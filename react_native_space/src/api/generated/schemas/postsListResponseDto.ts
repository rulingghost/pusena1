// @ts-nocheck
import type { CommunityPostResponseDto } from './communityPostResponseDto';

export interface PostsListResponseDto {
  items: CommunityPostResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}
