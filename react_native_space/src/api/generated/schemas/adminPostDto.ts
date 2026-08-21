// @ts-nocheck

export interface AdminPostDto {
  id: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}
