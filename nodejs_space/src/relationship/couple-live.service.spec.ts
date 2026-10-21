import { Test, TestingModule } from '@nestjs/testing';
import { CoupleLiveService } from './couple-live.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CoupleLiveService - Chat Pagination', () => {
  let service: CoupleLiveService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn().mockImplementation(({ where }: any) => {
          if (where.id === 'user-1') {
            return Promise.resolve({
              id: 'user-1',
              name: 'Aslı',
              nickname: 'asli',
              pairedUserId: 'user-2',
            });
          }
          if (where.id === 'user-2') {
            return Promise.resolve({
              id: 'user-2',
              name: 'Kerem',
              nickname: 'kerem',
              pairedUserId: 'user-1',
            });
          }
          return Promise.resolve(null);
        }),
      },
      coupleMessage: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      notification: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoupleLiveService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CoupleLiveService>(CoupleLiveService);
  });

  it('paginates messages and caps limit at 100', async () => {
    const mockMsgs = [
      { id: 'm1', body: 'Selam', kind: 'chat', nudgeId: null, senderId: 'user-1', readAt: null, createdAt: new Date(1000) },
      { id: 'm2', body: 'Naber?', kind: 'chat', nudgeId: null, senderId: 'user-2', readAt: null, createdAt: new Date(2000) },
    ];
    prisma.coupleMessage.findMany.mockResolvedValue(mockMsgs);
    prisma.coupleMessage.count.mockResolvedValue(120);

    const res = await service.listMessages('user-1', 1, 999); // requested 999

    expect(prisma.coupleMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 100, // capped at 100
        orderBy: { createdAt: 'desc' },
      }),
    );
    expect(res.limit).toBe(100);
    expect(res.total).toBe(120);
    expect(res.totalPages).toBe(2);
    expect(res.hasMore).toBe(true);
    expect(res.partnerName).toBe('kerem');
    // Output should be reversed to ascending order
    expect(res.items[0].id).toBe('m2');
    expect(res.items[1].id).toBe('m1');
  });

  it('supports before cursor for previous messages', async () => {
    const beforeIso = '2026-10-21T00:00:00.000Z';
    prisma.coupleMessage.findMany.mockResolvedValue([]);
    prisma.coupleMessage.count.mockResolvedValue(20);

    await service.listMessages('user-1', 1, 30, beforeIso);

    expect(prisma.coupleMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          createdAt: { lt: new Date(beforeIso) },
        }),
        skip: 0,
        take: 30,
      }),
    );
  });
});
