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
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() token?: string;
  @IsString() @MinLength(6, { message: 'Yeni şifre en az 6 karakter olmalıdır' }) newPassword: string;
}

export class ChangePasswordDto {
  @IsString() currentPassword: string;
  @IsString() @MinLength(6) newPassword: string;
}

export class SetPasswordDto {
  @ApiProperty({ description: 'Yeni hesap şifresi', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password: string;
}

export class DeleteAccountDto {
  @ApiProperty({ required: false, description: 'Hesap şifresi (sosyal girişli hesaplarda opsiyonel)' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false, description: 'Hesap silme nedeni' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false, description: 'Ek açıklama veya not' })
  @IsOptional()
  @IsString()
  note?: string;
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
  @ApiProperty({ required: false }) hasPassword?: boolean;
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

export class ExchangeCodeDto {
  @ApiProperty({ description: 'OAuth one-time exchange code' })
  @IsString()
  code: string;
}

export class WebDeleteAccountDto {
  @ApiProperty({ description: 'Kayıtlı e-posta adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Hesap şifresi' })
  @IsString()
  password: string;

  @ApiProperty({ required: false, description: 'Hesap silme nedeni' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false, description: 'Ek açıklama veya not' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class AppleFullNameDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  givenName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  familyName?: string;
}

export class AppleAuthDto {
  @ApiProperty({ description: 'Apple Identity Token (JWT)' })
  @IsString()
  @MinLength(10)
  identityToken: string;

  @ApiProperty({ required: false, description: 'Apple kullanıcı e-postası (varsa)' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, type: AppleFullNameDto, description: 'Apple kullanıcı tam adı' })
  @IsOptional()
  fullName?: AppleFullNameDto;
}

