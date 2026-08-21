import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateModulesDto {
  @IsArray() @IsString({ each: true }) activeModules: string[];
}

export class UpdateNotificationsDto {
  @IsBoolean() @IsOptional() pregnancyWeekly?: boolean;
  @IsBoolean() @IsOptional() pregnancyTips?: boolean;
  @IsBoolean() @IsOptional() periodReminder?: boolean;
  @IsBoolean() @IsOptional() fertilityAlert?: boolean;
  @IsBoolean() @IsOptional() specialDateReminder?: boolean;
  @IsBoolean() @IsOptional() communityLikes?: boolean;
  @IsBoolean() @IsOptional() communityComments?: boolean;
  @IsBoolean() @IsOptional() medicationReminder?: boolean;
  @IsBoolean() @IsOptional() countdownReminder?: boolean;
  @IsArray() @IsOptional() @IsInt({ each: true }) reminderOffsets?: number[];
}

export class UpdatePrivacyDto {
  @IsBoolean() @IsOptional() profilePublic?: boolean;
  @IsBoolean() @IsOptional() showCommunityPosts?: boolean;
  @IsBoolean() @IsOptional() allowFollow?: boolean;
}

export class NotificationSettingsDto {
  @ApiProperty() pregnancyWeekly: boolean;
  @ApiProperty() pregnancyTips: boolean;
  @ApiProperty() periodReminder: boolean;
  @ApiProperty() fertilityAlert: boolean;
  @ApiProperty() specialDateReminder: boolean;
  @ApiProperty() communityLikes: boolean;
  @ApiProperty() communityComments: boolean;
  @ApiProperty() medicationReminder: boolean;
  @ApiProperty() countdownReminder: boolean;
  @ApiProperty({ type: [Number] }) reminderOffsets: number[];
}

export class PrivacySettingsDto {
  @ApiProperty() profilePublic: boolean;
  @ApiProperty() showCommunityPosts: boolean;
  @ApiProperty() allowFollow: boolean;
}

export class ActiveModulesResponseDto {
  @ApiProperty({ type: [String] }) activeModules: string[];
}

export class SettingsResponseDto {
  @ApiProperty({ type: [String] }) activeModules: string[];
  @ApiProperty({ type: NotificationSettingsDto }) notifications: NotificationSettingsDto;
  @ApiProperty({ type: PrivacySettingsDto }) privacy: PrivacySettingsDto;
}

export class CompleteSetupResponseDto {
  @ApiProperty() hasCompletedSetup: boolean;
}
