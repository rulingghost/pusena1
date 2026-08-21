import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class SignupDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() @MinLength(2) name: string;
  @IsOptional() @IsString() nickname?: string;
  @IsString() @IsIn(['female', 'male', 'other']) gender: string;
  @IsOptional() @IsString() language?: string;
  @IsOptional() birthYear?: number;
}

export class LoginDto {
  @IsString() email: string;
  @IsString() password: string;
}

export class RefreshTokenDto {
  @IsString() refreshToken: string;
}

export class ForgotPasswordDto {
  @IsEmail() email: string;
}

export class ResetPasswordDto {
  @IsString() token: string;
  @IsString() @MinLength(6) newPassword: string;
}

export class ChangePasswordDto {
  @IsString() currentPassword: string;
  @IsString() @MinLength(6) newPassword: string;
}

export class DeleteAccountDto {
  @IsString() password: string;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() note?: string;
}

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, type: String }) nickname: string | null;
  @ApiProperty({ nullable: true, type: String }) biography: string | null;
  @ApiProperty({ nullable: true, type: String }) avatarUrl: string | null;
  @ApiProperty({ nullable: true, type: String }) partnerCode: string | null;
  @ApiProperty({ nullable: true, type: String }) pairedUserId: string | null;
  @ApiProperty() hasCompletedSetup: boolean;
  @ApiProperty() isAdmin: boolean;
  @ApiProperty({ nullable: true, type: String }) gender: string | null;
  @ApiProperty() language: string;
  @ApiProperty({ nullable: true, type: Number }) birthYear: number | null;
  @ApiProperty() createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty() token: string;
  @ApiProperty() refreshToken: string;
  @ApiProperty({ type: UserResponseDto }) user: UserResponseDto;
}

export class TokensResponseDto {
  @ApiProperty() token: string;
  @ApiProperty() refreshToken: string;
}

export class MeResponseDto {
  @ApiProperty({ type: UserResponseDto }) user: UserResponseDto;
}
