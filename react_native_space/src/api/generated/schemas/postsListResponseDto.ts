// @ts-nocheck
import type { CommunityPostResponseDto } from './communityPostResponseDto';

export interface PostsListResponseDto {
  items: CommunityPostResponseDto[];
  total: number;
  page: number;
  limit?: number;
  totalPages: number;
  hasMore?: boolean;
}
