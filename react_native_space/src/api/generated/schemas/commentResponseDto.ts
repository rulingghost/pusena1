// @ts-nocheck

export interface CommentResponseDto {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  /** @nullable */
  authorAvatarUrl: string | null;
  createdAt: string;
}
