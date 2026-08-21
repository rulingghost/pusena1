// @ts-nocheck

export interface PostPreviewDto {
  id: string;
  content: string;
  authorName: string;
  /** @nullable */
  authorAvatarUrl: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}
