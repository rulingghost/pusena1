// @ts-nocheck

export interface UserProfileResponseDto {
  id: string;
  email: string;
  name: string;
  /** @nullable */
  nickname: string | null;
  /** @nullable */
  biography: string | null;
  /** @nullable */
  avatarUrl: string | null;
  /** @nullable */
  gender: string | null;
  language: string;
  /** @nullable */
  birthYear: number | null;
  /** @nullable */
  heightCm: number | null;
  /** @nullable */
  weightKg: number | null;
  createdAt: string;
}
