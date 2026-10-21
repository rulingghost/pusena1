import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/api/queryClient';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ThemeProvider, useAppTheme } from '@/src/contexts/ThemeContext';
import { LanguageProvider } from '@/src/contexts/LanguageContext';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { GenderThemeSync } from '@/src/components/GenderThemeSync';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { loadApiBase } from '@/src/api/apiBase';
import { hydrateQueryCache, watchQueryCache } from '@/src/api/queryPersist';
import { StatusBar, View } from 'react-native';
import { AppAlertProvider } from '@/src/components/AppAlert';
import { PartnerLocationSync } from '@/src/location/PartnerLocationSync';
import { LiveAlertsSync } from '@/src/notifications/LiveAlertsSync';
import '@/src/location/backgroundShare';

watchQueryCache(queryClient);

/** Kayıtlı sunucu adresi, ilk istek atılmadan önce yüklenmeli. */
function ApiBaseGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([loadApiBase(), hydrateQueryCache(queryClient)]).finally(() => setReady(true));
  }, []);

  if (!ready) return <LoadingScreen />;
  return <>{children}</>;
}

function ThemedStatusBar() {
  const { isDark } = useAppTheme();
  return <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;
}

function RootNavigator() {
  const { colors } = useAppTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedStatusBar />
      <GenderThemeSync />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 260,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="notifications" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="pregnancy" options={{ headerShown: false }} />
        <Stack.Screen name="period" options={{ headerShown: false }} />
        <Stack.Screen name="story" options={{ headerShown: false }} />
        <Stack.Screen name="community" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="articles" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <ApiBaseGate>
              <AuthProvider>
                <AppAlertProvider>
                  <PartnerLocationSync />
                  <LiveAlertsSync />
                  <RootNavigator />
                </AppAlertProvider>
              </AuthProvider>
            </ApiBaseGate>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
