import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsArray, MinLength, MaxLength, Min, Max, IsIn } from 'class-validator';

export class UpdateProfileDto {
  @IsString() @IsOptional() @MinLength(2) name?: string;
  @IsString() @IsOptional() @MaxLength(30) nickname?: string;
  @IsString() @IsOptional() @MaxLength(300) biography?: string;
  @IsOptional() avatarUrl?: string | null;
  @IsOptional() @IsString() @IsIn(['female', 'male', 'other']) gender?: string;
  @IsOptional() @IsString() @IsIn(['tr', 'en']) language?: string;
  @IsOptional() @IsInt() @Min(1940) @Max(2026) birthYear?: number;
  @IsOptional() @IsInt() @Min(100) @Max(230) heightCm?: number;
  @IsOptional() @IsInt() @Min(30) @Max(300) weightKg?: number;
}

export class UpdateLanguageDto {
  @IsString() @IsIn(['tr', 'en']) language: string;
}

export class UserProfileResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, type: String }) nickname: string | null;
  @ApiProperty({ nullable: true, type: String }) biography: string | null;
  @ApiProperty({ nullable: true, type: String }) avatarUrl: string | null;
  @ApiProperty({ nullable: true, type: String }) gender: string | null;
  @ApiProperty() language: string;
  @ApiProperty({ nullable: true, type: Number }) birthYear: number | null;
  @ApiProperty({ nullable: true, type: Number }) heightCm: number | null;
  @ApiProperty({ nullable: true, type: Number }) weightKg: number | null;
  @ApiProperty() createdAt: Date;
}

export class PublicUserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, type: String }) nickname: string | null;
  @ApiProperty({ nullable: true, type: String }) avatarUrl: string | null;
  @ApiProperty() createdAt: Date;
}

export class SaveAssessmentDto {
  @IsOptional() @IsString() goal?: string;
  @IsOptional() @IsString() tryingDuration?: string;
  @IsOptional() @IsString() cycleRegularity?: string;
  @IsOptional() @IsString() contraceptionPast?: string;
  @IsOptional() @IsArray() healthConditions?: string[];
  @IsOptional() @IsInt() heightCm?: number;
  @IsOptional() @IsInt() weightKg?: number;
  @IsOptional() @IsInt() age?: number;
  @IsOptional() answers?: Record<string, unknown>;
}

export class AssessmentResponseDto {
  @ApiProperty({ nullable: true, type: String }) goal: string | null;
  @ApiProperty({ nullable: true, type: String }) tryingDuration: string | null;
  @ApiProperty({ nullable: true, type: String }) cycleRegularity: string | null;
  @ApiProperty({ nullable: true, type: String }) contraceptionPast: string | null;
  @ApiProperty({ type: [String] }) healthConditions: string[];
  @ApiProperty({ nullable: true, type: Number }) heightCm: number | null;
  @ApiProperty({ nullable: true, type: Number }) weightKg: number | null;
  @ApiProperty({ nullable: true, type: Number }) age: number | null;
  @ApiProperty({ nullable: true, type: Number }) score: number | null;
  @ApiProperty({ nullable: true, type: Number }) bmi: number | null;
  @ApiProperty({ type: [String] }) insights: string[];
  @ApiProperty({ type: [String] }) recommendations: string[];
}

export class UpsertMemoryDto {
  @IsString() @MinLength(1) title: string;
  @IsString() date: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() emoji?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() imageUrls?: string[];
}
