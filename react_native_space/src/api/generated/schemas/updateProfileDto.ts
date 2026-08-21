// @ts-nocheck

export interface UpdateProfileDto {
  /** @minLength 2 */
  name?: string;
  /** @maxLength 30 */
  nickname?: string;
  /** @maxLength 300 */
  biography?: string;
}
