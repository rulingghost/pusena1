import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { usePeriodControllerHistory } from '@/src/api/generated/api';
import type { CycleHistoryItemDto } from '@/src/api/generated/schemas';
import { customFetch } from '@/src/api/customFetch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { getSymptomInsights } from '@/src/utils/symptomInsights';
import { localDateKey } from '@/src/utils/dateOnly';

import { useAuth } from '@/src/contexts/AuthContext';
import { isMaleUser } from '@/src/utils/gender';

interface SymptomHistoryItem {
  id: string;
  date: string;
  type: string;
  severity: number;
  notes?: string | null;
  createdAt: string;
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const male = isMaleUser(user);

  const [tab, setTab] = useState<'cycles' | 'symptoms'>('cycles');
  const [refreshing, setRefreshing] = useState(false);
  const [endCycleId, setEndCycleId] = useState<string | null>(null);
  const [endCycleStart, setEndCycleStart] = useState<Date>(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);

  React.useEffect(() => {
    if (male) {
      Alert.alert('Erişim Kısıtlandı', 'Döngü geçmişi erkek kullanıcılar için geçerli değildir.');
      router.replace('/tabs/home');
    }
  }, [male, router]);

  const { data: cyclesData, isLoading: cyclesLoading, refetch: refetchCycles } = usePeriodControllerHistory(
    { page: 1, limit: 50 },
    { query: { enabled: !male } },
  );

