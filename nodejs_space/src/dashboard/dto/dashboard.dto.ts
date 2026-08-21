import { ApiProperty } from '@nestjs/swagger';

export class PregnancySummaryDto {
  @ApiProperty() currentWeek: number;
  @ApiProperty() currentDay: number;
  @ApiProperty() daysRemaining: number;
  @ApiProperty() babySizeComparison: string;
  @ApiProperty() progressPercent: number;
  @ApiProperty() trimester: number;
}

export class PeriodCalendarDayDto {
  @ApiProperty() date: string;
  @ApiProperty() type: string;
}

export class PeriodSummaryDto {
  @ApiProperty() daysUntilNextPeriod: number;
  @ApiProperty() currentCycleDay: number;
  @ApiProperty() nextPeriodDate: Date;
  @ApiProperty({ type: [PeriodCalendarDayDto] }) calendarDays: PeriodCalendarDayDto[];
}

export class NextSpecialDateDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() date: Date;
  @ApiProperty() daysUntil: number;
}

export class RelationshipSummaryDto {
  @ApiProperty() partnerName: string;
  @ApiProperty() daysTogether: number;
  @ApiProperty() startDate: Date;
  @ApiProperty({ nullable: true, type: NextSpecialDateDto }) nextSpecialDate: NextSpecialDateDto | null;
}

export class DailyTipDto {
  @ApiProperty() title: string;
  @ApiProperty() content: string;
  @ApiProperty() module: string;
}

export class PostPreviewDto {
  @ApiProperty() id: string;
  @ApiProperty() content: string;
  @ApiProperty() authorName: string;
  @ApiProperty({ nullable: true, type: String }) authorAvatarUrl: string | null;
  @ApiProperty() likesCount: number;
  @ApiProperty() commentsCount: number;
  @ApiProperty() createdAt: Date;
}

export class DashboardResponseDto {
  @ApiProperty({ nullable: true, type: PregnancySummaryDto }) pregnancy: PregnancySummaryDto | null;
  @ApiProperty({ nullable: true, type: PeriodSummaryDto }) period: PeriodSummaryDto | null;
  @ApiProperty({ nullable: true, type: RelationshipSummaryDto }) relationship: RelationshipSummaryDto | null;
  @ApiProperty({ nullable: true, type: DailyTipDto }) dailyTip: DailyTipDto | null;
  @ApiProperty({ type: [PostPreviewDto] }) recentPosts: PostPreviewDto[];
}
