import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { usePathname } from 'expo-router';
import { getPostAuthRoute } from '@/src/utils/routing';

export default function AuthLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();

  if (isLoading) return <LoadingScreen />;
  // Allow callback screen for OAuth
  if (isAuthenticated && !pathname?.includes('/auth/callback')) {
    return <Redirect href={getPostAuthRoute(user)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="callback" />
      <Stack.Screen name="server" />
    </Stack>
  );
}
