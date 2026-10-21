import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { getWellnessData, setWellnessData } from '@/src/utils/wellnessStorage';

interface WeightEntry {
  id: string;
  week: number;
  weight: number;
  date: string;
}

export default function WeightTrackerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  if (user?.gender === 'MALE') {
    router.replace('/tabs/home');
    return null;
  }

  const [prePregnancyWeight, setPrePregnancyWeight] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [currentWeekInput, setCurrentWeekInput] = useState<string>('');
  const [entries, setEntries] = useState<WeightEntry[]>([]);

  useEffect(() => {
    let active = true;
    getWellnessData<WeightEntry[]>('weight_entries', user?.id).then((saved) => {
      if (active && Array.isArray(saved)) {
        setEntries(saved);
      }
    });
    getWellnessData<number>('pre_pregnancy_weight', user?.id).then((w) => {
      if (active && typeof w === 'number') {
        setPrePregnancyWeight(w);
      }
    });
    return () => {
      active = false;
    };
  }, [user?.id]);

  const saveEntries = (updated: WeightEntry[]) => {
    setEntries(updated);
    void setWellnessData('weight_entries', updated, user?.id);
  };

  const handleAddWeight = () => {
    const w = parseFloat(currentInput.replace(',', '.'));
    const wk = parseInt(currentWeekInput, 10);
    if (isNaN(w) || isNaN(wk) || w <= 0 || wk <= 0) {
      Alert.alert('Geçersiz Değer', 'Lütfen geçerli kilo ve hafta değeri girin.');
      return;
    }

    if (prePregnancyWeight <= 0) {
      setPrePregnancyWeight(w);
      void setWellnessData('pre_pregnancy_weight', w, user?.id);
    }

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      week: wk,
      weight: w,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    };

    const updated = [newEntry, ...entries.filter((e) => e.week !== wk)].sort((a, b) => b.week - a.week);
    saveEntries(updated);
    setCurrentInput('');
    Alert.alert('Kaydedildi! ⚖️', `${wk}. hafta kilonuz ${w} kg olarak kaydedildi.`);
  };

  const hasData = entries.length > 0 || prePregnancyWeight > 0;
  const latestWeight = entries.length > 0 ? entries[0].weight : (prePregnancyWeight > 0 ? prePregnancyWeight : null);
  const totalGain = prePregnancyWeight > 0 && latestWeight != null
    ? parseFloat((latestWeight - prePregnancyWeight).toFixed(1))
    : null;

  const handleDeleteEntry = (id: string, week: number) => {
    Alert.alert(
      'Kaydı Sil',
      `${week}. hafta kilo kaydını silmek istediğinize emin misiniz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const updated = entries.filter((e) => e.id !== id);
            saveEntries(updated);
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Kilo & Gelişim Takipçisi ⚖️</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Haftalık Sağlıklı Kilo Takibi</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: isDark ? '#2D1F32' : '#FFF0F6', borderColor: Colors.floPink + '30' }]}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>TOPLAM DEĞİŞİM</Text>
              <Text style={[styles.summaryBig, { color: Colors.floPink }]}>
                {totalGain != null ? `${totalGain >= 0 ? '+' : ''}${totalGain} kg` : '—'}
              </Text>
            </View>
            <View style={[styles.bmiPill, { backgroundColor: hasData ? Colors.floTealLight : (isDark ? '#3D2032' : '#F3F4F6') }]}>
              <Text style={[styles.bmiPillText, { color: hasData ? Colors.floTeal : colors.textMuted }]}>
                {hasData ? 'Genel Referans: 11-16 kg' : 'Henüz Veri Yok'}
              </Text>
            </View>
          </View>

          <View style={styles.weightStatsRow}>
            <View style={[styles.wStatBox, { backgroundColor: isDark ? '#3D2032' : '#FFFFFF' }]}>
              <Text style={[styles.wStatNum, { color: colors.text }]}>
                {prePregnancyWeight > 0 ? `${prePregnancyWeight} kg` : '—'}
              </Text>
              <Text style={[styles.wStatLabel, { color: colors.textMuted }]}>Başlangıç Kilosu</Text>
            </View>
            <View style={[styles.wStatBox, { backgroundColor: isDark ? '#3D2032' : '#FFFFFF' }]}>
              <Text style={[styles.wStatNum, { color: colors.text }]}>
                {latestWeight != null ? `${latestWeight} kg` : '—'}
              </Text>
              <Text style={[styles.wStatLabel, { color: colors.textMuted }]}>Mevcut Kilo</Text>
            </View>
          </View>
        </View>

        {/* Input Box */}
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.inputCardTitle, { color: colors.text }]}>Yeni Kilo Kaydı Ekle</Text>
          <View style={styles.inputRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Gebelik Haftası</Text>
              <TextInput
                style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                keyboardType="numeric"
                placeholder="Örn: 16"
                placeholderTextColor={colors.textMuted}
                value={currentWeekInput}
                onChangeText={setCurrentWeekInput}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Kilo (kg)</Text>
              <TextInput
                style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                keyboardType="decimal-pad"
                placeholder="Örn: 64.5"
                placeholderTextColor={colors.textMuted}
                value={currentInput}
                onChangeText={setCurrentInput}
              />
            </View>
          </View>

          <Pressable style={[styles.addWeightBtn, { backgroundColor: Colors.floPink }]} onPress={handleAddWeight}>
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addWeightBtnText}>Kaydet</Text>
          </Pressable>
        </View>

        {/* History List */}
        <View style={styles.histSection}>
          <Text style={[styles.histSectionTitle, { color: colors.text }]}>Kilo Geçmişi</Text>
          {entries.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="scale-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Henüz kilo kaydı eklenmedi. Kilonuzu yukarıdan ekleyerek takibe başlayabilirsiniz.
              </Text>
            </View>
          ) : (
            entries.map((item) => (
              <View key={item.id} style={[styles.entryRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.weekCircle, { backgroundColor: Colors.floPinkLight }]}>
                    <Text style={[styles.weekCircleText, { color: Colors.floPink }]}>{item.week}</Text>
                  </View>
                  <View>
                    <Text style={[styles.entryWeekTitle, { color: colors.text }]}>{item.week}. Hafta</Text>
                    <Text style={[styles.entryDate, { color: colors.textMuted }]}>{item.date}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={[styles.entryWeight, { color: colors.text }]}>{item.weight} kg</Text>
                  <Pressable onPress={() => handleDeleteEntry(item.id, item.week)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Medical Disclaimer */}
        <View style={[styles.disclaimerBox, { backgroundColor: isDark ? '#2D1F32' : '#F9F5FF', borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.floPink} />
          <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
            Yasal Uyarı: Bu kilo takibi aracı genel bilgilendirme amaçlıdır; tıbbi tanı veya tedavi yerine geçmez. Gebelikte sağlıklı kilo artışı kişisel sağlık durumuna ve başlangıç beden kitle indeksine göre değişir. Kilo ve beslenme hedefleriniz için mutlaka doktorunuza danışınız.
          </Text>
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
  summaryCard: { padding: 18, borderRadius: 22, borderWidth: 1, marginVertical: 12 },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  summaryLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  summaryBig: { fontSize: 32, fontWeight: '900', marginTop: 2 },
  bmiPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  bmiPillText: { fontSize: 11, fontWeight: '700' },
  weightStatsRow: { flexDirection: 'row', gap: 10 },
  wStatBox: { flex: 1, padding: 12, borderRadius: 14, alignItems: 'center' },
  wStatNum: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  wStatLabel: { fontSize: 11 },
  inputCard: { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 16 },
  inputCardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  fieldLabel: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
  textInput: { height: 44, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, fontSize: 15, fontWeight: '700' },
  addWeightBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14 },
  addWeightBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  histSection: { marginTop: 8 },
  histSectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  entryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  weekCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  weekCircleText: { fontSize: 14, fontWeight: '800' },
  entryWeekTitle: { fontSize: 14, fontWeight: '700' },
  entryDate: { fontSize: 11, marginTop: 1 },
  entryWeight: { fontSize: 16, fontWeight: '800' },
  emptyBox: { padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 },
  emptyText: { fontSize: 13, textAlign: 'center' },
  disclaimerBox: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginTop: 24, alignItems: 'flex-start' },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
