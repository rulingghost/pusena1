// @ts-nocheck

export interface CreateSpecialDateDto {
  /** @minLength 1 */
  title: string;
  date: string;
  description?: string;
  isRecurring?: boolean;
  reminderDays?: number;
  reminderDaysList?: number[];
}
