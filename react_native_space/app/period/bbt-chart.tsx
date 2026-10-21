import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { getWellnessData, setWellnessData } from '@/src/utils/wellnessStorage';

const FEATURE_KEY = 'bbt_records';

interface BBTRecord {
  day: number;
  temp: number;
  date: string;
}

export default function BBTChartScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  if (user?.gender === 'MALE') {
    router.replace('/tabs/home');
    return null;
  }

  const [records, setRecords] = useState<BBTRecord[]>([]);
  const [newDay, setNewDay] = useState('');
  const [newTemp, setNewTemp] = useState('');

  useEffect(() => {
    let active = true;
    getWellnessData<BBTRecord[]>(FEATURE_KEY, user?.id).then((saved) => {
      if (active && Array.isArray(saved)) {
        setRecords(saved);
      }
    });
    return () => {
      active = false;
    };
  }, [user?.id]);

  const saveRecords = (updated: BBTRecord[]) => {
    setRecords(updated);
    void setWellnessData(FEATURE_KEY, updated, user?.id);
  };

  const handleAddTemp = () => {
    const d = parseInt(newDay, 10);
    const t = parseFloat(newTemp);
    if (isNaN(d) || isNaN(t) || t < 35 || t > 40) {
      Alert.alert('Geçersiz Değer', 'Lütfen geçerli bir bazal vücut sıcaklığı girin (örn. 36.5 °C).');
      return;
    }

    const newRecord: BBTRecord = {
      day: d,
      temp: t,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    };

    const updated = [...records.filter((r) => r.day !== d), newRecord].sort((a, b) => a.day - b.day);
    saveRecords(updated);
    Alert.alert('Kaydedildi! 🌡️', `Döngü ${d}. gün sıcaklığınız ${t} °C olarak kaydedildi.`);
  };

  // Find ovulation day (where temp jumps by >= 0.3)
  let ovDay: number | null = null;
  for (let i = 1; i < records.length; i++) {
    if (records[i].temp - records[i - 1].temp >= 0.3) {
      ovDay = records[i].day;
      break;
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Bazal Sıcaklık (BBT) Grafiği 🌡️</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Bifazik Eğri & Ovülasyon Tespiti</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Ovulation Detection Banner */}
        <View style={[styles.banner, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' }]}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.floTeal} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: Colors.floTeal }]}>
              {ovDay ? `Yumurtlama ${ovDay}. Günde Doğrulandı! ⭐` : 'Yumurtlama Takip Ediliyor'}
            </Text>
            <Text style={[styles.bannerDesc, { color: colors.textSecondary }]}>
              {ovDay
                ? `Sıcaklığınız ${ovDay}. günde 0.6 °C yükselerek luteal evreye girdiğinizi gösterdi.`
                : 'Yumurtlama anında progesteron hormonu sıcaklığı yaklaşık 0.3 - 0.5 °C artırır.'}
            </Text>
          </View>
        </View>

        {/* Visual Chart Card */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Döngü Sıcaklık Eğrisi (°C)</Text>
          {records.length === 0 ? (
            <View style={{ paddingVertical: 24, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Ionicons name="thermometer-outline" size={32} color={colors.textMuted} />
              <Text style={{ fontSize: 13, color: colors.textMuted, textAlign: 'center' }}>
                Henüz sıcaklık kaydı eklenmedi. Aşağıdan bugünkü ölçümü kaydederek grafiğinizi oluşturun.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.barsContainer}>
                {records.map((item) => {
                  const heightPercent = Math.min(100, Math.max(10, ((item.temp - 35.8) / 1.5) * 100));
                  const isHigh = item.temp >= 36.6;
                  const isOv = item.day === ovDay;
                  return (
                    <View key={item.day} style={styles.barCol}>
                      <Text style={[styles.barTempText, { color: isHigh ? Colors.floPink : colors.textMuted }]}>
                        {item.temp.toFixed(1)}
                      </Text>
                      <View style={styles.barSlot}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              height: `${heightPercent}%`,
                              backgroundColor: isOv ? Colors.floPurple : isHigh ? Colors.floPink : Colors.floTeal,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.barDayText, { color: colors.text }]}>G{item.day}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.legItem}>
                  <View style={[styles.legDot, { backgroundColor: Colors.floTeal }]} />
                  <Text style={[styles.legText, { color: colors.textMuted }]}>Foliküler (Düşük)</Text>
                </View>
                <View style={styles.legItem}>
                  <View style={[styles.legDot, { backgroundColor: Colors.floPink }]} />
                  <Text style={[styles.legText, { color: colors.textMuted }]}>Luteal (Yüksek)</Text>
                </View>
                <View style={styles.legItem}>
                  <View style={[styles.legDot, { backgroundColor: Colors.floPurple }]} />
                  <Text style={[styles.legText, { color: colors.textMuted }]}>Ovülasyon Sıçraması</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Add Entry Card */}
        <View style={[styles.addCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.addCardTitle, { color: colors.text }]}>Bugünkü Ölçümü Kaydet</Text>
          <View style={styles.addRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.addLabel, { color: colors.textMuted }]}>Döngü Günü</Text>
              <TextInput
                style={[styles.addInput, { color: colors.text, borderColor: colors.border }]}
                keyboardType="numeric"
                value={newDay}
                onChangeText={setNewDay}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.addLabel, { color: colors.textMuted }]}>Sıcaklık (°C)</Text>
              <TextInput
                style={[styles.addInput, { color: colors.text, borderColor: colors.border }]}
                keyboardType="decimal-pad"
                value={newTemp}
                onChangeText={setNewTemp}
              />
            </View>
          </View>
          <Pressable style={[styles.saveBtn, { backgroundColor: Colors.floTeal }]} onPress={handleAddTemp}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>Sıcaklığı Kaydet</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 17, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  banner: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 18, borderWidth: 1, marginVertical: 12 },
  bannerTitle: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  bannerDesc: { fontSize: 12.5, lineHeight: 17 },
  chartCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  chartTitle: { fontSize: 15, fontWeight: '800', marginBottom: 14 },
  barsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, paddingBottom: 8 },
  barCol: { alignItems: 'center', flex: 1 },
  barTempText: { fontSize: 9, fontWeight: '700', marginBottom: 4 },
  barSlot: { width: 14, height: 110, justifyContent: 'flex-end', backgroundColor: '#00000008', borderRadius: 7, overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 7 },
  barDayText: { fontSize: 10, fontWeight: '600', marginTop: 6 },
  chartLegend: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#00000010', paddingTop: 12, marginTop: 10 },
  legItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legDot: { width: 8, height: 8, borderRadius: 4 },
  legText: { fontSize: 10, fontWeight: '600' },
  addCard: { padding: 16, borderRadius: 18, borderWidth: 1 },
  addCardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  addRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  addLabel: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
  addInput: { height: 44, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, fontSize: 15, fontWeight: '700' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14 },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
