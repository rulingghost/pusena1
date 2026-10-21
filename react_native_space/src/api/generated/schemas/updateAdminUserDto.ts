// @ts-nocheck

export interface UpdateAdminUserDto {
  name?: string;
  email?: string;
  nickname?: string;
  biography?: string;
  isAdmin?: boolean;
  hasCompletedSetup?: boolean;
  activeModules?: string[];
}
