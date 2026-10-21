import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '@/src/components/BrandLogo';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/theme/useTheme';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { customFetch, getErrorMessage } from '@/src/api/customFetch';
import { getPostAuthRoute } from '@/src/utils/routing';

export default function SetPasswordScreen() {
  const { user, refreshUser, updateUser, logout } = useAuth();
  const { colors } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEn = language === 'en';

  const handleSetPassword = async () => {
    if (!password || !confirmPassword) {
      setError(isEn ? 'Please fill in both password fields' : 'Lütfen her iki şifre alanını da doldurun');
      return;
    }

    if (password.length < 6) {
      setError(isEn ? 'Password must be at least 6 characters' : 'Şifreniz en az 6 karakter olmalıdır');
      return;
    }

    if (password !== confirmPassword) {
      setError(isEn ? 'Passwords do not match' : 'Girdiğiniz şifreler birbiriyle eşleşmiyor');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await customFetch('/api/auth/set-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      // Update in local auth context state
      updateUser({ hasPassword: true });
      await refreshUser().catch(() => {});

      const updatedUser = { ...(user || {}), hasPassword: true } as any;
      router.replace(getPostAuthRoute(updatedUser));
    } catch (e: any) {
      setError(getErrorMessage(e, isEn ? 'Failed to set password' : 'Şifre kaydedilemedi. Lütfen tekrar deneyin.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      isEn ? 'Log out' : 'Çıkış Yap',
      isEn ? 'Are you sure you want to log out and switch account?' : 'Farklı bir hesapla giriş yapmak için çıkış yapmak istiyor musunuz?',
      [
        { text: isEn ? 'Cancel' : 'Vazgeç', style: 'cancel' },
        {
          text: isEn ? 'Log out' : 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BrandLogo size="md" style={{ marginBottom: 16 }} />
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {isEn ? 'Account Security' : 'Hesap Güvenliği'}
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {isEn ? 'Create Your Password' : 'Hesap Şifrenizi Belirleyin'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {isEn
              ? 'To safely sign in to Pusena from all devices and manage your account, please set a password with at least 6 characters.'
              : 'Pusena hesabınıza dilediğiniz zaman tüm cihazlardan e-posta ve şifrenizle giriş yapabilmeniz için lütfen en az 6 karakterli bir şifre belirleyin.'}
          </Text>
        </View>

        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>
              {isEn ? 'New Password' : 'Yeni Şifreniz'}
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={isEn ? 'At least 6 characters' : 'En az 6 karakter'}
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.text }]}>
              {isEn ? 'Confirm Password' : 'Şifrenizi Doğrulayın'}
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={isEn ? 'Re-enter your password' : 'Şifrenizi tekrar girin'}
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={10}>
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.buttonText}>
                  {isEn ? 'Save Password & Continue' : 'Şifremi Kaydet ve Devam Et'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </View>
            )}
          </Pressable>

          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={16} color={colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.logoutText, { color: colors.textMuted }]}>
              {isEn ? 'Log in with a different account' : 'Farklı bir hesapla giriş yap'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 48 },
  header: { alignItems: 'center', marginBottom: 28 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    marginBottom: 12,
  },
  badgeText: { fontSize: 13, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, lineHeight: 21, textAlign: 'center', paddingHorizontal: 16 },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 18,
  },
  errorText: { color: '#B91C1C', fontSize: 14, flex: 1, fontWeight: '500' },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutText: { fontSize: 14, fontWeight: '500' },
});
