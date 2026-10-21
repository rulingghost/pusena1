// @ts-nocheck
import type { AppleFullNameDto } from './appleFullNameDto';

export interface AppleAuthDto {
  /**
     * Apple Identity Token (JWT)
     * @minLength 10
     */
  identityToken: string;
  /** Apple kullanıcı e-postası (varsa) */
  email?: string;
  /** Apple kullanıcı tam adı */
  fullName?: AppleFullNameDto;
}
