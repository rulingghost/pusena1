import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { usePregnancyControllerGetWeekContent } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';

export default function WeekDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { weekNumber = '' } = useLocalSearchParams();
  const wn = Number(weekNumber) || 1;
  const { data, isLoading } = usePregnancyControllerGetWeekContent(wn);

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{wn}. Hafta</Text>
          <View style={{ width: 32 }} />
        </View>

        {data ? (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: Colors.pregnancy }]}>{data.title ?? ''}</Text>

            <View style={styles.sizeRow}>
              <View style={[styles.sizeBox, { backgroundColor: Colors.pregnancy + '10' }]}>
                <Text style={[styles.sizeLabel, { color: colors.textMuted }]}>Boy</Text>
                <Text style={[styles.sizeValue, { color: Colors.pregnancy }]}>{data.babySize ?? '-'}</Text>
              </View>
              <View style={[styles.sizeBox, { backgroundColor: Colors.pregnancy + '10' }]}>
                <Text style={[styles.sizeLabel, { color: colors.textMuted }]}>Kilo</Text>
                <Text style={[styles.sizeValue, { color: Colors.pregnancy }]}>{data.babyWeight ?? '-'}</Text>
              </View>
            </View>

            <Section title="Bebek Gelişimi" text={data.babyDevelopment} colors={colors} />
            <Section title="Organ Gelişimi" text={data.organDevelopment} colors={colors} />
            <Section title="Anne Değişiklikleri" text={data.motherChanges} colors={colors} />

            {(data.commonSymptoms?.length ?? 0) > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Yaygın Belirtiler</Text>
                <View style={styles.chipRow}>
                  {(data.commonSymptoms ?? []).map((s, i) => (
                    <View key={i} style={[styles.symptomChip, { backgroundColor: Colors.period + '12' }]}>
                      <Text style={{ color: Colors.period, fontSize: 13 }}>{s}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {(data.tips?.length ?? 0) > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>İpuçları</Text>
                {(data.tips ?? []).map((t, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={[styles.tipText, { color: colors.textSecondary }]}>{t}</Text>
                  </View>
                ))}
              </>
            )}

            {(data.warnings?.length ?? 0) > 0 && (
              <View style={[styles.warningBox, { backgroundColor: Colors.danger + '10' }]}>
                <Ionicons name="warning" size={18} color={Colors.danger} />
                {(data.warnings ?? []).map((w, i) => (
                  <Text key={i} style={[styles.warningText, { color: Colors.danger }]}>{w}</Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Bu hafta için içerik bulunamadı.</Text>
        )}

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          Bu genel bilgilendirme amaçlıdır, doktor tavsiyesi değildir.
        </Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function Section({ title, text, colors }: { title: string; text?: string; colors: any }) {
  if (!text) return null;
  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{text}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700' },
  card: { borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  sizeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  sizeBox: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  sizeLabel: { fontSize: 12, marginBottom: 4 },
  sizeValue: { fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  sectionText: { fontSize: 14, lineHeight: 21 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tipRow: { flexDirection: 'row', gap: 8, marginBottom: 6, alignItems: 'flex-start' },
  tipText: { flex: 1, fontSize: 14, lineHeight: 20 },
  warningBox: { padding: 14, borderRadius: 12, marginTop: 16, gap: 6 },
  warningText: { fontSize: 13, lineHeight: 18 },
  disclaimer: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  emptyText: { fontSize: 15, textAlign: 'center', marginTop: 40 },
});
