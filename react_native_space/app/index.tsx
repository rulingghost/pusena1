import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { getPostAuthRoute } from '@/src/utils/routing';
import { ONBOARDING_SEEN_KEY } from '@/app/onboarding';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [hasCheckedIntro, setHasCheckedIntro] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_SEEN_KEY)
      .then((val) => {
        setHasSeenIntro(val === 'true');
      })
      .catch(() => {
        setHasSeenIntro(false);
      })
      .finally(() => {
        setHasCheckedIntro(true);
      });
  }, []);

  if (isLoading || !hasCheckedIntro) return <LoadingScreen />;

  // Logged-in users skip intro completely and go to their authorized destination
  if (isAuthenticated) {
    return <Redirect href={getPostAuthRoute(user)} />;
  }

  // First time users see the 3-4 page onboarding intro
  if (!hasSeenIntro) {
    return <Redirect href="/onboarding" />;
  }

  // Already seen intro but not logged in: go to login
  return <Redirect href="/auth/login" />;
}