  const { data: symptomsData, isLoading: symptomsLoading, refetch: refetchSymptoms } = useQuery<{ items: SymptomHistoryItem[]; total: number }>({
    queryKey: ['/api/symptoms/history'],
    queryFn: () => customFetch('/api/symptoms/history'),
    enabled: !male,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCycles(), refetchSymptoms()]);
    setRefreshing(false);
  }, [refetchCycles, refetchSymptoms]);

  const handleDeleteSymptom = (id: string, name: string) => {
    Alert.alert('Semptomu Sil', `"${name}" kaydını silmek istediğinize emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await customFetch(`/api/symptoms/${id}`, { method: 'DELETE' });
            await queryClient.invalidateQueries({ queryKey: ['/api/symptoms/history'] });
            await queryClient.invalidateQueries({ queryKey: ['/api/period/calendar'] });
            refetchSymptoms();
            Alert.alert('Başarılı', 'Semptom silindi.');
          } catch {
            Alert.alert('Hata', 'Silme işlemi başarısız.');
          }
        },
      },
    ]);
  };

  const handleEndCycle = (item: CycleHistoryItemDto) => {
    setEndCycleId(item.id);
    setEndCycleStart(item.startDate ? new Date(item.startDate) : new Date());
    setShowEndPicker(true);
  };

  const saveCycleEnd = async (date: Date) => {
    if (!endCycleId) return;
    const dateStr = localDateKey(date);
    try {
      await customFetch(`/api/period/cycles/${endCycleId}/end`, {
        method: 'PATCH',
        body: JSON.stringify({ date: dateStr }),
      });
      await queryClient.invalidateQueries({ queryKey: ['/api/period/history'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/period'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      refetchCycles();
      Alert.alert('Kaydedildi ✓', 'Regl bitiş tarihi güncellendi.');
    } catch {
      Alert.alert('Hata', 'Bitiş tarihi kaydedilemedi.');
    } finally {
      setShowEndPicker(false);
      setEndCycleId(null);
    }
  };

  const renderCycleItem = ({ item }: { item: CycleHistoryItemDto }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={[styles.dot, { backgroundColor: Colors.period }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.dateRange, { color: colors.text }]}>
          {item?.startDate ? new Date(item.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
          {item?.endDate ? ` - ${new Date(item.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}` : ' - Devam ediyor'}
        </Text>
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Döngü: {item?.cycleLength ?? '-'} gün • Regl: {item?.periodLength ?? '-'} gün
        </Text>
        {!item?.endDate && (
          <Pressable style={[styles.endBtn, { borderColor: Colors.period }]} onPress={() => handleEndCycle(item)}>
            <Ionicons name="calendar-outline" size={14} color={Colors.period} />
            <Text style={[styles.endBtnText, { color: Colors.period }]}>Regl Bitiş Tarihini Gir</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderSymptomItem = ({ item }: { item: SymptomHistoryItem }) => {
    const insights = getSymptomInsights([item.type]);
    const insight = insights[0];
    return (
    <View style={[styles.card, { backgroundColor: colors.card, flexDirection: 'column', alignItems: 'stretch' }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={[styles.dot, { backgroundColor: Colors.warning }]} />
        <View style={{ flex: 1 }}>
          <View style={styles.symptomHeader}>
            <Text style={[styles.symptomType, { color: colors.text }]}>{item.type}</Text>
            <View style={[styles.sevBadge, { backgroundColor: Colors.period + '20' }]}>
              <Text style={{ color: Colors.period, fontWeight: '700', fontSize: 11 }}>Şiddet: {item.severity}/3</Text>
            </View>
          </View>
          <Text style={[styles.symptomDate, { color: colors.textMuted }]}>
            {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
          {item.notes ? <Text style={[styles.symptomNotes, { color: colors.textSecondary }]}>{item.notes}</Text> : null}
        </View>
        <Pressable onPress={() => handleDeleteSymptom(item.id, item.type)} style={styles.deleteBtn} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </Pressable>
      </View>
      {insight && (
        <View style={[styles.insightBox, { backgroundColor: Colors.floTeal + '12', borderColor: Colors.floTeal + '30' }]}>
          <Text style={[styles.insightTitle, { color: Colors.floTeal }]}>💡 {insight.title} — Neden?</Text>
          <Text style={[styles.insightText, { color: colors.textSecondary }]}>{insight.explanation}</Text>
          {insight.tip ? <Text style={[styles.insightTip, { color: colors.textMuted }]}>Öneri: {insight.tip}</Text> : null}
        </View>
      )}
    </View>
  );};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Geçmiş Kayıtlar</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, tab === 'cycles' && { borderBottomColor: Colors.period, borderBottomWidth: 2.5 }]}
          onPress={() => setTab('cycles')}
        >
          <Text style={[styles.tabText, { color: tab === 'cycles' ? Colors.period : colors.textMuted, fontWeight: tab === 'cycles' ? '700' : '500' }]}>
            Döngü Geçmişi ({cyclesData?.total ?? 0})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, tab === 'symptoms' && { borderBottomColor: Colors.period, borderBottomWidth: 2.5 }]}
          onPress={() => setTab('symptoms')}
        >
          <Text style={[styles.tabText, { color: tab === 'symptoms' ? Colors.period : colors.textMuted, fontWeight: tab === 'symptoms' ? '700' : '500' }]}>
            Semptomlar ({symptomsData?.items?.length ?? 0})
          </Text>
        </Pressable>
      </View>

      {tab === 'cycles' ? (
        <FlatList
          data={cyclesData?.items ?? []}
          keyExtractor={(item) => item?.id ?? Math.random().toString()}
          renderItem={renderCycleItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.period} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{cyclesLoading ? 'Yükleniyor...' : 'Henüz döngü kaydı yok'}</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={symptomsData?.items ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderSymptomItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.period} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{symptomsLoading ? 'Yükleniyor...' : 'Henüz kaydedilmiş semptom yok'}</Text>
            </View>
          }
        />
      )}
      <DatePickerModal
        visible={showEndPicker}
        onClose={() => { setShowEndPicker(false); setEndCycleId(null); }}
        onSelect={saveCycleEnd}
        selectedDate={new Date()}
        minDate={endCycleStart}
        maxDate={new Date()}
        accentColor={Colors.period}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 20, fontWeight: '700' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  tabBtn: { paddingVertical: 10, marginRight: 20 },
  tabText: { fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, marginBottom: 10, gap: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dateRange: { fontSize: 15, fontWeight: '600' },
  info: { fontSize: 13, marginTop: 4 },
  symptomHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  symptomType: { fontSize: 15, fontWeight: '600' },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  symptomDate: { fontSize: 12, marginTop: 3 },
  symptomNotes: { fontSize: 13, marginTop: 4 },
  deleteBtn: { padding: 8 },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
  endBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, alignSelf: 'flex-start' },
  endBtnText: { fontSize: 12, fontWeight: '700' },
  insightBox: { marginTop: 12, padding: 12, borderRadius: 10, borderWidth: 1 },
  insightTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  insightText: { fontSize: 12, lineHeight: 18 },
  insightTip: { fontSize: 11, marginTop: 6, fontStyle: 'italic' },
});
