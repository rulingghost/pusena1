import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSpecialDateDto {
  @IsString() @MinLength(1) title: string;
  @IsString() date: string;
  @IsString() @IsOptional() description?: string;
  @IsBoolean() @IsOptional() isRecurring?: boolean;
  @IsInt() @IsOptional() reminderDays?: number;
  @IsArray() @IsOptional() reminderDaysList?: number[];
}

export class UpdateSpecialDateDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() date?: string;
  @IsString() @IsOptional() description?: string;
  @IsBoolean() @IsOptional() isRecurring?: boolean;
  @IsInt() @IsOptional() reminderDays?: number | null;
  @IsArray() @IsOptional() reminderDaysList?: number[];
}

export class SpecialDateResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() date: Date;
  @ApiProperty({ nullable: true, type: String }) description: string | null;
  @ApiProperty() isRecurring: boolean;
  @ApiProperty({ nullable: true, type: Number }) reminderDays: number | null;
  @ApiProperty({ type: [Number] }) reminderDaysList: number[];
  @ApiProperty() daysUntil: number;
  @ApiProperty() createdAt: Date;
}

export class SpecialDatesListResponseDto {
  @ApiProperty({ type: [SpecialDateResponseDto] }) items: SpecialDateResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}
