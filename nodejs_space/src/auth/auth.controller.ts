import { Controller, Post, Get, Patch, Delete, Body, Req, Res, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, DeleteAccountDto, AuthResponseDto, TokensResponseDto, MeResponseDto, ExchangeCodeDto, WebDeleteAccountDto, AppleAuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto, SuccessMessageResponseDto } from '../common/dto/success.dto';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Kullanıcı kaydı oluştur' })
  @ApiOkResponse({ type: AuthResponseDto })
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'E-posta ve şifre ile giriş yap' })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  @ApiOperation({ summary: 'Mevcut oturum açmış kullanıcı profilini getir' })
  @ApiOkResponse({ type: MeResponseDto })
  async getMe(@Req() req: Request): Promise<MeResponseDto> {
    return this.authService.getMe((req as any).user.id);
  }

  @Post('auth/refresh')
  @ApiOperation({ summary: 'Yenileme tokenı ile erişim tokenını yenile' })
  @ApiOkResponse({ type: TokensResponseDto })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokensResponseDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/logout')
  @ApiOperation({ summary: 'Oturumu kapat ve tokenı iptal et' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async logout(@Req() req: Request, @Body() dto: RefreshTokenDto): Promise<SuccessResponseDto> {
    return this.authService.logout((req as any).user.id, dto.refreshToken);
  }

  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Şifre sıfırlama kodu talep et' })
  @ApiOkResponse({ type: SuccessMessageResponseDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<SuccessMessageResponseDto> {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('auth/reset-password')
  @ApiOperation({ summary: '6 haneli doğrulama kodu ile yeni şifre belirle' })
  @ApiOkResponse({ type: SuccessMessageResponseDto })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<SuccessMessageResponseDto> {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('auth/change-password')
  @ApiOperation({ summary: 'Mevcut oturumda şifre değiştir' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto): Promise<SuccessResponseDto> {
    return this.authService.changePassword((req as any).user.id, dto.currentPassword, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('auth/account')
  @ApiOperation({ summary: 'Kullanıcı hesabını ve tüm verilerini kalıcı olarak sil' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async deleteAccount(@Req() req: Request, @Body() dto: DeleteAccountDto): Promise<SuccessResponseDto> {
    return this.authService.deleteAccount((req as any).user.id, dto.password, dto.reason, dto.note);
  }

  @Post('auth/web-delete-account')
  @ApiOperation({ summary: 'Web üzerinden e-posta ve şifre ile hesap silme işlemini gerçekleştir' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async webDeleteAccount(@Body() dto: WebDeleteAccountDto): Promise<SuccessResponseDto> {
    return this.authService.webDeleteAccount(dto);
  }

  @Post('auth/exchange-code')
  @ApiOperation({ summary: 'OAuth tek kullanımlık kodunu oturum tokenlarına çevir' })
  @ApiOkResponse({ type: AuthResponseDto })
  async exchangeCode(@Body() dto: ExchangeCodeDto): Promise<AuthResponseDto> {
    return this.authService.exchangeAuthCode(dto.code);
  }

  @Post('auth/apple')
  @ApiOperation({ summary: 'Sign in with Apple ile giriş / kayıt (iOS & Web)' })
  @ApiOkResponse({ type: AuthResponseDto })
  async appleAuth(@Body() dto: AppleAuthDto): Promise<AuthResponseDto> {
    return this.authService.appleLogin(dto);
  }

  @Get('auth/google')
  async googleAuth(@Query('redirect_uri') redirectUri: string, @Res() res: Response): Promise<void> {
    const url = this.authService.getGoogleAuthUrl(redirectUri);
    res.redirect(url);
  }

  @Get('auth/google/callback')
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response): Promise<void> {
    try {
      const redirectUrl = await this.authService.handleGoogleCallback(code, state);
      res.redirect(redirectUrl);
    } catch {
      let safeRedirectUri: string | null = null;
      try {
        const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
        const data = typeof decoded.data === 'string' ? JSON.parse(decoded.data) : decoded.data;
        if (data?.redirectUri && this.authService.isAllowedRedirectUri(data.redirectUri)) {
          safeRedirectUri = data.redirectUri;
        }
      } catch {}

      if (safeRedirectUri) {
        const errorUrl = new URL(safeRedirectUri);
        errorUrl.searchParams.set('error', 'auth_failed');
        res.redirect(errorUrl.toString());
      } else {
        res.status(400).send('Kimlik doğrulama başarısız oldu veya geçersiz yönlendirme isteği.');
      }
    }
  }
}
