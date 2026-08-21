// @ts-nocheck

export interface NotificationItemDto {
  id: string;
  type: string;
  title: string;
  body: string;
  module: string;
  /** @nullable */
  referenceId: string | null;
  isRead: boolean;
  /** @nullable */
  actionType: string | null;
  actionDone: boolean;
  createdAt: string;
}
