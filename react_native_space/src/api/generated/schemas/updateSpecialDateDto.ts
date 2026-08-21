// @ts-nocheck

export interface UpdateSpecialDateDto {
  title?: string;
  date?: string;
  description?: string;
  isRecurring?: boolean;
  /** @nullable */
  reminderDays?: number | null;
  reminderDaysList?: number[];
}
