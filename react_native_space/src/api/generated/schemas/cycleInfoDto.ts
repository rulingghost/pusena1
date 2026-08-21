// @ts-nocheck

export interface CycleInfoDto {
  id: string;
  startDate: string;
  /** @nullable */
  endDate: string | null;
  cycleLength: number;
  periodLength: number;
  currentCycleDay: number;
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
}
