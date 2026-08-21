// @ts-nocheck
import type { SymptomItemDto } from './symptomItemDto';

export interface CreateSymptomsDto {
  date: string;
  symptoms: SymptomItemDto[];
}
