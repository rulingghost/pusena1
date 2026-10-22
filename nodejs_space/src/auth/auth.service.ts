import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/email.service';
import { SignupDto, LoginDto, ResetPasswordDto, WebDeleteAccountDto, AppleAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  private generatePartnerCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'BL-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private serializeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      biography: user.biography,
      avatarUrl: user.avatarUrl,
      partnerCode: user.partnerCode,
      pairedUserId: user.pairedUserId,
      hasCompletedSetup: user.hasCompletedSetup,
      isAdmin: user.isAdmin,
      hasPassword: Boolean(user.password),
      gender: user.gender ?? null,
      language: user.language ?? 'tr',
      birthYear: user.birthYear ?? null,
      createdAt: user.createdAt,
    };
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Bu e-posta adresi zaten kayıtlı');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const partnerCode = this.generatePartnerCode();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        nickname: dto.nickname || null,
        gender: dto.gender || null,
        language: dto.language === 'en' ? 'en' : 'tr',
        birthYear: dto.birthYear ?? null,
        partnerCode,
        settings: { create: { activeModules: dto.gender === 'male' ? ['relationship'] : [] } },
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.password);
    return {
      ...tokens,
      user: this.serializeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const loginIdentifier = dto.email.trim();
    // Allow login with email, nickname, name, or special admin alias
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: loginIdentifier, mode: 'insensitive' } },
          { nickname: { equals: loginIdentifier, mode: 'insensitive' } },
          { name: { equals: loginIdentifier, mode: 'insensitive' } },
        ],
      },
    });

    // If identifier is 'admin' and not found above, try standard demo admin accounts
    if (!user && loginIdentifier.toLowerCase() === 'admin') {
      user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: 'admin@bloom.com' },
            { email: 'a@a.com' },
            { isAdmin: true },
          ],
        },
      });
    }

    if (!user || !user.password) throw new UnauthorizedException('Geçersiz e-posta / kullanıcı adı veya şifre');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Geçersiz e-posta / kullanıcı adı veya şifre');

    // Auto-generate partnerCode if missing
    if (!user.partnerCode) {
      const partnerCode = this.generatePartnerCode();
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { partnerCode },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.password);
    return {
      ...tokens,
      user: this.serializeUser(user),
    };
  }

  async getMe(userId: string) {
    let user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');

    if (!user.partnerCode) {
      const partnerCode = this.generatePartnerCode();
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { partnerCode },
      });
    }

    return { user: this.serializeUser(user) };
  }

  private readonly userRevokedTimestamps = new Map<string, number>();

  revokeUserTokens(userId: string) {
    this.userRevokedTimestamps.set(userId, Math.floor(Date.now() / 1000));
  }

  isTokenRevoked(userId: string, iat?: number): boolean {
    if (!iat) return false;
    const revokedAt = this.userRevokedTimestamps.get(userId);
    if (!revokedAt) return false;
    return iat < revokedAt;
  }

  async refreshToken(refreshTokenStr: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({ where: { token: refreshTokenStr } });
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      if (tokenRecord) await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } }).catch(() => {});
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş yenileme tokenı');
    }

    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');

    return this.generateTokens(user.id, user.email, user.password);
  }

  async logout(userId: string, refreshTokenStr: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId, token: refreshTokenStr } });
    this.revokeUserTokens(userId);
    return { success: true };
  }

  private readonly resetCodes = new Map<string, { code: string; expiresAt: number; attempts: number }>();

  async forgotPassword(email: string) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });

    if (user) {
      // 6-digit numeric verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      this.resetCodes.set(normalizedEmail, {
        code,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins TTL
        attempts: 0,
      });

      this.logger.log(`[Şifre Sıfırlama Kodu] ${normalizedEmail} için üretilen kod: ${code}`);
      await this.emailService.sendPasswordResetCode(normalizedEmail, code);
    }

    // Always return success message to prevent email enumeration
    return {
      success: true,
      message: 'Şifre sıfırlama doğrulama kodu e-posta adresinize gönderildi.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const rawCode = (dto.code || dto.token || '').trim();
    if (!rawCode) {
      throw new BadRequestException('Sıfırlama kodu gereklidir');
    }

    let targetEmail = (dto.email || '').trim().toLowerCase();

    // If email wasn't provided, search by code across resetCodes
    if (!targetEmail) {
      for (const [emailKey, val] of this.resetCodes.entries()) {
        if (val.code === rawCode) {
          targetEmail = emailKey;
          break;
        }
      }
    }

    if (!targetEmail) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş sıfırlama kodu');
    }

    const item = this.resetCodes.get(targetEmail);
    if (!item || Date.now() > item.expiresAt) {
      this.resetCodes.delete(targetEmail);
      throw new BadRequestException('Sıfırlama kodunun süresi dolmuş. Lütfen yeni bir kod isteyin.');
    }

    if (item.attempts >= 5) {
      this.resetCodes.delete(targetEmail);
      throw new BadRequestException('Çok fazla hatalı kod denemesi yapıldı. Lütfen yeni bir kod isteyin.');
    }

    if (item.code !== rawCode) {
      item.attempts += 1;
      throw new BadRequestException('Geçersiz sıfırlama kodu');
    }

    // Code is valid: single-use guarantee
    this.resetCodes.delete(targetEmail);

    const user = await this.prisma.user.findFirst({
      where: { email: { equals: targetEmail, mode: 'insensitive' } },
    });
    if (!user) {
      throw new BadRequestException('Kullanıcı hesabı bulunamadı');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Invalidate existing sessions and refresh tokens
    await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } }).catch(() => {});
    this.revokeUserTokens(user.id);

    return {
      success: true,
      message: 'Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.',
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) throw new BadRequestException('Bu hesap için şifre değiştirilemez');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Mevcut şifre yanlış');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    // Invalidate all active tokens and refresh tokens
    await this.prisma.refreshToken.deleteMany({ where: { userId } }).catch(() => {});
    this.revokeUserTokens(userId);

    return { success: true };
  }

  async setPassword(userId: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('Şifre en az 6 karakter olmalıdır');
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return { success: true };
  }

  async deleteAccount(userId: string, password?: string, reason?: string, note?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');
    if (user.password) {
      if (!password) {
        throw new BadRequestException('Hesabınızı silmek için şifrenizi girmeniz gerekmektedir.');
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new UnauthorizedException('Şifre yanlış');
    }

    // Invalidate tokens and refresh tokens immediately
    this.revokeUserTokens(userId);

    return await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({ where: { userId } }).catch(() => {});

      // Save deletion record for admin audit
      await tx.deletedAccount.create({
        data: {
          email: user.email,
          name: user.name,
          reason: reason || 'Belirtilmedi',
          note: note || null,
        },
      });

      // Unlink partner and shut down location sharing
      const partnerId = user.pairedUserId;
      if (partnerId) {
        await tx.user.updateMany({
          where: { id: partnerId },
          data: { pairedUserId: null },
        });
        await tx.partnerLocation.updateMany({
          where: { userId: partnerId },
          data: { sharingEnabled: false, latitude: 0, longitude: 0, accuracy: null },
        });
        await tx.notification.create({
          data: {
            userId: partnerId,
            type: 'partner_unpaired',
            module: 'relationship',
            title: 'Partner bağlantısı sonlandı',
            body: `${user.nickname || user.name} hesabını kapattığı için partner eşleşmesi ve konum paylaşımı kaldırıldı.`,
          },
        }).catch(() => {});
      }

      const reversePartners = await tx.user.findMany({
        where: { pairedUserId: userId },
        select: { id: true },
      });
      if (reversePartners.length > 0) {
        const rIds = reversePartners.map((r) => r.id);
        await tx.user.updateMany({
          where: { id: { in: rIds } },
          data: { pairedUserId: null },
        });
        await tx.partnerLocation.updateMany({
          where: { userId: { in: rIds } },
          data: { sharingEnabled: false, latitude: 0, longitude: 0, accuracy: null },
        });
      }

      await tx.partnerLocation.deleteMany({ where: { userId } }).catch(() => {});
      await tx.user.delete({ where: { id: userId } });
      return { success: true };
    });
  }

  async webDeleteAccount(dto: WebDeleteAccountDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (!user) {
      throw new NotFoundException('Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.');
    }
    if (user.password) {
      const valid = await bcrypt.compare(dto.password, user.password);
      if (!valid) throw new UnauthorizedException('Girdiğiniz şifre hatalı.');
    } else {
      // Social login without password: require security verification note or in-app deletion
      if (!dto.password || dto.password.length < 6) {
        throw new BadRequestException('Bu hesap Google ile oluşturulmuştur. Güvenlik için lütfen uygulama içinden Hesabı Sil seçeneğini kullanın.');
      }
    }
    return this.deleteAccount(user.id, dto.password, dto.reason, dto.note);
  }

  // Google SSO helpers & security
  private readonly usedStateNonces = new Set<string>();
  private readonly authCodeStore = new Map<
    string,
    { token: string; refreshToken: string; user: any; expiresAt: number }
  >();

  isAllowedRedirectUri(uri: string): boolean {
    if (!uri || typeof uri !== 'string') return false;
    try {
      const parsed = new URL(uri);
      // Mobile custom schemes
      if (['pusena:', 'pusenaapp:', 'exp:', 'bloom:'].includes(parsed.protocol)) {
        return true;
      }
      // Web schemes
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        const hostname = parsed.hostname.toLowerCase();
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return true;
        }
        const appOrigin = this.configService.get<string>('APP_ORIGIN', 'http://localhost:3000/');
        try {
          const originHost = new URL(appOrigin).hostname.toLowerCase();
          if (hostname === originHost || hostname.endsWith(`.${originHost}`)) {
            return true;
          }
        } catch {}
        if (hostname === 'pusena.app' || hostname.endsWith('.pusena.app')) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  getGoogleAuthUrl(redirectUri: string) {
    if (!this.isAllowedRedirectUri(redirectUri)) {
      throw new BadRequestException('Geçersiz veya yetkilendirilmemiş yönlendirme adresi (redirect_uri)');
    }
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
      throw new BadRequestException('Google ile giriş şu anda aktif değildir. Lütfen e-posta ve şifrenizle giriş yapınız.');
    }
    const appOrigin = this.configService.get<string>('APP_ORIGIN', 'https://pusena-api-live.onrender.com');
    const callbackUrl = new URL('/api/auth/google/callback', appOrigin).toString();

    const nonce = crypto.randomBytes(16).toString('hex');
    const state = this.signState({ redirectUri, nonce, createdAt: Date.now() });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleGoogleCallback(code: string, stateStr: string) {
    const stateData = this.verifyState(stateStr);
    if (!stateData) throw new UnauthorizedException('Geçersiz veya süresi dolmuş state parametresi');

    const { redirectUri } = stateData;
    const clientId = this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET');
    const appOrigin = this.configService.get<string>('APP_ORIGIN', 'http://localhost:3000/');
    const callbackUrl = new URL('/api/auth/google/callback', appOrigin).toString();

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.id_token) throw new UnauthorizedException('Google kimlik doğrulama başarısız');

    // Verify ID token
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: tokenData.id_token, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload?.email_verified || !payload?.email) throw new UnauthorizedException('E-posta doğrulanamadı');

    // Find or create user
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ googleId: payload.sub }, { email: payload.email }] },
    });

    if (user) {
      if (!user.googleId) {
        user = await this.prisma.user.update({ where: { id: user.id }, data: { googleId: payload.sub, avatarUrl: user.avatarUrl || payload.picture } });
      }
    } else {
      user = await this.prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          googleId: payload.sub,
          avatarUrl: payload.picture,
          partnerCode: this.generatePartnerCode(),
          settings: { create: { activeModules: [] } },
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.password);
    const authCode = crypto.randomBytes(32).toString('hex');

    // Clean up expired auth codes periodically
    const now = Date.now();
    for (const [k, v] of this.authCodeStore.entries()) {
      if (v.expiresAt < now) this.authCodeStore.delete(k);
    }

    // Save one-time exchange code with 2-minute TTL
    this.authCodeStore.set(authCode, {
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      user: this.serializeUser(user),
      expiresAt: now + 2 * 60 * 1000,
    });

    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.set('code', authCode);
    return redirectUrl.toString();
  }

  async exchangeAuthCode(code: string) {
    if (!code || typeof code !== 'string') {
      throw new BadRequestException('Yetkilendirme kodu gereklidir');
    }
    const item = this.authCodeStore.get(code);
    if (!item) {
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş yetkilendirme kodu');
    }

    // Immediately remove (single-use guarantee)
    this.authCodeStore.delete(code);

    if (Date.now() > item.expiresAt) {
      throw new UnauthorizedException('Yetkilendirme kodunun süresi dolmuş');
    }

    return {
      token: item.token,
      refreshToken: item.refreshToken,
      user: item.user,
    };
  }

  private async generateTokens(userId: string, email: string, passwordHash?: string | null) {
    const pwdSig = passwordHash ? passwordHash.slice(-10) : '';
    const accessToken = this.jwtService.sign({ sub: userId, email, pwdSig }, { expiresIn: '15m' });
    const refreshToken = crypto.randomUUID();

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return { token: accessToken, refreshToken };
  }

  async appleLogin(dto: AppleAuthDto) {
    if (!dto.identityToken) {
      throw new BadRequestException('Apple kimlik belirteci (identityToken) gereklidir');
    }

    let payload: any;
    try {
      payload = this.jwtService.decode(dto.identityToken);
    } catch {
      throw new UnauthorizedException('Geçersiz Apple kimlik belirteci formatı');
    }

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Apple kimlik belirteci geçerli bir kullanıcı kimliği (sub) içermiyor');
    }

    // Issuer verification
    if (payload.iss && !payload.iss.includes('appleid.apple.com')) {
      throw new UnauthorizedException('Kimlik belirteci Apple tarafından imzalanmamış');
    }

    const appleSub = payload.sub as string;
    const resolvedEmail = (payload.email || dto.email || `${appleSub}@privaterelay.appleid.com`).toLowerCase().trim();

    // 1. Check if user is mapped via AppSecret
    let user = null;
    const secretKey = `APPLE_USER_${appleSub}`;
    const secretMapping = await this.prisma.appSecret.findUnique({
      where: { key: secretKey },
    });

    if (secretMapping?.value) {
      user = await this.prisma.user.findUnique({
        where: { id: secretMapping.value },
      });
    }

    // 2. If not found by secret, check by email
    if (!user) {
      user = await this.prisma.user.findFirst({
        where: { email: { equals: resolvedEmail, mode: 'insensitive' } },
      });
    }

    // 3. If user doesn't exist, create a new user
    if (!user) {
      const given = dto.fullName?.givenName?.trim();
      const family = dto.fullName?.familyName?.trim();
      const name = [given, family].filter(Boolean).join(' ').trim() || 'Apple Kullanıcısı';
      const partnerCode = this.generatePartnerCode();

      user = await this.prisma.user.create({
        data: {
          email: resolvedEmail,
          name,
          partnerCode,
          settings: { create: { activeModules: [] } },
        },
      });
    }

    // 4. Ensure secret mapping is saved for future logins
    await this.prisma.appSecret.upsert({
      where: { key: secretKey },
      create: { key: secretKey, value: user.id },
      update: { value: user.id },
    });

    // 5. Generate and return JWT tokens
    const tokens = await this.generateTokens(user.id, user.email, user.password);
    return {
      ...tokens,
      user: this.serializeUser(user),
    };
  }

  private signState(payload: { redirectUri: string; nonce: string; createdAt: number }): string {
    const data = JSON.stringify(payload);
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
    return Buffer.from(JSON.stringify({ data, hmac })).toString('base64url');
  }

  private verifyState(state: string): { redirectUri: string } | null {
    try {
      const { data, hmac } = JSON.parse(Buffer.from(state, 'base64url').toString());
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const expected = crypto.createHmac('sha256', secret).update(data).digest('hex');
      if (hmac !== expected) return null;

      const parsed = JSON.parse(data);
      if (!parsed.redirectUri || !this.isAllowedRedirectUri(parsed.redirectUri)) {
        return null;
      }

      // Check expiry: 10 minutes max
      if (!parsed.createdAt || typeof parsed.createdAt !== 'number') return null;
      if (Date.now() - parsed.createdAt > 10 * 60 * 1000) return null;

      // Replay prevention: check and record nonce
      if (!parsed.nonce || typeof parsed.nonce !== 'string') return null;
      if (this.usedStateNonces.has(parsed.nonce)) return null;
      this.usedStateNonces.add(parsed.nonce);

      // Keep usedStateNonces bounded
      if (this.usedStateNonces.size > 2000) {
        const arr = Array.from(this.usedStateNonces);
        for (let i = 0; i < 500; i++) this.usedStateNonces.delete(arr[i]);
      }

      return { redirectUri: parsed.redirectUri };
    } catch {
      return null;
    }
  }
}
