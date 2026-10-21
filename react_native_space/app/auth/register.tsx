import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '@/src/components/BrandLogo';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/theme/useTheme';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { getErrorMessage } from '@/src/api/customFetch';

export default function RegisterScreen() {
  const { signup } = useAuth();
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const genderOptions = [
    { key: 'female', label: t.auth.female, icon: 'female-outline' as const },
    { key: 'male', label: t.auth.male, icon: 'male-outline' as const },
    { key: 'other', label: t.auth.other, icon: 'ellipsis-horizontal-outline' as const },
  ];

  const handleRegister = async () => {
    if (!name?.trim() || !email?.trim() || !password) {
      setError(language === 'en' ? 'Please fill in all fields' : 'Lütfen ad, e-posta ve şifre girin');
      return;
    }
    if (!gender) {
      setError(language === 'en' ? 'Please select your gender' : 'Lütfen cinsiyetinizi seçin');
      return;
    }
    if (password.length < 6) {
      setError(language === 'en' ? 'Password must be at least 6 characters' : 'Şifre en az 6 karakter olmalı');
      return;
    }
    if (!isAgeConfirmed) {
      setError(language === 'en' ? 'You must confirm that you are at least 18 years old' : 'Uygulamayı kullanmak için 18 yaşından büyük olduğunuzu onaylamalısınız');
      return;
    }
    if (!isTermsAccepted) {
      setError(language === 'en' ? 'Please accept the Terms of Service & Privacy Policy' : 'Lütfen Kullanım Koşulları ve Gizlilik Politikası\'nı onaylayın');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await signup(email.trim(), password, name.trim(), undefined, {
        gender,
        language,
      });
      router.replace('/');
    } catch (e) {
      setError(getErrorMessage(e, language === 'en' ? 'Sign up failed' : 'Kayıt başarısız'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BrandLogo size="md" style={{ marginBottom: 12 }} />
          <Text style={[styles.title, { color: colors.text }]}>
            {language === 'en' ? 'Create Account' : 'Hesap Oluştur'}
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={language === 'en' ? 'Your name' : 'Adınız'}
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t.auth.email}
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t.auth.password}
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>{t.auth.gender}</Text>
            <View style={styles.optionRow}>
              {genderOptions.map((g) => {
                const active = gender === g.key;
                return (
                  <Pressable
                    key={g.key}
                    onPress={() => setGender(g.key)}
                    style={[
                      styles.genderChip,
                      { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary + '15' : colors.inputBg },
                    ]}
                  >
                    <Ionicons name={g.icon} size={18} color={active ? colors.primary : colors.textMuted} />
                    <Text style={[styles.genderText, { color: active ? colors.primary : colors.text }]}>{g.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Age and Legal Consent */}
          <View style={styles.consentSection}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setIsAgeConfirmed(!isAgeConfirmed)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isAgeConfirmed }}
            >
              <Ionicons
                name={isAgeConfirmed ? 'checkbox' : 'square-outline'}
                size={22}
                color={isAgeConfirmed ? colors.primary : colors.textMuted}
                style={{ marginRight: 10, marginTop: 1 }}
              />
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                {language === 'en'
                  ? 'I confirm that I am at least 18 years old.'
                  : '18 yaşından büyük olduğumu ve uygulamayı kişisel sağlık takibim için kullandığımı onaylıyorum.'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isTermsAccepted }}
            >
              <Ionicons
                name={isTermsAccepted ? 'checkbox' : 'square-outline'}
                size={22}
                color={isTermsAccepted ? colors.primary : colors.textMuted}
                style={{ marginRight: 10, marginTop: 1 }}
              />
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                {language === 'en' ? (
                  <>
                    I accept the{' '}
                    <Text
                      style={{ color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' }}
                      onPress={() => Linking.openURL('https://pusena-api-live.onrender.com/privacy')}
                    >
                      Terms of Service & Privacy Policy
                    </Text>
                    .
                  </>
                ) : (
                  <>
                    <Text
                      style={{ color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' }}
                      onPress={() => Linking.openURL('https://pusena-api-live.onrender.com/privacy')}
                    >
                      Kullanım Koşulları
                    </Text>{' '}
                    ve{' '}
                    <Text
                      style={{ color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' }}
                      onPress={() => Linking.openURL('https://pusena-api-live.onrender.com/privacy')}
                    >
                      Gizlilik Politikası
                    </Text>
                    'nı okudum, kabul ediyorum.
                  </>
                )}
              </Text>
            </Pressable>
          </View>

          <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t.auth.register}</Text>}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>{t.auth.hasAccount} </Text>
          <Link href="/auth/login" asChild>
            <Pressable><Text style={[styles.footerLink, { color: colors.primary }]}>{t.auth.login}</Text></Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 48 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  error: { color: '#F43F5E', textAlign: 'center', marginBottom: 16, fontSize: 14 },
  form: { gap: 16 },
  section: { gap: 8, marginBottom: 8 },
  sectionLabel: { fontSize: 15, fontWeight: '700' },
  sectionHint: { fontSize: 12, lineHeight: 17 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  langChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, flex: 1,
  },
  langFlag: { fontSize: 18 },
  langText: { fontSize: 14, fontWeight: '600', flex: 1 },
  genderChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5,
  },
  genderText: { fontSize: 13, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, height: 52 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  consentSection: { gap: 12, marginVertical: 6 },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkboxLabel: { flex: 1, fontSize: 13, lineHeight: 18 },
  button: { height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '600' },
});
