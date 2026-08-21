import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { usePregnancyControllerGetAllWeeks, usePregnancyControllerGet } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import type { WeekSummaryDto } from '@/src/api/generated/schemas';

export default function WeeksScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { data, isLoading } = usePregnancyControllerGetAllWeeks();
  const { data: preg } = usePregnancyControllerGet();
  const currentWeek = preg?.currentWeek ?? 0;

  if (isLoading) return <LoadingScreen />;

  const renderWeek = ({ item }: { item: WeekSummaryDto }) => {
    const isCurrent = item?.weekNumber === currentWeek;
    const isPast = (item?.weekNumber ?? 0) < currentWeek;
    return (
      <Pressable
        style={[styles.weekCard, { backgroundColor: isCurrent ? Colors.pregnancy + '15' : colors.card, borderColor: isCurrent ? Colors.pregnancy : colors.border }]}
        onPress={() => router.push(`/pregnancy/${item?.weekNumber}`)}
      >
        <View style={[styles.weekBadge, { backgroundColor: isCurrent ? Colors.pregnancy : isPast ? Colors.success + '20' : colors.inputBg }]}>
          <Text style={[styles.weekBadgeText, { color: isCurrent ? '#fff' : isPast ? Colors.success : colors.textMuted }]}>{item?.weekNumber}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.weekTitle, { color: colors.text }]}>{item?.title ?? `Hafta ${item?.weekNumber}`}</Text>
          <Text style={[styles.weekSize, { color: colors.textSecondary }]}>{item?.babySize ?? ''}</Text>
        </View>
        {isCurrent && <View style={[styles.currentTag, { backgroundColor: Colors.pregnancy }]}><Text style={styles.currentTagText}>Şu an</Text></View>}
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Tüm Haftalar</Text>
        <View style={{ width: 32 }} />
      </View>
      <FlatList
        data={data?.weeks ?? []}
        keyExtractor={(item) => String(item?.weekNumber ?? Math.random())}
        renderItem={renderWeek}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 20, fontWeight: '700' },
  weekCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8, gap: 12 },
  weekBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  weekBadgeText: { fontSize: 14, fontWeight: '700' },
  weekTitle: { fontSize: 14, fontWeight: '600' },
  weekSize: { fontSize: 12, marginTop: 2 },
  currentTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  currentTagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
