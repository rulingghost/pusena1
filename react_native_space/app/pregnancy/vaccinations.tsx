import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { TURKEY_VACCINES, vaccineStatus } from '@/src/data/turkeyVaccines';
import { ageInDays, loadBabyProfile, saveBabyProfile, type BabyProfile } from '@/src/data/babyProfile';
import { localDateKey } from '@/src/utils/dateOnly';

const DONE_KEY = 'baby_vaccines_done_ids';

export default function VaccinationsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [profile, setProfile] = useState<BabyProfile>({ birthDate: null, sex: 'unknown' });
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'due' | 'done'>('all');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadBabyProfile().then(setProfile);
    AsyncStorage.getItem(DONE_KEY).then((raw) => {
      if (!raw) return;
      try { setDoneIds(JSON.parse(raw)); } catch { /* ignore */ }
    });
  }, []);

  const days = ageInDays(profile.birthDate);

  const persistDone = (ids: string[]) => {
    setDoneIds(ids);
    AsyncStorage.setItem(DONE_KEY, JSON.stringify(ids));
  };

  const toggle = (id: string) => {
    persistDone(doneIds.includes(id) ? doneIds.filter((x) => x !== id) : [...doneIds, id]);
  };

  const onPickBirth = async (date: Date) => {
    const next = { ...profile, birthDate: localDateKey(date) };
    setProfile(next);
    await saveBabyProfile(next);
    setShowPicker(false);
  };

  const completedCount = TURKEY_VACCINES.filter((v) => doneIds.includes(v.id)).length;
  const percent = Math.round((completedCount / TURKEY_VACCINES.length) * 100);

  const filtered = useMemo(() => {
    return TURKEY_VACCINES.filter((v) => {
      const done = doneIds.includes(v.id);
      if (filter === 'done') return done;
      if (filter === 'due') return !done && (days == null || vaccineStatus(v, days) !== 'later');
      return true;
    });
  }, [filter, doneIds, days]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Bebek Aşı Takvimi 💉</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>T.C. Sağlık Bakanlığı — gün gün şema</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroHealthCard}>
          <Image source={AppImages.babyHealthCare} style={styles.heroHealthImg} resizeMode="cover" />
        </View>

        <Pressable style={[styles.birthCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowPicker(true)}>
          <Ionicons name="calendar" size={20} color={Colors.floTeal} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.birthLabel, { color: colors.textMuted }]}>BEBEĞİN DOĞUM TARİHİ</Text>
            <Text style={[styles.birthValue, { color: colors.text }]}>
              {profile.birthDate
                ? `${new Date(profile.birthDate + 'T00:00:00').toLocaleDateString('tr-TR')}  •  ${days} günlük`
                : 'Tarih girin — aşılar kaçıncı günde olduğuyla listelenir'}
            </Text>
          </View>
          <Ionicons name="pencil" size={16} color={colors.textMuted} />
        </Pressable>

        {showPicker && (
          <DatePickerModal
            visible={showPicker}
            onClose={() => setShowPicker(false)}
            onSelect={onPickBirth}
            selectedDate={profile.birthDate ? new Date(profile.birthDate + 'T00:00:00') : new Date()}
            maxDate={new Date()}
            accentColor={Colors.floTeal}
          />
        )}

        <View style={[styles.progressCard, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' }]}>
          <View style={styles.progTop}>
            <View>
              <Text style={[styles.progTitle, { color: Colors.floTeal }]}>Tamamlanan kayıtlarınız</Text>
              <Text style={[styles.progSub, { color: colors.textSecondary }]}>
                {completedCount} / {TURKEY_VACCINES.length} doz işaretlendi
              </Text>
            </View>
            <Text style={[styles.progPercent, { color: Colors.floTeal }]}>%{percent}</Text>
          </View>
          <View style={[styles.barTrack, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]}>
            <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: Colors.floTeal }]} />
          </View>
        </View>

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          Rutin program: doğumda Hep B; ~30. gün Hep B 2; ~60. gün BCG + 5’li karma + KPA; ~120. gün karma + KPA 2; ~180. gün karma + KPA 3 + Hep B 3 + OPA; 12. ay KKK + KPA rapel + suçiçeği + Hep A; 18. ay karma rapel + OPA 2 + Hep A 2. 9. ay KKK ek dozu salgın kararına bağlıdır. Kaçırılan doz için aile hekiminiz “kaçırılan doz şeması” uygular. Bu liste tanı/tedavi değildir.
        </Text>

        <View style={styles.filterRow}>
          {[
            { key: 'all', label: 'Tüm dozlar' },
            { key: 'due', label: 'Sıradaki / geçmiş' },
            { key: 'done', label: 'Yapıldı işaretli' },
          ].map((f) => {
            const isSel = filter === f.key;
            return (
              <Pressable
                key={f.key}
                style={[styles.filterChip, { backgroundColor: isSel ? Colors.floTeal : isDark ? colors.card : '#F3F4F6' }]}
                onPress={() => setFilter(f.key as any)}
              >
                <Text style={[styles.filterText, { color: isSel ? '#FFFFFF' : colors.text }]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.list}>
          {filtered.map((item) => {
            const done = doneIds.includes(item.id);
            const st = vaccineStatus(item, days);
            const badge =
              done ? 'YAPILDI' :
              st === 'due' ? 'BU ARALIKTA' :
              st === 'upcoming' ? 'YAKINDA' :
              st === 'passed' ? 'TARİHİ GEÇTİ' : 'HENÜZ DEĞİL';
            const badgeColor = done ? Colors.floTeal : st === 'due' ? Colors.floPink : st === 'passed' ? '#D97706' : colors.textMuted;

            return (
              <Pressable
                key={item.id}
                style={[styles.vaccineCard, { backgroundColor: colors.card, borderColor: colors.border }, done && { opacity: 0.85 }]}
                onPress={() => toggle(item.id)}
                onLongPress={() => Alert.alert(item.name, item.notes)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.monthBadge, { backgroundColor: badgeColor + '18' }]}>
                    <Text style={[styles.monthText, { color: badgeColor }]}>{item.ageLabel}</Text>
                  </View>
                  <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={done ? Colors.floTeal : colors.textMuted} />
                </View>
                <Text style={[styles.vaccineName, { color: colors.text }]}>{item.name} · {item.doseLabel}</Text>
                <Text style={[styles.ageDetail, { color: Colors.floTeal }]}>{item.ageDetail}</Text>
                <Text style={[styles.protectsText, { color: Colors.floPink }]}>Koruduğu: {item.protectsAgainst}</Text>
                <Text style={[styles.vaccineDesc, { color: colors.textSecondary }]}>{item.how}</Text>
                <Text style={[styles.site, { color: colors.textMuted }]}>Uygulama yeri: {item.site}{item.optional ? ' · Salgın / hekim kararı' : ''}</Text>
                <Text style={[styles.notes, { color: colors.textSecondary }]}>{item.notes}</Text>
                <Text style={[styles.tapHint, { color: colors.textMuted }]}>Kısa dokunuş: yaptım işaretle · uzun bas: özet</Text>
              </Pressable>
            );
          })}
        </View>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroHealthCard: { width: '100%', height: 140, borderRadius: 20, overflow: 'hidden', marginVertical: 10 },
  heroHealthImg: { width: '100%', height: '100%' },
  birthCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  birthLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  birthValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  progressCard: { padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 10 },
  progTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  progTitle: { fontSize: 15, fontWeight: '800' },
  progSub: { fontSize: 12, marginTop: 2 },
  progPercent: { fontSize: 24, fontWeight: '900' },
  barTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  disclaimer: { fontSize: 11.5, lineHeight: 17, marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14 },
  filterText: { fontSize: 12, fontWeight: '700' },
  list: { gap: 10 },
  vaccineCard: { padding: 16, borderRadius: 18, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  monthBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, maxWidth: '85%' },
  monthText: { fontSize: 11, fontWeight: '800' },
  vaccineName: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  ageDetail: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  protectsText: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  vaccineDesc: { fontSize: 12.5, lineHeight: 17 },
  site: { fontSize: 11, marginTop: 6, fontWeight: '600' },
  notes: { fontSize: 12, lineHeight: 17, marginTop: 6 },
  tapHint: { fontSize: 10, marginTop: 8 },
});
