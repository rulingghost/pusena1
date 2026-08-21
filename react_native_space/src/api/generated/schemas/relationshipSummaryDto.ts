// @ts-nocheck
import type { NextSpecialDateDto } from './nextSpecialDateDto';

export interface RelationshipSummaryDto {
  partnerName: string;
  daysTogether: number;
  startDate: string;
  /** @nullable */
  nextSpecialDate: NextSpecialDateDto | null;
}
