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
  createdAt: string;
}
