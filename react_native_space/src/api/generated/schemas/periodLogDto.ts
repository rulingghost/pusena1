// @ts-nocheck

export interface PeriodLogDto {
  date: string;
  /**
     * @minimum 1
     * @maximum 5
     */
  flowLevel: number;
  notes?: string;
}
