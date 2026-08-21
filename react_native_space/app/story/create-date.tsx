import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert, Switch, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useSpecialDatesControllerCreate } from '@/src/api/generated/api';
import { useQueryClient } from '@tanstack/react-query';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { localDateKey } from '@/src/utils/dateOnly';

const REMINDER_OPTIONS = [
  { value: 1, label: '1 gün önce' },
  { value: 7, label: '1 hafta önce' },
  { value: 30, label: '1 ay önce' },
] as const;

export default function CreateDateScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMutation = useSpecialDatesControllerCreate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderDays, setReminderDays] = useState<number[]>([1, 7]);

  const toggleReminder = (val: number) => {
    setReminderDays(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir başlık girin.');
      return;
    }
    createMutation.mutate(
      { data: { title: title.trim(), date: localDateKey(date), description: description.trim() || undefined, isRecurring, reminderDaysList: reminderDays } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/special-dates'] });
          queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
          Alert.alert('Başarılı ✨', 'Özel gününüz eklendi.');
          router.back();
        },
        onError: () => Alert.alert('Hata', 'Özel gün eklenemedi.'),
      }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Özel Gün Ekle 🎁</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Başlık</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="gift-outline" size={18} color={Colors.relationship} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Örn: İlk Buluşma, Doğum Günü"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Tarih</Text>
          <Pressable
            style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color={Colors.relationship} style={styles.inputIcon} />
            <Text style={[styles.inputText, { color: colors.text }]}>
              {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </Pressable>

          <DatePickerModal
            visible={showDatePicker}
            selectedDate={date}
            onSelect={(d) => { setDate(d); setShowDatePicker(false); }}
            onClose={() => setShowDatePicker(false)}
            accentColor={Colors.relationship}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Açıklama (İsteğe Bağlı)</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Unutulmaz anlar, notlar..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={[styles.switchRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Her yıl tekrarla</Text>
              <Text style={[styles.switchSub, { color: colors.textMuted }]}>Yıldönümü gibi her yıl hatırlatılsın</Text>
            </View>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              trackColor={{ true: Colors.primary, false: colors.border }}
              thumbColor="#fff"
            />
          </View>

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>Hatırlatma Zamanı</Text>
          <View style={styles.reminderRow}>
            {REMINDER_OPTIONS.map(opt => {
              const selected = reminderDays.includes(opt.value);
              return (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.reminderChip,
                    {
                      backgroundColor: selected ? Colors.primary + '15' : colors.inputBg,
                      borderColor: selected ? Colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => toggleReminder(opt.value)}
                >
                  <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={selected ? Colors.primary : colors.textMuted} />
                  <Text style={[styles.reminderChipText, { color: selected ? Colors.primary : colors.textSecondary }]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
            onPress={handleSave}
            disabled={createMutation.isPending}
          >
            <Ionicons name="heart" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>{createMutation.isPending ? 'Ekleniyor...' : 'Özel Günü Kaydet'}</Text>
          </Pressable>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.2 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },

  card: {
    borderRadius: 24, padding: 20, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12, marginLeft: 2 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, height: 50, marginBottom: 4,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  inputText: { fontSize: 15 },
  textArea: {
    borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 14.5,
    minHeight: 80, marginBottom: 4,
  },

  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, marginTop: 14,
  },
  switchLabel: { fontSize: 15, fontWeight: '600' },
  switchSub: { fontSize: 11.5, marginTop: 2 },

  reminderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  reminderChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, borderWidth: 1,
  },
  reminderChipText: { fontSize: 12.5, fontWeight: '700' },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 16, marginTop: 24,
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
