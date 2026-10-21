// @ts-nocheck

export interface ResetPasswordDto {
  email?: string;
  code?: string;
  token?: string;
  /** @minLength 6 */
  newPassword: string;
}
