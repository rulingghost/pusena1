import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePregnancyDto {
  @IsString() lastMenstrualPeriod: string;
  @IsOptional() @IsString() babyName?: string;
}

export class UpdatePregnancyDto {
  @IsOptional() @IsString() lastMenstrualPeriod?: string;
  @IsOptional() @IsString() babyName?: string;
}

export class SetBabyNameDto {
  @IsString() babyName: string;
}

export class PregnancyResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() lastMenstrualPeriod: Date;
  @ApiProperty() dueDate: Date;
  @ApiProperty({ nullable: true, required: false }) babyName?: string | null;
  @ApiProperty() currentWeek: number;
  @ApiProperty() currentDay: number;
  @ApiProperty() daysRemaining: number;
  @ApiProperty() trimester: number;
  @ApiProperty() progressPercent: number;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: Date;
}

export class CreatePregnancyResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() lastMenstrualPeriod: Date;
  @ApiProperty() dueDate: Date;
  @ApiProperty({ nullable: true, required: false }) babyName?: string | null;
  @ApiProperty() currentWeek: number;
  @ApiProperty() currentDay: number;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: Date;
}

export class WeekContentResponseDto {
  @ApiProperty() weekNumber: number;
  @ApiProperty() title: string;
  @ApiProperty() babyDevelopment: string;
  @ApiProperty() babySize: string;
  @ApiProperty() babyWeight: string;
  @ApiProperty() organDevelopment: string;
  @ApiProperty() motherChanges: string;
  @ApiProperty({ nullable: true, required: false }) letterFromBaby?: string | null;
  @ApiProperty({ type: [String] }) commonSymptoms: string[];
  @ApiProperty({ type: [String] }) tips: string[];
  @ApiProperty({ type: [String] }) warnings: string[];
}

export class WeekSummaryDto {
  @ApiProperty() weekNumber: number;
  @ApiProperty() title: string;
  @ApiProperty() babySize: string;
}

export class AllWeeksResponseDto {
  @ApiProperty({ type: [WeekSummaryDto] }) weeks: WeekSummaryDto[];
}

export class BabyNameItemDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() gender: string; // girl, boy, unisex
  @ApiProperty() meaning: string;
  @ApiProperty() origin: string;
  @ApiProperty() isPopular: boolean;
}

export class BabyNamesResponseDto {
  @ApiProperty({ type: [BabyNameItemDto] }) items: BabyNameItemDto[];
  @ApiProperty() total: number;
}
