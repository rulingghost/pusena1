// @ts-nocheck
import type { NotificationItemDto } from './notificationItemDto';

export interface NotificationsListResponseDto {
  items: NotificationItemDto[];
  total: number;
  page: number;
  totalPages: number;
  unreadCount: number;
}
