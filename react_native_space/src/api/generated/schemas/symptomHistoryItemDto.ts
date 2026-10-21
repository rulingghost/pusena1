// @ts-nocheck

export interface SymptomHistoryItemDto {
  id: string;
  date: string;
  type: string;
  severity: number;
  /** @nullable */
  notes: string | null;
  createdAt: string;
}
