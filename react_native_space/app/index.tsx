import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  if (user?.isAdmin) return <Redirect href="/admin" />;
  if (!user?.hasCompletedSetup) return <Redirect href="/setup" />;
  return <Redirect href="/tabs/home" />;
}
