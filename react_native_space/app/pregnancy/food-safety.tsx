import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';
import { usePregnancyControllerGet } from '@/src/api/generated/api';
import { useAssessment } from '@/src/api/bloomClient';
import { ageInDays, loadBabyProfile } from '@/src/data/babyProfile';
import {
  FOOD_SAFETY_CATALOG,
  describeStage,
  resolveFood,
  type LifeStage,
} from '@/src/data/foodSafety';

export default function FoodSafetyScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: preg } = usePregnancyControllerGet({ query: { retry: false } });
  const { data: assessment } = useAssessment();
  const [birthDays, setBirthDays] = React.useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'safe' | 'caution' | 'danger'>('all');

  React.useEffect(() => {
    loadBabyProfile().then((p) => setBirthDays(ageInDays(p.birthDate)));
  }, []);

  const stage: LifeStage = useMemo(() => {
    if (birthDays != null && birthDays >= 0 && birthDays <= 42) return 'postpartum';
    if (preg?.isActive) {
      const w = preg.currentWeek ?? 1;
      if (w <= 13) return 'pregnancy_t1';
      if (w <= 27) return 'pregnancy_t2';
      return 'pregnancy_t3';
    }
    if (assessment?.goal === 'ttc') return 'ttc';
    return 'cycle';
  }, [preg, assessment, birthDays]);

  const meta = describeStage(stage);

  const rows = FOOD_SAFETY_CATALOG.map((f) => {
    const r = resolveFood(f, stage);
    return { ...f, status: r.status, reason: r.reason };
  }).filter((f) => {
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    const q = search.trim().toLowerCase();
    if (q && !f.name.toLowerCase().includes(q) && !f.category.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Besin Güvenliği</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{meta.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroFoodCard}>
          <Image source={AppImages.pregnancyNutritionPlate} style={styles.heroFoodImg} resizeMode="cover" />
        </View>
        <View style={[styles.banner, { backgroundColor: isDark ? '#2D1F32' : '#FFF7ED', borderColor: '#F59E0B40' }]}>
          <Text style={[styles.bannerTitle, { color: colors.text }]}>{meta.title}</Text>
          <Text style={[styles.bannerBody, { color: colors.textSecondary }]}>{meta.subtitle}</Text>
          <Text style={[styles.bannerBody, { color: colors.textMuted, marginTop: 6 }]}>
            Kaynak mantığı: listeria/toksoplazma/kafein/cıva — gebelik kaydı, lohusa günü veya TTC değerlendirmeniz yoksa gebelik yasağı uydurulmaz.
          </Text>
        </View>

        <View style={[styles.searchBar, { backgroundColor: isDark ? colors.card : '#F3F4F6', borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Besin ara"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filterRow}>
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'safe', label: 'Uygun' },
            { key: 'caution', label: 'Sınırlı' },
            { key: 'danger', label: 'Kaçının' },
          ].map((item) => {
            const isSel = filterStatus === item.key;
            return (
              <Pressable
                key={item.key}
                style={[styles.filterChip, { backgroundColor: isSel ? Colors.floPink : isDark ? colors.card : '#F3F4F6' }]}
                onPress={() => setFilterStatus(item.key as any)}
              >
                <Text style={[styles.filterChipText, { color: isSel ? '#FFFFFF' : colors.text }]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {rows.map((food) => {
          const isSafe = food.status === 'safe';
          const isCaution = food.status === 'caution';
          const badgeBg = isSafe ? '#DCFCE7' : isCaution ? '#FEF3C7' : '#FEE2E2';
          const badgeColor = isSafe ? '#16A34A' : isCaution ? '#D97706' : '#DC2626';
          const badgeLabel = isSafe ? 'UYGUN' : isCaution ? 'SINIRLI' : 'KAÇININ';
          return (
            <View key={food.id} style={[styles.foodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardTop}>
                <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.statusBadgeText, { color: badgeColor }]}>{badgeLabel}</Text>
                </View>
                <Text style={[styles.catLabel, { color: colors.textMuted }]}>{food.category}</Text>
              </View>
              <Text style={[styles.foodName, { color: colors.text }]}>{food.name}</Text>
              <Text style={[styles.foodReason, { color: colors.textSecondary }]}>{food.reason}</Text>
            </View>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 10 },
  heroFoodCard: { width: '100%', height: 140, borderRadius: 20, overflow: 'hidden', marginVertical: 6 },
  heroFoodImg: { width: '100%', height: '100%' },
  banner: { padding: 14, borderRadius: 16, borderWidth: 1 },
  bannerTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  bannerBody: { fontSize: 12.5, lineHeight: 18 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 44, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 13 },
  filterRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  filterChipText: { fontSize: 12, fontWeight: '700' },
  foodCard: { padding: 16, borderRadius: 18, borderWidth: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '900' },
  catLabel: { fontSize: 11, fontWeight: '600' },
  foodName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  foodReason: { fontSize: 13, lineHeight: 18 },
});
