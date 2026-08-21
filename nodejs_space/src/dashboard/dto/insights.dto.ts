import { ApiProperty } from '@nestjs/swagger';

export class InsightItemDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: ['info', 'tip', 'warning', 'danger', 'success'] }) level: string;
  @ApiProperty() module: string;
  @ApiProperty() title: string;
  @ApiProperty() body: string;
  @ApiProperty() reason: string;
  @ApiProperty({ required: false, nullable: true, type: String }) action?: string;
  @ApiProperty({ required: false, nullable: true, type: String }) route?: string;
}

export class InsightsResponseDto {
  @ApiProperty({ type: [InsightItemDto] }) items: InsightItemDto[];
}
