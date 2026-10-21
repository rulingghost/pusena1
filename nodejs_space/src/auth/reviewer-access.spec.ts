import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { assertUserNotMale, filterModulesForGender } from '../common/gender-modules';

describe('Reviewer Access & Store Review Accounts Verification', () => {
  let authService: AuthService;
  let prisma: any;
  let jwtService: any;
  let configService: any;

  const rawPassword = 'Pusena2026Review!*';
  let hashedPassword: string;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(rawPassword, 10);
  });

  const mockFemaleReviewer = {
    id: 'reviewer-female-uuid-1',
    email: 'reviewer.female@pusena.com',
    password: '', // will be set in beforeEach
    name: 'Zeynep Reviewer',
    nickname: 'zeynep_rev',
    gender: 'female',
    partnerCode: 'BL-REV01',
    pairedUserId: 'reviewer-male-uuid-2',
    hasCompletedSetup: true,
    isAdmin: false,
    language: 'tr',
    createdAt: new Date(),
  };

  const mockMaleReviewer = {
    id: 'reviewer-male-uuid-2',
    email: 'reviewer.male@pusena.com',
    password: '',
    name: 'Emre Reviewer',
    nickname: 'emre_rev',
    gender: 'male',
    partnerCode: 'BL-REV02',
    pairedUserId: 'reviewer-female-uuid-1',
    hasCompletedSetup: true,
    isAdmin: false,
    language: 'tr',
    createdAt: new Date(),
  };

  const mockFreshReviewer = {
    id: 'reviewer-fresh-uuid-3',
    email: 'reviewer.fresh@pusena.com',
    password: '',
    name: 'Aslı Reviewer',
    nickname: 'asli_rev',
    gender: 'female',
    partnerCode: 'BL-FRESH1',
    pairedUserId: null,
    hasCompletedSetup: true,
    isAdmin: false,
    language: 'tr',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockFemaleReviewer.password = hashedPassword;
    mockMaleReviewer.password = hashedPassword;
    mockFreshReviewer.password = hashedPassword;

    prisma = {
      user: {
        findFirst: jest.fn(async ({ where }: any) => {
          const emailCondition = where?.OR?.find((c: any) => c.email);
          const email = emailCondition?.email?.equals || emailCondition?.email;
          if (email === 'reviewer.female@pusena.com') return mockFemaleReviewer;
          if (email === 'reviewer.male@pusena.com') return mockMaleReviewer;
          if (email === 'reviewer.fresh@pusena.com') return mockFreshReviewer;
          return null;
        }),
        findUnique: jest.fn(async ({ where }: any) => {
          if (where.email === 'reviewer.female@pusena.com' || where.id === mockFemaleReviewer.id) return mockFemaleReviewer;
          if (where.email === 'reviewer.male@pusena.com' || where.id === mockMaleReviewer.id) return mockMaleReviewer;
          if (where.email === 'reviewer.fresh@pusena.com' || where.id === mockFreshReviewer.id) return mockFreshReviewer;
          return null;
        }),
        update: jest.fn(async ({ data }: any) => ({ ...mockFemaleReviewer, ...data })),
      },
      refreshToken: {
        create: jest.fn().mockResolvedValue({ id: 'rt-1', token: 'mock-refresh-token' }),
        findUnique: jest.fn(),
        delete: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      appSecret: {
        findUnique: jest.fn(),
        upsert: jest.fn().mockResolvedValue({}),
      },
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token-reviewer'),
      decode: jest.fn(),
    };

    configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret-at-least-32-chars-long-12345';
        return 'mock-secret';
      }),
      get: jest.fn((key: string, def?: any) => {
        if (key === 'JWT_EXPIRES_IN') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '30d';
        return def;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('Store Reviewer Account Credentials Verification', () => {
    it('should successfully authenticate the Female Reviewer with valid password', async () => {
      const result = await authService.login({
        email: 'reviewer.female@pusena.com',
        password: rawPassword,
      });

      expect(result).toBeDefined();
      expect(result.token).toBe('mock-jwt-token-reviewer');
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe('reviewer.female@pusena.com');
      expect(result.user.gender).toBe('female');
      expect(result.user.hasCompletedSetup).toBe(true);
      expect(result.user.pairedUserId).toBe(mockMaleReviewer.id);
    });

    it('should successfully authenticate the Male Partner Reviewer', async () => {
      const result = await authService.login({
        email: 'reviewer.male@pusena.com',
        password: rawPassword,
      });

      expect(result).toBeDefined();
      expect(result.token).toBe('mock-jwt-token-reviewer');
      expect(result.user.email).toBe('reviewer.male@pusena.com');
      expect(result.user.gender).toBe('male');
      expect(result.user.hasCompletedSetup).toBe(true);
      expect(result.user.pairedUserId).toBe(mockFemaleReviewer.id);
    });

    it('should successfully authenticate the Fresh Unpaired Reviewer', async () => {
      const result = await authService.login({
        email: 'reviewer.fresh@pusena.com',
        password: rawPassword,
      });

      expect(result).toBeDefined();
      expect(result.token).toBe('mock-jwt-token-reviewer');
      expect(result.user.email).toBe('reviewer.fresh@pusena.com');
      expect(result.user.pairedUserId).toBeNull();
      expect(result.user.partnerCode).toBe('BL-FRESH1');
    });

    it('should reject reviewer login attempts with incorrect password', async () => {
      await expect(
        authService.login({
          email: 'reviewer.female@pusena.com',
          password: 'WrongPassword2026!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Partner & Role Isolation Validation', () => {
    it('verifies that Female and Male reviewers are mutually paired', () => {
      expect(mockFemaleReviewer.pairedUserId).toBe(mockMaleReviewer.id);
      expect(mockMaleReviewer.pairedUserId).toBe(mockFemaleReviewer.id);
    });

    it('verifies that Fresh reviewer is completely solo / unpaired', () => {
      expect(mockFreshReviewer.pairedUserId).toBeNull();
    });

    it('verifies that Male reviewer is restricted to relationship module only', async () => {
      // Male reviewer cannot perform personal female tracking actions
      await expect(assertUserNotMale(prisma as any, mockMaleReviewer.id, 'gebelik')).rejects.toThrow(
        ForbiddenException,
      );

      // Female reviewer is fully allowed
      await expect(assertUserNotMale(prisma as any, mockFemaleReviewer.id, 'gebelik')).resolves.toBeUndefined();

      // Module filtering keeps relationship for male, allows all for female
      expect(filterModulesForGender(['pregnancy', 'period', 'relationship'], mockMaleReviewer.gender)).toEqual([
        'relationship',
      ]);
      expect(filterModulesForGender(['pregnancy', 'period', 'relationship'], mockFemaleReviewer.gender)).toEqual([
        'pregnancy',
        'period',
        'relationship',
      ]);
    });
  });
});
