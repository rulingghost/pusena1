// @ts-nocheck

export interface SendNotificationDto {
  title: string;
  body: string;
  userId?: string;
  userIds?: string[];
  module?: string;
  type?: string;
  targetModule?: string;
}
