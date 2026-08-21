// @ts-nocheck

export interface CycleHistoryItemDto {
  id: string;
  startDate: string;
  /** @nullable */
  endDate: string | null;
  cycleLength: number;
  periodLength: number;
}
