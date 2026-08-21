// @ts-nocheck
import type { AdminCommentDto } from './adminCommentDto';

export interface AdminCommentsListResponseDto {
  items: AdminCommentDto[];
  total: number;
  page: number;
  totalPages: number;
}
