import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SymptomItemDto {
  @IsString() type: string;
  @IsInt() @Min(1) @Max(5) severity: number;
  @IsString() @IsOptional() notes?: string;
}

export class CreateSymptomsDto {
  @IsDateString() date: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => SymptomItemDto) symptoms: SymptomItemDto[];
}

export class SymptomResponseItemDto {
  @ApiProperty() id: string;
  @ApiProperty() type: string;
  @ApiProperty() severity: number;
  @ApiProperty({ nullable: true, type: String }) notes: string | null;
}

export class SymptomsResponseDto {
  @ApiProperty() date: Date;
  @ApiProperty({ type: [SymptomResponseItemDto] }) symptoms: SymptomResponseItemDto[];
}

export class SymptomHistoryItemDto {
  @ApiProperty() id: string;
  @ApiProperty() date: Date;
  @ApiProperty() type: string;
  @ApiProperty() severity: number;
  @ApiProperty({ nullable: true, type: String }) notes: string | null;
  @ApiProperty() createdAt: Date;
}

export class SymptomHistoryResponseDto {
  @ApiProperty({ type: [SymptomHistoryItemDto] }) items: SymptomHistoryItemDto[];
  @ApiProperty() total: number;
}

export class SymptomCategoryDto {
  @ApiProperty() name: string;
  @ApiProperty({ type: [String] }) types: string[];
}

export class SymptomTypesResponseDto {
  @ApiProperty({ type: [SymptomCategoryDto] }) categories: SymptomCategoryDto[];
}
