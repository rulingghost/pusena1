import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { dateKey, computeIsPeriodActive, calculatePregnancyProgress, calculateCycleProgress } from '../common/dates';
import { filterModulesForGender } from '../common/gender-modules';
import { getBlockedUserIds } from '../common/blocking';
import { buildDailyTip } from './daily-tips';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [settings, user, blockedIds, myFollowing] = await Promise.all([
      this.prisma.userSettings.findUnique({ where: { userId } }),
      this.prisma.user.findUnique({ where: { id: userId }, select: { gender: true } }),
      getBlockedUserIds(this.prisma, userId),
      this.prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } }),
    ]);
    const modules = filterModulesForGender(settings?.activeModules ?? [], user?.gender);
    const followedIds = myFollowing.map((f) => f.followingId);

    const postWhere: any = {
      authorId: { notIn: blockedIds },
      OR: [
        { authorId: userId },
        {
          author: {
            settings: {
              is: {
                showCommunityPosts: true,
                profilePublic: true,
              },
            },
          },
        },
        {
          authorId: { in: followedIds },
          author: {
            settings: {
              is: {
                showCommunityPosts: true,
              },
            },
          },
        },
        {
          author: {
            settings: null,
          },
        },
      ],
    };

    let pregnancy = null;
    let period = null;
    let relationship = null;
    let dailyTip = null;

    const now = new Date();

    // Birbirinden bağımsız tüm okumalar tek turda: Render'da her sıralı sorgu
    // ekrana ~100-200 ms ekliyordu.
    const [p, cycle, r, nextSD, posts] = await Promise.all([
      modules.includes('pregnancy')
        ? this.prisma.pregnancy.findUnique({ where: { userId } })
        : Promise.resolve(null),
      modules.includes('period')
        ? this.prisma.periodCycle.findFirst({ where: { userId }, orderBy: { startDate: 'desc' } })
        : Promise.resolve(null),
      this.prisma.relationship.findUnique({ where: { userId } }),
      this.prisma.specialDate.findFirst({
        where: { userId, date: { gte: now } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.communityPost.findMany({
        where: postWhere,
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          likesCount: true,
          commentsCount: true,
          createdAt: true,
          author: { select: { name: true, avatarUrl: true } },
        },
      }),
    ]);

    if (p) {
      const prog = calculatePregnancyProgress(p.lastMenstrualPeriod, p.dueDate);
      const weekContent = await this.prisma.pregnancyWeekContent.findUnique({ where: { weekNumber: Math.min(prog.week, 40) } });

      pregnancy = {
        currentWeek: prog.week,
        currentDay: prog.day,
        daysRemaining: prog.daysRemaining,
        babySizeComparison: weekContent?.babySize ?? '',
        progressPercent: prog.progressPercent,
        trimester: prog.trimester,
        babyName: p.babyName,
      };

      dailyTip = buildDailyTip({ pregnancyWeek: prog.week });
    }

    if (cycle) {
      const prog = calculateCycleProgress(cycle.startDate, cycle.cycleLength, cycle.periodLength);

      // 7-day strip
      const calendarDays: any[] = [];
      const today = new Date();
      for (let i = -3; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dayProg = calculateCycleProgress(cycle.startDate, cycle.cycleLength, cycle.periodLength, d);
        const cycleDayMod = ((dayProg.currentCycleDay - 1) % cycle.cycleLength);
        let type = 'normal';
        if (cycleDayMod < cycle.periodLength) type = 'period';
        else if (dayProg.currentCycleDay === prog.ovulationDay) type = 'ovulation';
        else if (dayProg.currentCycleDay >= prog.ovulationDay - 5 && dayProg.currentCycleDay <= prog.ovulationDay + 1) type = 'fertile';
        calendarDays.push({ date: dateKey(d), type });
      }

      period = {
        daysUntilNextPeriod: prog.daysUntilNextPeriod,
        currentCycleDay: prog.currentCycleDay,
        nextPeriodDate: prog.nextPeriodDate,
        calendarDays,
        isPeriodActive: computeIsPeriodActive(cycle),
        daysUntilOvulation: prog.daysUntilOvulation,
        cycleLength: cycle.cycleLength,
        periodLength: cycle.periodLength,
      };
      if (!dailyTip) {
        dailyTip = buildDailyTip({
          currentCycleDay: prog.currentCycleDay,
          cycleLength: cycle.cycleLength,
          periodLength: cycle.periodLength,
        });
      }
    }

    if (r) {
      const startDate = new Date(r.startDate);
      const daysTogether = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));

      // Calculate next anniversary
      const thisYearAnn = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());
      if (thisYearAnn < now) {
        thisYearAnn.setFullYear(thisYearAnn.getFullYear() + 1);
      }
      const daysUntilAnniversary = Math.max(0, Math.ceil((thisYearAnn.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      const nextAnniversaryYear = Math.max(1, thisYearAnn.getFullYear() - startDate.getFullYear());

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
      if (!dailyTip) dailyTip = buildDailyTip({ hasRelationship: true });
    }

    if (!dailyTip) dailyTip = buildDailyTip({});

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
