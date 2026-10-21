import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService - OAuth Security & Exchange Code', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;
  let configService: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
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
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      decode: jest.fn(),
    };

    configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret-at-least-32-chars-long-12345';
        if (key === 'GOOGLE_CLIENT_ID') return 'mock-client-id';
        if (key === 'GOOGLE_CLIENT_SECRET') return 'mock-client-secret';
        return 'mock';
      }),
      get: jest.fn((key: string, def?: any) => {
        if (key === 'APP_ORIGIN') return 'https://pusena.app';
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

    service = module.get<AuthService>(AuthService);
  });

  describe('isAllowedRedirectUri', () => {
    it('accepts mobile app schemes', () => {
      expect(service.isAllowedRedirectUri('pusena://auth/callback')).toBe(true);
      expect(service.isAllowedRedirectUri('exp://127.0.0.1:8081')).toBe(true);
    });

    it('accepts localhost development URLs', () => {
      expect(service.isAllowedRedirectUri('http://localhost:8081/auth/callback')).toBe(true);
      expect(service.isAllowedRedirectUri('http://127.0.0.1:3000')).toBe(true);
    });

    it('accepts official APP_ORIGIN domains', () => {
      expect(service.isAllowedRedirectUri('https://pusena.app/auth/callback')).toBe(true);
      expect(service.isAllowedRedirectUri('https://app.pusena.app/callback')).toBe(true);
    });

    it('rejects arbitrary external/malicious domains (open redirect prevention)', () => {
      expect(service.isAllowedRedirectUri('https://evil.com/callback')).toBe(false);
      expect(service.isAllowedRedirectUri('https://attacker.org')).toBe(false);
      expect(service.isAllowedRedirectUri('javascript:alert(1)')).toBe(false);
      expect(service.isAllowedRedirectUri('')).toBe(false);
    });
  });

  describe('getGoogleAuthUrl', () => {
    it('throws BadRequestException for invalid redirectUri', () => {
      expect(() => service.getGoogleAuthUrl('https://evil.com')).toThrow(BadRequestException);
    });

    it('returns valid Google OAuth URL for whitelisted redirectUri', () => {
      const url = service.getGoogleAuthUrl('pusena://auth/callback');
      expect(url).toContain('accounts.google.com');
      expect(url).toContain('client_id=mock-client-id');
      expect(url).toContain('state=');
    });
  });

  describe('exchangeAuthCode', () => {
    it('rejects empty or nonexistent code with UnauthorizedException', async () => {
      await expect(service.exchangeAuthCode('non-existent-code')).rejects.toThrow(UnauthorizedException);
    });

    it('exchanges code for tokens once and deletes the code to prevent replay', async () => {
      // Simulate code storage inside authCodeStore
      const testCode = 'auth-code-123';
      (service as any).authCodeStore.set(testCode, {
        token: 'jwt-access-token',
        refreshToken: 'uuid-refresh-token',
        user: { id: 'u1', email: 'test@example.com' },
        expiresAt: Date.now() + 60000,
      });

      const firstCall = await service.exchangeAuthCode(testCode);
      expect(firstCall.token).toBe('jwt-access-token');
      expect(firstCall.refreshToken).toBe('uuid-refresh-token');

      // Second call must fail immediately (single-use guarantee)
      await expect(service.exchangeAuthCode(testCode)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteAccount', () => {
    it('revokes tokens, unlinks partner, and deletes user in a transaction', async () => {
      const hashed = await bcrypt.hash('correct-pw', 10);

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-to-delete',
        email: 'del@example.com',
        name: 'Deleted User',
        password: hashed,
        pairedUserId: 'partner-user-99',
      });
      prisma.$transaction = jest.fn().mockImplementation((cb) => cb(prisma));
      prisma.user.updateMany = jest.fn().mockResolvedValue({ count: 1 });
      prisma.user.findMany = jest.fn().mockResolvedValue([]);
      prisma.user.delete = jest.fn().mockResolvedValue({});
      prisma.deletedAccount = { create: jest.fn().mockResolvedValue({ id: 'del-rec-1' }) };
      prisma.partnerLocation = {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      };
      prisma.notification = { create: jest.fn().mockResolvedValue({}) };

      const res = await service.deleteAccount('user-to-delete', 'correct-pw', 'Leaving app');

      expect(res.success).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.deletedAccount.create).toHaveBeenCalled();
      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: { id: 'partner-user-99' },
        data: { pairedUserId: null },
      });
      expect(prisma.partnerLocation.updateMany).toHaveBeenCalledWith({
        where: { userId: 'partner-user-99' },
        data: { sharingEnabled: false, latitude: 0, longitude: 0, accuracy: null },
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-to-delete' } });
      expect(service.isTokenRevoked('user-to-delete', Math.floor(Date.now() / 1000) - 10)).toBe(true);
    });

    it('throws UnauthorizedException if password does not match', async () => {
      const hashed = await bcrypt.hash('correct-pw', 10);

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-to-delete',
        password: hashed,
      });

      await expect(service.deleteAccount('user-to-delete', 'wrong-pw')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('webDeleteAccount', () => {
    it('throws NotFoundException when email does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.webDeleteAccount({ email: 'nonexistent@example.com', password: 'any-password' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      const hashed = await bcrypt.hash('real-password', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-web-del',
        email: 'user@example.com',
        password: hashed,
      });

      await expect(
        service.webDeleteAccount({ email: 'user@example.com', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('successfully validates user password and executes account deletion', async () => {
      const hashed = await bcrypt.hash('valid-password', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-web-del',
        email: 'user@example.com',
        password: hashed,
        pairedUserId: null,
      });
      prisma.$transaction = jest.fn().mockImplementation((cb) => cb(prisma));
      prisma.user.updateMany = jest.fn().mockResolvedValue({ count: 0 });
      prisma.user.findMany = jest.fn().mockResolvedValue([]);
      prisma.user.delete = jest.fn().mockResolvedValue({});
      prisma.deletedAccount = { create: jest.fn().mockResolvedValue({ id: 'del-1' }) };
      prisma.partnerLocation = {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      };

      const res = await service.webDeleteAccount({
        email: 'USER@example.com',
        password: 'valid-password',
        reason: 'GDPR right to be forgotten',
        note: 'Web form request',
      });

      expect(res.success).toBe(true);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-web-del' } });
      expect(prisma.deletedAccount.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'user@example.com',
            reason: 'GDPR right to be forgotten',
            note: 'Web form request',
          }),
        }),
      );
    });
  });

  describe('forgotPassword & resetPassword', () => {
    it('generates a 6-digit code for existing user and returns success message', async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: 'u-pw-reset',
        email: 'reset@example.com',
      });

      const res = await service.forgotPassword('RESET@example.com');
      expect(res.success).toBe(true);
      expect(res.message).toContain('kod');

      const stored = (service as any).resetCodes.get('reset@example.com');
      expect(stored).toBeDefined();
      expect(stored.code).toMatch(/^\d{6}$/);
      expect(stored.expiresAt).toBeGreaterThan(Date.now());
    });

    it('rejects resetPassword with invalid code', async () => {
      (service as any).resetCodes.set('reset@example.com', {
        code: '123456',
        expiresAt: Date.now() + 60000,
        attempts: 0,
      });

      await expect(
        service.resetPassword({
          email: 'reset@example.com',
          code: '999999',
          newPassword: 'new-password-123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects resetPassword if code has expired', async () => {
      (service as any).resetCodes.set('reset@example.com', {
        code: '123456',
        expiresAt: Date.now() - 1000,
        attempts: 0,
      });

      await expect(
        service.resetPassword({
          email: 'reset@example.com',
          code: '123456',
          newPassword: 'new-password-123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('resets password, deletes code, and revokes tokens when code is valid', async () => {
      (service as any).resetCodes.set('reset@example.com', {
        code: '654321',
        expiresAt: Date.now() + 60000,
        attempts: 0,
      });
      prisma.user.findFirst.mockResolvedValue({
        id: 'u-pw-reset',
        email: 'reset@example.com',
      });
      prisma.user.update = jest.fn().mockResolvedValue({});
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 });

      const res = await service.resetPassword({
        email: 'reset@example.com',
        code: '654321',
        newPassword: 'brandNewPassword123',
      });

      expect(res.success).toBe(true);
      // Code was deleted
      expect((service as any).resetCodes.get('reset@example.com')).toBeUndefined();
      // Password updated
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'u-pw-reset' },
        }),
      );
      // Tokens revoked
      expect(service.isTokenRevoked('u-pw-reset', Math.floor(Date.now() / 1000) - 10)).toBe(true);
    });
  });

  describe('appleLogin', () => {
    it('throws BadRequestException if identityToken is empty', async () => {
      await expect(service.appleLogin({ identityToken: '' })).rejects.toThrow(BadRequestException);
    });

    it('throws UnauthorizedException if token decode fails or lacks sub', async () => {
      jwtService.decode.mockReturnValue(null);
      await expect(service.appleLogin({ identityToken: 'invalid.jwt.token' })).rejects.toThrow(UnauthorizedException);

      jwtService.decode.mockReturnValue({ email: 'some@email.com' }); // no sub
      await expect(service.appleLogin({ identityToken: 'invalid.jwt.token' })).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException if issuer is not Apple', async () => {
      jwtService.decode.mockReturnValue({ sub: 'apple-sub-1', iss: 'https://evil.com' });
      await expect(service.appleLogin({ identityToken: 'token' })).rejects.toThrow(UnauthorizedException);
    });

    it('authenticates existing user mapped via AppSecret', async () => {
      jwtService.decode.mockReturnValue({
        sub: 'apple-sub-12345',
        iss: 'https://appleid.apple.com',
        email: 'user@apple.com',
      });

      prisma.appSecret.findUnique.mockResolvedValue({
        key: 'APPLE_USER_apple-sub-12345',
        value: 'existing-apple-user-id',
      });

      prisma.user.findUnique.mockResolvedValue({
        id: 'existing-apple-user-id',
        email: 'user@apple.com',
        name: 'Existing Apple User',
        password: 'hashed-password',
      });

      const res = await service.appleLogin({ identityToken: 'valid-apple-jwt' });
      expect(res.token).toBe('mock-jwt-token');
      expect(res.user.id).toBe('existing-apple-user-id');
      expect(res.user.email).toBe('user@apple.com');
    });

    it('creates and registers a new user when no existing mapping or email matches', async () => {
      jwtService.decode.mockReturnValue({
        sub: 'new-apple-sub-999',
        iss: 'https://appleid.apple.com',
        email: 'newuser@privaterelay.appleid.com',
      });

      prisma.appSecret.findUnique.mockResolvedValue(null);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'new-apple-user-id',
        email: 'newuser@privaterelay.appleid.com',
        name: 'Elif Yılmaz',
        partnerCode: 'BL-APPL1',
      });

      const res = await service.appleLogin({
        identityToken: 'valid-apple-jwt',
        fullName: { givenName: 'Elif', familyName: 'Yılmaz' },
      });

      expect(res.token).toBe('mock-jwt-token');
      expect(res.user.id).toBe('new-apple-user-id');
      expect(res.user.name).toBe('Elif Yılmaz');
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'newuser@privaterelay.appleid.com',
            name: 'Elif Yılmaz',
          }),
        }),
      );
      expect(prisma.appSecret.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { key: 'APPLE_USER_new-apple-sub-999' },
          create: expect.objectContaining({ value: 'new-apple-user-id' }),
        }),
      );
    });
  });
});
