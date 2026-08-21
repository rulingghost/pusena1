// @ts-nocheck

export interface SignupDto {
  email: string;
  /** @minLength 6 */
  password: string;
  /** @minLength 2 */
  name: string;
}
