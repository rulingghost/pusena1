import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from './community.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CommunityService - Two-Way Blocking & Privacy', () => {
  let service: CommunityService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      blockedUser: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      follow: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      communityPost: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
      comment: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      postLike: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      savedPost: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
  });

  describe('assertCanViewPost', () => {
    it('throws NotFoundException if post does not exist', async () => {
      prisma.communityPost.findUnique.mockResolvedValue(null);
      await expect(service.assertCanViewPost('user-1', 'post-1')).rejects.toThrow(NotFoundException);
    });

    it('allows author to view their own post regardless of settings', async () => {
      prisma.communityPost.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-1',
        author: { id: 'user-1', settings: { showCommunityPosts: false, profilePublic: false } },
      });
      const post = await service.assertCanViewPost('user-1', 'post-1');
      expect(post.id).toBe('post-1');
    });

    it('throws NotFoundException if users are two-way blocked', async () => {
      prisma.communityPost.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-2',
        author: { id: 'user-2', settings: { showCommunityPosts: true, profilePublic: true } },
      });
      prisma.blockedUser.count.mockResolvedValue(1);

      await expect(service.assertCanViewPost('user-1', 'post-1')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException if post author disabled community posts', async () => {
      prisma.communityPost.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-2',
        author: { id: 'user-2', settings: { showCommunityPosts: false, profilePublic: true } },
      });
      prisma.blockedUser.count.mockResolvedValue(0);

      await expect(service.assertCanViewPost('user-1', 'post-1')).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException if author is private and requester is not following', async () => {
      prisma.communityPost.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-2',
        author: { id: 'user-2', settings: { showCommunityPosts: true, profilePublic: false } },
      });
      prisma.blockedUser.count.mockResolvedValue(0);
      prisma.follow.findUnique.mockResolvedValue(null);

      await expect(service.assertCanViewPost('user-1', 'post-1')).rejects.toThrow(ForbiddenException);
    });

    it('allows viewer if author is private and requester is following', async () => {
      prisma.communityPost.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-2',
        author: { id: 'user-2', settings: { showCommunityPosts: true, profilePublic: false } },
      });
      prisma.blockedUser.count.mockResolvedValue(0);
      prisma.follow.findUnique.mockResolvedValue({ id: 'follow-1' });

      const post = await service.assertCanViewPost('user-1', 'post-1');
      expect(post.id).toBe('post-1');
    });
  });

  describe('getComments', () => {
    it('filters out comments written by blocked users (two-way)', async () => {
      prisma.communityPost.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'author-1',
        author: { id: 'author-1', settings: { showCommunityPosts: true, profilePublic: true } },
      });
      prisma.blockedUser.count.mockResolvedValue(0);
      // user-1 has blocked user-blocked, and user-blocker has blocked user-1
      prisma.blockedUser.findMany.mockImplementation(({ where }: any) => {
        if (where.userId === 'user-1') return Promise.resolve([{ blockedUserId: 'user-blocked' }]);
        if (where.blockedUserId === 'user-1') return Promise.resolve([{ userId: 'user-blocker' }]);
        return Promise.resolve([]);
      });

      prisma.comment.findMany.mockResolvedValue([]);
      prisma.comment.count.mockResolvedValue(0);

      await service.getComments('user-1', 'post-1', 1, 20);

      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            postId: 'post-1',
            authorId: { notIn: expect.arrayContaining(['user-blocked', 'user-blocker']) },
          },
          skip: 0,
          take: 20,
        }),
      );
    });

    it('caps limit at 100 and returns pagination metadata', async () => {
      prisma.communityPost.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'author-1',
        author: { id: 'author-1' },
      });
      prisma.blockedUser.count.mockResolvedValue(0);
      prisma.blockedUser.findMany.mockResolvedValue([]);
      prisma.comment.findMany.mockResolvedValue([]);
      prisma.comment.count.mockResolvedValue(150);

      const res = await service.getComments('user-1', 'post-1', 1, 500); // requested 500, must cap at 100

      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 100,
        }),
      );
      expect(res.limit).toBe(100);
      expect(res.total).toBe(150);
      expect(res.totalPages).toBe(2);
      expect(res.hasMore).toBe(true);
    });
  });

  describe('getPosts pagination', () => {
    it('caps limit at 50 and calculates hasMore correctly', async () => {
      prisma.blockedUser.findMany.mockResolvedValue([]);
      prisma.follow.findMany.mockResolvedValue([]);
      prisma.communityPost.findMany.mockResolvedValue([
        { id: 'p1', author: { id: 'u1', name: 'User 1' }, isEdited: false, likesCount: 0, commentsCount: 0, createdAt: new Date() },
      ]);
      prisma.communityPost.count.mockResolvedValue(120);
      prisma.postLike.findMany.mockResolvedValue([]);
      prisma.savedPost.findMany.mockResolvedValue([]);

      const res = await service.getPosts('user-1', undefined, 1, 999); // requested 999, must cap at 50

      expect(prisma.communityPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 50,
        }),
      );
      expect(res.limit).toBe(50);
      expect(res.total).toBe(120);
      expect(res.totalPages).toBe(3);
      expect(res.hasMore).toBe(true);
    });
  });
});
