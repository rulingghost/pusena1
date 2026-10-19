import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRelationshipDto {
  @IsString() startDate: string;
  @IsString() @MinLength(1) partnerName: string;
}

export class UpdateRelationshipDto {
  @IsString() @IsOptional() startDate?: string;
  @IsString() @IsOptional() partnerName?: string;
}

export class RelationshipResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() startDate: Date;
  @ApiProperty() partnerName: string;
  @ApiProperty() daysTogether: number;
  @ApiProperty() createdAt: Date;
}

export class PairPartnerDto {
  @IsString() @MinLength(4) partnerCode: string;
}

export class PartnerInfoDto {
  @ApiProperty({ nullable: true, type: String }) partnerCode: string | null;
  @ApiProperty() isPaired: boolean;
  @ApiProperty() paired: boolean;
  @ApiProperty({ nullable: true, required: false }) pairedUserName?: string;
  @ApiProperty({ nullable: true, required: false }) partnerName?: string;
  @ApiProperty({ nullable: true, required: false }) pairedUserEmail?: string;
  @ApiProperty({ nullable: true, required: false }) pairedUserId?: string | null;
}

export class AnswerCoupleQuestionDto {
  @IsString() @MinLength(1) answer: string;
}

export class LocationUpdateDto {
  @IsOptional() @Type(() => Number) @IsNumber() latitude?: number;
  @IsOptional() @Type(() => Number) @IsNumber() longitude?: number;
  @IsOptional() @Type(() => Number) @IsNumber() accuracy?: number;
  @IsOptional() @IsBoolean() sharingEnabled?: boolean;
}

export class SendNudgeDto {
  @IsString() type: string;
  @IsOptional() @IsString() comment?: string;
}

export class CoupleChatDto {
  @IsString() @MinLength(1) body: string;
  @IsOptional() @IsString() nudgeId?: string;
  @IsOptional() @IsString() kind?: string;
}
