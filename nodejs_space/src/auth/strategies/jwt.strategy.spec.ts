import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockConfigService: any;
  let mockPrisma: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('test-jwt-secret-with-minimum-32-chars-long!'),
    };
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
    };
    mockAuthService = {
      isTokenRevoked: jest.fn().mockReturnValue(false),
    };

    strategy = new JwtStrategy(mockConfigService, mockPrisma, mockAuthService);
  });

  it('validates and returns user for a valid token payload', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      nickname: 'tester',
      gender: 'female',
      isAdmin: false,
      pairedUserId: null,
      password: 'hashed-password-1234567890',
    });

    const result = await strategy.validate({
      sub: 'user-1',
      email: 'test@example.com',
      pwdSig: '1234567890',
      iat: Math.floor(Date.now() / 1000),
    });

    expect(result).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      nickname: 'tester',
      gender: 'female',
      isAdmin: false,
      pairedUserId: null,
    });
  });

  it('throws UnauthorizedException if token was revoked', async () => {
    mockAuthService.isTokenRevoked.mockReturnValue(true);

    await expect(
      strategy.validate({
        sub: 'user-1',
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000) - 100,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException if user does not exist in DB', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      strategy.validate({
        sub: 'non-existent',
        email: 'ghost@example.com',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException if password changed and pwdSig does not match', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      password: 'new-hashed-password-abcdefghij',
    });

    await expect(
      strategy.validate({
        sub: 'user-1',
        email: 'test@example.com',
        pwdSig: '1234567890', // old password slice
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
