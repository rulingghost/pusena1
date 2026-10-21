// @ts-nocheck
import type { DeletedAccountDto } from './deletedAccountDto';

export interface AdminDeletedAccountsResponseDto {
  items: DeletedAccountDto[];
  total: number;
  page: number;
  totalPages: number;
}
