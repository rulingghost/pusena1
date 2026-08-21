// @ts-nocheck

export interface PeriodSetupDto {
  lastPeriodStart: string;
  /**
     * @minimum 21
     * @maximum 45
     */
  cycleLength: number;
  /**
     * @minimum 2
     * @maximum 10
     */
  periodLength: number;
}
