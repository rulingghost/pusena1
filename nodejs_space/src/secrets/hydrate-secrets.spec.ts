import { validateSecrets, isUsable } from './hydrate-secrets';

describe('hydrate-secrets and validateSecrets', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('isUsable', () => {
    it('returns false for empty, undefined or placeholder values', () => {
      expect(isUsable('')).toBe(false);
      expect(isUsable('   ')).toBe(false);
      expect(isUsable(undefined)).toBe(false);
      expect(isUsable('YOUR_API_KEY')).toBe(false);
      expect(isUsable('changeme')).toBe(false);
      expect(isUsable('TODO')).toBe(false);
      expect(isUsable('dev-secret')).toBe(false);
      expect(isUsable('test-secret')).toBe(false);
    });

    it('returns true for real secrets', () => {
      expect(isUsable('my-super-secret-key-that-is-very-long-and-secure')).toBe(true);
    });
  });

  describe('validateSecrets in development', () => {
    it('generates a random CRON_SECRET if missing and never equals JWT_SECRET', () => {
      process.env.NODE_ENV = 'development';
      process.env.JWT_SECRET = 'this-is-a-long-and-secure-jwt-secret-key-1234';
      delete (process.env as any).CRON_SECRET;

      validateSecrets();

      const cron = process.env.CRON_SECRET as string;
      expect(cron).toBeDefined();
      expect(cron.length).toBeGreaterThanOrEqual(32);
      expect(cron).not.toBe(process.env.JWT_SECRET);
    });

    it('regenerates CRON_SECRET if it was mistakenly set to JWT_SECRET', () => {
      process.env.NODE_ENV = 'development';
      const sharedSecret = 'this-is-a-shared-secret-that-must-be-split-1234';
      process.env.JWT_SECRET = sharedSecret;
      process.env.CRON_SECRET = sharedSecret;

      validateSecrets();

      expect(process.env.CRON_SECRET).not.toBe(sharedSecret);
      expect(process.env.CRON_SECRET).not.toBe(process.env.JWT_SECRET);
    });
  });

  describe('validateSecrets in production', () => {
    let mockExit: jest.SpyInstance;
    let mockConsoleError: jest.SpyInstance;

    beforeEach(() => {
      mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
        throw new Error('process.exit called');
      }) as any);
      mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      mockExit.mockRestore();
      mockConsoleError.mockRestore();
    });

    it('exits if JWT_SECRET and CRON_SECRET are identical in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
      const same = 'identical-secret-key-that-is-at-least-32-chars-long!';
      process.env.JWT_SECRET = same;
      process.env.CRON_SECRET = same;

      expect(() => validateSecrets()).toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('exits if JWT_SECRET is less than 32 characters in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
      process.env.JWT_SECRET = 'too-short';
      process.env.CRON_SECRET = 'cron-secret-that-is-sufficiently-long-and-secure-32chars';

      expect(() => validateSecrets()).toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('exits if DATABASE_URL is missing in production', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;
      process.env.JWT_SECRET = 'jwt-secret-that-is-sufficiently-long-and-secure-32chars';
      process.env.CRON_SECRET = 'cron-secret-that-is-sufficiently-long-and-secure-32chars';

      expect(() => validateSecrets()).toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('succeeds without exiting when all production secrets are valid and distinct', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
      process.env.JWT_SECRET = 'jwt-secret-that-is-sufficiently-long-and-secure-32chars';
      process.env.CRON_SECRET = 'cron-secret-that-is-sufficiently-long-and-secure-32chars';

      expect(() => validateSecrets()).not.toThrow();
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});
