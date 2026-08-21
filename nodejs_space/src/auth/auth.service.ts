import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

    const tokens = await this.generateTokens(user.id, user.email);
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

    const tokens = await this.generateTokens(user.id, user.email);
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

  async refreshToken(refreshTokenStr: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({ where: { token: refreshTokenStr } });
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      if (tokenRecord) await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } }).catch(() => {});
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş yenileme tokenı');
    }

    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');

    return this.generateTokens(user.id, user.email);
  }

  async logout(userId: string, refreshTokenStr: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId, token: refreshTokenStr } });
    return { success: true };
  }

  async forgotPassword(email: string) {
    // In a real app, send email with reset link. For now, just return success.
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    return { success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) throw new BadRequestException('Bu hesap için şifre değiştirilemez');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Mevcut şifre yanlış');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { success: true };
  }

  async deleteAccount(userId: string, password: string, reason?: string, note?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');
    if (user.password) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new UnauthorizedException('Şifre yanlış');
    }

    // Save deletion record for admin audit
    await this.prisma.deletedAccount.create({
      data: {
        email: user.email,
        name: user.name,
        reason: reason || 'Belirtilmedi',
        note: note || null,
      },
    });

    await this.prisma.user.delete({ where: { id: userId } });
    return { success: true };
  }

  // Google SSO helpers
  getGoogleAuthUrl(redirectUri: string) {
    const clientId = this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    const appOrigin = this.configService.get<string>('APP_ORIGIN', 'http://localhost:3000/');
    const callbackUrl = new URL('/api/auth/google/callback', appOrigin).toString();

    const state = this.signState(JSON.stringify({ redirectUri }));

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
    if (!stateData) throw new UnauthorizedException('Geçersiz state parametresi');

    const { redirectUri } = JSON.parse(stateData);
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

    const tokens = await this.generateTokens(user.id, user.email);
    const userJson = encodeURIComponent(JSON.stringify(this.serializeUser(user)));

    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.set('token', tokens.token);
    redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
    redirectUrl.searchParams.set('user', userJson);
    return redirectUrl.toString();
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign({ sub: userId, email }, { expiresIn: '15m' });
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

  private signState(data: string): string {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
    return Buffer.from(JSON.stringify({ data, hmac })).toString('base64url');
  }

  private verifyState(state: string): string | null {
    try {
      const { data, hmac } = JSON.parse(Buffer.from(state, 'base64url').toString());
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const expected = crypto.createHmac('sha256', secret).update(data).digest('hex');
      if (hmac !== expected) return null;
      return data;
    } catch {
      return null;
    }
  }
}
