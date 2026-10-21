import { ForbiddenException } from '@nestjs/common';
import { assertUserNotMale, filterModulesForGender, isMaleGender } from './gender-modules';
import { PrismaService } from '../prisma/prisma.service';

describe('gender-modules', () => {
  describe('isMaleGender', () => {
    it('returns true for male', () => {
      expect(isMaleGender('male')).toBe(true);
    });

    it('returns false for female, other, null, undefined', () => {
      expect(isMaleGender('female')).toBe(false);
      expect(isMaleGender('other')).toBe(false);
      expect(isMaleGender(null)).toBe(false);
      expect(isMaleGender(undefined)).toBe(false);
    });
  });

  describe('filterModulesForGender', () => {
    it('restricts male users to relationship module only', () => {
      expect(filterModulesForGender(['pregnancy', 'period', 'relationship'], 'male')).toEqual(['relationship']);
      expect(filterModulesForGender(['pregnancy'], 'male')).toEqual(['relationship']);
    });

    it('allows all modules for female or other', () => {
      expect(filterModulesForGender(['pregnancy', 'period', 'relationship'], 'female')).toEqual([
        'pregnancy',
        'period',
        'relationship',
      ]);
    });
  });

  describe('assertUserNotMale', () => {
    let mockPrisma: Partial<PrismaService>;

    beforeEach(() => {
      mockPrisma = {
        user: {
          findUnique: jest.fn(),
        } as any,
      };
    });

    it('throws ForbiddenException when user gender is male', async () => {
      (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'male' });

      await expect(assertUserNotMale(mockPrisma as PrismaService, 'male-user-id', 'regl')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('does not throw when user gender is female', async () => {
      (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'female' });

      await expect(assertUserNotMale(mockPrisma as PrismaService, 'female-user-id', 'regl')).resolves.toBeUndefined();
    });

    it('does not throw when user gender is null or not set', async () => {
      (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: null });

      await expect(assertUserNotMale(mockPrisma as PrismaService, 'neutral-user-id', 'regl')).resolves.toBeUndefined();
    });
  });
});
