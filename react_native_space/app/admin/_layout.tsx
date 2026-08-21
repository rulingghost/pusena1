import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';

export default function AdminLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  if (!user?.isAdmin) return <Redirect href="/tabs/home" />;

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="users" />
      <Stack.Screen name="user-detail" />
      <Stack.Screen name="posts" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="pregnancy-content" />
      <Stack.Screen name="deleted-accounts" />
    </Stack>
  );
}
