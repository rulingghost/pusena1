// @ts-nocheck
import type { AdminUserDetailDtoPairedUser } from './adminUserDetailDtoPairedUser';
import type { AdminUserDetailDtoPeriod } from './adminUserDetailDtoPeriod';
import type { AdminUserDetailDtoPregnancy } from './adminUserDetailDtoPregnancy';
import type { AdminUserDetailDtoRelationship } from './adminUserDetailDtoRelationship';
import type { AdminUserDetailDtoSettings } from './adminUserDetailDtoSettings';

export interface AdminUserDetailDto {
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
  /** @nullable */
  pregnancy: AdminUserDetailDtoPregnancy;
  /** @nullable */
  relationship: AdminUserDetailDtoRelationship;
  postsCount: number;
  commentsCount: number;
  /** @nullable */
  period: AdminUserDetailDtoPeriod;
  /** @nullable */
  settings: AdminUserDetailDtoSettings;
  /** @nullable */
  pairedUser: AdminUserDetailDtoPairedUser;
  symptomsCount: number;
  notificationsCount: number;
  periodCyclesCount: number;
}
