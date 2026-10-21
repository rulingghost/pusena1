import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authControllerLogin, authControllerSignup, authControllerGetMe, authControllerLogout } from '@/src/api/generated/api';
import { tryRefreshTokens, clearAuthTokens } from '@/src/api/customFetch';
import { clearQueryCache, hydrateQueryCache, setCurrentCacheUserId, clearPersistSaveTimer } from '@/src/api/queryPersist';
import { queryClient, resetQueryClientForUserChange } from '@/src/api/queryClient';
import { stopPartnerLocationShare } from '@/src/location/backgroundShare';
import { setMediaAuthToken } from '@/src/utils/mediaUrl';
import { getSecureItem, setSecureItem } from '@/src/utils/secureStorage';
import type { UserResponseDto } from '@/src/api/generated/schemas';

const USER_CACHE_KEY = 'cached_auth_user';

function safeParseUser(raw: string | null): UserResponseDto | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserResponseDto;
  } catch {
    return null;
  }
}

/** Sunucu avatarı boş dönerse önbellekteki fotoğrafı koru. */
function mergeKeepAvatar(next: UserResponseDto | null, prev: UserResponseDto | null) {
  if (!next) return null;
  if (!next.avatarUrl && prev?.avatarUrl) return { ...next, avatarUrl: prev.avatarUrl };
  return next;
}

async function cacheUser(user: UserResponseDto | null) {
  if (user) {
    await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(user)).catch(() => {});
  } else {
    await AsyncStorage.removeItem(USER_CACHE_KEY).catch(() => {});
  }
}

interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    nickname?: string,
    extra?: { gender?: string; language?: string; birthYear?: number },
  ) => Promise<void>;
  logout: () => Promise<void>;
  setAuthFromCallback: (token: string, refreshToken: string, user: UserResponseDto) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (partial: Partial<UserResponseDto>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  setAuthFromCallback: async () => {},
  refreshUser: async () => {},
  updateUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const [token, cached] = await Promise.all([
        getSecureItem('auth_token'),
        AsyncStorage.getItem(USER_CACHE_KEY),
      ]);
      const prevCached = safeParseUser(cached);
      if (prevCached) {
        // Önbellekteki kullanıcıyı hemen göster, doğrulamayı arkada yap.
        setCurrentCacheUserId(prevCached.id);
        setUser(prevCached);
        setIsLoading(false);
      }
      if (!token) {
        setMediaAuthToken(null);
        clearPersistSaveTimer();
        await resetQueryClientForUserChange();
        setCurrentCacheUserId(null);
        setUser(null);
        await cacheUser(null);
        setIsLoading(false);
        return;
      }
      setMediaAuthToken(token);
      try {
        const data = await authControllerGetMe();
        const merged = mergeKeepAvatar(data?.user ?? null, prevCached);
        if (merged?.id) setCurrentCacheUserId(merged.id);
        setUser(merged);
        await cacheUser(merged);
      } catch {
        const refreshed = await tryRefreshTokens();
        if (refreshed) {
          const freshToken = await getSecureItem('auth_token').catch(() => null);
          setMediaAuthToken(freshToken);
          const data = await authControllerGetMe();
          const merged = mergeKeepAvatar(data?.user ?? null, prevCached);
          if (merged?.id) setCurrentCacheUserId(merged.id);
          setUser(merged);
          await cacheUser(merged);
        } else {
          setMediaAuthToken(null);
          clearPersistSaveTimer();
          await resetQueryClientForUserChange();
          await clearAuthTokens();
          setCurrentCacheUserId(null);
          await cacheUser(null);
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    clearPersistSaveTimer();
    await resetQueryClientForUserChange();

    const data = await authControllerLogin({ email, password });
    setCurrentCacheUserId(data.user.id);
    await setSecureItem('auth_token', data.token);
    await setSecureItem('refresh_token', data.refreshToken);
    setMediaAuthToken(data.token);
    await hydrateQueryCache(queryClient, data.user.id);
    setUser(data.user);
    await cacheUser(data.user);
  }, []);

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string,
    nickname?: string,
    extra?: { gender?: string; language?: string; birthYear?: number },
  ) => {
    clearPersistSaveTimer();
    await resetQueryClientForUserChange();

    const data = await authControllerSignup({
      email,
      password,
      name,
      ...(nickname?.trim() ? { nickname: nickname.trim() } : {}),
      ...(extra?.gender ? { gender: extra.gender } : {}),
      ...(extra?.language ? { language: extra.language } : {}),
      ...(extra?.birthYear ? { birthYear: extra.birthYear } : {}),
    } as any);
    setCurrentCacheUserId(data.user.id);
    await setSecureItem('auth_token', data.token);
    await setSecureItem('refresh_token', data.refreshToken);
    setMediaAuthToken(data.token);
    await hydrateQueryCache(queryClient, data.user.id);
    setUser(data.user);
    await cacheUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = await getSecureItem('refresh_token');
      if (refreshToken) {
        await authControllerLogout({ refreshToken }).catch(() => {});
      }
    } finally {
      setMediaAuthToken(null);
      clearPersistSaveTimer();
      await resetQueryClientForUserChange();
      await clearAuthTokens();
      const currentId = userRef.current?.id;
      await cacheUser(null);
      await clearQueryCache(currentId);
      await stopPartnerLocationShare().catch(() => {});
      await AsyncStorage.removeItem('live_alert_seen_ids').catch(() => {});
      await AsyncStorage.removeItem('active_home_module').catch(() => {});
      await AsyncStorage.setItem('partner_location_sharing', '0').catch(() => {});
      await AsyncStorage.removeItem('partner_location_sharing').catch(() => {});
      setUser(null);
    }
  }, []);

  const setAuthFromCallback = useCallback(async (token: string, refreshToken: string, userData: UserResponseDto) => {
    clearPersistSaveTimer();
    await resetQueryClientForUserChange();

    setCurrentCacheUserId(userData.id);
    await setSecureItem('auth_token', token);
    await setSecureItem('refresh_token', refreshToken);
    setMediaAuthToken(token);
    await hydrateQueryCache(queryClient, userData.id);
    setUser(userData);
    await cacheUser(userData);
  }, []);

  const userRef = useRef<UserResponseDto | null>(null);
  userRef.current = user;

  const refreshUser = useCallback(async () => {
    try {
      const data = await authControllerGetMe();
      const next = mergeKeepAvatar(data?.user ?? null, userRef.current);
      setUser(next);
      await cacheUser(next);
    } catch {
      /* çevrimdışı olabiliriz; önbellekteki kullanıcı geçerli kalsın */
    }
  }, []);

  const updateUser = useCallback((partial: Partial<UserResponseDto>) => {
    const prev = userRef.current;
    if (!prev) return;
    const next = { ...prev, ...partial };
    setUser(next);
    void cacheUser(next);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      setAuthFromCallback,
      refreshUser,
      updateUser,
    }),
    [user, isLoading, login, signup, logout, setAuthFromCallback, refreshUser, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
