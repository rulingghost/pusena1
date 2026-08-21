import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { getApiBase, getDefaultApiBase, normalizeApiBase, pingApiBase, setApiBase } from '@/src/api/apiBase';

type Status = { ok: boolean; text: string } | null;

export default function ServerSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();

  const [value, setValue] = useState('');
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    setValue(getApiBase());
  }, []);

  const test = async () => {
    setChecking(true);
    setStatus(null);
    const target = normalizeApiBase(value);
    const ok = await pingApiBase(target);
    setStatus(
      ok
        ? { ok: true, text: 'Sunucuya ulaşıldı. Kaydedip giriş yapabilirsiniz.' }
        : { ok: false, text: 'Ulaşılamadı. Adresi ve sunucunun açık olduğunu kontrol edin.' },
    );
    setChecking(false);
  };

  const save = async () => {
    const saved = await setApiBase(value);
    setValue(saved);
    setStatus({ ok: true, text: 'Adres kaydedildi.' });
    router.replace('/auth/login');
  };

  const reset = async () => {
    const saved = await setApiBase('');
    setValue(saved);
    setStatus(null);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Sunucu adresi</Text>
        </View>

        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Normal kullanımda bu ekran gerekmez; adres uygulamaya gömülüdür. Burası yalnızca
          geliştirme ve destek içindir.
        </Text>

        <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="link-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="https://ornek-adres.ngrok-free.app"
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={setValue}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          {value.length > 0 && (
            <Pressable onPress={() => setValue('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {status && (
          <View
            style={[
              styles.statusBox,
              {
                backgroundColor: (status.ok ? Colors.success : Colors.danger) + '12',
                borderColor: (status.ok ? Colors.success : Colors.danger) + '30',
              },
            ]}
          >
            <Ionicons
              name={status.ok ? 'checkmark-circle' : 'alert-circle'}
              size={18}
              color={status.ok ? Colors.success : Colors.danger}
            />
            <Text style={[styles.statusText, { color: colors.text }]}>{status.text}</Text>
          </View>
        )}

        <Pressable
          style={[styles.secondaryBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={test}
          disabled={checking || !value.trim()}
        >
          {checking ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={[styles.secondaryText, { color: colors.text }]}>Bağlantıyı test et</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: value.trim() ? Colors.primary : colors.border }]}
          onPress={save}
          disabled={!value.trim()}
        >
          <Text style={styles.buttonText}>Kaydet</Text>
        </Pressable>

        <Pressable onPress={reset} style={styles.resetBtn}>
          <Text style={[styles.resetText, { color: colors.textMuted }]}>
            Varsayılana dön ({getDefaultApiBase()})
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: { fontSize: 20, fontWeight: '800' },
  hint: { fontSize: 13, lineHeight: 19, marginBottom: 18 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '600' },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  statusText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  secondaryBtn: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  secondaryText: { fontSize: 15, fontWeight: '700' },
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  resetBtn: { alignItems: 'center', paddingVertical: 16 },
  resetText: { fontSize: 12.5, fontWeight: '600' },
});
