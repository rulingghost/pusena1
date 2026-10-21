// @ts-nocheck

export interface AdminUserDto {
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
  partnerCode: string | null;
  /** @nullable */
  googleId: string | null;
  hasCompletedSetup: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  activeModules: string[];
}
