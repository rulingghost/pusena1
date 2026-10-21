// @ts-nocheck
import type { SignupDtoGender } from './signupDtoGender';

export interface SignupDto {
  email: string;
  /** @minLength 6 */
  password: string;
  /** @minLength 2 */
  name: string;
  nickname?: string;
  gender: SignupDtoGender;
  language?: string;
  birthYear?: number;
}
