// @ts-nocheck

export interface UserResponseDto {
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
  partnerCode?: string | null;
  /** @nullable */
  pairedUserId?: string | null;
  hasCompletedSetup: boolean;
  isAdmin: boolean;
  /** @nullable */
  gender?: string | null;
  language?: string;
  /** @nullable */
  birthYear?: number | null;
  createdAt: string;
}
