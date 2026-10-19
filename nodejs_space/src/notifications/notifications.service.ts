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

    // Hafta içerikleri bir kez okunur; eskiden her gebelik için ayrı sorgu atılıyordu.
    const partnerIds = pregnancies.map((p) => p.user?.pairedUserId).filter((id): id is string => !!id);
    const [weekRows, livePartners] = await Promise.all([
      this.prisma.pregnancyWeekContent.findMany(),
      partnerIds.length
        ? this.prisma.user.findMany({ where: { id: { in: partnerIds } }, select: { id: true } })
        : Promise.resolve([]),
    ]);
    const weekMap = new Map(weekRows.map((w) => [w.weekNumber, w]));
    // Silinmiş partner kaydına yazmak toplu insert'i tamamen düşürürdü.
    const partnerExists = new Set(livePartners.map((u) => u.id));

    const rows: Array<{ userId: string; type: string; title: string; body: string; module: string }> = [];

    for (const p of pregnancies) {
      if (p.user?.settings?.pregnancyTips === false) continue;
      const diffDays = Math.floor((Date.now() - p.lastMenstrualPeriod.getTime()) / (86400000));
      const week = Math.min(Math.floor(diffDays / 7) + 1, 40);
      const daysRemaining = Math.max(0, 280 - diffDays);
      const weekContent = weekMap.get(week);
      const tips = weekContent?.tips ?? [];
      const tip = tips.length
        ? tips[Math.floor(Math.random() * tips.length)]
        : 'Sağlıklı beslenmeye ve düzenli kontrollerinize dikkat edin.';
      const babyLetter = weekContent?.letterFromBaby ||
        `Anneciğim bu hafta ${week}. haftama ulaştım! Dünyaya gelmeme yaklaşık ${daysRemaining} gün kaldı, çok heyecanlıyım. Sizleri çok seviyorum 💕`;

      rows.push({
        userId: p.userId,
        type: 'pregnancy_tip',
        title: `${week}. Hafta İpucu 🤰`,
        body: tip,
        module: 'pregnancy',
      });
      rows.push({
        userId: p.userId,
        type: 'baby_letter',
        title: `💌 Bebekten Anneye Mesaj (${week}. Hafta)`,
        body: babyLetter,
        module: 'pregnancy',
      });

      if (p.user?.pairedUserId && partnerExists.has(p.user.pairedUserId)) {
        rows.push({
          userId: p.user.pairedUserId,
          type: 'pregnancy_partner_update',
          title: `👶 Gebelik Güncellemesi: ${week}. Hafta`,
          body: `${p.user.name || 'Partneriniz'} ${week}. gebelik haftasında! Bebeğinizin büyümesi ve günün ipuçları Pusena'da hazır.`,
          module: 'pregnancy',
        });
      }
    }

    if (rows.length) {
      await this.prisma.notification.createMany({ data: rows, skipDuplicates: true });
    }
    const sentCount = rows.length;
    this.logger.log(`Sent ${sentCount} pregnancy tip notifications`);
    return { success: true, sentCount };
  }

  // Cron: send special date reminders
  async sendSpecialDateReminders() {
    const allDates = await this.prisma.specialDate.findMany({
      include: { user: { include: { settings: true } } },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const partnerIds = allDates.map((sd) => sd.user?.pairedUserId).filter((id): id is string => !!id);
    // Bugün gönderilmiş hatırlatmalar tek sorguda; eskiden özel gün başına bir sorgu atılıyordu.
    const [sentToday, livePartners] = await Promise.all([
      this.prisma.notification.findMany({
        where: { type: 'special_date_reminder', createdAt: { gte: today } },
        select: { userId: true, referenceId: true },
      }),
      partnerIds.length
        ? this.prisma.user.findMany({ where: { id: { in: partnerIds } }, select: { id: true } })
        : Promise.resolve([]),
    ]);
    const alreadySent = new Set(sentToday.map((n) => `${n.userId}:${n.referenceId}`));
    const partnerExists = new Set(livePartners.map((u) => u.id));

    const rows: Array<{
      userId: string;
      type: string;
      title: string;
      body: string;
      module: string;
      referenceId: string;
    }> = [];

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

      if (alreadySent.has(`${sd.userId}:${sd.id}`)) continue;

      let timeLabel = '';
      if (daysUntil === 0) timeLabel = 'Bugün!';
      else if (daysUntil === 1) timeLabel = 'Yarın!';
      else timeLabel = `${daysUntil} gün sonra`;

      rows.push({
        userId: sd.userId,
        type: 'special_date_reminder',
        title: `${sd.title} ${timeLabel} 🎁`,
        body: `"${sd.title}" özel gününüze ${daysUntil === 0 ? 'bugün' : daysUntil + ' gün'} kaldı.`,
        module: 'relationship',
        referenceId: sd.id,
      });
      alreadySent.add(`${sd.userId}:${sd.id}`);

      // If user is paired with a partner, send reminder to partner too
      const partnerId = sd.user?.pairedUserId;
      if (partnerId && partnerExists.has(partnerId) && !alreadySent.has(`${partnerId}:${sd.id}`)) {
        rows.push({
          userId: partnerId,
          type: 'special_date_reminder',
          title: `${sd.title} ${timeLabel} 🎁`,
          body: `${sd.user?.name || 'Partneriniz'} ile "${sd.title}" özel gününüze ${daysUntil === 0 ? 'bugün' : daysUntil + ' gün'} kaldı.`,
          module: 'relationship',
          referenceId: sd.id,
        });
        alreadySent.add(`${partnerId}:${sd.id}`);
      }
    }

    if (rows.length) {
      await this.prisma.notification.createMany({ data: rows, skipDuplicates: true });
    }
    const sentCount = rows.length;
    this.logger.log(`Sent ${sentCount} special date reminder notifications`);
    return { success: true, sentCount };
  }

  // Cron: send period reminders
  async sendPeriodReminders() {
    const users = await this.prisma.user.findMany({
      where: { settings: { periodReminder: true, activeModules: { has: 'period' } } },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);
    if (!userIds.length) return { success: true, sentCount: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Döngüler ve bugünkü hatırlatmalar iki sorguda toplanır; eskiden
    // kullanıcı başına iki ayrı sorgu atılıyordu.
    const [cycles, sentToday] = await Promise.all([
      this.prisma.periodCycle.findMany({
        where: { userId: { in: userIds } },
        orderBy: { startDate: 'desc' },
        select: { userId: true, startDate: true, cycleLength: true },
      }),
      this.prisma.notification.findMany({
        where: { userId: { in: userIds }, type: 'period_reminder', createdAt: { gte: today } },
        select: { userId: true },
      }),
    ]);

    const latestByUser = new Map<string, (typeof cycles)[number]>();
    for (const c of cycles) {
      if (!latestByUser.has(c.userId)) latestByUser.set(c.userId, c);
    }
    const notifiedToday = new Set(sentToday.map((n) => n.userId));

    const rows: Array<{
      userId: string;
      type: string;
      title: string;
      body: string;
      module: string;
      actionType: string | null;
    }> = [];

    for (const userId of userIds) {
      if (notifiedToday.has(userId)) continue;
      const latestCycle = latestByUser.get(userId);
      if (!latestCycle) continue;

      const nextPeriodDate = new Date(latestCycle.startDate.getTime() + latestCycle.cycleLength * 86400000);
      const daysUntil = Math.floor((nextPeriodDate.getTime() - Date.now()) / 86400000);

      // 2 gün öncesinden başlayarak uyar; kullanıcı hazırlık yapabilsin.
      if (daysUntil >= -1 && daysUntil <= 2) {
        const copy =
          daysUntil === 2
            ? {
                title: 'Regl 2 gün sonra bekleniyor 🩸',
                body: 'Döngü kaydına göre yaklaşıyor. Hazırlığını şimdiden yapabilirsin.',
              }
            : daysUntil === 1
              ? {
                  title: 'Yarın regl başlayabilir 🩸',
                  body: 'Ped/tampon, ağrı kesici ve sıcak su torbanı hazırlamak için iyi bir zaman.',
                }
              : {
                  title: 'Regl Hatırlatma 🩸',
                  body: 'Regl döneminiz başlamış olabilir. Regl oldunuz mu?',
                };

        rows.push({
          userId,
          type: 'period_reminder',
          title: copy.title,
          body: copy.body,
          module: 'period',
          actionType: daysUntil <= 0 ? 'period_confirm' : null,
        });
      }
    }

    if (rows.length) {
      await this.prisma.notification.createMany({ data: rows, skipDuplicates: true });
    }
    const sentCount = rows.length;
    this.logger.log(`Sent ${sentCount} period reminder notifications`);
    return { success: true, sentCount };
  }
}
