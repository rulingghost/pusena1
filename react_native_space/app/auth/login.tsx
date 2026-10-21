import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/theme/useTheme';
import { getErrorMessage, customFetch } from '@/src/api/customFetch';
import { getApiBase } from '@/src/api/apiBase';
import { Colors } from '@/src/theme/colors';
import { getPostAuthRoute } from '@/src/utils/routing';
import type { UserResponseDto, AuthResponseDto } from '@/src/api/generated/schemas';
import { BrandLogo } from '@/src/components/BrandLogo';

export default function LoginScreen() {
  const { login, setAuthFromCallback } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email?.trim() || !password?.trim()) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      router.replace('/');
    } catch (e) {
      setError(getErrorMessage(e, 'Giriş başarısız'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const baseUrl = getApiBase();
      let redirectUri: string;
      if (Platform.OS === 'web') {
        redirectUri = `${window.location.origin}/auth/callback`;
      } else {
        redirectUri = AuthSession.makeRedirectUri();
      }
      const authUrl = new URL('/api/auth/google', baseUrl);
      authUrl.searchParams.set('redirect_uri', redirectUri);

      if (Platform.OS === 'web') {
        window.location.href = authUrl.toString();
      } else {
        const result = await WebBrowser.openAuthSessionAsync(authUrl.toString(), redirectUri);
        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const code = url.searchParams.get('code');
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

          const token = url.searchParams.get('token');
          const refreshToken = url.searchParams.get('refreshToken');
          const userStr = url.searchParams.get('user');
          if (token && refreshToken && userStr) {
            const userData = JSON.parse(decodeURIComponent(userStr)) as UserResponseDto;
            await setAuthFromCallback(token, refreshToken, userData);
            router.replace(getPostAuthRoute(userData));
          }
        }
      }
    } catch (e) {
      setError('Google ile giriş başarısız');
    }
  };

  const handleAppleLogin = async () => {
    try {
      if (Platform.OS === 'ios') {
        const isAvail = await AppleAuthentication.isAvailableAsync().catch(() => false);
        if (!isAvail) {
          setError('Bu cihazda Apple ile Giriş desteklenmiyor.');
          return;
        }

        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        if (!credential.identityToken) {
          setError('Apple kimlik doğrulaması tamamlanamadı.');
          return;
        }

        setIsLoading(true);
        setError('');
        const res = await customFetch<AuthResponseDto>('/api/auth/apple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identityToken: credential.identityToken,
            email: credential.email ?? undefined,
            fullName: credential.fullName
              ? {
                  givenName: credential.fullName.givenName ?? undefined,
                  familyName: credential.fullName.familyName ?? undefined,
                }
              : undefined,
          }),
        });

        if (res?.token && res?.refreshToken && res?.user) {
          await setAuthFromCallback(res.token, res.refreshToken, res.user);
          router.replace(getPostAuthRoute(res.user));
        }
      } else {
        setError('Apple ile Giriş yalnızca iOS cihazlarda desteklenmektedir.');
      }
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') {
        return;
      }
      setError(getErrorMessage(e, 'Apple ile giriş başarısız'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <BrandLogo size="lg" />
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>Kadınlar İçin Yaşam Asistanı</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.welcome, { color: colors.text }]}>Hoş Geldin 💕</Text>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: Colors.danger + '10' }]}>
              <Ionicons name="alert-circle" size={16} color={Colors.danger} />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>E-posta veya Kullanıcı Adı</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="person-outline" size={18} color={Colors.primary + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="E-posta veya kullanıcı adı"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Şifre</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.primary + '80'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
              </Pressable>
            </View>

            <Link href="/auth/forgot-password" asChild>
              <Pressable><Text style={[styles.forgotText, { color: Colors.primary }]}>Şifremi Unuttum</Text></Pressable>
            </Link>

            <Pressable
              style={[styles.button, { backgroundColor: Colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Giriş Yap</Text>}
            </Pressable>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>veya</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {Platform.OS === 'ios' && (
              <Pressable
                style={[styles.appleButton, { backgroundColor: isDark ? '#FFFFFF' : '#000000' }]}
                onPress={handleAppleLogin}
                disabled={isLoading}
              >
                <Ionicons name="logo-apple" size={19} color={isDark ? '#000000' : '#FFFFFF'} />
                <Text style={[styles.appleText, { color: isDark ? '#000000' : '#FFFFFF' }]}>Apple ile Giriş Yap</Text>
              </Pressable>
            )}

            <Pressable style={[styles.googleButton, { borderColor: colors.border, backgroundColor: colors.card }]} onPress={handleGoogleLogin}>
              <Ionicons name="logo-google" size={18} color={isDark ? '#FFF' : '#444'} />
              <Text style={[styles.googleText, { color: colors.text }]}>Google ile Giriş Yap</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>Hesabın yok mu? </Text>
          <Link href="/auth/register" asChild>
            <Pressable><Text style={[styles.footerLink, { color: Colors.primary }]}>Kayıt Ol</Text></Pressable>
          </Link>
        </View>

        <Pressable
          style={{ alignItems: 'center', marginTop: 14 }}
          onPress={() => Linking.openURL('https://pusena-api.onrender.com/privacy')}
        >
          <Text style={{ fontSize: 12, color: colors.textMuted, textDecorationLine: 'underline' }}>
            Gizlilik Politikası & Kullanım Koşulları
          </Text>
        </Pressable>

        {__DEV__ && (
          <Link href="/auth/server" asChild>
            <Pressable style={styles.serverLink}>
              <Ionicons name="settings-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.serverLinkText, { color: colors.textMuted }]}>Sunucu adresi (geliştirme)</Text>
            </Pressable>
          </Link>
        )}

        {/* Decorative Bottom */}
        <View style={styles.decoBottom}>
          <Text style={{ fontSize: 20, opacity: 0.4 }}>🌷</Text>
          <Text style={{ fontSize: 16, opacity: 0.3, marginHorizontal: 8 }}>✿</Text>
          <Text style={{ fontSize: 20, opacity: 0.4 }}>🌸</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  header: { alignItems: 'center', marginBottom: 24 },
  tagline: { fontSize: 13, marginTop: 10, letterSpacing: 0.5 },

  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#C96BAE',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  welcome: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 20 },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderRadius: 12, marginBottom: 12,
  },
  error: { color: Colors.danger, fontSize: 13, flex: 1 },

  form: { gap: 12 },
  label: { fontSize: 13, fontWeight: '600', marginLeft: 4, marginBottom: -4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 16,
    paddingHorizontal: 14, height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  forgotText: { textAlign: 'right', fontSize: 13, fontWeight: '600' },
  button: {
    height: 52, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  demoAdminBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 14, borderWidth: 1,
  },
  demoAdminText: { fontSize: 12 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  appleButton: {
    height: 50, borderRadius: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    marginBottom: 8,
  },
  appleText: { fontSize: 15, fontWeight: '700' },
  googleButton: {
    height: 50, borderRadius: 16, borderWidth: 1,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  googleText: { fontSize: 15, fontWeight: '600' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },

  decoBottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  serverLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 },
  serverLinkText: { fontSize: 12, fontWeight: '600' },
});
