import {
  diffCalendarDays,
  parseDateOnly,
  localDateKey,
  toCalendarUtc,
  calculatePregnancyProgress,
  calculateCycleProgress,
  computeIsPeriodActive,
  DAY_MS,
} from './dates';

describe('Standardized Date & Progress Calculations (Madde 16)', () => {
  describe('diffCalendarDays', () => {
    it('calculates 0 days for same calendar date regardless of hours', () => {
      const morning = new Date(2026, 9, 21, 1, 0, 0);
      const evening = new Date(2026, 9, 21, 23, 30, 0);
      expect(diffCalendarDays(morning, evening)).toBe(0);
    });

    it('calculates exact positive calendar difference across month boundaries', () => {
      expect(diffCalendarDays('2026-09-30', '2026-10-02')).toBe(2);
    });

    it('calculates negative calendar difference for past dates', () => {
      expect(diffCalendarDays('2026-10-10', '2026-10-05')).toBe(-5);
    });
  });

  describe('calculatePregnancyProgress', () => {
    it('calculates day 1 and week 1 on the exact LMP date', () => {
      const lmp = '2026-01-01';
      const now = new Date('2026-01-01T15:00:00.000Z');
      const res = calculatePregnancyProgress(lmp, null, now);

      expect(res.week).toBe(1);
      expect(res.day).toBe(1);
      expect(res.daysRemaining).toBe(280);
      expect(res.trimester).toBe(1);
      expect(res.progressPercent).toBe(0);
    });

    it('calculates week 2 day 1 after 7 days elapsed', () => {
      const lmp = '2026-01-01';
      const now = new Date('2026-01-08T10:00:00.000Z'); // 7 days after LMP
      const res = calculatePregnancyProgress(lmp, null, now);

      expect(res.week).toBe(2);
      expect(res.day).toBe(1);
      expect(res.daysRemaining).toBe(273);
      expect(res.trimester).toBe(1);
    });

    it('calculates correct trimester transitions (1st <= 13, 2nd <= 27, 3rd >= 28)', () => {
      // 14 weeks = 98 days
      const lmp = '2026-01-01';
      const nowW14 = new Date(Date.UTC(2026, 0, 1 + 91));
      const resW14 = calculatePregnancyProgress(lmp, null, nowW14);
      expect(resW14.week).toBe(14);
      expect(resW14.trimester).toBe(2);

      // 28 weeks = 189 days
      const nowW28 = new Date(Date.UTC(2026, 0, 1 + 189));
      const resW28 = calculatePregnancyProgress(lmp, null, nowW28);
      expect(resW28.week).toBe(28);
      expect(resW28.trimester).toBe(3);
    });

    it('clamps week between 1 and 42 even for past or far future dates', () => {
      const lmp = '2026-01-01';
      // Future date 350 days later
      const farFuture = new Date(Date.UTC(2026, 0, 1 + 350));
      const res = calculatePregnancyProgress(lmp, null, farFuture);
      expect(res.week).toBe(42);
      expect(res.daysRemaining).toBe(0);
      expect(res.progressPercent).toBe(100);
    });
  });

  describe('calculateCycleProgress', () => {
    it('calculates cycle day 1 and correct ovulation on start date', () => {
      const startDate = '2026-10-01';
      const now = new Date('2026-10-01T12:00:00.000Z');
      const res = calculateCycleProgress(startDate, 28, 5, now);

      expect(res.currentCycleDay).toBe(1);
      expect(res.ovulationDay).toBe(14); // 28 - 14 = 14
      // Day 14 is Oct 1 + 13 days = Oct 14
      expect(res.ovulationDate.toISOString().slice(0, 10)).toBe('2026-10-14');
      expect(res.daysUntilOvulation).toBe(13);
      expect(res.daysUntilNextPeriod).toBe(28);
      // Fertile window: Oct 14 - 5 days = Oct 9 to Oct 15
      expect(res.fertileStart.toISOString().slice(0, 10)).toBe('2026-10-09');
      expect(res.fertileEnd.toISOString().slice(0, 10)).toBe('2026-10-15');
    });

    it('calculates current cycle day and days until next period mid cycle', () => {
      const startDate = '2026-10-01';
      const now = new Date('2026-10-14T10:00:00.000Z'); // Day 14 (Ovulation day)
      const res = calculateCycleProgress(startDate, 28, 5, now);

      expect(res.currentCycleDay).toBe(14);
      expect(res.daysUntilOvulation).toBe(0);
      expect(res.daysUntilNextPeriod).toBe(15);
    });
  });

  describe('computeIsPeriodActive', () => {
    it('returns true during bleeding days', () => {
      const cycle = {
        startDate: parseDateOnly('2026-10-01'),
        endDate: null,
        periodLength: 5,
      };
      const day3 = parseDateOnly('2026-10-03');
      expect(computeIsPeriodActive(cycle, day3)).toBe(true);
    });

    it('returns false after bleeding days or when marked ended', () => {
      const cycle = {
        startDate: parseDateOnly('2026-10-01'),
        endDate: parseDateOnly('2026-10-04'),
        periodLength: 5,
      };
      const day3 = parseDateOnly('2026-10-03');
      expect(computeIsPeriodActive(cycle, day3)).toBe(false);
    });
  });
});
