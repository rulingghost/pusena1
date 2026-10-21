// @ts-nocheck
import type { SymptomHistoryItemDto } from './symptomHistoryItemDto';

export interface SymptomHistoryResponseDto {
  items: SymptomHistoryItemDto[];
  total: number;
}
