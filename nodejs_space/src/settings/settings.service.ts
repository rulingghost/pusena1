import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateModulesDto, UpdateNotificationsDto, UpdatePrivacyDto } from './dto/settings.dto';
import { filterModulesForGender } from '../common/gender-modules';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(userId: string) {
    const [settings, user] = await Promise.all([
      this.prisma.userSettings.findUnique({ where: { userId } }),
      this.prisma.user.findUnique({ where: { id: userId }, select: { gender: true } }),
    ]);
    if (!settings) {
      const created = await this.prisma.userSettings.create({
        data: { userId, activeModules: filterModulesForGender([], user?.gender) },
      });
      return this.formatSettings(created, user?.gender);
    }
    return this.formatSettings(settings, user?.gender);
  }

  async updateModules(userId: string, dto: UpdateModulesDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { gender: true } });
    const activeModules = filterModulesForGender(dto.activeModules, user?.gender);
    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      update: { activeModules },
      create: { userId, activeModules },
    });
    return { activeModules: filterModulesForGender(settings.activeModules, user?.gender) };
  }

  async updateNotifications(userId: string, dto: UpdateNotificationsDto) {
    const data: any = {};
    if (dto.pregnancyWeekly !== undefined) data.pregnancyWeekly = dto.pregnancyWeekly;
    if (dto.pregnancyTips !== undefined) data.pregnancyTips = dto.pregnancyTips;
    if (dto.periodReminder !== undefined) data.periodReminder = dto.periodReminder;
    if (dto.fertilityAlert !== undefined) data.fertilityAlert = dto.fertilityAlert;
    if (dto.specialDateReminder !== undefined) data.specialDateReminder = dto.specialDateReminder;
    if (dto.communityLikes !== undefined) data.communityLikes = dto.communityLikes;
    if (dto.communityComments !== undefined) data.communityComments = dto.communityComments;
    if (dto.medicationReminder !== undefined) data.medicationReminder = dto.medicationReminder;
    if (dto.countdownReminder !== undefined) data.countdownReminder = dto.countdownReminder;
    if (dto.reminderOffsets !== undefined) {
      const allowed = new Set([30, 7, 3, 1]);
      data.reminderOffsets = [...new Set(dto.reminderOffsets.filter((n) => allowed.has(n)))].sort((a, b) => b - a);
    }

    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
    return this.formatNotifications(settings);
  }

  async updatePrivacy(userId: string, dto: UpdatePrivacyDto) {
    const data: any = {};
    if (dto.profilePublic !== undefined) data.profilePublic = dto.profilePublic;
    if (dto.showCommunityPosts !== undefined) data.showCommunityPosts = dto.showCommunityPosts;
    if (dto.allowFollow !== undefined) data.allowFollow = dto.allowFollow;

    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
    return this.formatPrivacy(settings);
  }

  async completeSetup(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { hasCompletedSetup: true } });
    return { hasCompletedSetup: true };
  }

  private formatNotifications(s: any) {
    return {
      pregnancyWeekly: s.pregnancyWeekly,
      pregnancyTips: s.pregnancyTips,
      periodReminder: s.periodReminder,
      fertilityAlert: s.fertilityAlert,
      specialDateReminder: s.specialDateReminder,
      communityLikes: s.communityLikes,
      communityComments: s.communityComments,
      medicationReminder: s.medicationReminder ?? true,
      countdownReminder: s.countdownReminder ?? true,
      reminderOffsets: Array.isArray(s.reminderOffsets) && s.reminderOffsets.length ? s.reminderOffsets : [30, 7, 3, 1],
    };
  }

  private formatPrivacy(s: any) {
    return {
      profilePublic: s.profilePublic,
      showCommunityPosts: s.showCommunityPosts,
      allowFollow: s.allowFollow ?? true,
    };
  }

  private formatSettings(s: any, gender?: string | null) {
    return {
      activeModules: filterModulesForGender(s.activeModules, gender),
      notifications: this.formatNotifications(s),
      privacy: this.formatPrivacy(s),
    };
  }
}
