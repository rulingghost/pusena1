// @ts-nocheck

export interface AdminUserDto {
  id: string;
  email: string;
  name: string;
  /** @nullable */
  avatarUrl: string | null;
  /** @nullable */
  googleId: string | null;
  hasCompletedSetup: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  activeModules: string[];
}
