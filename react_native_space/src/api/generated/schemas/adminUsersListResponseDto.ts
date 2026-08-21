// @ts-nocheck
import type { AdminUserDto } from './adminUserDto';

export interface AdminUsersListResponseDto {
  items: AdminUserDto[];
  total: number;
  page: number;
  totalPages: number;
}
