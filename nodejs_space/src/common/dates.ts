const DAY_MS = 24 * 60 * 60 * 1000;
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

export function isBleedingMarkedEnded(startDate: Date, endDate: Date | null | undefined): boolean {
  if (!endDate) return false;
  const days = (endDate.getTime() - startDate.getTime()) / DAY_MS;
  return days >= 0 && days < BLEEDING_END_MAX_DAYS;
}

export function computeIsPeriodActive(
  cycle: { startDate: Date; endDate: Date | null; periodLength: number },
  now = new Date(),
): boolean {
  const currentCycleDay = Math.floor((now.getTime() - cycle.startDate.getTime()) / DAY_MS) + 1;
  if (isBleedingMarkedEnded(cycle.startDate, cycle.endDate)) return false;
  return currentCycleDay >= 1 && currentCycleDay <= cycle.periodLength;
}
