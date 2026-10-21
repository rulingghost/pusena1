// @ts-nocheck
import type { SaveAssessmentDtoAnswers } from './saveAssessmentDtoAnswers';

export interface SaveAssessmentDto {
  goal?: string;
  tryingDuration?: string;
  cycleRegularity?: string;
  contraceptionPast?: string;
  healthConditions?: string[];
  heightCm?: number;
  weightKg?: number;
  age?: number;
  answers?: SaveAssessmentDtoAnswers;
}
