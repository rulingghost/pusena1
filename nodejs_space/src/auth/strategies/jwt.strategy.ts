import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth.service';

interface JwtPayload {
  sub: string;
  email: string;
  pwdSig?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Geçersiz oturum anahtarı');
    }

    // 1. Fast token revocation check (logout, account deletion, etc.)
    if (this.authService.isTokenRevoked(payload.sub, payload.iat)) {
      throw new UnauthorizedException('Oturum sonlandırılmış, lütfen tekrar giriş yapın');
    }

    // 2. Database user existence check
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        gender: true,
        isAdmin: true,
        pairedUserId: true,
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı hesabı bulunamadı veya silinmiş');
    }

    // 3. Password invalidation check: if token was issued with pwdSig and password changed
    if (payload.pwdSig && user.password) {
      const currentSig = user.password.slice(-10);
      if (currentSig !== payload.pwdSig) {
        throw new UnauthorizedException('Şifre değiştirildiği için oturum sonlandırıldı');
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      gender: user.gender,
      isAdmin: user.isAdmin,
      pairedUserId: user.pairedUserId,
    };
  }
}
