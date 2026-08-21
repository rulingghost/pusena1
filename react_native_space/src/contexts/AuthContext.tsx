import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authControllerLogin, authControllerSignup, authControllerGetMe, authControllerLogout } from '@/src/api/generated/api';
import { tryRefreshTokens, clearAuthTokens } from '@/src/api/customFetch';
import type { UserResponseDto } from '@/src/api/generated/schemas';

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
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await authControllerGetMe();
        setUser(data?.user ?? null);
      } catch {
        const refreshed = await tryRefreshTokens();
        if (refreshed) {
          const data = await authControllerGetMe();
          setUser(data?.user ?? null);
        } else {
          await clearAuthTokens();
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
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        await authControllerLogout({ refreshToken }).catch(() => {});
      }
    } finally {
      await clearAuthTokens();
      setUser(null);
    }
  }, []);

  const setAuthFromCallback = useCallback(async (token: string, refreshToken: string, userData: UserResponseDto) => {
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    setUser(userData);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authControllerGetMe();
      setUser(data?.user ?? null);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        setAuthFromCallback,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
