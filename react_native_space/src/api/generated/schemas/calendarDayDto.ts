// @ts-nocheck

export interface CalendarDayDto {
  date: string;
  type: string;
  /** @nullable */
  flowLevel: number | null;
  hasSymptoms: boolean;
}
