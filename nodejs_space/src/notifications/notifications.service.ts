import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(userId: string, page: number, limit: number) {
    const [items, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      items: items.map(n => ({
        id: n.id, type: n.type, title: n.title, body: n.body,
        module: n.module, referenceId: n.referenceId, isRead: n.isRead,
        actionType: n.actionType, actionDone: n.actionDone,
        createdAt: n.createdAt,
      })),
      total, page, totalPages: Math.ceil(total / limit), unreadCount,
    };
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
    return { success: true };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    return { success: true };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({ where: { userId, isRead: false } });
    return { count };
  }

  async clearAll(userId: string) {
    await this.prisma.notification.deleteMany({ where: { userId } });
    return { success: true };
  }

  async answerAction(userId: string, notificationId: string, answer: string) {
    const notif = await this.prisma.notification.findFirst({ where: { id: notificationId, userId } });
    if (!notif) throw new NotFoundException('Bildirim bulunamadı');

    // Mark action done & read
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { actionDone: true, isRead: true },
    });

    // Handle period_confirm action
    if (notif.actionType === 'period_confirm' && answer === 'yes') {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const latestCycle = await this.prisma.periodCycle.findFirst({
        where: { userId },
        orderBy: { startDate: 'desc' },
      });
      if (latestCycle) {
        await this.prisma.periodCycle.update({
          where: { id: latestCycle.id },
          data: { endDate: todayDate },
        });
        const newCycle = await this.prisma.periodCycle.create({
          data: {
            userId,
            startDate: todayDate,
            cycleLength: latestCycle.cycleLength,
            periodLength: latestCycle.periodLength,
          },
        });
        await this.prisma.periodDay.upsert({
          where: { userId_date: { userId, date: todayDate } },
          update: { flowLevel: 2 },
          create: { userId, cycleId: newCycle.id, date: todayDate, flowLevel: 2 },
        });
        this.logger.log(`Period confirmed and logged for user ${userId}`);
      }
    }

    return { success: true };
  }

  // Cron: send pregnancy tips to all pregnant users
  async sendPregnancyTips() {
    const pregnancies = await this.prisma.pregnancy.findMany({
      where: { isActive: true },
      include: { user: { include: { settings: true } } },
    });

    let sentCount = 0;
    for (const p of pregnancies) {
      if (p.user?.settings?.pregnancyTips === false) continue;
      const diffDays = Math.floor((Date.now() - p.lastMenstrualPeriod.getTime()) / (86400000));
      const week = Math.min(Math.floor(diffDays / 7) + 1, 40);
      const daysRemaining = Math.max(0, 280 - diffDays);
      const weekContent = await this.prisma.pregnancyWeekContent.findUnique({ where: { weekNumber: week } });
      const tip = weekContent?.tips?.[Math.floor(Math.random() * (weekContent?.tips?.length || 1))]
        ?? 'Sağlıklı beslenmeye ve düzenli kontrollerinize dikkat edin.';
      const babyLetter = (weekContent as any)?.letterFromBaby ||
        `Anneciğim bu hafta ${week}. haftama ulaştım! Dünyaya gelmeme yaklaşık ${daysRemaining} gün kaldı, çok heyecanlıyım. Sizleri çok seviyorum 💕`;

      // Notification 1: Pregnancy Tip
      await this.prisma.notification.create({
        data: {
          userId: p.userId,
          type: 'pregnancy_tip',
          title: `${week}. Hafta İpucu 🤰`,
          body: tip,
          module: 'pregnancy',
        },
      });
      sentCount++;

      // Notification 2: Baby's Letter to Mom
      await this.prisma.notification.create({
        data: {
          userId: p.userId,
          type: 'baby_letter',
          title: `💌 Bebekten Anneye Mesaj (${week}. Hafta)`,
          body: babyLetter,
          module: 'pregnancy',
        },
      });
      sentCount++;

      // If user has paired partner, also notify partner!
      if (p.user?.pairedUserId) {
        const partner = await this.prisma.user.findUnique({ where: { id: p.user.pairedUserId } });
        if (partner) {
          await this.prisma.notification.create({
            data: {
              userId: partner.id,
              type: 'pregnancy_partner_update',
              title: `👶 Gebelik Güncellemesi: ${week}. Hafta`,
              body: `${p.user.name || 'Partneriniz'} ${week}. gebelik haftasında! Bebeğinizin büyümesi ve günün ipuçları Pusena'da hazır.`,
              module: 'pregnancy',
            },
          });
          sentCount++;
        }
      }
    }
    this.logger.log(`Sent ${sentCount} pregnancy tip notifications`);
    return { success: true, sentCount };
  }

  // Cron: send special date reminders
  async sendSpecialDateReminders() {
    const allDates = await this.prisma.specialDate.findMany({
      include: { user: { include: { settings: true } } },
    });

    let sentCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const sd of allDates) {
      if (sd.user?.settings?.specialDateReminder === false) continue;

      const reminderList = sd.reminderDaysList?.length ? sd.reminderDaysList : (sd.reminderDays != null ? [sd.reminderDays] : [1, 7]);

      let targetDate = new Date(sd.date);
      if (sd.isRecurring) {
        targetDate.setFullYear(today.getFullYear());
        if (targetDate < today) targetDate.setFullYear(today.getFullYear() + 1);
      }

      const daysUntil = Math.ceil((targetDate.getTime() - today.getTime()) / 86400000);

      if (!reminderList.includes(daysUntil)) continue;

      // Check if already notified today
      const existing = await this.prisma.notification.findFirst({
        where: { userId: sd.userId, type: 'special_date_reminder', referenceId: sd.id, createdAt: { gte: today } },
      });
      if (existing) continue;

      let timeLabel = '';
      if (daysUntil === 0) timeLabel = 'Bugün!';
      else if (daysUntil === 1) timeLabel = 'Yarın!';
      else if (daysUntil <= 7) timeLabel = `${daysUntil} gün sonra`;
      else timeLabel = `${daysUntil} gün sonra`;

      await this.prisma.notification.create({
        data: {
          userId: sd.userId,
          type: 'special_date_reminder',
          title: `${sd.title} ${timeLabel} 🎁`,
          body: `"${sd.title}" özel gününüze ${daysUntil === 0 ? 'bugün' : daysUntil + ' gün'} kaldı.`,
          module: 'relationship',
          referenceId: sd.id,
        },
      });
      sentCount++;

      // If user is paired with a partner, send reminder to partner too
      if (sd.user?.pairedUserId) {
        await this.prisma.notification.create({
          data: {
            userId: sd.user.pairedUserId,
            type: 'special_date_reminder',
            title: `${sd.title} ${timeLabel} 🎁`,
            body: `${sd.user.name || 'Partneriniz'} ile "${sd.title}" özel gününüze ${daysUntil === 0 ? 'bugün' : daysUntil + ' gün'} kaldı.`,
            module: 'relationship',
            referenceId: sd.id,
          },
        });
        sentCount++;
      }
    }
    this.logger.log(`Sent ${sentCount} special date reminder notifications`);
    return { success: true, sentCount };
  }

  // Cron: send period reminders
  async sendPeriodReminders() {
    const users = await this.prisma.user.findMany({
      where: { settings: { periodReminder: true, activeModules: { has: 'period' } } },
      include: { settings: true },
    });

    let sentCount = 0;
    for (const user of users) {
      const latestCycle = await this.prisma.periodCycle.findFirst({
        where: { userId: user.id },
        orderBy: { startDate: 'desc' },
      });
      if (!latestCycle) continue;

      const nextPeriodDate = new Date(latestCycle.startDate.getTime() + latestCycle.cycleLength * 86400000);
      const daysUntil = Math.floor((nextPeriodDate.getTime() - Date.now()) / 86400000);

      // Send reminder when period is expected (0 days) or 1 day before
      if (daysUntil >= -1 && daysUntil <= 1) {
        // Check if we already sent a reminder today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existing = await this.prisma.notification.findFirst({
          where: {
            userId: user.id,
            type: 'period_reminder',
            createdAt: { gte: today },
          },
        });
        if (existing) continue;

        await this.prisma.notification.create({
          data: {
            userId: user.id,
            type: 'period_reminder',
            title: 'Regl Hatırlatma 🩸',
            body: 'Regl döneminiz yaklaşıyor veya başlamış olabilir. Regl oldunuz mu?',
            module: 'period',
            actionType: 'period_confirm',
          },
        });
        sentCount++;
      }
    }
    this.logger.log(`Sent ${sentCount} period reminder notifications`);
    return { success: true, sentCount };
  }
}
