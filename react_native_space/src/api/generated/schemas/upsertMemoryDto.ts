// @ts-nocheck

export interface UpsertMemoryDto {
  /** @minLength 1 */
  title: string;
  date: string;
  category?: string;
  emoji?: string;
  notes?: string;
  imageUrls?: string[];
}
