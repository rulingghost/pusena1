import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PeriodSetupDto {
  @IsDateString() lastPeriodStart: string;
  @IsInt() @Min(21) @Max(45) cycleLength: number;
  @IsInt() @Min(2) @Max(10) periodLength: number;
}

export class PeriodLogDto {
  @IsDateString() date: string;
  @IsInt() @Min(1) @Max(5) flowLevel: number;
  @IsString() @IsOptional() notes?: string;
}

export class StartPeriodDto {
  @IsDateString() date: string;
}

export class EndPeriodDto {
  @IsDateString() @IsOptional() date?: string;
}

export class EndPeriodResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() periodLength: number;
}

export class PeriodSetupResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() lastPeriodStart: Date;
  @ApiProperty() cycleLength: number;
  @ApiProperty() periodLength: number;
  @ApiProperty() nextPeriodDate: Date;
  @ApiProperty() ovulationDate: Date;
}

export class CycleInfoDto {
  @ApiProperty() id: string;
  @ApiProperty() startDate: Date;
  @ApiProperty({ nullable: true, type: Date }) endDate: Date | null;
  @ApiProperty() cycleLength: number;
  @ApiProperty() periodLength: number;
  @ApiProperty() currentCycleDay: number;
  @ApiProperty() nextPeriodDate: Date;
  @ApiProperty() ovulationDate: Date;
  @ApiProperty() fertileWindowStart: Date;
  @ApiProperty() fertileWindowEnd: Date;
  @ApiProperty() isPeriodActive: boolean;
}

export class PeriodResponseDto {
  @ApiProperty({ nullable: true, type: CycleInfoDto }) currentCycle: CycleInfoDto | null;
  @ApiProperty() averageCycleLength: number;
}

export class PeriodDayResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() date: Date;
  @ApiProperty() flowLevel: number;
  @ApiProperty({ nullable: true, type: String }) notes: string | null;
  @ApiProperty() cycleId: string;
}

export class CalendarDayDto {
  @ApiProperty() date: string;
  @ApiProperty() type: string;
  @ApiProperty({ nullable: true, type: Number }) flowLevel: number | null;
  @ApiProperty() hasSymptoms: boolean;
}

export class CalendarResponseDto {
  @ApiProperty({ type: [CalendarDayDto] }) days: CalendarDayDto[];
}

export class CycleHistoryItemDto {
  @ApiProperty() id: string;
  @ApiProperty() startDate: Date;
  @ApiProperty({ nullable: true, type: Date }) endDate: Date | null;
  @ApiProperty() cycleLength: number;
  @ApiProperty() periodLength: number;
}

export class PeriodHistoryResponseDto {
  @ApiProperty({ type: [CycleHistoryItemDto] }) items: CycleHistoryItemDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class StartPeriodResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() startDate: Date;
  @ApiProperty() cycleLength: number;
  @ApiProperty() periodLength: number;
}
