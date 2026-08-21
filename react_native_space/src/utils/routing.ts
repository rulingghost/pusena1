import type { UserResponseDto } from '@/src/api/generated/schemas';

/** Post-login / post-OAuth redirect based on user state. */
export function getPostAuthRoute(user: UserResponseDto | null | undefined): '/auth/login' | '/admin' | '/setup' | '/tabs/home' {
  if (!user) return '/auth/login';
  if (user.isAdmin) return '/admin';
  if (!user.hasCompletedSetup) return '/setup';
  return '/tabs/home';
}
