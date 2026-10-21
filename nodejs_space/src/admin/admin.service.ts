import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWeekContentDto, SendNotificationDto, UpdateAdminUserDto, AdminUpdateArticleDto, AdminUpdateFaqDto, AdminUpdateMythDto } from './dto/admin.dto';
import { ADMIN_PORTAL_HTML } from './admin-portal.template';
import { ArticlesService } from '../articles/articles.service';
import { AuthService } from '../auth/auth.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesService: ArticlesService,
    private readonly authService: AuthService,
  ) {}

  async assertAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.isAdmin) throw new ForbiddenException('Admin yetkisi gerekli');
  }

  async getUsers(page: number, limit: number, search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } },
        { partnerCode: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { settings: { select: { activeModules: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);
    return {
      items: users.map(u => ({
        id: u.id, email: u.email, name: u.name, nickname: u.nickname, biography: u.biography, avatarUrl: u.avatarUrl,
        partnerCode: u.partnerCode, googleId: u.googleId, hasCompletedSetup: u.hasCompletedSetup,
        isAdmin: u.isAdmin, createdAt: u.createdAt, updatedAt: u.updatedAt,
        activeModules: u.settings?.activeModules ?? [],
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetail(userId: string) {
    const u = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
        pregnancy: true,
        relationship: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            symptoms: true,
            notifications: true,
            periodCycles: true,
          },
        },
      },
    });
    if (!u) throw new NotFoundException('Kullanıcı bulunamadı');

    let pairedUser = null;
    if (u.pairedUserId) {
      const partner = await this.prisma.user.findUnique({
        where: { id: u.pairedUserId },
        select: { id: true, name: true, email: true, partnerCode: true },
      });
      pairedUser = partner;
    }

    const latestCycle = await this.prisma.periodCycle.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });

    const [
      recentSymptoms,
      specialDates,
      periodCycles,
      recentNotifications,
      recentPosts,
      blockedCount,
      reportsCount,
    ] = await Promise.all([
      this.prisma.symptom.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 20 }),
      this.prisma.specialDate.findMany({ where: { userId }, orderBy: { date: 'asc' }, take: 30 }),
      this.prisma.periodCycle.findMany({ where: { userId }, orderBy: { startDate: 'desc' }, take: 12 }),
      this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.prisma.communityPost.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, content: true, category: true, likesCount: true, commentsCount: true, createdAt: true },
      }),
      this.prisma.blockedUser.count({ where: { userId } }),
      this.prisma.report.count({ where: { reporterId: userId } }),
    ]);

    return {
      id: u.id, email: u.email, name: u.name, nickname: u.nickname, biography: u.biography, avatarUrl: u.avatarUrl,
      partnerCode: u.partnerCode, pairedUserId: u.pairedUserId, googleId: u.googleId, hasCompletedSetup: u.hasCompletedSetup,
      isAdmin: u.isAdmin, createdAt: u.createdAt, updatedAt: u.updatedAt,
      activeModules: u.settings?.activeModules ?? [],
      settings: u.settings ? {
        pregnancyWeekly: u.settings.pregnancyWeekly,
        pregnancyTips: u.settings.pregnancyTips,
        periodReminder: u.settings.periodReminder,
        fertilityAlert: u.settings.fertilityAlert,
        specialDateReminder: u.settings.specialDateReminder,
        communityLikes: u.settings.communityLikes,
        communityComments: u.settings.communityComments,
        profilePublic: u.settings.profilePublic,
        showCommunityPosts: u.settings.showCommunityPosts,
      } : null,
      pregnancy: u.pregnancy ? {
        lastMenstrualPeriod: u.pregnancy.lastMenstrualPeriod,
        dueDate: u.pregnancy.dueDate,
        babyName: u.pregnancy.babyName,
        isActive: u.pregnancy.isActive,
      } : null,
      relationship: u.relationship ? {
        partnerName: u.relationship.partnerName,
        startDate: u.relationship.startDate,
      } : null,
      period: latestCycle ? {
        startDate: latestCycle.startDate,
        endDate: latestCycle.endDate,
        cycleLength: latestCycle.cycleLength,
        periodLength: latestCycle.periodLength,
      } : null,
      pairedUser,
      postsCount: u._count.posts,
      commentsCount: u._count.comments,
      symptomsCount: u._count.symptoms,
      notificationsCount: u._count.notifications,
      periodCyclesCount: u._count.periodCycles,
      blockedUsersCount: blockedCount,
      reportsCount,
      recentSymptoms,
      specialDates,
      periodCycles,
      recentNotifications,
      recentPosts,
    };
  }

  async updateUser(userId: string, dto: UpdateAdminUserDto) {
    const u = await this.prisma.user.findUnique({ where: { id: userId }, include: { settings: true } });
    if (!u) throw new NotFoundException('Kullanıcı bulunamadı');

    if (dto.email && dto.email !== u.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Bu e-posta adresi zaten kullanılıyor');
    }

    const userData: any = {};
    if (dto.name !== undefined) userData.name = dto.name;
    if (dto.email !== undefined) userData.email = dto.email;
    if (dto.nickname !== undefined) userData.nickname = dto.nickname || null;
    if (dto.biography !== undefined) userData.biography = dto.biography || null;
    if (dto.isAdmin !== undefined) userData.isAdmin = dto.isAdmin;
    if (dto.hasCompletedSetup !== undefined) userData.hasCompletedSetup = dto.hasCompletedSetup;

    await this.prisma.user.update({ where: { id: userId }, data: userData });

    if (dto.activeModules !== undefined) {
      if (u.settings) {
        await this.prisma.userSettings.update({
          where: { userId },
          data: { activeModules: dto.activeModules },
        });
      } else {
        await this.prisma.userSettings.create({
          data: { userId, activeModules: dto.activeModules },
        });
      }
    }

    return this.getUserDetail(userId);
  }

  async deleteUser(userId: string, adminId?: string) {
    if (adminId && userId === adminId) {
      throw new BadRequestException('Kendi admin hesabınızı silemezsiniz');
    }
    const u = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!u) throw new NotFoundException('Kullanıcı bulunamadı');

    this.authService.revokeUserTokens(userId);

    return await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({ where: { userId } }).catch(() => {});

      await tx.deletedAccount.create({
        data: {
          email: u.email,
          name: u.name,
          reason: 'Admin tarafından silindi',
          note: adminId ? `Silen admin: ${adminId}` : null,
        },
      });

      // Unlink partner and shut down location sharing
      const partnerId = u.pairedUserId;
      if (partnerId) {
        await tx.user.updateMany({
          where: { id: partnerId },
          data: { pairedUserId: null },
        });
        await tx.partnerLocation.updateMany({
          where: { userId: partnerId },
          data: { sharingEnabled: false, latitude: 0, longitude: 0, accuracy: null },
        });
        await tx.notification.create({
          data: {
            userId: partnerId,
            type: 'partner_unpaired',
            module: 'relationship',
            title: 'Partner bağlantısı sonlandı',
            body: `${u.nickname || u.name} hesabı kapatıldığı için partner eşleşmesi ve konum paylaşımı kaldırıldı.`,
          },
        }).catch(() => {});
      }

      const reversePartners = await tx.user.findMany({
        where: { pairedUserId: userId },
        select: { id: true },
      });
      if (reversePartners.length > 0) {
        const rIds = reversePartners.map((r) => r.id);
        await tx.user.updateMany({
          where: { id: { in: rIds } },
          data: { pairedUserId: null },
        });
        await tx.partnerLocation.updateMany({
          where: { userId: { in: rIds } },
          data: { sharingEnabled: false, latitude: 0, longitude: 0, accuracy: null },
        });
      }

      await tx.partnerLocation.deleteMany({ where: { userId } }).catch(() => {});
      await tx.user.delete({ where: { id: userId } });
      return { success: true };
    });
  }

  async getStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const [
      totalUsers,
      activeUsers,
      adminUsers,
      newUsersToday,
      newUsersWeek,
      totalPosts,
      totalComments,
      deletedAccounts,
      pregnancyUsers,
      periodUsers,
      relationshipUsers,
      notificationsSent,
      pendingSetup,
      activePregnancies,
      symptomsLogged,
      symptomTypesCount,
      babyNamesCount,
      pregnancyWeeksCount,
      specialDatesCount,
      unreadNotifications,
      pairedUsers,
      openNudges,
      coupleMessages,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { hasCompletedSetup: true } }),
      this.prisma.user.count({ where: { isAdmin: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
      this.prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
      this.prisma.communityPost.count(),
      this.prisma.comment.count(),
      this.prisma.deletedAccount.count(),
      this.prisma.userSettings.count({ where: { activeModules: { has: 'pregnancy' } } }),
      this.prisma.userSettings.count({ where: { activeModules: { has: 'period' } } }),
      this.prisma.userSettings.count({ where: { activeModules: { has: 'relationship' } } }),
      this.prisma.notification.count({ where: { type: 'admin' } }),
      this.prisma.user.count({ where: { hasCompletedSetup: false } }),
      this.prisma.pregnancy.count({ where: { isActive: true } }),
      this.prisma.symptom.count(),
      this.prisma.symptomType.count(),
      this.prisma.babyName.count(),
      this.prisma.pregnancyWeekContent.count(),
      this.prisma.specialDate.count(),
      this.prisma.notification.count({ where: { isRead: false } }),
      this.prisma.user.count({ where: { pairedUserId: { not: null } } }),
      this.prisma.partnerNudge.count({ where: { status: 'open' } }),
      this.prisma.coupleMessage.count(),
    ]);

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      newUsersToday,
      newUsersWeek,
      totalPosts,
      totalComments,
      deletedAccounts,
      pregnancyUsers,
      periodUsers,
      relationshipUsers,
      notificationsSent,
      pendingSetup,
      activePregnancies,
      symptomsLogged,
      symptomTypesCount,
      babyNamesCount,
      pregnancyWeeksCount,
      specialDatesCount,
      unreadNotifications,
      pairedCouples: Math.floor(pairedUsers / 2),
      openNudges,
      coupleMessages,
    };
  }

  async getDeletedAccounts(page: number = 1, limit: number = 50) {
    const [items, total] = await Promise.all([
      this.prisma.deletedAccount.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.deletedAccount.count(),
    ]);
    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateWeekContent(weekNumber: number, dto: UpdateWeekContentDto) {
    const existing = await this.prisma.pregnancyWeekContent.findUnique({ where: { weekNumber } });
    if (!existing) throw new NotFoundException('Hafta içeriği bulunamadı');
    return this.prisma.pregnancyWeekContent.update({
      where: { weekNumber },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.babyDevelopment !== undefined && { babyDevelopment: dto.babyDevelopment }),
        ...(dto.babySize !== undefined && { babySize: dto.babySize }),
        ...(dto.babyWeight !== undefined && { babyWeight: dto.babyWeight }),
        ...(dto.organDevelopment !== undefined && { organDevelopment: dto.organDevelopment }),
        ...(dto.motherChanges !== undefined && { motherChanges: dto.motherChanges }),
        ...(dto.letterFromBaby !== undefined && { letterFromBaby: dto.letterFromBaby }),
        ...(dto.commonSymptoms !== undefined && { commonSymptoms: dto.commonSymptoms }),
        ...(dto.tips !== undefined && { tips: dto.tips }),
        ...(dto.warnings !== undefined && { warnings: dto.warnings }),
      },
    });
  }

  async sendNotification(dto: SendNotificationDto) {
    const module = dto.module || 'sistem';
    const type = dto.type || 'admin';

    let targetUserIds: string[] = [];

    if (dto.userId) {
      targetUserIds = [dto.userId];
    } else if (dto.userIds?.length) {
      targetUserIds = dto.userIds;
    } else if (dto.targetModule) {
      const users = await this.prisma.userSettings.findMany({
        where: { activeModules: { has: dto.targetModule } },
        select: { userId: true },
      });
      targetUserIds = users.map(u => u.userId);
    } else {
      const users = await this.prisma.user.findMany({ select: { id: true } });
      targetUserIds = users.map(u => u.id);
    }

    if (targetUserIds.length === 0) {
      return { success: true, sentCount: 0 };
    }

    await this.prisma.notification.createMany({
      data: targetUserIds.map(userId => ({
        userId,
        type,
        title: dto.title,
        body: dto.body,
        module,
      })),
    });

    return { success: true, sentCount: targetUserIds.length };
  }

  async getPosts(page: number, limit: number, search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where,
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.communityPost.count({ where }),
    ]);
    return {
      items: posts.map(p => ({
        id: p.id, content: p.content, category: p.category,
        authorId: p.authorId, authorName: p.author.name,
        likesCount: p.likesCount, commentsCount: p.commentsCount,
        createdAt: p.createdAt,
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async adminDeletePost(postId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Gönderi bulunamadı');
    await this.prisma.communityPost.delete({ where: { id: postId } });
    return { success: true };
  }

  async getComments(page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count(),
    ]);
    return {
      items: items.map(c => ({
        id: c.id, content: c.content, postId: c.postId,
        authorId: c.authorId, authorName: c.author.name,
        createdAt: c.createdAt,
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async adminDeleteComment(commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Yorum bulunamadı');
    await this.prisma.comment.delete({ where: { id: commentId } });
    await this.prisma.communityPost.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    });
    return { success: true };
  }

  async getPostsWithComments(page: number, limit: number) {
    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        include: {
          author: { select: { id: true, name: true, email: true } },
          comments: {
            include: { author: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.communityPost.count(),
    ]);
    return {
      items: posts.map(p => ({
        id: p.id, content: p.content, category: p.category,
        authorId: p.authorId, authorName: p.author.name, authorEmail: p.author.email,
        likesCount: p.likesCount, commentsCount: p.commentsCount, isEdited: p.isEdited, createdAt: p.createdAt,
        comments: p.comments.map(c => ({
          id: c.id, content: c.content, authorId: c.authorId, authorName: c.author.name, createdAt: c.createdAt,
        })),
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async adminUpdatePost(postId: string, data: { content?: string; category?: string }) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Gönderi bulunamadı');
    return this.prisma.communityPost.update({
      where: { id: postId },
      data: {
        ...(data.content !== undefined && { content: data.content }),
        ...(data.category !== undefined && { category: data.category }),
        isEdited: true,
      },
    });
  }

  async adminUpdateComment(commentId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Yorum bulunamadı');
    return this.prisma.comment.update({ where: { id: commentId }, data: { content } });
  }

  async getPregnancyWeeksList() {
    return this.prisma.pregnancyWeekContent.findMany({
      orderBy: { weekNumber: 'asc' },
      select: { weekNumber: true, title: true, babySize: true, babyWeight: true },
    });
  }

  async getPregnancyWeekDetail(weekNumber: number) {
    const w = await this.prisma.pregnancyWeekContent.findUnique({ where: { weekNumber } });
    if (!w) throw new NotFoundException('Hafta içeriği bulunamadı');
    return w;
  }

  async getSymptomTypes() {
    return this.prisma.symptomType.findMany({ orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }] });
  }

  async updateSymptomType(id: string, data: { category?: string; name?: string; displayOrder?: number }) {
    const existing = await this.prisma.symptomType.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Semptom tipi bulunamadı');
    return this.prisma.symptomType.update({ where: { id }, data });
  }

  async getBabyNames(page = 1, limit = 100, search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { meaning: { contains: search, mode: 'insensitive' } },
        { origin: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await Promise.all([
      this.prisma.babyName.findMany({ where, orderBy: { name: 'asc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.babyName.count({ where }),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateBabyName(id: string, data: { name?: string; gender?: string; meaning?: string; origin?: string; isPopular?: boolean }) {
    const existing = await this.prisma.babyName.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Bebek ismi bulunamadı');
    return this.prisma.babyName.update({ where: { id }, data });
  }

  async getArticlesContent() {
    const [articles, faqs, myths] = await Promise.all([
      this.articlesService.getArticles(),
      this.articlesService.getFaqs(),
      this.articlesService.getMyths(),
    ]);
    return { articles: articles.items, faqs: faqs.items, myths: myths.items };
  }

  async updateArticleContent(id: string, data: AdminUpdateArticleDto) {
    return this.articlesService.adminUpdateArticle(id, data);
  }

  async updateFaqContent(id: string, data: AdminUpdateFaqDto) {
    return this.articlesService.adminUpdateFaq(id, data);
  }

  async updateMythContent(id: string, data: AdminUpdateMythDto) {
    return this.articlesService.adminUpdateMyth(id, data);
  }

  // Moderation Methods
  async getReportedPosts(page = 1, limit = 20) {
    const safeLimit = Math.max(1, Math.min(100, limit));
    const safePage = Math.max(1, page);

    const reportsGroup = await this.prisma.report.groupBy({
      by: ['postId'],
      _count: { postId: true },
      orderBy: { _count: { postId: 'desc' } },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    const postIds = reportsGroup.map((r) => r.postId);
    const allGroups = await this.prisma.report.groupBy({
      by: ['postId'],
    });
    const total = allGroups.length;

    const posts = await this.prisma.communityPost.findMany({
      where: { id: { in: postIds } },
      include: {
        author: { select: { id: true, name: true, email: true, avatarUrl: true } },
        reports: {
          select: {
            id: true,
            reason: true,
            createdAt: true,
            reporter: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    const items = reportsGroup.map((rg) => {
      const p = posts.find((item) => item.id === rg.postId);
      return {
        postId: rg.postId,
        reportCount: rg._count.postId,
        post: p
          ? {
              id: p.id,
              content: p.content,
              category: p.category,
              createdAt: p.createdAt,
              author: p.author,
            }
          : null,
        reports: p?.reports ?? [],
      };
    });

    return { items, total, page: safePage, totalPages: Math.ceil(total / safeLimit) };
  }

  async deleteReportedPost(postId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Gönderi bulunamadı');

    await this.prisma.$transaction([
      this.prisma.report.deleteMany({ where: { postId } }),
      this.prisma.comment.deleteMany({ where: { postId } }),
      this.prisma.postLike.deleteMany({ where: { postId } }),
      this.prisma.savedPost.deleteMany({ where: { postId } }),
      this.prisma.communityPost.delete({ where: { id: postId } }),
    ]);

    return { success: true };
  }

  async dismissPostReports(postId: string) {
    await this.prisma.report.deleteMany({ where: { postId } });
    return { success: true };
  }

  async getReportedAiResponses() {
    try {
      const secret = await this.prisma.appSecret.findUnique({ where: { key: 'REPORTED_AI_RESPONSES' } });
      if (secret?.value) {
        const parsed = JSON.parse(secret.value);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    try {
      const filePath = join(process.cwd(), 'storage', 'reported_ai_responses.json');
      if (fs.existsSync(filePath)) {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  async dismissAiResponseReport(reportId: string) {
    const current = await this.getReportedAiResponses();
    const updated = current.filter((r: any) => r.id !== reportId);
    const json = JSON.stringify(updated);
    await this.prisma.appSecret.upsert({
      where: { key: 'REPORTED_AI_RESPONSES' },
      update: { value: json },
      create: { key: 'REPORTED_AI_RESPONSES', value: json },
    }).catch(() => {});
    return { success: true };
  }

  getAdminPortalHtml(): string {
    return ADMIN_PORTAL_HTML;
  }
}
