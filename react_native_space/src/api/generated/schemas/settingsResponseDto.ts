// @ts-nocheck
import type { NotificationSettingsDto } from './notificationSettingsDto';
import type { PrivacySettingsDto } from './privacySettingsDto';

export interface SettingsResponseDto {
  activeModules: string[];
  notifications: NotificationSettingsDto;
  privacy: PrivacySettingsDto;
}
