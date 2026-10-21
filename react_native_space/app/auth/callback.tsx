import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { getPostAuthRoute } from '@/src/utils/routing';
import { customFetch } from '@/src/api/customFetch';
import type { UserResponseDto, AuthResponseDto } from '@/src/api/generated/schemas';

export default function AuthCallback() {
  const { setAuthFromCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        let code: string | null = null;
        let token: string | null = null;
        let refreshToken: string | null = null;
        let userStr: string | null = null;
        let errorParam: string | null = null;

        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          code = params.get('code');
          token = params.get('token');
          refreshToken = params.get('refreshToken');
          userStr = params.get('user');
          errorParam = params.get('error');
        }

        if (errorParam) {
          router.replace('/auth/login');
          return;
        }

        // Güvenli Authorization Code değişimi
        if (code) {
          const res = await customFetch<AuthResponseDto>('/api/auth/exchange-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          if (res?.token && res?.refreshToken && res?.user) {
            await setAuthFromCallback(res.token, res.refreshToken, res.user);
            router.replace(getPostAuthRoute(res.user));
            return;
          }
        }

        // Geriye dönük uyumluluk (eski token query parametreleri varsa)
        if (token && refreshToken && userStr) {
          const user = JSON.parse(decodeURIComponent(userStr)) as UserResponseDto;
          await setAuthFromCallback(token, refreshToken, user);
          router.replace(getPostAuthRoute(user));
        } else {
          router.replace('/auth/login');
        }
      } catch {
        router.replace('/auth/login');
      }
    };

    handleCallback();
  }, [setAuthFromCallback]);

  return <LoadingScreen />;
}
