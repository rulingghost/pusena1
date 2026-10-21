// @ts-nocheck
import type { InsightItemDtoLevel } from './insightItemDtoLevel';

export interface InsightItemDto {
  id: string;
  level: InsightItemDtoLevel;
  module: string;
  title: string;
  body: string;
  reason: string;
  /** @nullable */
  action?: string | null;
  /** @nullable */
  route?: string | null;
}
