import { ApiProperty } from '@nestjs/swagger';

export class NotificationItemDto {
  @ApiProperty() id: string;
  @ApiProperty() type: string;
  @ApiProperty() title: string;
  @ApiProperty() body: string;
  @ApiProperty() module: string;
  @ApiProperty({ nullable: true, type: String }) referenceId: string | null;
  @ApiProperty() isRead: boolean;
  @ApiProperty({ nullable: true, type: String }) actionType: string | null;
  @ApiProperty() actionDone: boolean;
  @ApiProperty() createdAt: Date;
}

export class NotificationsListResponseDto {
  @ApiProperty({ type: [NotificationItemDto] }) items: NotificationItemDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
  @ApiProperty() unreadCount: number;
}

export class UnreadCountResponseDto {
  @ApiProperty() count: number;
}
