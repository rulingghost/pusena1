// @ts-nocheck
import type { UpdateProfileDtoGender } from './updateProfileDtoGender';
import type { UpdateProfileDtoLanguage } from './updateProfileDtoLanguage';

export interface UpdateProfileDto {
  /** @minLength 2 */
  name?: string;
  /** @maxLength 30 */
  nickname?: string;
  /** @maxLength 300 */
  biography?: string;
  /** @nullable */
  avatarUrl?: string | null;
  gender?: UpdateProfileDtoGender;
  language?: UpdateProfileDtoLanguage;
  /**
     * @minimum 1940
     * @maximum 2026
     */
  birthYear?: number;
  /**
     * @minimum 100
     * @maximum 230
     */
  heightCm?: number;
  /**
     * @minimum 30
     * @maximum 300
     */
  weightKg?: number;
}
