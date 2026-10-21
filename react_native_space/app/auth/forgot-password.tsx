import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { customFetch, getErrorMessage } from '@/src/api/customFetch';
import { BrandLogo } from '@/src/components/BrandLogo';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [step, setStep] = useState<'support' | 'reset'>('support');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenEmail = async () => {
    const supportEmail = 'destek@pusena.com';
    const subject = encodeURIComponent('Pusena Şifre Sıfırlama Talebi');
    const body = encodeURIComponent(
      `Merhaba Pusena Destek Ekibi,\n\nHesabımın şifresini unuttum. Lütfen şifremi sıfırlayabilmem için gerekli doğrulama adımlarını kayıtlı e-postama iletiniz.\n\nKayıtlı E-posta Adresim: ${email.trim() || '[Buraya e-posta adresinizi yazınız]'}\n`
    );
    const url = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Destek E-postası 💌',
          `Cihazınızda varsayılan e-posta uygulaması bulunamadı. Lütfen kayıtlı e-posta adresinizden destek@pusena.com adresine "Şifre Sıfırlama Talebi" konulu bir e-posta gönderiniz.`
        );
      }
    } catch {
      Alert.alert('Bilgi', 'Lütfen doğrudan destek@pusena.com adresine e-posta gönderiniz.');
    }
  };

  const handleResetPassword = async () => {
    setError('');
    const trimmedCode = code.trim();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Lütfen kayıtlı e-posta adresinizi girin.');
      return;
    }
    if (!trimmedCode) {
      setError('Lütfen 6 haneli doğrulama kodunu girin.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
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
        'Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.',
        [{ text: 'Giriş Yap', onPress: () => router.replace('/auth/login') }]
      );
    } catch (e) {
      setError(getErrorMessage(e, 'Şifre sıfırlanamadı. Lütfen kodu kontrol edin.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.back} onPress={() => (step === 'reset' ? setStep('support') : router.back())}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <BrandLogo size="sm" style={{ alignSelf: 'center', marginBottom: 20 }} />
        <Text style={[styles.title, { color: colors.text }]}>
          {step === 'support' ? 'Şifremi Unuttum' : 'Yeni Şifre Belirleyin'}
        </Text>

        {step === 'support' ? (
          <>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Hesap ve sağlık verilerinizin güvenliği gereğince şifre sıfırlama işlemleri doğrudan destek ekibimiz üzerinden yürütülmektedir.
            </Text>

            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Kayıtlı e-posta adresiniz"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleOpenEmail}
            >
              <Ionicons name="mail" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Destek Ekibine Yaz (destek@pusena.com)</Text>
            </Pressable>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Talebiniz incelendikten sonra doğrulama kodunuz kayıtlı e-postanıza iletilir.
              </Text>
            </View>

            <Pressable style={styles.codeSwitchBtn} onPress={() => setStep('reset')}>
              <Text style={[styles.codeSwitchText, { color: colors.primary }]}>
                Destek ekibinden kod aldınız mı? <Text style={{ fontWeight: '700' }}>Kodu Girin</Text>
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Destek ekibimiz tarafından iletilen 6 haneli kodu ve yeni şifrenizi girin.
            </Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Kayıtlı e-posta adresiniz"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="key-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, letterSpacing: 4, fontWeight: '700' }]}
                placeholder="6 haneli kod"
                placeholderTextColor={colors.textMuted}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Yeni şifreniz (en az 6 karakter)"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Yeni şifrenizi doğrulayın"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Şifreyi Sıfırla ve Kaydet</Text>}
            </Pressable>

            <Pressable style={styles.resendBtn} onPress={() => setStep('support')}>
              <Text style={[styles.resendText, { color: colors.primary }]}>Destek Bilgilerine Geri Dön</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 100, justifyContent: 'center' },
  back: { position: 'absolute', top: 56, left: 24, zIndex: 10, padding: 8 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  desc: { fontSize: 14, lineHeight: 20, marginBottom: 20, textAlign: 'center' },
  error: { color: '#F43F5E', marginBottom: 16, fontSize: 13, textAlign: 'center', backgroundColor: '#FEE2E2', padding: 8, borderRadius: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 52, marginBottom: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  button: { height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8, flexDirection: 'row' },
  buttonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  infoBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginTop: 16, backgroundColor: 'rgba(236, 72, 153, 0.08)' },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
  codeSwitchBtn: { marginTop: 20, padding: 8, alignItems: 'center' },
  codeSwitchText: { fontSize: 14 },
  resendBtn: { marginTop: 16, padding: 8, alignItems: 'center' },
  resendText: { fontSize: 14, fontWeight: '600' },
});
