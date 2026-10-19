import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { foldTr } from '../common/text';

function fuzzyNameScore(query: string, name: string, nickname?: string | null) {
  const nq = foldTr(query);
  if (!nq) return 0;
  const candidates = [name, nickname].filter(Boolean).map((v) => foldTr(v as string));
  let best = 0;
  for (const c of candidates) {
    if (c === nq) best = Math.max(best, 100);
    else if (c.startsWith(nq) || nq.startsWith(c)) best = Math.max(best, 82);
    else if (c.includes(nq) || (nq.length >= 3 && nq.includes(c))) best = Math.max(best, 64);
    else {
      const overlap = [...nq].filter((ch) => c.includes(ch)).length / Math.max(nq.length, 1);
      if (overlap >= 0.7) best = Math.max(best, 42);
    }
  }
  return best;
}

function pregnancyWeek(p?: { isActive: boolean; lastMenstrualPeriod: Date } | null) {
  if (!p?.isActive) return null;
  return Math.max(1, Math.min(42, Math.floor((Date.now() - new Date(p.lastMenstrualPeriod).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1));
}

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  private displayName(user: { name: string; nickname?: string | null } | null): string {
    return user?.nickname || user?.name || 'Anonim';
  }

  async createPost(userId: string, content: string, category: string, pregnancyWeek?: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const post = await this.prisma.communityPost.create({
      data: { authorId: userId, content, category, pregnancyWeek },
    });
    return {
      ...post, authorName: this.displayName(user), authorAvatarUrl: user?.avatarUrl ?? null,
      isLiked: false, isSaved: false, isEdited: false,
    };
  }

  async getPosts(userId: string, category: string | undefined, page: number, limit: number, q?: string) {
    const blockedUsers = await this.prisma.blockedUser.findMany({ where: { userId }, select: { blockedUserId: true } });
    const blockedIds = blockedUsers.map(b => b.blockedUserId);

    // Filter by category, blocked users, and privacy setting (showCommunityPosts)
    const where: any = {
      authorId: { notIn: blockedIds },
      OR: [
        { authorId: userId },
        { author: { settings: { is: { showCommunityPosts: true } } } },
        { author: { settings: null } },
      ],
    };
    if (category) where.category = category;
    const query = (q ?? '').trim();
    if (query) {
      where.content = { contains: query, mode: 'insensitive' };
    }

    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where,
        include: { author: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.communityPost.count({ where }),
    ]);

    const postIds = posts.map(p => p.id);
    const [likes, saves] = await Promise.all([
      this.prisma.postLike.findMany({ where: { userId, postId: { in: postIds } } }),
      this.prisma.savedPost.findMany({ where: { userId, postId: { in: postIds } } }),
    ]);
    const likedIds = new Set(likes.map(l => l.postId));
    const savedIds = new Set(saves.map(s => s.postId));

    return {
      items: posts.map(p => ({
        id: p.id, content: p.content, category: p.category, pregnancyWeek: p.pregnancyWeek,
        isEdited: p.isEdited,
        authorId: p.authorId, authorName: this.displayName(p.author), authorAvatarUrl: p.author.avatarUrl,
        likesCount: p.likesCount, commentsCount: p.commentsCount,
        isLiked: likedIds.has(p.id), isSaved: savedIds.has(p.id), createdAt: p.createdAt,
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async getPost(userId: string, postId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: { author: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
    });
    if (!post) throw new NotFoundException('Gönderi bulunamadı');

    const [liked, saved] = await Promise.all([
      this.prisma.postLike.findUnique({ where: { userId_postId: { userId, postId } } }),
      this.prisma.savedPost.findUnique({ where: { userId_postId: { userId, postId } } }),
    ]);

    return {
      id: post.id, content: post.content, category: post.category, pregnancyWeek: post.pregnancyWeek,
      isEdited: post.isEdited,
      authorId: post.authorId, authorName: this.displayName(post.author), authorAvatarUrl: post.author.avatarUrl,
      likesCount: post.likesCount, commentsCount: post.commentsCount,
      isLiked: !!liked, isSaved: !!saved, createdAt: post.createdAt,
    };
  }

  async editPost(userId: string, postId: string, content: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Gönderi bulunamadı');
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (post.authorId !== userId && !user?.isAdmin) throw new ForbiddenException('Bu gönderiyi düzenleme yetkiniz yok');

    const updated = await this.prisma.communityPost.update({
      where: { id: postId },
      data: { content, isEdited: true },
      include: { author: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
    });
    return {
      id: updated.id, content: updated.content, category: updated.category, pregnancyWeek: updated.pregnancyWeek,
      isEdited: updated.isEdited,
      authorId: updated.authorId, authorName: this.displayName(updated.author), authorAvatarUrl: updated.author.avatarUrl,
      likesCount: updated.likesCount, commentsCount: updated.commentsCount,
      isLiked: false, isSaved: false, createdAt: updated.createdAt,
    };
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Gönderi bulunamadı');
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (post.authorId !== userId && !user?.isAdmin) throw new ForbiddenException('Bu gönderiyi silme yetkiniz yok');
    await this.prisma.communityPost.delete({ where: { id: postId } });
    return { success: true };
  }

  async toggleLike(userId: string, postId: string) {
    const existing = await this.prisma.postLike.findUnique({ where: { userId_postId: { userId, postId } } });

    // Beğeni satırı ile sayaç tek işlemde değişmeli; aksi halde hızlı çift
    // dokunuşta sayaç gerçek beğeni sayısından sapıyordu.
    if (existing) {
      const [, updated] = await this.prisma.$transaction([
        this.prisma.postLike.delete({ where: { id: existing.id } }),
        this.prisma.communityPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
          select: { likesCount: true },
        }),
      ]);
      return { liked: false, likesCount: Math.max(0, updated.likesCount) };
    }

    try {
      const [, updated] = await this.prisma.$transaction([
        this.prisma.postLike.create({ data: { userId, postId } }),
        this.prisma.communityPost.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
          select: { likesCount: true },
        }),
      ]);
      void this.notifyPostAuthorOfLike(userId, postId).catch(() => null);
      return { liked: true, likesCount: updated.likesCount };
    } catch {
      // Eşzamanlı ikinci istek unique kısıtına takıldı; mevcut durumu döndür.
      const post = await this.prisma.communityPost.findUnique({
        where: { id: postId },
        select: { likesCount: true },
      });
      return { liked: true, likesCount: post?.likesCount ?? 0 };
    }
  }

  async toggleSave(userId: string, postId: string) {
    const existing = await this.prisma.savedPost.findUnique({ where: { userId_postId: { userId, postId } } });
    if (existing) {
      await this.prisma.savedPost.delete({ where: { id: existing.id } });
      return { saved: false };
    } else {
      await this.prisma.savedPost.create({ data: { userId, postId } });
      return { saved: true };
    }
  }

  async reportPost(userId: string, postId: string, reason: string) {
    await this.prisma.report.upsert({
      where: { reporterId_postId: { reporterId: userId, postId } },
      update: { reason },
      create: { reporterId: userId, postId, reason },
    });
    return { success: true };
  }

  async getComments(postId: string, page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId },
        include: { author: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count({ where: { postId } }),
    ]);

    return {
      items: items.map(c => ({
        id: c.id, content: c.content, authorId: c.authorId,
        authorName: this.displayName(c.author), authorAvatarUrl: c.author.avatarUrl, createdAt: c.createdAt,
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async createComment(userId: string, postId: string, content: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const comment = await this.prisma.comment.create({ data: { postId, authorId: userId, content } });
    await this.prisma.communityPost.update({ where: { id: postId }, data: { commentsCount: { increment: 1 } } });

    await this.notifyPostAuthorOfComment(userId, postId, content, this.displayName(user));

    return {
      id: comment.id, content: comment.content, authorId: userId,
      authorName: this.displayName(user), authorAvatarUrl: user?.avatarUrl ?? null, createdAt: comment.createdAt,
    };
  }

  private async notifyPostAuthorOfComment(commenterId: string, postId: string, content: string, commenterName: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      select: { authorId: true, content: true },
    });
    if (!post || post.authorId === commenterId) return;

    const settings = await this.prisma.userSettings.findUnique({ where: { userId: post.authorId } });
    if (settings && settings.communityComments === false) return;

    const author = await this.prisma.user.findUnique({ where: { id: post.authorId }, select: { language: true } });
    const isEn = author?.language === 'en';
    const preview = content.length > 80 ? `${content.slice(0, 80)}…` : content;

    await this.prisma.notification.create({
      data: {
        userId: post.authorId,
        type: 'community_comment',
        module: 'community',
        title: isEn ? 'New comment on your post 💬' : 'Gönderinize yorum yapıldı 💬',
        body: isEn ? `${commenterName} commented: "${preview}"` : `${commenterName} yorum yaptı: "${preview}"`,
        referenceId: postId,
      },
    });
  }

  private async notifyPostAuthorOfLike(likerId: string, postId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post || post.authorId === likerId) return;

    const settings = await this.prisma.userSettings.findUnique({ where: { userId: post.authorId } });
    if (settings && settings.communityLikes === false) return;

    const [liker, author] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: likerId }, select: { name: true, nickname: true } }),
      this.prisma.user.findUnique({ where: { id: post.authorId }, select: { language: true } }),
    ]);
    const isEn = author?.language === 'en';
    const likerName = this.displayName(liker);

    await this.prisma.notification.create({
      data: {
        userId: post.authorId,
        type: 'community_like',
        module: 'community',
        title: isEn ? 'Your post got a like ❤️' : 'Gönderiniz beğenildi ❤️',
        body: isEn ? `${likerName} liked your post.` : `${likerName} gönderinizi beğendi.`,
        referenceId: postId,
      },
    });
  }

  async searchUsers(userId: string, query: string, page: number, limit: number) {
    const q = (query ?? '').trim();
    const blocked = await this.prisma.blockedUser.findMany({ where: { userId }, select: { blockedUserId: true } });
    const blockedIds = blocked.map((b) => b.blockedUserId);

    const me = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        language: true,
        settings: { select: { activeModules: true } },
        pregnancy: { select: { isActive: true, lastMenstrualPeriod: true } },
      },
    });
    const myWeek = pregnancyWeek(me?.pregnancy);
    const myModules = new Set(me?.settings?.activeModules ?? []);

    // Arama varsa süzmeyi veritabanına bırak; tüm havuzu çekip bellekte
    // skorlamak Render'da her tuş vuruşunda saniyeler alıyordu.
    const pool = await this.prisma.user.findMany({
      where: {
        id: { notIn: [...blockedIds, userId] },
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' as const } },
                { nickname: { contains: q, mode: 'insensitive' as const } },
                { biography: { contains: q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        avatarUrl: true,
        biography: true,
        language: true,
        createdAt: true,
        settings: { select: { activeModules: true, allowFollow: true, profilePublic: true } },
        pregnancy: { select: { isActive: true, lastMenstrualPeriod: true } },
        _count: { select: { posts: true, followers: true } },
      },
      take: q ? 100 : 150,
    });

    const scored = pool
      .map((u) => {
        const nameHit = q ? fuzzyNameScore(q, u.name, u.nickname) : 0;
        const bioHit = q && u.biography && foldTr(u.biography).includes(foldTr(q)) ? 25 : 0;
        if (q && nameHit < 20 && !bioHit) return null;

        const reasons: string[] = [];
        let similar = 0;
        const week = pregnancyWeek(u.pregnancy);
        if (myWeek && week && Math.abs(myWeek - week) <= 2) {
          similar += 40;
          reasons.push(`Gebelik ~${week}. hafta`);
        }
        const theirMods = u.settings?.activeModules ?? [];
        const overlap = theirMods.filter((m) => myModules.has(m));
        if (overlap.length) {
          similar += overlap.length * 12;
          reasons.push('Benzer takip');
        }
        if (me?.language && u.language === me.language) similar += 8;
        if (u._count.posts > 0) similar += 6;
        if (u._count.followers > 2) similar += 4;

        return {
          user: u,
          rank: (q ? nameHit * 3 + bioHit : similar + 1) + similar * 0.15,
          matchReason: q
            ? nameHit >= 80
              ? 'Yakın isim'
              : bioHit
                ? 'Biyografide geçiyor'
                : 'Benzer isim'
            : reasons[0] || 'Sana yakın kişiler',
        };
      })
      .filter((row): row is NonNullable<typeof row> => !!row)
      .sort((a, b) => b.rank - a.rank);

    const total = scored.length;
    const slice = scored.slice((page - 1) * limit, page * limit);
    const ids = slice.map((s) => s.user.id);
    const followingRows = ids.length
      ? await this.prisma.follow.findMany({
          where: { followerId: userId, followingId: { in: ids } },
          select: { followingId: true },
        })
      : [];
    const followingIds = new Set(followingRows.map((f) => f.followingId));

    return {
      items: slice.map((s) => ({
        id: s.user.id,
        name: this.displayName(s.user),
        avatarUrl: s.user.avatarUrl,
        biography: s.user.biography,
        postsCount: s.user._count.posts,
        followersCount: s.user._count.followers,
        isFollowing: followingIds.has(s.user.id),
        matchReason: s.matchReason,
      })),
      suggested: !q,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getUserProfile(userId: string, targetUserId: string) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true, name: true, nickname: true, avatarUrl: true, biography: true, createdAt: true,
        settings: { select: { showCommunityPosts: true, profilePublic: true, allowFollow: true } },
        _count: { select: { posts: true, followers: true, following: true } },
      },
    });
    if (!target) throw new NotFoundException('Kullanıcı bulunamadı');

    const isSelf = targetUserId === userId;
    const isFollowing = isSelf
      ? false
      : !!(await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
        }));

    const profilePublic = target.settings?.profilePublic !== false;
    const allowFollow = target.settings?.allowFollow !== false;
    const postsEnabled = target.settings?.showCommunityPosts !== false;
    const canSeePosts = isSelf || (postsEnabled && (profilePublic || isFollowing));

    return {
      id: target.id,
      name: this.displayName(target),
      avatarUrl: target.avatarUrl,
      biography: isSelf || profilePublic || isFollowing ? target.biography : null,
      joinedAt: target.createdAt,
      postsCount: canSeePosts ? target._count.posts : 0,
      followersCount: target._count.followers,
      followingCount: target._count.following,
      isFollowing,
      isSelf,
      canSeePosts,
      profilePublic,
      allowFollow,
      canFollow: !isSelf && (allowFollow || isFollowing),
    };
  }

  async getUserPosts(userId: string, targetUserId: string, page: number, limit: number) {
    if (targetUserId !== userId) {
      const settings = await this.prisma.userSettings.findUnique({ where: { userId: targetUserId } });
      const isFollowing = !!(await this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
      }));
      const postsEnabled = !settings || settings.showCommunityPosts !== false;
      const profilePublic = !settings || settings.profilePublic !== false;
      if (!postsEnabled || (!profilePublic && !isFollowing)) {
        return { items: [], total: 0, page, totalPages: 0 };
      }
    }

    const where = { authorId: targetUserId };
    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where,
        include: { author: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.communityPost.count({ where }),
    ]);

    const postIds = posts.map(p => p.id);
    const [likes, saves] = await Promise.all([
      this.prisma.postLike.findMany({ where: { userId, postId: { in: postIds } } }),
      this.prisma.savedPost.findMany({ where: { userId, postId: { in: postIds } } }),
    ]);
    const likedIds = new Set(likes.map(l => l.postId));
    const savedIds = new Set(saves.map(s => s.postId));

    return {
      items: posts.map(p => ({
        id: p.id, content: p.content, category: p.category, pregnancyWeek: p.pregnancyWeek,
        isEdited: p.isEdited,
        authorId: p.authorId, authorName: this.displayName(p.author), authorAvatarUrl: p.author.avatarUrl,
        likesCount: p.likesCount, commentsCount: p.commentsCount,
        isLiked: likedIds.has(p.id), isSaved: savedIds.has(p.id), createdAt: p.createdAt,
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async getMyPostsWithComments(userId: string, page: number, limit: number) {
    const where = { authorId: userId };
    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where,
        include: {
          comments: {
            include: { author: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
            orderBy: { createdAt: 'asc' },
            take: 50,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.communityPost.count({ where }),
    ]);

    return {
      items: posts.map(p => ({
        id: p.id, content: p.content, category: p.category, pregnancyWeek: p.pregnancyWeek,
        isEdited: p.isEdited, likesCount: p.likesCount, commentsCount: p.commentsCount,
        createdAt: p.createdAt,
        comments: p.comments.map(c => ({
          id: c.id, content: c.content, authorId: c.authorId,
          authorName: this.displayName(c.author), authorAvatarUrl: c.author.avatarUrl,
          createdAt: c.createdAt,
        })),
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async getSavedPosts(userId: string, page: number, limit: number) {
    const [saved, total] = await Promise.all([
      this.prisma.savedPost.findMany({
        where: { userId },
        include: {
          post: {
            include: { author: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.savedPost.count({ where: { userId } }),
    ]);

    const likes = await this.prisma.postLike.findMany({
      where: { userId, postId: { in: saved.map(s => s.postId) } },
    });
    const likedIds = new Set(likes.map(l => l.postId));

    return {
      items: saved.map(s => ({
        id: s.post.id, content: s.post.content, category: s.post.category,
        pregnancyWeek: s.post.pregnancyWeek, isEdited: s.post.isEdited,
        authorId: s.post.authorId, authorName: this.displayName(s.post.author),
        authorAvatarUrl: s.post.author.avatarUrl,
        likesCount: s.post.likesCount, commentsCount: s.post.commentsCount,
        isLiked: likedIds.has(s.post.id), isSaved: true, createdAt: s.post.createdAt,
      })),
      total, page, totalPages: Math.ceil(total / limit),
    };
  }

  async toggleFollow(userId: string, targetUserId: string) {
    if (userId === targetUserId) throw new ForbiddenException('Kendinizi takip edemezsiniz');

    const target = await this.prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true, name: true, nickname: true, language: true } });
    if (!target) throw new NotFoundException('Kullanıcı bulunamadı');

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
    });

    if (existing) {
      await this.prisma.follow.delete({ where: { id: existing.id } });
      const followersCount = await this.prisma.follow.count({ where: { followingId: targetUserId } });
      return { following: false, followersCount };
    }

    const settings = await this.prisma.userSettings.findUnique({ where: { userId: targetUserId } });
    if (settings && settings.allowFollow === false) {
      throw new ForbiddenException('Bu kullanıcı takip edilmeyi kapattı');
    }

    await this.prisma.follow.create({ data: { followerId: userId, followingId: targetUserId } });
    const followersCount = await this.prisma.follow.count({ where: { followingId: targetUserId } });

    const me = await this.prisma.user.findUnique({ where: { id: userId }, select: { name: true, nickname: true } });
    const isEn = target.language === 'en';
    await this.prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'community_follow',
        module: 'community',
        title: isEn ? 'New follower 👥' : 'Yeni takipçi 👥',
        body: isEn
          ? `${this.displayName(me)} started following you.`
          : `${this.displayName(me)} sizi takip etmeye başladı.`,
        referenceId: userId,
      },
    });

    return { following: true, followersCount };
  }

  async getFollowList(userId: string, targetUserId: string, kind: 'followers' | 'following') {
    const rows = kind === 'followers'
      ? await this.prisma.follow.findMany({
          where: { followingId: targetUserId },
          include: { follower: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 200,
        })
      : await this.prisma.follow.findMany({
          where: { followerId: targetUserId },
          include: { following: { select: { id: true, name: true, nickname: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 200,
        });

    const users = rows.map(r => (kind === 'followers' ? (r as any).follower : (r as any).following));
    const myFollowing = await this.prisma.follow.findMany({
      where: { followerId: userId, followingId: { in: users.map((u: any) => u.id) } },
      select: { followingId: true },
    });
    const followingIds = new Set(myFollowing.map(f => f.followingId));

    return {
      items: users.map((u: any) => ({
        id: u.id,
        name: this.displayName(u),
        avatarUrl: u.avatarUrl,
        isFollowing: followingIds.has(u.id),
      })),
      total: users.length,
    };
  }

  async getSavedArticles(userId: string) {
    const rows = await this.prisma.savedArticle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { items: rows, total: rows.length };
  }

  async toggleSavedArticle(userId: string, articleId: string, kind: string) {
    const existing = await this.prisma.savedArticle.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
    if (existing) {
      await this.prisma.savedArticle.delete({ where: { id: existing.id } });
      return { saved: false };
    }
    await this.prisma.savedArticle.create({ data: { userId, articleId, kind: kind || 'article' } });
    return { saved: true };
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Yorum bulunamadı');
    const post = await this.prisma.communityPost.findUnique({ where: { id: comment.postId } });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const isCommentAuthor = comment.authorId === userId;
    const isPostAuthor = post?.authorId === userId;
    const isAdmin = user?.isAdmin === true;

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      throw new ForbiddenException('Bu yorumu silme yetkiniz yok');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
    await this.prisma.communityPost.update({ where: { id: comment.postId }, data: { commentsCount: { decrement: 1 } } });
    return { success: true };
  }

  async blockUser(userId: string, blockedUserId: string) {
    await this.prisma.blockedUser.upsert({
      where: { userId_blockedUserId: { userId, blockedUserId } },
      update: {},
      create: { userId, blockedUserId },
    });
    return { success: true };
  }

  async unblockUser(userId: string, blockedUserId: string) {
    await this.prisma.blockedUser.deleteMany({ where: { userId, blockedUserId } });
    return { success: true };
  }
}
