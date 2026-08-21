// @ts-nocheck
import type { AdminUserDetailDtoPregnancy } from './adminUserDetailDtoPregnancy';
import type { AdminUserDetailDtoRelationship } from './adminUserDetailDtoRelationship';

export interface AdminUserDetailDto {
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
  /** @nullable */
  pregnancy: AdminUserDetailDtoPregnancy;
  /** @nullable */
  relationship: AdminUserDetailDtoRelationship;
  postsCount: number;
  commentsCount: number;
}
