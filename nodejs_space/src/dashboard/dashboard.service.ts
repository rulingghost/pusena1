import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { dateKey, computeIsPeriodActive } from '../common/dates';
import { filterModulesForGender } from '../common/gender-modules';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [settings, user] = await Promise.all([
      this.prisma.userSettings.findUnique({ where: { userId } }),
      this.prisma.user.findUnique({ where: { id: userId }, select: { gender: true } }),
    ]);
    const modules = filterModulesForGender(settings?.activeModules ?? [], user?.gender);

    let pregnancy = null;
    let period = null;
    let relationship = null;
    let dailyTip = null;

    if (modules.includes('pregnancy')) {
      const p = await this.prisma.pregnancy.findUnique({ where: { userId } });
      if (p) {
        const diffMs = Date.now() - p.lastMenstrualPeriod.getTime();
        const totalDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        const week = Math.max(1, Math.min(42, Math.floor(totalDays / 7) + 1));
        const day = Math.max(1, Math.min(7, (totalDays % 7) + 1));
        const daysRemaining = Math.max(0, Math.ceil((p.dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
        const progressPercent = Math.min(100, Math.round(((280 - daysRemaining) / 280) * 100));
        const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;

        const weekContent = await this.prisma.pregnancyWeekContent.findUnique({ where: { weekNumber: Math.min(week, 40) } });

        pregnancy = {
          currentWeek: week, currentDay: day, daysRemaining,
          babySizeComparison: weekContent?.babySize ?? '',
          progressPercent, trimester,
          babyName: p.babyName,
        };

        dailyTip = { title: 'Gebelik İpucu', content: weekContent?.tips?.[0] ?? 'Sağlıklı beslenmeye dikkat edin.', module: 'pregnancy' };
      }
    }

    if (modules.includes('period')) {
      const cycle = await this.prisma.periodCycle.findFirst({ where: { userId }, orderBy: { startDate: 'desc' } });
      if (cycle) {
        const currentCycleDay = Math.floor((Date.now() - cycle.startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        const nextPeriod = new Date(cycle.startDate.getTime() + cycle.cycleLength * 24 * 60 * 60 * 1000);
        const daysUntilNext = Math.max(0, Math.ceil((nextPeriod.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));

        // 7-day strip
        const calendarDays: any[] = [];
        const today = new Date();
        for (let i = -3; i <= 3; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() + i);
          const daysSinceStart = Math.floor((d.getTime() - cycle.startDate.getTime()) / (24 * 60 * 60 * 1000));
          const cycleDay = ((daysSinceStart % cycle.cycleLength) + cycle.cycleLength) % cycle.cycleLength;
          const ovDay = cycle.cycleLength - 14;
          let type = 'normal';
          if (cycleDay < cycle.periodLength) type = 'period';
          else if (cycleDay === ovDay) type = 'ovulation';
          else if (cycleDay >= ovDay - 5 && cycleDay <= ovDay + 1) type = 'fertile';
          calendarDays.push({ date: dateKey(d), type });
        }

        const ovDay = cycle.cycleLength - 14;
        const daysUntilOvulation = Math.max(0, ovDay - currentCycleDay + 1);

        period = {
          daysUntilNextPeriod: daysUntilNext,
          currentCycleDay,
          nextPeriodDate: nextPeriod,
          calendarDays,
          isPeriodActive: computeIsPeriodActive(cycle),
          daysUntilOvulation,
          cycleLength: cycle.cycleLength,
          periodLength: cycle.periodLength,
        };
        if (!dailyTip) dailyTip = { title: 'Regl İpucu', content: 'Düzenli egzersiz regl ağrılarını azaltabilir.', module: 'period' };
      }
    }

    // Always fetch relationship if available, or if module is active
    const r = await this.prisma.relationship.findUnique({ where: { userId } });
    if (r) {
      const now = new Date();
      const startDate = new Date(r.startDate);
      const daysTogether = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));

      // Calculate next anniversary
      const thisYearAnn = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());
      if (thisYearAnn < now) {
        thisYearAnn.setFullYear(thisYearAnn.getFullYear() + 1);
      }
      const daysUntilAnniversary = Math.max(0, Math.ceil((thisYearAnn.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      const nextAnniversaryYear = Math.max(1, thisYearAnn.getFullYear() - startDate.getFullYear());

      // Next special date
      const nextSD = await this.prisma.specialDate.findFirst({
        where: { userId, date: { gte: now } },
        orderBy: { date: 'asc' },
      });

      let nextSpecialDate = null;
      if (nextSD) {
        const daysUntil = Math.ceil((nextSD.date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        nextSpecialDate = { id: nextSD.id, title: nextSD.title, date: nextSD.date, daysUntil };
      }

      relationship = {
        partnerName: r.partnerName,
        daysTogether,
        startDate: r.startDate,
        daysUntilAnniversary,
        nextAnniversaryYear,
        nextAnniversaryDate: thisYearAnn,
        nextSpecialDate,
      };
      if (!dailyTip) dailyTip = { title: 'İlişki İpucu 💕', content: 'Partnerinize sevginizi hissettirecek küçük bir mesaj atın.', module: 'relationship' };
    }

    // Recent posts
    const posts = await this.prisma.communityPost.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, avatarUrl: true } } },
    });

    return {
      pregnancy, period, relationship, dailyTip,
      recentPosts: posts.map(p => ({
        id: p.id, content: p.content, authorName: p.author.name,
        authorAvatarUrl: p.author.avatarUrl, likesCount: p.likesCount,
        commentsCount: p.commentsCount, createdAt: p.createdAt,
      })),
    };
  }
}
