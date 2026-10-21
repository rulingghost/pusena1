import type { UserResponseDto } from '@/src/api/generated/schemas';

/** Post-login / post-OAuth redirect based on user state. */
export function getPostAuthRoute(user: UserResponseDto | null | undefined): '/auth/login' | '/auth/set-password' | '/admin' | '/setup' | '/tabs/home' {
  if (!user) return '/auth/login';
  if (user.hasPassword === false) return '/auth/set-password';
  if (user.isAdmin) return '/admin';
  if (!user.hasCompletedSetup) return '/setup';
  return '/tabs/home';
}
