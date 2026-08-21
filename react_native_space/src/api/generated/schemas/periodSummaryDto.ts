// @ts-nocheck
import type { PeriodCalendarDayDto } from './periodCalendarDayDto';

export interface PeriodSummaryDto {
  daysUntilNextPeriod: number;
  currentCycleDay: number;
  nextPeriodDate: string;
  calendarDays: PeriodCalendarDayDto[];
}
