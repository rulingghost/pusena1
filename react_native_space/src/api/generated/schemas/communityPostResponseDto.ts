// @ts-nocheck

export interface CommunityPostResponseDto {
  id: string;
  content: string;
  category: string;
  /** @nullable */
  pregnancyWeek: number | null;
  authorId: string;
  authorName: string;
  /** @nullable */
  authorAvatarUrl: string | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}
