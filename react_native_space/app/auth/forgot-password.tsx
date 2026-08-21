import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { authControllerForgotPassword } from '@/src/api/generated/api';
import { getErrorMessage } from '@/src/api/customFetch';
import { BrandLogo } from '@/src/components/BrandLogo';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email?.trim()) { setError('E-posta adresinizi girin'); return; }
    setIsLoading(true); setError('');
    try {
      await authControllerForgotPassword({ email: email.trim() });
      setSent(true);
    } catch (e) { setError(getErrorMessage(e, 'Hata oluştu')); }
    finally { setIsLoading(false); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <BrandLogo size="sm" style={{ alignSelf: 'center', marginBottom: 16 }} />
      <Text style={[styles.title, { color: colors.text }]}>Şifremi Unuttum</Text>
      {sent ? (
        <Text style={[styles.success, { color: colors.success }]}>Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.</Text>
      ) : (
        <>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <TextInput style={[styles.input, { color: colors.text }]} placeholder="E-posta" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sıfırlama Bağlantısı Gönder</Text>}
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  back: { position: 'absolute', top: 60, left: 24, zIndex: 1 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  desc: { fontSize: 14, marginBottom: 24 },
  error: { color: '#F43F5E', marginBottom: 16, fontSize: 14 },
  success: { fontSize: 16, marginBottom: 24 },
  inputContainer: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, height: 52, justifyContent: 'center', marginBottom: 16 },
  input: { fontSize: 16 },
  button: { height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
