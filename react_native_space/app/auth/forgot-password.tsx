import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { customFetch, getErrorMessage } from '@/src/api/customFetch';
import { BrandLogo } from '@/src/components/BrandLogo';

export default function ForgotPasswordScreen() {
  const { colors, isDark } = useTheme();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // 1. Adım: E-postaya 6 Haneli Kod Gönder
  const handleSendCode = async () => {
    setError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Lütfen kayıtlı e-posta adresinizi girin.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Lütfen geçerli bir e-posta adresi yazın.');
      return;
    }

    setIsLoading(true);
    try {
      await customFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      setResendCooldown(60);
      setStep('verify');
    } catch (e) {
      setError(getErrorMessage(e, 'Kod gönderilemedi. Lütfen e-posta adresinizi kontrol edin.'));
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Adım: Kodu Doğrula ve Yeni Şifreyi Kaydet
  const handleResetPassword = async () => {
    setError('');
    const trimmedCode = code.trim();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Lütfen e-posta adresinizi kontrol edin.');
      return;
    }
    if (!trimmedCode || trimmedCode.length < 6) {
      setError('Lütfen e-postanıza gelen 6 haneli doğrulama kodunu eksiksiz girin.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Yeni şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Girdiğiniz yeni şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setIsLoading(true);
    try {
      await customFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          code: trimmedCode,
          newPassword,
        }),
      });

      Alert.alert(
        'Şifreniz Güncellendi ✨',
        'Hesap şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.',
        [{ text: 'Giriş Yap', onPress: () => router.replace('/auth/login') }],
      );
    } catch (e) {
      setError(getErrorMessage(e, 'Şifre sıfırlanamadı. Lütfen kodu veya e-posta adresinizi kontrol edin.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable
        style={styles.back}
        onPress={() => (step === 'verify' ? setStep('request') : router.back())}
        accessibilityRole="button"
        accessibilityLabel="Geri"
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <BrandLogo size="md" style={{ alignSelf: 'center', marginBottom: 20 }} />

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {step === 'request' ? 'Şifremi Unuttum' : 'Yeni Şifre Belirleyin'}
          </Text>

          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            {step === 'request'
              ? 'Pusena hesabınıza kayıtlı e-posta adresinizi girin. Size şifrenizi yenilemeniz için 6 haneli güvenli bir doğrulama kodu göndereceğiz.'
              : `${email} adresine gönderilen 6 haneli kodu ve yeni şifrenizi girerek hesabınızı güvenceye alın.`}
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {step === 'request' ? (
            <View style={styles.form}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>E-posta Adresi</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="ornek@gmail.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <Pressable
                style={[styles.button, { backgroundColor: Colors.primary }]}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="paper-plane-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Doğrulama Kodu Gönder</Text>
                  </>
                )}
              </Pressable>

              <View style={[styles.infoBox, { backgroundColor: isDark ? '#2D1622' : '#FFF0F5' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Kod e-posta kutunuza anında iletilir. Lütfen gereksiz / spam klasörünüzü de kontrol etmeyi unutmayın.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>6 Haneli Doğrulama Kodu</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="key-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.codeInput, { color: colors.text }]}
                  placeholder="123456"
                  placeholderTextColor={colors.textMuted}
                  value={code}
                  onChangeText={(val) => {
                    setCode(val.replace(/[^0-9]/g, ''));
                    setError('');
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <Text style={[styles.label, { color: colors.textSecondary }]}>Yeni Şifre</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="En az 6 karakter"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={(val) => {
                    setNewPassword(val);
                    setError('');
                  }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                </Pressable>
              </View>

              <Text style={[styles.label, { color: colors.textSecondary }]}>Yeni Şifre (Tekrar)</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Şifrenizi tekrar yazın"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    setError('');
                  }}
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={8}>
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                </Pressable>
              </View>

              <Pressable
                style={[styles.button, { backgroundColor: Colors.primary }]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Şifreyi Güncelle ve Giriş Yap</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={[styles.resendBtn, { opacity: resendCooldown > 0 ? 0.6 : 1 }]}
                onPress={resendCooldown > 0 ? undefined : handleSendCode}
                disabled={resendCooldown > 0 || isLoading}
              >
                <Text style={[styles.resendText, { color: Colors.primary }]}>
                  {resendCooldown > 0
                    ? `Kodu tekrar gönder (${resendCooldown}s)`
                    : 'Kod gelmedi mi? Tekrar Gönder'}
                </Text>
              </Pressable>

              <Pressable style={styles.changeEmailBtn} onPress={() => setStep('request')}>
                <Text style={[styles.changeEmailText, { color: colors.textMuted }]}>
                  Farklı bir e-posta adresi dene
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 90, paddingBottom: 40, justifyContent: 'center' },
  back: { position: 'absolute', top: 52, left: 20, zIndex: 10, padding: 8 },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#C96BAE',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  desc: { fontSize: 13.5, lineHeight: 20, marginBottom: 20, textAlign: 'center' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FEE2E2',
  },
  errorText: { color: Colors.danger, fontSize: 13, flex: 1 },
  form: { gap: 10 },
  label: { fontSize: 13, fontWeight: '600', marginLeft: 4, marginBottom: 2 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 8,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  codeInput: { letterSpacing: 8, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  button: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: { color: '#FFF', fontSize: 15.5, fontWeight: '700' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
  },
  infoText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  resendBtn: { marginTop: 14, padding: 8, alignItems: 'center' },
  resendText: { fontSize: 13.5, fontWeight: '600' },
  changeEmailBtn: { marginTop: 4, padding: 8, alignItems: 'center' },
  changeEmailText: { fontSize: 13 },
});
