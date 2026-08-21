// @ts-nocheck

export interface ChangePasswordDto {
  currentPassword: string;
  /** @minLength 6 */
  newPassword: string;
}
