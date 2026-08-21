// @ts-nocheck

export interface PeriodDayResponseDto {
  id: string;
  date: string;
  flowLevel: number;
  /** @nullable */
  notes: string | null;
  cycleId: string;
}
