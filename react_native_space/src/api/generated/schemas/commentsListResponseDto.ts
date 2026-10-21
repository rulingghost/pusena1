// @ts-nocheck
import type { CommentResponseDto } from './commentResponseDto';

export interface CommentsListResponseDto {
  items: CommentResponseDto[];
  total: number;
  page: number;
  limit?: number;
  totalPages: number;
  hasMore?: boolean;
}
