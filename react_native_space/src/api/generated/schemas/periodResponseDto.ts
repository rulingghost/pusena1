// @ts-nocheck
import type { CycleInfoDto } from './cycleInfoDto';

export interface PeriodResponseDto {
  /** @nullable */
  currentCycle: CycleInfoDto | null;
  averageCycleLength: number;
}
