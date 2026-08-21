// @ts-nocheck

export interface SymptomItemDto {
  type: string;
  /**
     * @minimum 1
     * @maximum 5
     */
  severity: number;
  notes?: string;
}
