import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseDateOnly, dateKey, computeIsPeriodActive } from '../common/dates';

@Injectable()
export class PeriodService {
  constructor(private readonly prisma: PrismaService) {}

  async setup(userId: string, lastPeriodStart: string, cycleLength: number, periodLength: number) {
    const startDate = parseDateOnly(lastPeriodStart);
    const cycle = await this.prisma.periodCycle.create({
      data: { userId, startDate, cycleLength, periodLength },
    });

    const nextPeriod = new Date(startDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
    const ovulation = new Date(startDate.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000);

    return {
      id: cycle.id, lastPeriodStart: startDate, cycleLength, periodLength,
      nextPeriodDate: nextPeriod, ovulationDate: ovulation,
    };
  }

  async getPeriod(userId: string) {
    const latestCycle = await this.prisma.periodCycle.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });

    if (!latestCycle) return { currentCycle: null, averageCycleLength: 28 };

    const cycles = await this.prisma.periodCycle.findMany({ where: { userId } });
    const avgLength = cycles.length > 0
      ? Math.round(cycles.reduce((s, c) => s + c.cycleLength, 0) / cycles.length)
      : 28;

    const currentCycleDay = Math.floor((Date.now() - latestCycle.startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const nextPeriod = new Date(latestCycle.startDate.getTime() + latestCycle.cycleLength * 24 * 60 * 60 * 1000);
    const ovulationDay = latestCycle.cycleLength - 14;
    const ovulation = new Date(latestCycle.startDate.getTime() + ovulationDay * 24 * 60 * 60 * 1000);
    const fertileStart = new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000);
    const fertileEnd = new Date(ovulation.getTime() + 1 * 24 * 60 * 60 * 1000);

    return {
      currentCycle: {
        id: latestCycle.id, startDate: latestCycle.startDate, endDate: latestCycle.endDate,
        cycleLength: latestCycle.cycleLength, periodLength: latestCycle.periodLength,
        currentCycleDay, nextPeriodDate: nextPeriod, ovulationDate: ovulation,
        fertileWindowStart: fertileStart, fertileWindowEnd: fertileEnd,
        isPeriodActive: computeIsPeriodActive(latestCycle),
      },
      averageCycleLength: avgLength,
    };
  }

  async logDay(userId: string, date: string, flowLevel: number, notes?: string) {
    const d = parseDateOnly(date);
    const cycle = await this.prisma.periodCycle.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
    if (!cycle) throw new NotFoundException('Lütfen önce regl takibi kurun');

    const day = await this.prisma.periodDay.upsert({
      where: { userId_date: { userId, date: d } },
      update: { flowLevel, notes },
      create: { userId, cycleId: cycle.id, date: d, flowLevel, notes },
    });

    return { id: day.id, date: day.date, flowLevel: day.flowLevel, notes: day.notes, cycleId: day.cycleId };
  }

  async getCalendar(userId: string, month: number, year: number) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const periodDays = await this.prisma.periodDay.findMany({
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
    });

    const symptoms = await this.prisma.symptom.findMany({
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
    });

