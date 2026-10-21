// @ts-nocheck

export interface PregnancyResponseDto {
  id: string;
  lastMenstrualPeriod: string;
  dueDate: string;
  /** @nullable */
  babyName?: string | null;
  currentWeek: number;
  currentDay: number;
  daysRemaining: number;
  trimester: number;
  progressPercent: number;
  isActive: boolean;
  createdAt: string;
}
