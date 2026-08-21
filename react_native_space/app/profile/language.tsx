import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { LANGUAGES, type Language } from '@/src/i18n/translations';

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const handleSelect = (code: Language) => {
    if (code === language) return;
    setLanguage(code);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>{t.profile.language}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {language === 'en' ? 'App and content language' : 'Uygulama ve içerik dili'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.infoCard, { backgroundColor: Colors.primary + '10', borderColor: Colors.primary + '25' }]}>
          <Ionicons name="information-circle-outline" size={19} color={Colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>{t.auth.languageHint}</Text>
        </View>

        {LANGUAGES.map((l) => {
          const active = language === l.code;
          return (
            <Pressable
              key={l.code}
              onPress={() => handleSelect(l.code)}
              style={[
                styles.row,
                {
                  backgroundColor: colors.card,
                  borderColor: active ? Colors.primary : colors.border,
                  borderWidth: active ? 1.8 : 1,
                },
              ]}
            >
              <Text style={styles.flag}>{l.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{l.nativeLabel}</Text>
                <Text style={[styles.rowSub, { color: colors.textMuted }]}>{l.label}</Text>
              </View>
              {active ? (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              ) : (
                <Ionicons name="ellipse-outline" size={24} color={colors.border} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  scroll: { padding: 20, gap: 12 },
  infoCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 4,
  },
  infoText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18 },
  flag: { fontSize: 28 },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  rowSub: { fontSize: 12, marginTop: 2 },
});
