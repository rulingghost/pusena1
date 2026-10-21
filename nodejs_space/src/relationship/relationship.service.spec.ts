import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RelationshipService - Pairing & Unpairing Atomicity', () => {
  let service: RelationshipService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn().mockImplementation((cb) => cb(prisma)),
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
      },
      partnerLocation: {
        updateMany: jest.fn(),
      },
      relationship: {
        findUnique: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
      },
      notification: {
        create: jest.fn().mockResolvedValue({ id: 'notif-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RelationshipService>(RelationshipService);
  });

  describe('unpair', () => {
    it('unpair resets pairedUserId and shuts down partnerLocation for both users in a transaction', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        pairedUserId: 'user-2',
        gender: 'female',
        partnerCode: 'BL-123456',
      });
      prisma.user.updateMany.mockResolvedValue({ count: 2 });
      prisma.partnerLocation.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.unpair('user-1');

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['user-1', 'user-2'] } },
        data: { pairedUserId: null },
      });
      expect(prisma.partnerLocation.updateMany).toHaveBeenCalledWith({
        where: { userId: { in: ['user-1', 'user-2'] } },
        data: {
          sharingEnabled: false,
          latitude: 0,
          longitude: 0,
          accuracy: null,
        },
      });
      expect(result.isPaired).toBe(false);
    });
  });

  describe('pairPartner', () => {
    it('throws BadRequestException if user tries to pair with own code', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        gender: 'female',
        partnerCode: 'BL-ABCDEF',
      });

      await expect(service.pairPartner('user-1', 'BL-ABCDEF')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException if user id matches partner id', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        gender: 'female',
        partnerCode: 'BL-ABCDEF',
      });
      prisma.user.findFirst.mockResolvedValue({
        id: 'user-1', // same user returned by code
        partnerCode: 'BL-ABCDEF',
      });

      await expect(service.pairPartner('user-1', 'BL-XYZ999')).rejects.toThrow(BadRequestException);
    });

    it('throws ConflictException if partner is already paired with someone else', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        gender: 'female',
        partnerCode: 'BL-ABCDEF',
        pairedUserId: null,
      });
      prisma.user.findFirst.mockResolvedValue({
        id: 'user-2',
        partnerCode: 'BL-XYZ888',
        pairedUserId: 'user-3', // already paired!
      });

      await expect(service.pairPartner('user-1', 'BL-XYZ888')).rejects.toThrow(ConflictException);
    });

    it('throws ConflictException if current user is already paired with someone else', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        gender: 'female',
        partnerCode: 'BL-ABCDEF',
        pairedUserId: 'user-99', // already paired!
      });
      prisma.user.findFirst.mockResolvedValue({
        id: 'user-2',
        partnerCode: 'BL-XYZ888',
        pairedUserId: null,
      });

      await expect(service.pairPartner('user-1', 'BL-XYZ888')).rejects.toThrow(ConflictException);
    });

    it('atomically pairs two users and initializes partnerLocation with sharingEnabled=false', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        gender: 'female',
        partnerCode: 'BL-ABCDEF',
        name: 'Leyla',
        pairedUserId: null,
      });
      prisma.user.findFirst.mockResolvedValue({
        id: 'user-2',
        gender: 'male',
        partnerCode: 'BL-GHIJKL',
        name: 'Mecnun',
        pairedUserId: null,
      });
      prisma.relationship.findUnique.mockResolvedValue(null);
      prisma.relationship.create.mockResolvedValue({ id: 'rel-1' });
      prisma.user.update.mockResolvedValue({});
      prisma.partnerLocation.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.pairPartner('user-1', 'BL-GHIJKL');

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      // Both users updated mutually
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { pairedUserId: 'user-2' },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-2' },
        data: { pairedUserId: 'user-1' },
      });
      // partnerLocation disabled by default
      expect(prisma.partnerLocation.updateMany).toHaveBeenCalledWith({
        where: { userId: { in: ['user-1', 'user-2'] } },
        data: {
          sharingEnabled: false,
          latitude: 0,
          longitude: 0,
          accuracy: null,
        },
      });
      expect(result.isPaired).toBe(true);
      expect(result.pairedUserId).toBe('user-2');
    });
  });
});