    const latestCycle = await this.prisma.periodCycle.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });

    const days: any[] = [];
    const daysInMonth = endOfMonth.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = new Date(year, month - 1, d);
      const periodDay = periodDays.find(pd => dateKey(pd.date) === dateKey(currentDate));
      const hasSymptoms = symptoms.some(s => dateKey(s.date) === dateKey(currentDate));

      let type = 'normal';
      if (periodDay) {
        type = 'period';
      } else if (latestCycle) {
        const daysSinceStart = Math.floor((currentDate.getTime() - latestCycle.startDate.getTime()) / (24 * 60 * 60 * 1000));
        const cycleDay = ((daysSinceStart % latestCycle.cycleLength) + latestCycle.cycleLength) % latestCycle.cycleLength;
        const ovDay = latestCycle.cycleLength - 14;
        if (cycleDay === ovDay) type = 'ovulation';
        else if (cycleDay >= ovDay - 5 && cycleDay <= ovDay + 1) type = 'fertile';
        else if (cycleDay < latestCycle.periodLength) type = 'predicted';
      }

      days.push({
        date: dateKey(currentDate),
        type,
        flowLevel: periodDay?.flowLevel ?? null,
        hasSymptoms,
      });
    }

    return { days };
  }

  async getHistory(userId: string, page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.periodCycle.findMany({
        where: { userId },
        orderBy: { startDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.periodCycle.count({ where: { userId } }),
    ]);

    return {
      items: items.map(c => ({
        id: c.id, startDate: c.startDate, endDate: c.endDate,
        cycleLength: c.cycleLength, periodLength: c.periodLength,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async startPeriod(userId: string, dateStr: string) {
    const date = parseDateOnly(dateStr);
    const prevCycle = await this.prisma.periodCycle.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
    const cycleLength = prevCycle
      ? Math.floor((date.getTime() - prevCycle.startDate.getTime()) / (24 * 60 * 60 * 1000))
      : 28;
    const periodLength = prevCycle?.periodLength ?? 5;

    if (prevCycle) {
      if (dateKey(prevCycle.startDate) === dateKey(date)) {
        await this.prisma.periodCycle.update({ where: { id: prevCycle.id }, data: { endDate: null } });
        await this.prisma.periodDay.upsert({
          where: { userId_date: { userId, date } },
          update: { flowLevel: 2 },
          create: { userId, cycleId: prevCycle.id, date, flowLevel: 2 },
        });
        return { id: prevCycle.id, startDate: prevCycle.startDate, cycleLength: prevCycle.cycleLength, periodLength: prevCycle.periodLength };
      }
      await this.prisma.periodCycle.update({
        where: { id: prevCycle.id },
        data: { endDate: date, cycleLength: Math.max(21, Math.min(45, cycleLength)) },
      });
    }

    const newCycle = await this.prisma.periodCycle.create({
      data: { userId, startDate: date, cycleLength: Math.max(21, Math.min(45, cycleLength)), periodLength },
    });

    // Also log the first day of period so it immediately shows on calendar
    await this.prisma.periodDay.upsert({
      where: { userId_date: { userId, date } },
      update: { flowLevel: 2 },
      create: { userId, cycleId: newCycle.id, date, flowLevel: 2 },
    });

    return { id: newCycle.id, startDate: newCycle.startDate, cycleLength: newCycle.cycleLength, periodLength: newCycle.periodLength };
  }

  async endPeriod(userId: string, dateStr?: string) {
    const date = dateStr ? parseDateOnly(dateStr) : parseDateOnly(dateKey(new Date()));
    const activeCycle = await this.prisma.periodCycle.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
    if (!activeCycle) throw new NotFoundException('Aktif döngü bulunamadı');
    if (date.getTime() < activeCycle.startDate.getTime()) {
      throw new BadRequestException('Bitiş tarihi başlangıçtan önce olamaz');
    }

    const daysSinceStart = Math.floor((date.getTime() - activeCycle.startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const newPeriodLength = Math.max(1, Math.min(15, daysSinceStart));

    await this.prisma.periodCycle.update({
      where: { id: activeCycle.id },
      data: { endDate: date, periodLength: newPeriodLength },
    });

    await this.prisma.periodDay.deleteMany({
      where: {
        userId,
        cycleId: activeCycle.id,
        date: { gt: date },
      },
    });

    return { success: true, periodLength: newPeriodLength };
  }

  async endCycleById(userId: string, cycleId: string, dateStr: string) {
    const cycle = await this.prisma.periodCycle.findFirst({ where: { id: cycleId, userId } });
    if (!cycle) throw new NotFoundException('Döngü bulunamadı');

    const date = parseDateOnly(dateStr);
    if (date.getTime() < cycle.startDate.getTime()) {
      throw new BadRequestException('Bitiş tarihi başlangıçtan önce olamaz');
    }

    const daysSinceStart = Math.floor((date.getTime() - cycle.startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const newPeriodLength = Math.max(1, Math.min(15, daysSinceStart));

    await this.prisma.periodCycle.update({
      where: { id: cycleId },
      data: { endDate: date, periodLength: newPeriodLength },
    });

    await this.prisma.periodDay.deleteMany({
      where: { userId, cycleId, date: { gt: date } },
    });

    return { success: true, periodLength: newPeriodLength, endDate: date };
  }
}
