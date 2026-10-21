export const DAY_MS = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD → UTC midnight, so the calendar day is stable in JSON/ISO. */
export function parseDateOnly(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec((value ?? '').trim());
  if (m) {
    return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  }
  return new Date(value);
}

/** Local calendar day as YYYY-MM-DD. `toISOString().slice(0,10)` is yesterday in Turkey before 03:00. */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

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

export function toCalendarUtc(d: Date | string): Date {
  if (typeof d === 'string') return parseDateOnly(d);
  return parseDateOnly(dateKey(d));
}

export function diffCalendarDays(from: Date | string, to: Date | string): number {
  const fromUtc = toCalendarUtc(from);
  const toUtc = toCalendarUtc(to);
  return Math.round((toUtc.getTime() - fromUtc.getTime()) / DAY_MS);
}

export function calculatePregnancyProgress(
  lmp: Date | string,
  dueDate?: Date | string | null,
  now: Date = new Date(),
) {
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

