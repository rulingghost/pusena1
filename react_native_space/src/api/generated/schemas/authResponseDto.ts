// @ts-nocheck
import type { UserResponseDto } from './userResponseDto';

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  user: UserResponseDto;
}
