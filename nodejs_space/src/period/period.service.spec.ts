import { ForbiddenException } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PeriodService (Male Guard)', () => {
  let service: PeriodService;
  let mockPrisma: Partial<PrismaService>;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      } as any,
      periodCycle: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
      } as any,
      periodDay: {
        upsert: jest.fn(),
        findMany: jest.fn(),
      } as any,
      symptom: {
        findMany: jest.fn(),
      } as any,
    };
    service = new PeriodService(mockPrisma as PrismaService);
  });

  it('rejects male user from setup with ForbiddenException', async () => {
    (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'male' });

    await expect(service.setup('male-1', '2026-10-01', 28, 5)).rejects.toThrow(ForbiddenException);
  });

  it('rejects male user from getPeriod with ForbiddenException', async () => {
    (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'male' });

    await expect(service.getPeriod('male-1')).rejects.toThrow(ForbiddenException);
  });

  it('rejects male user from startPeriod with ForbiddenException', async () => {
    (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'male' });

    await expect(service.startPeriod('male-1', '2026-10-01')).rejects.toThrow(ForbiddenException);
  });

  it('allows female user to getPeriod', async () => {
    (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'female' });
    (mockPrisma.periodCycle!.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await service.getPeriod('female-1');
    expect(res).toEqual({ currentCycle: null, averageCycleLength: 28 });
  });
});
