import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';

describe('MediaService - Access Control', () => {
  let service: MediaService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      mediaObject: {
        findUnique: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('throws NotFoundException if media object does not exist', async () => {
    prisma.mediaObject.findUnique.mockResolvedValue(null);
    await expect(service.assertCanAccess('media-1', null)).rejects.toThrow(NotFoundException);
  });

  it('allows public access for avatar kind without login', async () => {
    const avatar = { id: 'media-avatar', kind: 'avatar', userId: 'user-1', bytes: Buffer.from([]), mimeType: 'image/jpeg' };
    prisma.mediaObject.findUnique.mockResolvedValue(avatar);

    const result = await service.assertCanAccess('media-avatar', null);
    expect(result).toBe(avatar);
  });

  it('throws UnauthorizedException for memory kind without authentication', async () => {
    const memory = { id: 'media-mem', kind: 'memory', userId: 'user-1', bytes: Buffer.from([]), mimeType: 'image/jpeg' };
    prisma.mediaObject.findUnique.mockResolvedValue(memory);

    await expect(service.assertCanAccess('media-mem', null)).rejects.toThrow(UnauthorizedException);
  });

  it('allows owner to access their own private memory', async () => {
    const memory = { id: 'media-mem', kind: 'memory', userId: 'user-1', bytes: Buffer.from([]), mimeType: 'image/jpeg' };
    prisma.mediaObject.findUnique.mockResolvedValue(memory);

    const result = await service.assertCanAccess('media-mem', 'user-1');
    expect(result).toBe(memory);
  });

  it('allows mutual active partner to access partner private memory', async () => {
    const memory = { id: 'media-mem', kind: 'memory', userId: 'user-1', bytes: Buffer.from([]), mimeType: 'image/jpeg' };
    prisma.mediaObject.findUnique.mockResolvedValue(memory);

    // Requester user-2 has pairedUserId: 'user-1'
    prisma.user.findUnique.mockImplementation(({ where }: any) => {
      if (where.id === 'user-2') return Promise.resolve({ pairedUserId: 'user-1', isAdmin: false });
      if (where.id === 'user-1') return Promise.resolve({ pairedUserId: 'user-2' });
      return Promise.resolve(null);
    });

    const result = await service.assertCanAccess('media-mem', 'user-2');
    expect(result).toBe(memory);
  });

  it('throws ForbiddenException if stranger attempts to access private memory', async () => {
    const memory = { id: 'media-mem', kind: 'memory', userId: 'user-1', bytes: Buffer.from([]), mimeType: 'image/jpeg' };
    prisma.mediaObject.findUnique.mockResolvedValue(memory);

    prisma.user.findUnique.mockImplementation(({ where }: any) => {
      if (where.id === 'user-stranger') return Promise.resolve({ pairedUserId: null, isAdmin: false });
      return Promise.resolve(null);
    });

    await expect(service.assertCanAccess('media-mem', 'user-stranger')).rejects.toThrow(ForbiddenException);
  });

  it('allows admin to access private memory', async () => {
    const memory = { id: 'media-mem', kind: 'memory', userId: 'user-1', bytes: Buffer.from([]), mimeType: 'image/jpeg' };
    prisma.mediaObject.findUnique.mockResolvedValue(memory);

    prisma.user.findUnique.mockImplementation(({ where }: any) => {
      if (where.id === 'admin-user') return Promise.resolve({ pairedUserId: null, isAdmin: true });
      return Promise.resolve(null);
    });

    const result = await service.assertCanAccess('media-mem', 'admin-user');
    expect(result).toBe(memory);
  });
});
