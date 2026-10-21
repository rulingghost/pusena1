import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';

import { getPostAuthRoute } from '@/src/utils/routing';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  return <Redirect href={getPostAuthRoute(user)} />;
}
