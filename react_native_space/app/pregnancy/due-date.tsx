import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { customFetch } from '@/src/api/customFetch';
import { useQueryClient } from '@tanstack/react-query';
import { calculatePregnancyProgress, toCalendarUtc, DAY_MS } from '@/src/utils/dateOnly';

export default function DueDateCalculatorScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [method, setMethod] = useState<'lmp' | 'conception' | 'ivf'>('lmp');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calculated, setCalculated] = useState<{
    dueDate: Date;
    currentWeek: number;
    currentDay: number;
    daysRemaining: number;
    conceptionDate: Date;
    zodiac: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const calculateDueDate = () => {
    let due: Date;
    let lmpDate: Date;

    const baseDate = toCalendarUtc(selectedDate);
    if (method === 'lmp') {
      lmpDate = baseDate;
      due = new Date(baseDate.getTime() + 280 * DAY_MS);
    } else if (method === 'conception') {
      lmpDate = new Date(baseDate.getTime() - 14 * DAY_MS);
      due = new Date(baseDate.getTime() + 266 * DAY_MS);
    } else {
      // IVF 5-day transfer
      lmpDate = new Date(baseDate.getTime() - 19 * DAY_MS);
      due = new Date(baseDate.getTime() + 261 * DAY_MS);
    }

    const prog = calculatePregnancyProgress(lmpDate, due);
    const currentWeek = prog.week;
    const currentDay = prog.day;
    const daysRemaining = prog.daysRemaining;

    // Estimate Zodiac
    const m = due.getMonth() + 1;
    const d = due.getDate();
    let zodiac = 'Koç ♈';
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) zodiac = 'Koç ♈';
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) zodiac = 'Boğa ♉';
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) zodiac = 'İkizler ♊';
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) zodiac = 'Yengeç ♋';
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) zodiac = 'Aslan ♌';
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) zodiac = 'Başak ♍';
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) zodiac = 'Terazi ♎';
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) zodiac = 'Akrep ♏';
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) zodiac = 'Yay ♐';
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) zodiac = 'Oğlak ♑';
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) zodiac = 'Kova ♒';
    else zodiac = 'Balık ♓';

    setCalculated({
      dueDate: due,
      currentWeek,
      currentDay,
      daysRemaining,
      conceptionDate: new Date(lmpDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      zodiac,
    });
  };

  const handleSaveToProfile = async () => {
    if (!calculated) return;
    setIsSaving(true);
    try {
      let lmpDate: Date;
      if (method === 'lmp') lmpDate = selectedDate;
      else if (method === 'conception') lmpDate = new Date(selectedDate.getTime() - 14 * 24 * 60 * 60 * 1000);
      else lmpDate = new Date(selectedDate.getTime() - 19 * 24 * 60 * 60 * 1000);

      await customFetch('/api/pregnancy', {
        method: 'POST',
        body: JSON.stringify({
          lastMenstrualPeriod: lmpDate.toISOString(),
        }),
      });

      await queryClient.invalidateQueries({ queryKey: ['/api/pregnancy'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      Alert.alert('Başarılı! 🌸', 'Doğum tarihi ve gebelik profiliniz güncellendi.');
      router.push('/pregnancy');
    } catch {
      Alert.alert('Hata', 'Kayıt yapılamadı.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Doğum Tarihi Hesaplayıcı 📅</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Naegele & IVF Bilimsel Formülü</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Method Selector */}
        <View style={[styles.methodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hesaplama Yöntemi</Text>
          <View style={styles.methodButtons}>
            {[
              { key: 'lmp', label: 'Son Adet Tarihi (SAT)' },
              { key: 'conception', label: 'Gebe Kalma Tarihi' },
              { key: 'ivf', label: 'Tüp Bebek (5. Gün Embriyo)' },
            ].map((m) => {
              const isActive = method === m.key;
              return (
                <Pressable
                  key={m.key}
                  style={[
                    styles.methodBtn,
                    { backgroundColor: isActive ? Colors.floPink : isDark ? '#2D2030' : '#F9F7F8', borderColor: isActive ? Colors.floPink : colors.border },
                  ]}
                  onPress={() => {
                    setMethod(m.key as any);
                    setCalculated(null);
                  }}
                >
                  <Text style={[styles.methodBtnText, { color: isActive ? '#FFFFFF' : colors.text }]}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Date Setter Box */}
        <View style={[styles.dateBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.dateBoxLabel, { color: colors.textMuted }]}>
            {method === 'lmp' ? 'Son Adetinizin İlk Günü' : method === 'conception' ? 'İlişki / Gebe Kalma Günü' : 'Embriyo Transfer Günü'}
          </Text>
          <Text style={[styles.selectedDateText, { color: colors.text }]}>
            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>

          {/* Quick Date Stepper (Day offset) */}
          <View style={styles.stepperRow}>
            <Pressable
              style={[styles.stepperBtn, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}
              onPress={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
            >
              <Text style={[styles.stepperBtnText, { color: colors.text }]}>-1 Hafta</Text>
            </Pressable>
            <Pressable
              style={[styles.stepperBtn, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}
              onPress={() => setSelectedDate(new Date(selectedDate.getTime() - 1 * 24 * 60 * 60 * 1000))}
            >
              <Text style={[styles.stepperBtnText, { color: colors.text }]}>-1 Gün</Text>
            </Pressable>
            <Pressable
              style={[styles.stepperBtn, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}
              onPress={() => setSelectedDate(new Date(selectedDate.getTime() + 1 * 24 * 60 * 60 * 1000))}
            >
              <Text style={[styles.stepperBtnText, { color: colors.text }]}>+1 Gün</Text>
            </Pressable>
            <Pressable
              style={[styles.stepperBtn, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}
              onPress={() => setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
            >
              <Text style={[styles.stepperBtnText, { color: colors.text }]}>+1 Hafta</Text>
            </Pressable>
          </View>

          <Pressable style={[styles.calcActionBtn, { backgroundColor: Colors.floPink }]} onPress={calculateDueDate}>
            <Ionicons name="calculator-outline" size={20} color="#FFFFFF" />
            <Text style={styles.calcActionText}>Hesapla ✨</Text>
          </Pressable>
        </View>

        {/* Calculation Result */}
        {calculated && (
          <View style={[styles.resultCard, { backgroundColor: isDark ? '#2D1F32' : '#FFF0F6', borderColor: Colors.floPink + '40' }]}>
            <View style={styles.resBadge}>
              <Text style={styles.resBadgeText}>TAHMİNİ DOĞUM TARİHİ</Text>
            </View>
            <Text style={[styles.resDueDate, { color: colors.text }]}>
              {calculated.dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>

            <View style={styles.resGrid}>
              <View style={[styles.resItem, { backgroundColor: isDark ? '#3D2032' : '#FFFFFF' }]}>
                <Text style={[styles.resVal, { color: Colors.floPink }]}>{calculated.currentWeek}. Hafta</Text>
                <Text style={[styles.resLbl, { color: colors.textMuted }]}>Mevcut Hafta</Text>
              </View>
              <View style={[styles.resItem, { backgroundColor: isDark ? '#3D2032' : '#FFFFFF' }]}>
                <Text style={[styles.resVal, { color: Colors.floTeal }]}>{calculated.daysRemaining} Gün</Text>
                <Text style={[styles.resLbl, { color: colors.textMuted }]}>Kavuşmaya Kalan</Text>
              </View>
              <View style={[styles.resItem, { backgroundColor: isDark ? '#3D2032' : '#FFFFFF' }]}>
                <Text style={[styles.resVal, { color: Colors.floPurple }]}>{calculated.zodiac}</Text>
                <Text style={[styles.resLbl, { color: colors.textMuted }]}>Bebek Burcu</Text>
              </View>
            </View>

            <Pressable style={[styles.saveProfileBtn, { backgroundColor: Colors.floPurple }]} onPress={handleSaveToProfile} disabled={isSaving}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.saveProfileBtnText}>Gebelik Takibini Başlat 🌸</Text>
            </Pressable>
          </View>
        )}
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
  methodCard: { padding: 16, borderRadius: 18, borderWidth: 1, marginVertical: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  methodButtons: { gap: 8 },
  methodBtn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  methodBtnText: { fontSize: 13, fontWeight: '700' },
  dateBox: { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 16 },
  dateBoxLabel: { fontSize: 12, fontWeight: '600' },
  selectedDateText: { fontSize: 20, fontWeight: '800', marginVertical: 8 },
  stepperRow: { flexDirection: 'row', gap: 6, marginVertical: 10 },
  stepperBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  stepperBtnText: { fontSize: 12, fontWeight: '700' },
  calcActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, marginTop: 8 },
  calcActionText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  resultCard: { padding: 20, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
  resBadge: { backgroundColor: Colors.floPink, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  resBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  resDueDate: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  resGrid: { flexDirection: 'row', gap: 8, width: '100%', marginBottom: 16 },
  resItem: { flex: 1, padding: 12, borderRadius: 14, alignItems: 'center' },
  resVal: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  resLbl: { fontSize: 10, textAlign: 'center' },
  saveProfileBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, width: '100%', borderRadius: 16 },
  saveProfileBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
