import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString() @MinLength(1) content: string;
  @IsString() category: string;
  @IsInt() @IsOptional() pregnancyWeek?: number;
}

export class EditPostDto {
  @IsString() @MinLength(1) content: string;
}

export class CreateCommentDto {
  @IsString() @MinLength(1) content: string;
}

export class ReportPostDto {
  @IsString() @MinLength(1) reason: string;
}

export class CommunityPostResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() content: string;
  @ApiProperty() category: string;
  @ApiProperty({ nullable: true, type: Number }) pregnancyWeek: number | null;
  @ApiProperty() isEdited: boolean;
  @ApiProperty() authorId: string;
  @ApiProperty() authorName: string;
  @ApiProperty({ nullable: true, type: String }) authorAvatarUrl: string | null;
  @ApiProperty() likesCount: number;
  @ApiProperty() commentsCount: number;
  @ApiProperty() isLiked: boolean;
  @ApiProperty() isSaved: boolean;
  @ApiProperty() createdAt: Date;
}

export class PostsListResponseDto {
  @ApiProperty({ type: [CommunityPostResponseDto] }) items: CommunityPostResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class CommentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() content: string;
  @ApiProperty() authorId: string;
  @ApiProperty() authorName: string;
  @ApiProperty({ nullable: true, type: String }) authorAvatarUrl: string | null;
  @ApiProperty() createdAt: Date;
}

export class CommentsListResponseDto {
  @ApiProperty({ type: [CommentResponseDto] }) items: CommentResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class LikeResponseDto {
  @ApiProperty() liked: boolean;
  @ApiProperty() likesCount: number;
}

export class SaveResponseDto {
  @ApiProperty() saved: boolean;
}
