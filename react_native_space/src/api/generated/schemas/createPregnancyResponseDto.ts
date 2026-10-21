// @ts-nocheck

export interface CreatePregnancyResponseDto {
  id: string;
  lastMenstrualPeriod: string;
  dueDate: string;
  /** @nullable */
  babyName?: string | null;
  currentWeek: number;
  currentDay: number;
  isActive: boolean;
  createdAt: string;
}
