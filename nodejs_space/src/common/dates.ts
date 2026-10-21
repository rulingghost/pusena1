export const DAY_MS = 24 * 60 * 60 * 1000;
const BLEEDING_END_MAX_DAYS = 16;

/** YYYY-MM-DD → UTC midnight, so the calendar day is stable in JSON/ISO. */
export function parseDateOnly(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec((value ?? '').trim());
  if (m) {
    return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  }
  return new Date(value);
}

/** Local calendar day as YYYY-MM-DD (avoids UTC+3 midnight shifting to the previous day). */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Date-only key for a Date that may be UTC midnight (DB) or local midnight (UI loop).
 */
export function dateKey(d: Date): string {
  if (
    d.getUTCHours() === 0 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0
  ) {
    return d.toISOString().slice(0, 10);
  }
  return localDateKey(d);
}

/** Converts any Date or date string to UTC midnight of its calendar date. */
export function toCalendarUtc(d: Date | string): Date {
  if (typeof d === 'string') return parseDateOnly(d);
  return parseDateOnly(dateKey(d));
}

/** Calculates the signed difference in calendar days (to - from). */
export function diffCalendarDays(from: Date | string, to: Date | string): number {
  const fromUtc = toCalendarUtc(from);
  const toUtc = toCalendarUtc(to);
  return Math.round((toUtc.getTime() - fromUtc.getTime()) / DAY_MS);
}

export function isBleedingMarkedEnded(startDate: Date, endDate: Date | null | undefined): boolean {
  if (!endDate) return false;
  const days = diffCalendarDays(startDate, endDate);
  return days >= 0 && days < BLEEDING_END_MAX_DAYS;
}

export function computeIsPeriodActive(
  cycle: { startDate: Date; endDate: Date | null; periodLength: number },
  now = new Date(),
): boolean {
  const currentCycleDay = diffCalendarDays(cycle.startDate, now) + 1;
  if (isBleedingMarkedEnded(cycle.startDate, cycle.endDate)) return false;
  return currentCycleDay >= 1 && currentCycleDay <= cycle.periodLength;
}

export interface PregnancyProgress {
  week: number;
  day: number;
  daysRemaining: number;
  progressPercent: number;
  trimester: number;
}

export function calculatePregnancyProgress(
  lmp: Date | string,
  dueDate?: Date | string | null,
  now: Date = new Date(),
): PregnancyProgress {
  const lmpUtc = toCalendarUtc(lmp);
  const dueUtc = dueDate ? toCalendarUtc(dueDate) : new Date(lmpUtc.getTime() + 280 * DAY_MS);
  const todayUtc = toCalendarUtc(now);

  const elapsedDays = Math.max(0, Math.round((todayUtc.getTime() - lmpUtc.getTime()) / DAY_MS));
  const week = Math.max(1, Math.min(42, Math.floor(elapsedDays / 7) + 1));
  const day = Math.max(1, Math.min(7, (elapsedDays % 7) + 1));

  const daysRemaining = Math.max(0, Math.round((dueUtc.getTime() - todayUtc.getTime()) / DAY_MS));
  const progressPercent = Math.min(100, Math.max(0, Math.round(((280 - daysRemaining) / 280) * 100)));
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;

  return { week, day, daysRemaining, progressPercent, trimester };
}

export interface CycleProgress {
  currentCycleDay: number;
  nextPeriodDate: Date;
  daysUntilNextPeriod: number;
  ovulationDay: number;
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  daysUntilOvulation: number;
}

export function calculateCycleProgress(
  startDate: Date | string,
  cycleLength = 28,
  periodLength = 5,
  now: Date = new Date(),
): CycleProgress {
  const startUtc = toCalendarUtc(startDate);
  const todayUtc = toCalendarUtc(now);
  const daysSinceStart = diffCalendarDays(startUtc, todayUtc);
  const currentCycleDay = Math.max(1, daysSinceStart + 1);

  const nextPeriodDate = new Date(startUtc.getTime() + cycleLength * DAY_MS);
  const daysUntilNextPeriod = Math.max(0, diffCalendarDays(todayUtc, nextPeriodDate));

  const ovulationDay = cycleLength - 14;
  // Day 14 of cycle is start date + (14 - 1) days
  const ovulationDate = new Date(startUtc.getTime() + (ovulationDay - 1) * DAY_MS);
  const fertileStart = new Date(ovulationDate.getTime() - 5 * DAY_MS);
  const fertileEnd = new Date(ovulationDate.getTime() + 1 * DAY_MS);
  const daysUntilOvulation = Math.max(0, diffCalendarDays(todayUtc, ovulationDate));

  return {
    currentCycleDay,
    nextPeriodDate,
    daysUntilNextPeriod,
    ovulationDay,
    ovulationDate,
    fertileStart,
    fertileEnd,
    daysUntilOvulation,
  };
}

