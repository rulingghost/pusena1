import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { getWellnessData, setWellnessData } from '@/src/utils/wellnessStorage';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { computeGrowth, type Sex } from '@/src/data/whoGrowth';
import { ageInDays, loadBabyProfile, saveBabyProfile, type BabyProfile } from '@/src/data/babyProfile';
import { localDateKey } from '@/src/utils/dateOnly';

const FEATURE_KEY = 'baby_growth_records';

interface GrowthRecord {
  id: string;
  date: string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  headCm: number;
  weightPercentile: number | null;
  lengthPercentile: number | null;
  headPercentile: number | null;
  band: string;
}

export default function PercentileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  if (user?.gender === 'MALE') {
    router.replace('/tabs/home');
    return null;
  }

  const [profile, setProfile] = useState<BabyProfile>({ birthDate: null, sex: 'unknown' });
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [inWeight, setInWeight] = useState('');
  const [inHeight, setInHeight] = useState('');
  const [inHead, setInHead] = useState('');

  useEffect(() => {
    let active = true;
    setLoaded(false);
    Promise.all([
      loadBabyProfile(user?.id),
      getWellnessData<GrowthRecord[]>(FEATURE_KEY, user?.id),
    ]).then(([p, saved]) => {
      if (!active) return;
      setProfile(p);
      setRecords(Array.isArray(saved) ? saved : []);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!loaded) return;
    void setWellnessData(FEATURE_KEY, records, user?.id);
  }, [records, loaded, user?.id]);

  const days = ageInDays(profile.birthDate);
  const ageMonths = days == null ? null : Math.round((days / 30.4375) * 10) / 10;

  const handleAdd = () => {
    const w = parseFloat(inWeight.replace(',', '.'));
    const h = parseFloat(inHeight.replace(',', '.'));
    const hd = parseFloat(inHead.replace(',', '.'));
    if (!profile.birthDate || profile.sex === 'unknown') {
      Alert.alert('Eksik profil', 'Önce doğum tarihi ve cinsiyet girin. DSÖ eğrileri kız/erkek için ayrıdır; uydurma persentil göstermiyoruz.');
      return;
    }
    if (ageMonths == null || ageMonths > 24) {
      Alert.alert('Yaş aralığı', 'Bu tablo 0–24 ay DSÖ standartları içindir.');
      return;
    }
    if (isNaN(w) || w < 1 || w > 25 || isNaN(h) || h < 40 || h > 100) {
      Alert.alert('Geçersiz ölçüm', 'Kilo (kg) ve boy (cm) gerçekçi aralıkta olmalı.');
      return;
    }
    const result = computeGrowth({
      sex: profile.sex as Sex,
      ageMonths,
      weightKg: w,
      heightCm: h,
      headCm: isNaN(hd) ? undefined : hd,
    });
    const rec: GrowthRecord = {
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      ageMonths,
      weightKg: w,
      heightCm: h,
      headCm: isNaN(hd) ? 0 : hd,
      weightPercentile: result.weightPercentile,
      lengthPercentile: result.lengthPercentile,
      headPercentile: result.headPercentile,
      band: result.band,
    };
    setRecords((prev) => [rec, ...prev]);
    setInWeight('');
    setInHeight('');
    setInHead('');
    Alert.alert('Kaydedildi', result.note);
  };

  const latest = records[0];
  const latestResult = latest && profile.sex !== 'unknown'
    ? computeGrowth({ sex: profile.sex as Sex, ageMonths: latest.ageMonths, weightKg: latest.weightKg, heightCm: latest.heightCm, headCm: latest.headCm || undefined })
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Bebek Büyüme & Persentil</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>DSÖ 2006 — sadece girdiğiniz ölçümler</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Bebek profili</Text>
          <Pressable style={[styles.rowBtn, { borderColor: colors.border }]} onPress={() => setShowBirthPicker(true)}>
            <Text style={{ color: colors.textMuted }}>Doğum tarihi</Text>
            <Text style={{ color: colors.text, fontWeight: '700' }}>
              {profile.birthDate ? `${new Date(profile.birthDate + 'T00:00:00').toLocaleDateString('tr-TR')} (${ageMonths ?? '—'} ay)` : 'Seçin'}
            </Text>
          </Pressable>
          <View style={styles.sexRow}>
            {(['girl', 'boy'] as const).map((s) => {
              const sel = profile.sex === s;
              return (
                <Pressable
                  key={s}
                  style={[styles.sexChip, { backgroundColor: sel ? Colors.floTeal : isDark ? '#2D2030' : '#F3F4F6' }]}
                  onPress={async () => {
                    const next = { ...profile, sex: s };
                    setProfile(next);
                    await saveBabyProfile(next, user?.id);
                  }}
                >
                  <Text style={{ color: sel ? '#fff' : colors.text, fontWeight: '700' }}>{s === 'girl' ? 'Kız' : 'Erkek'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {latest && latestResult ? (
          <View style={[styles.summaryCard, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' }]}>
            <Text style={[styles.sumLabel, { color: Colors.floTeal }]}>SON ÖLÇÜM · {latest.ageMonths} ay</Text>
            <Text style={[styles.sumWeight, { color: colors.text }]}>{latest.weightKg} kg</Text>
            <Text style={[styles.note, { color: colors.textSecondary }]}>{latestResult.note}</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#2D2030' : '#FFFFFF' }]}>
                <Text style={[styles.statVal, { color: Colors.floTeal }]}>
                  {latest.weightPercentile != null ? `${latest.weightPercentile}.p` : '—'}
                </Text>
                <Text style={[styles.statLbl, { color: colors.textMuted }]}>Kilo persentil</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#2D2030' : '#FFFFFF' }]}>
                <Text style={[styles.statVal, { color: Colors.floTeal }]}>
                  {latest.lengthPercentile != null ? `${latest.lengthPercentile}.p` : '—'}
                </Text>
                <Text style={[styles.statLbl, { color: colors.textMuted }]}>Boy persentil</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#2D2030' : '#FFFFFF' }]}>
                <Text style={[styles.statVal, { color: Colors.floPink }]}>
                  {latest.headPercentile != null ? `${latest.headPercentile}.p` : '—'}
                </Text>
                <Text style={[styles.statLbl, { color: colors.textMuted }]}>Baş persentil</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Örnek eğri yok. Doğum tarihi, cinsiyet ve kendi tartı/boyunuz olmadan persentil üretilmez.
          </Text>
        )}

        <View style={[styles.addCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.addTitle, { color: colors.text }]}>Bugünün ölçümü</Text>
          <View style={styles.inputsRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inpLabel, { color: colors.textMuted }]}>Kilo (kg)</Text>
              <TextInput style={[styles.inp, { color: colors.text, borderColor: colors.border }]} keyboardType="decimal-pad" value={inWeight} onChangeText={setInWeight} placeholder="3.6" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inpLabel, { color: colors.textMuted }]}>Boy (cm)</Text>
              <TextInput style={[styles.inp, { color: colors.text, borderColor: colors.border }]} keyboardType="decimal-pad" value={inHeight} onChangeText={setInHeight} placeholder="52" placeholderTextColor={colors.textMuted} />
            </View>
          </View>
          <Text style={[styles.inpLabel, { color: colors.textMuted }]}>Baş çevresi (cm, isteğe bağlı)</Text>
          <TextInput style={[styles.inp, { color: colors.text, borderColor: colors.border }]} keyboardType="decimal-pad" value={inHead} onChangeText={setInHead} placeholder="35.5" placeholderTextColor={colors.textMuted} />
          <Pressable style={[styles.addBtn, { backgroundColor: Colors.floTeal }]} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Persentili hesapla ve kaydet</Text>
          </Pressable>
        </View>

        {records.map((r) => (
          <View key={r.id} style={[styles.tableRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowWeight, { color: colors.text }]}>{r.weightKg} kg · {r.heightCm} cm · {r.ageMonths} ay</Text>
              <Text style={[styles.rowHead, { color: colors.textMuted }]}>
                {new Date(r.date).toLocaleDateString('tr-TR')} · kilo {r.weightPercentile ?? '—'}.p · boy {r.lengthPercentile ?? '—'}.p
              </Text>
            </View>
            <Pressable onPress={() => setRecords((prev) => prev.filter((x) => x.id !== r.id))} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <DatePickerModal
        visible={showBirthPicker}
        onClose={() => setShowBirthPicker(false)}
        onSelect={async (d) => {
          const next = { ...profile, birthDate: localDateKey(d) };
          setProfile(next);
          await saveBabyProfile(next, user?.id);
          setShowBirthPicker(false);
        }}
        selectedDate={profile.birthDate ? new Date(profile.birthDate + 'T00:00:00') : new Date()}
        maxDate={new Date()}
        accentColor={Colors.floTeal}
      />
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
  card: { padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  rowBtn: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  sexRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  sexChip: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  summaryCard: { padding: 18, borderRadius: 22, borderWidth: 1, marginBottom: 12 },
  sumLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  sumWeight: { fontSize: 32, fontWeight: '900', marginTop: 2 },
  note: { fontSize: 12.5, lineHeight: 18, marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, padding: 10, borderRadius: 12, alignItems: 'center' },
  statVal: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  statLbl: { fontSize: 10, textAlign: 'center' },
  empty: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  addCard: { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 16 },
  addTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  inputsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  inpLabel: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  inp: { height: 42, borderRadius: 12, borderWidth: 1, paddingHorizontal: 10, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  addBtn: { paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  tableRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8, gap: 8 },
  rowWeight: { fontSize: 14, fontWeight: '800' },
  rowHead: { fontSize: 12, marginTop: 2 },
});
