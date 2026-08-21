// @ts-nocheck
import type { CycleHistoryItemDto } from './cycleHistoryItemDto';

export interface PeriodHistoryResponseDto {
  items: CycleHistoryItemDto[];
  total: number;
  page: number;
  totalPages: number;
}
