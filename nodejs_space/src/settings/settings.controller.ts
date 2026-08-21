import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { SettingsService } from './settings.service';
import { UpdateModulesDto, UpdateNotificationsDto, UpdatePrivacyDto, SettingsResponseDto, ActiveModulesResponseDto, NotificationSettingsDto, PrivacySettingsDto, CompleteSetupResponseDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Settings')
@Controller('api/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Req() req: Request): Promise<SettingsResponseDto> {
    return this.settingsService.getSettings((req as any).user.id);
  }

  @Patch('modules')
  async updateModules(@Req() req: Request, @Body() dto: UpdateModulesDto): Promise<ActiveModulesResponseDto> {
    return this.settingsService.updateModules((req as any).user.id, dto);
  }

  @Patch('notifications')
  async updateNotifications(@Req() req: Request, @Body() dto: UpdateNotificationsDto): Promise<NotificationSettingsDto> {
    return this.settingsService.updateNotifications((req as any).user.id, dto);
  }

  @Patch('privacy')
  async updatePrivacy(@Req() req: Request, @Body() dto: UpdatePrivacyDto): Promise<PrivacySettingsDto> {
    return this.settingsService.updatePrivacy((req as any).user.id, dto);
  }

  @Patch('complete-setup')
  async completeSetup(@Req() req: Request): Promise<CompleteSetupResponseDto> {
    return this.settingsService.completeSetup((req as any).user.id);
  }
}
