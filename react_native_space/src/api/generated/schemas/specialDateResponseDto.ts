// @ts-nocheck

export interface SpecialDateResponseDto {
  id: string;
  title: string;
  date: string;
  /** @nullable */
  description: string | null;
  isRecurring: boolean;
  /** @nullable */
  reminderDays: number | null;
  reminderDaysList: number[];
  daysUntil: number;
  createdAt: string;
}
