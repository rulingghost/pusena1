import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class AdminUserDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, type: String }) nickname: string | null;
  @ApiProperty({ nullable: true, type: String }) biography: string | null;
  @ApiProperty({ nullable: true, type: String }) avatarUrl: string | null;
  @ApiProperty({ nullable: true, type: String }) partnerCode: string | null;
  @ApiProperty({ nullable: true, type: String }) googleId: string | null;
  @ApiProperty() hasCompletedSetup: boolean;
  @ApiProperty() isAdmin: boolean;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty({ type: [String] }) activeModules: string[];
}

export class AdminUsersListResponseDto {
  @ApiProperty({ type: [AdminUserDto] }) items: AdminUserDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class AdminUserDetailDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, type: String }) nickname: string | null;
  @ApiProperty({ nullable: true, type: String }) biography: string | null;
  @ApiProperty({ nullable: true, type: String }) avatarUrl: string | null;
  @ApiProperty({ nullable: true, type: String }) partnerCode: string | null;
  @ApiProperty({ nullable: true, type: String }) googleId: string | null;
  @ApiProperty() hasCompletedSetup: boolean;
  @ApiProperty() isAdmin: boolean;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty({ type: [String] }) activeModules: string[];
  @ApiProperty({ nullable: true }) pregnancy: Record<string, unknown> | null;
  @ApiProperty({ nullable: true }) relationship: Record<string, unknown> | null;
  @ApiProperty() postsCount: number;
  @ApiProperty() commentsCount: number;
  @ApiProperty({ nullable: true }) period: Record<string, unknown> | null;
  @ApiProperty({ nullable: true }) settings: Record<string, unknown> | null;
  @ApiProperty({ nullable: true }) pairedUser: Record<string, unknown> | null;
  @ApiProperty() symptomsCount: number;
  @ApiProperty() notificationsCount: number;
  @ApiProperty() periodCyclesCount: number;
}

export class UpdateAdminUserDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() nickname?: string;
  @IsOptional() @IsString() biography?: string;
  @IsOptional() @IsBoolean() isAdmin?: boolean;
  @IsOptional() @IsBoolean() hasCompletedSetup?: boolean;
  @IsOptional() @IsArray() activeModules?: string[];
}

export class AdminStatsDto {
  @ApiProperty() totalUsers: number;
  @ApiProperty() activeUsers: number;
  @ApiProperty() adminUsers: number;
  @ApiProperty() newUsersToday: number;
  @ApiProperty() newUsersWeek: number;
  @ApiProperty() totalPosts: number;
  @ApiProperty() totalComments: number;
  @ApiProperty() deletedAccounts: number;
  @ApiProperty() pregnancyUsers: number;
  @ApiProperty() periodUsers: number;
  @ApiProperty() relationshipUsers: number;
  @ApiProperty() notificationsSent: number;
  @ApiProperty() pendingSetup: number;
  @ApiProperty() activePregnancies: number;
  @ApiProperty() symptomsLogged: number;
  @ApiProperty() symptomTypesCount: number;
  @ApiProperty() babyNamesCount: number;
  @ApiProperty() pregnancyWeeksCount: number;
  @ApiProperty() specialDatesCount: number;
  @ApiProperty() unreadNotifications: number;
  @ApiProperty() pairedCouples: number;
  @ApiProperty() openNudges: number;
  @ApiProperty() coupleMessages: number;
}

export class AdminUpdatePostDto {
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() category?: string;
}

export class AdminUpdateCommentDto {
  @IsString() content: string;
}

export class AdminUpdateSymptomTypeDto {
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() displayOrder?: number;
}

export class AdminUpdateBabyNameDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() meaning?: string;
  @IsOptional() @IsString() origin?: string;
  @IsOptional() @IsBoolean() isPopular?: boolean;
}

export class AdminUpdateArticleDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() subtitle?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) content?: string[];
}

export class AdminUpdateFaqDto {
  @IsOptional() @IsString() question?: string;
  @IsOptional() @IsString() answer?: string;
}

export class AdminUpdateMythDto {
  @IsOptional() @IsString() statement?: string;
  @IsOptional() @IsString() explanation?: string;
}

export class DeletedAccountDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty() reason: string;
  @ApiProperty({ nullable: true, type: String }) note: string | null;
  @ApiProperty() createdAt: Date;
}

export class AdminDeletedAccountsResponseDto {
  @ApiProperty({ type: [DeletedAccountDto] }) items: DeletedAccountDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class UpdateWeekContentDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() babyDevelopment?: string;
  @IsOptional() @IsString() babySize?: string;
  @IsOptional() @IsString() babyWeight?: string;
  @IsOptional() @IsString() organDevelopment?: string;
  @IsOptional() @IsString() motherChanges?: string;
  @IsOptional() @IsString() letterFromBaby?: string;
  @IsOptional() @IsArray() commonSymptoms?: string[];
  @IsOptional() @IsArray() tips?: string[];
  @IsOptional() @IsArray() warnings?: string[];
}

export class UpdatedWeekContentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() weekNumber: number;
  @ApiProperty() title: string;
  @ApiProperty() babyDevelopment: string;
  @ApiProperty() babySize: string;
  @ApiProperty() babyWeight: string;
  @ApiProperty() organDevelopment: string;
  @ApiProperty() motherChanges: string;
  @ApiProperty({ nullable: true, type: String }) letterFromBaby?: string | null;
  @ApiProperty({ type: [String] }) commonSymptoms: string[];
  @ApiProperty({ type: [String] }) tips: string[];
  @ApiProperty({ type: [String] }) warnings: string[];
}

export class SendNotificationDto {
  @IsString() title: string;
  @IsString() body: string;
  @IsOptional() @IsString() userId?: string;
  @IsOptional() @IsArray() userIds?: string[];
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() targetModule?: string;
}

export class SendNotificationResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() sentCount: number;
}

export class AdminPostDto {
  @ApiProperty() id: string;
  @ApiProperty() content: string;
  @ApiProperty() category: string;
  @ApiProperty() authorId: string;
  @ApiProperty() authorName: string;
  @ApiProperty() likesCount: number;
  @ApiProperty() commentsCount: number;
  @ApiProperty() createdAt: Date;
}

export class AdminPostsListResponseDto {
  @ApiProperty({ type: [AdminPostDto] }) items: AdminPostDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class AdminCommentDto {
  @ApiProperty() id: string;
  @ApiProperty() content: string;
  @ApiProperty() postId: string;
  @ApiProperty() authorId: string;
  @ApiProperty() authorName: string;
  @ApiProperty() createdAt: Date;
}

export class AdminCommentsListResponseDto {
  @ApiProperty({ type: [AdminCommentDto] }) items: AdminCommentDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}
