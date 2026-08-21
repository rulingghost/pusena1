// @ts-nocheck
import type { DailyTipDto } from './dailyTipDto';
import type { PeriodSummaryDto } from './periodSummaryDto';
import type { PostPreviewDto } from './postPreviewDto';
import type { PregnancySummaryDto } from './pregnancySummaryDto';
import type { RelationshipSummaryDto } from './relationshipSummaryDto';

export interface DashboardResponseDto {
  /** @nullable */
  pregnancy: PregnancySummaryDto | null;
  /** @nullable */
  period: PeriodSummaryDto | null;
  /** @nullable */
  relationship: RelationshipSummaryDto | null;
  /** @nullable */
  dailyTip: DailyTipDto | null;
  recentPosts: PostPreviewDto[];
}
