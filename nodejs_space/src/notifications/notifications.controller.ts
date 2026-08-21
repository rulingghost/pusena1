import { Controller, Get, Post, Patch, Delete, Param, Query, Body, Req, UseGuards, ParseIntPipe, DefaultValuePipe, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { NotificationsListResponseDto, UnreadCountResponseDto } from './dto/notifications.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../common/dto/success.dto';
import { SendNotificationResponseDto } from '../admin/dto/admin.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ForbiddenException } from '@nestjs/common';

class AnswerActionDto {
  @IsString() @ApiProperty() answer: string; // 'yes' or 'no'
}

@ApiTags('Notifications')
@Controller('api/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<NotificationsListResponseDto> {
    return this.notificationsService.getNotifications((req as any).user.id, page, limit);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  async unreadCount(@Req() req: Request): Promise<UnreadCountResponseDto> {
    return this.notificationsService.getUnreadCount((req as any).user.id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markRead(@Req() req: Request, @Param('id') id: string): Promise<SuccessResponseDto> {
    return this.notificationsService.markRead((req as any).user.id, id);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllRead(@Req() req: Request): Promise<SuccessResponseDto> {
    return this.notificationsService.markAllRead((req as any).user.id);
  }

  @Delete('clear-all')
  @UseGuards(JwtAuthGuard)
  async clearAll(@Req() req: Request): Promise<SuccessResponseDto> {
    return this.notificationsService.clearAll((req as any).user.id);
  }

  @Post(':id/answer')
  @UseGuards(JwtAuthGuard)
  async answerAction(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: AnswerActionDto,
  ): Promise<SuccessResponseDto> {
    return this.notificationsService.answerAction((req as any).user.id, id, dto.answer);
  }

  // Cron endpoints — protected by API key
  @Post('cron/pregnancy-tips')
  async cronPregnancyTips(@Headers('x-api-key') apiKey: string): Promise<SendNotificationResponseDto> {
    const secret = this.configService.get<string>('CRON_SECRET') || this.configService.get<string>('JWT_SECRET');
    if (apiKey !== secret) throw new ForbiddenException('Geçersiz API anahtarı');
    return this.notificationsService.sendPregnancyTips();
  }

  @Post('cron/special-date-reminders')
  async cronSpecialDateReminders(@Headers('x-api-key') apiKey: string): Promise<SendNotificationResponseDto> {
    const secret = this.configService.get<string>('CRON_SECRET') || this.configService.get<string>('JWT_SECRET');
    if (apiKey !== secret) throw new ForbiddenException('Geçersiz API anahtarı');
    return this.notificationsService.sendSpecialDateReminders();
  }

  @Post('cron/period-reminders')
  async cronPeriodReminders(@Headers('x-api-key') apiKey: string): Promise<SendNotificationResponseDto> {
    const secret = this.configService.get<string>('CRON_SECRET') || this.configService.get<string>('JWT_SECRET');
    if (apiKey !== secret) throw new ForbiddenException('Geçersiz API anahtarı');
    return this.notificationsService.sendPeriodReminders();
  }
}
