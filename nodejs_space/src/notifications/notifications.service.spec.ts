import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationsService (Idempotency - Madde 18)', () => {
  let service: NotificationsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      notification: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
      },
      periodCycle: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      periodDay: {
        upsert: jest.fn(),
      },
      pregnancy: {
        findMany: jest.fn(),
      },
      pregnancyWeekContent: {
        findMany: jest.fn(),
      },
      specialDate: {
        findMany: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(mockPrisma)),
    };

    service = new NotificationsService(mockPrisma as PrismaService);
  });

  describe('answerAction (Idempotency)', () => {
    it('throws NotFoundException if notification does not exist', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue(null);

      await expect(service.answerAction('user-1', 'notif-999', 'yes')).rejects.toThrow(NotFoundException);
    });

    it('returns immediately with success if action is already done (idempotent)', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue({
        id: 'notif-1',
        userId: 'user-1',
        actionDone: true,
        actionType: 'period_confirm',
      });

      const res = await service.answerAction('user-1', 'notif-1', 'yes');

      expect(res).toEqual({ success: true });
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(mockPrisma.notification.update).not.toHaveBeenCalled();
      expect(mockPrisma.periodCycle.create).not.toHaveBeenCalled();
    });

    it('marks action done and creates new periodCycle when period_confirm is yes', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue({
        id: 'notif-1',
        userId: 'user-1',
        actionDone: false,
        actionType: 'period_confirm',
      });
      mockPrisma.periodCycle.findFirst.mockResolvedValue({
        id: 'cycle-1',
        userId: 'user-1',
        startDate: new Date('2026-09-01T00:00:00.000Z'),
        cycleLength: 28,
        periodLength: 5,
      });
      mockPrisma.periodCycle.create.mockResolvedValue({
        id: 'cycle-2',
        userId: 'user-1',
      });

      const res = await service.answerAction('user-1', 'notif-1', 'yes');

      expect(res).toEqual({ success: true });
      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { actionDone: true, isRead: true },
      });
      expect(mockPrisma.periodCycle.update).toHaveBeenCalled();
      expect(mockPrisma.periodCycle.create).toHaveBeenCalled();
      expect(mockPrisma.periodDay.upsert).toHaveBeenCalled();
    });
  });

  describe('sendPregnancyTips (Cron Idempotency)', () => {
    it('sends tips on first run, and skips already sent tips on duplicate run today', async () => {
      const mockPregnancies = [
        {
          userId: 'mom-1',
          lastMenstrualPeriod: new Date('2026-05-01T00:00:00.000Z'),
          dueDate: new Date('2027-02-05T00:00:00.000Z'),
          user: { name: 'Ayşe', settings: { pregnancyTips: true } },
        },
      ];
      mockPrisma.pregnancy.findMany.mockResolvedValue(mockPregnancies);
      mockPrisma.pregnancyWeekContent.findMany.mockResolvedValue([
        { weekNumber: 25, tips: ['Bol su için'], letterFromBaby: 'Seni seviyorum anne' },
      ]);
      mockPrisma.user.findMany.mockResolvedValue([]);

      // First run: no notifications sent today
      mockPrisma.notification.findMany.mockResolvedValueOnce([]);

      const firstRun = await service.sendPregnancyTips();
      expect(firstRun.success).toBe(true);
      expect(firstRun.sentCount).toBe(2); // pregnancy_tip and baby_letter
      expect(mockPrisma.notification.createMany).toHaveBeenCalled();

      // Second run: notifications already exist for today
      mockPrisma.notification.findMany.mockResolvedValueOnce([
        { userId: 'mom-1', type: 'pregnancy_tip' },
        { userId: 'mom-1', type: 'baby_letter' },
      ]);
      mockPrisma.notification.createMany.mockClear();

      const secondRun = await service.sendPregnancyTips();
      expect(secondRun.success).toBe(true);
      expect(secondRun.sentCount).toBe(0); // 0 duplicates!
      expect(mockPrisma.notification.createMany).not.toHaveBeenCalled();
    });
  });
});
