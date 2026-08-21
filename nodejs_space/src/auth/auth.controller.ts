import { Controller, Post, Get, Patch, Delete, Body, Req, Res, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ChangePasswordDto, DeleteAccountDto, AuthResponseDto, TokensResponseDto, MeResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto, SuccessMessageResponseDto } from '../common/dto/success.dto';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('auth/login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async getMe(@Req() req: Request): Promise<MeResponseDto> {
    return this.authService.getMe((req as any).user.id);
  }

  @Post('auth/refresh')
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokensResponseDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/logout')
  async logout(@Req() req: Request, @Body() dto: RefreshTokenDto): Promise<SuccessResponseDto> {
    return this.authService.logout((req as any).user.id, dto.refreshToken);
  }

  @Post('auth/forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<SuccessMessageResponseDto> {
    return this.authService.forgotPassword(dto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('auth/change-password')
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto): Promise<SuccessResponseDto> {
    return this.authService.changePassword((req as any).user.id, dto.currentPassword, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('auth/account')
  async deleteAccount(@Req() req: Request, @Body() dto: DeleteAccountDto): Promise<SuccessResponseDto> {
    return this.authService.deleteAccount((req as any).user.id, dto.password, dto.reason, dto.note);
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
    } catch (error) {
      const stateData = state ? JSON.parse(Buffer.from(state, 'base64url').toString()) : null;
      const redirectUri = stateData?.data ? JSON.parse(stateData.data)?.redirectUri : '/';
      const errorUrl = new URL(redirectUri);
      errorUrl.searchParams.set('error', 'auth_failed');
      res.redirect(errorUrl.toString());
    }
  }
}
