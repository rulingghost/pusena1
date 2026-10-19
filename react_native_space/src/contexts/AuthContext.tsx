import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authControllerLogin, authControllerSignup, authControllerGetMe, authControllerLogout } from '@/src/api/generated/api';
import { tryRefreshTokens, clearAuthTokens } from '@/src/api/customFetch';
import { clearQueryCache } from '@/src/api/queryPersist';
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
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem(USER_CACHE_KEY),
      ]);
      const prevCached = safeParseUser(cached);
      if (prevCached) {
        // Önbellekteki kullanıcıyı hemen göster, doğrulamayı arkada yap.
        setUser(prevCached);
        setIsLoading(false);
      }
      if (!token) {
        setUser(null);
        await cacheUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const data = await authControllerGetMe();
        const merged = mergeKeepAvatar(data?.user ?? null, prevCached);
        setUser(merged);
        await cacheUser(merged);
      } catch {
        const refreshed = await tryRefreshTokens();
        if (refreshed) {
          const data = await authControllerGetMe();
          const merged = mergeKeepAvatar(data?.user ?? null, prevCached);
          setUser(merged);
          await cacheUser(merged);
        } else {
          await clearAuthTokens();
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
    const data = await authControllerLogin({ email, password });
    await AsyncStorage.setItem('auth_token', data.token);
    await AsyncStorage.setItem('refresh_token', data.refreshToken);
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
    const data = await authControllerSignup({
      email,
      password,
      name,
      ...(nickname?.trim() ? { nickname: nickname.trim() } : {}),
      ...(extra?.gender ? { gender: extra.gender } : {}),
      ...(extra?.language ? { language: extra.language } : {}),
      ...(extra?.birthYear ? { birthYear: extra.birthYear } : {}),
    } as any);
    await AsyncStorage.setItem('auth_token', data.token);
    await AsyncStorage.setItem('refresh_token', data.refreshToken);
    setUser(data.user);
    await cacheUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        await authControllerLogout({ refreshToken }).catch(() => {});
      }
    } finally {
      await clearAuthTokens();
      await cacheUser(null);
      await clearQueryCache();
      setUser(null);
    }
  }, []);

  const setAuthFromCallback = useCallback(async (token: string, refreshToken: string, userData: UserResponseDto) => {
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('refresh_token', refreshToken);
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
