import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';

export default function SetupLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  if (user?.hasPassword === false) return <Redirect href="/auth/set-password" />;
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
