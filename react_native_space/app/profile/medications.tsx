import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import {
  loadMedications,
  saveMedications,
  ensureNotificationPermission,
  syncBloomAlerts,
  type MedItem,
} from '@/src/notifications/bloomAlerts';
import { localDateKey } from '@/src/utils/dateOnly';
import { useSettingsControllerGetSettings } from '@/src/api/generated/api';

const PRESETS: { times: number; label: string; hours: string[] }[] = [
  { times: 1, label: 'Günde 1', hours: ['09:00'] },
  { times: 2, label: 'Günde 2', hours: ['08:00', '20:00'] },
  { times: 3, label: 'Günde 3', hours: ['08:00', '14:00', '21:00'] },
  { times: 4, label: 'Günde 4', hours: ['08:00', '12:00', '16:00', '20:00'] },
];

function todayKey() {
  return localDateKey();
}

function toDate(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 9, m || 0, 0, 0);
  return d;
}

export default function MedicationsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: settings } = useSettingsControllerGetSettings();

  const [meds, setMeds] = useState<MedItem[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [dosageInput, setDosageInput] = useState('1 Tablet');
  const [times, setTimes] = useState<string[]>(['09:00']);
  const [pickerFor, setPickerFor] = useState<number | null>(null);

  const persist = useCallback(async (updated: MedItem[]) => {
    setMeds(updated);
    await saveMedications(updated);
    const n = settings?.notifications as any;
    await syncBloomAlerts({
      prefs: {
        medicationReminder: n?.medicationReminder !== false,
        countdownReminder: n?.countdownReminder !== false,
        specialDateReminder: n?.specialDateReminder !== false,
        periodReminder: n?.periodReminder !== false,
        reminderOffsets: n?.reminderOffsets ?? [30, 7, 3, 1],
      },
    });
  }, [settings]);

  useEffect(() => {
    loadMedications().then(setMeds);
    ensureNotificationPermission();
  }, []);

  const takenToday = (med: MedItem, time: string) => med.takenOn?.[time] === todayKey();

  const toggleTaken = (id: string, time: string) => {
    const updated = meds.map((m) => {
      if (m.id !== id) return m;
      const takenOn = { ...(m.takenOn || {}) };
      if (takenOn[time] === todayKey()) delete takenOn[time];
      else takenOn[time] = todayKey();
      return { ...m, takenOn };
    });
    persist(updated);
  };

  const addMed = async () => {
    if (!nameInput.trim()) {
      Alert.alert('Ad gerekli', 'İlaç veya vitamin adını yazın.');
      return;
    }
    const uniqueTimes = [...new Set(times.filter(Boolean))].sort();
    if (!uniqueTimes.length) {
      Alert.alert('Saat seçin', 'En az bir alınış saati seçmelisiniz.');
      return;
    }
    const ok = await ensureNotificationPermission();
    const newItem: MedItem = {
      id: Date.now().toString(),
      name: nameInput.trim(),
      dosage: dosageInput.trim() || '1 Adet',
      times: uniqueTimes,
      takenOn: {},
    };
    await persist([...meds, newItem]);
    setNameInput('');
    setTimes(['09:00']);
    Alert.alert(
      'Eklendi',
      ok
        ? `"${newItem.name}" için ${uniqueTimes.join(', ')} saatlerinde bildirim kuruldu.`
        : 'Kayıt eklendi. Bildirim için ayarlardan izin verin.',
    );
  };

  const deleteMed = (id: string) => {
    Alert.alert('Silinsin mi?', 'Bu ilaç listeden ve hatırlatmalardan kalkar.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => persist(meds.filter((m) => m.id !== id)) },
    ]);
  };

  const onPickTime = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') setPickerFor(null);
    if (!date || pickerFor == null) return;
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    setTimes((prev) => prev.map((t, i) => (i === pickerFor ? `${hh}:${mm}` : t)));
  };

  const pending = meds.reduce((acc, m) => acc + m.times.filter((t) => !takenToday(m, t)).length, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>İlaç & Vitamin Takibi</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {pending === 0 ? 'Bugünkü dozlar tamam' : `Bugün ${pending} doz bekliyor`}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.addCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.addTitle, { color: colors.text }]}>Yeni ilaç / vitamin</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder="Ad (ör. Folik asit)"
            placeholderTextColor={colors.textMuted}
            value={nameInput}
            onChangeText={setNameInput}
          />
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder="Doz (ör. 400 mcg / 1 tablet)"
            placeholderTextColor={colors.textMuted}
            value={dosageInput}
            onChangeText={setDosageInput}
          />

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Günde kaç kez?</Text>
          <View style={styles.chipRow}>
            {PRESETS.map((p) => (
              <Pressable
                key={p.times}
                onPress={() => setTimes(p.hours)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: times.length === p.times ? Colors.floTeal : isDark ? '#2A2A2A' : '#F3F4F6',
                  },
                ]}
              >
                <Text style={{ color: times.length === p.times ? '#fff' : colors.text, fontWeight: '700', fontSize: 12 }}>
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Saatleri seçin (yazmayın)</Text>
          {times.map((t, idx) => (
            <View key={`${t}-${idx}`} style={styles.timeRow}>
              <Pressable
                style={[styles.timeBtn, { borderColor: colors.border, backgroundColor: isDark ? '#1A1A1A' : '#FAFAFA' }]}
                onPress={() => setPickerFor(idx)}
              >
                <Ionicons name="time-outline" size={18} color={Colors.floTeal} />
                <Text style={[styles.timeText, { color: colors.text }]}>{t}</Text>
              </Pressable>
              {times.length > 1 && (
                <Pressable onPress={() => setTimes(times.filter((_, i) => i !== idx))} hitSlop={8}>
                  <Ionicons name="close-circle" size={22} color={colors.textMuted} />
                </Pressable>
              )}
            </View>
          ))}
          {times.length < 6 && (
            <Pressable
              onPress={() => setTimes([...times, '12:00'])}
              style={styles.addTimeBtn}
            >
              <Ionicons name="add" size={16} color={Colors.floTeal} />
              <Text style={{ color: Colors.floTeal, fontWeight: '700', fontSize: 13 }}>Başka bir saat ekle</Text>
            </Pressable>
          )}

          {pickerFor != null && (
            <>
              <DateTimePicker
                value={toDate(times[pickerFor] || '09:00')}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onPickTime}
              />
              {Platform.OS === 'ios' && (
                <Pressable onPress={() => setPickerFor(null)} style={{ alignSelf: 'flex-end', paddingVertical: 6 }}>
                  <Text style={{ color: Colors.floTeal, fontWeight: '800' }}>Saati onayla</Text>
                </Pressable>
              )}
            </>
          )}

          <Pressable style={[styles.addBtn, { backgroundColor: Colors.floTeal }]} onPress={addMed}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Kaydet ve hatırlat</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bugünkü dozlar</Text>
        {meds.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 13, lineHeight: 20 }}>
            Henüz kayıt yok. Saatleri listeden seçin; yazmanıza gerek yok. Saat geldiğinde uygulama bildirim verir.
          </Text>
        ) : (
          meds.map((med) => (
            <View key={med.id} style={[styles.medCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.medHead}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.medName, { color: colors.text }]}>{med.name}</Text>
                  <Text style={[styles.medSub, { color: colors.textMuted }]}>{med.dosage}</Text>
                </View>
                <Pressable onPress={() => deleteMed(med.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
              {med.times.map((t) => {
                const done = takenToday(med, t);
                return (
                  <Pressable key={t} style={styles.doseRow} onPress={() => toggleTaken(med.id, t)}>
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={done ? Colors.success : colors.textMuted}
                    />
                    <Text style={[styles.doseText, { color: done ? colors.textMuted : colors.text }]}>
                      {t} {done ? '— alındı' : '— bekliyor'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))
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
  addCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginVertical: 12 },
  addTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  input: { height: 44, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, fontSize: 13, marginBottom: 8 },
  fieldLabel: { fontSize: 12, fontWeight: '700', marginTop: 4, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  timeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
  timeText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  addTimeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, marginBottom: 8 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14, marginTop: 4 },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12, marginTop: 8 },
  medCard: { padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  medHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  medName: { fontSize: 15, fontWeight: '700' },
  medSub: { fontSize: 12, marginTop: 2 },
  doseRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  doseText: { fontSize: 14, fontWeight: '600' },
});
