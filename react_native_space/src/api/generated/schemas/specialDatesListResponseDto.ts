// @ts-nocheck
import type { SpecialDateResponseDto } from './specialDateResponseDto';

export interface SpecialDatesListResponseDto {
  items: SpecialDateResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}
