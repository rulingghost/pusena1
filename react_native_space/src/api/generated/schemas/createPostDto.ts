// @ts-nocheck

export interface CreatePostDto {
  /** @minLength 1 */
  content: string;
  category: string;
  pregnancyWeek?: number;
}
