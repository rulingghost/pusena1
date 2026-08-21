// @ts-nocheck

export interface CreatePregnancyResponseDto {
  id: string;
  lastMenstrualPeriod: string;
  dueDate: string;
  currentWeek: number;
  currentDay: number;
  isActive: boolean;
  createdAt: string;
}
