// @ts-nocheck
import type { AdminPostDto } from './adminPostDto';

export interface AdminPostsListResponseDto {
  items: AdminPostDto[];
  total: number;
  page: number;
  totalPages: number;
}
