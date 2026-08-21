import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'user_mood_journal';

interface MoodLog {
  id: string;
  moodEmoji: string;
  moodName: string;
  gratitudeText: string;
  notes: string;
  date: string;
  createdAt: string;
}

const MOODS = [
  { emoji: '🥰', name: 'Huzurlu & Mutlu', color: Colors.floPink },
  { emoji: '⚡', name: 'Enerjik & Canlı', color: '#F59E0B' },
  { emoji: '😌', name: 'Sakin & Dingin', color: Colors.floTeal },
  { emoji: '🥺', name: 'Duygusal & Hassas', color: Colors.floPurple },
  { emoji: '🥱', name: 'Yorgun & Bitkin', color: '#6B7280' },
];

export default function MoodJournalScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [gratitude, setGratitude] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) setLogs(parsed);
        } catch { /* ignore */ }
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs, loaded]);

  const resetForm = () => {
    setGratitude('');
    setNotes('');
    setEditingId(null);
    setSelectedMood(MOODS[0]);
  };

  const handleSave = () => {
    if (!gratitude.trim() && !notes.trim()) {
      Alert.alert('Eksik', 'Minnettarlık veya not yazın.');
      return;
    }
    if (editingId) {
      setLogs((prev) =>
        prev.map((l) =>
          l.id === editingId
            ? { ...l, moodEmoji: selectedMood.emoji, moodName: selectedMood.name, gratitudeText: gratitude.trim(), notes: notes.trim() }
            : l,
        ),
      );
      resetForm();
      return;
    }
    const now = new Date();
    const newLog: MoodLog = {
      id: `${Date.now()}`,
      moodEmoji: selectedMood.emoji,
      moodName: selectedMood.name,
      gratitudeText: gratitude.trim(),
      notes: notes.trim(),
      date: now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      createdAt: now.toISOString(),
    };
    setLogs((prev) => [newLog, ...prev]);
    resetForm();
  };

  const startEdit = (log: MoodLog) => {
    setEditingId(log.id);
    setGratitude(log.gratitudeText);
    setNotes(log.notes);
    setSelectedMood(MOODS.find((m) => m.name === log.moodName) ?? MOODS[0]);
  };

  const remove = (id: string) => {
    Alert.alert('Günlüğü sil', 'Bu kayıt silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => {
          setLogs((prev) => prev.filter((l) => l.id !== id));
          if (editingId === id) resetForm();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Duygu & Minnettarlık Günlüğü</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {editingId ? 'Kaydı düzenliyorsunuz' : 'Kayıtlar cihazda saklanır; örnek metin yok'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Bugün nasıl hissediyorsun?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m) => {
              const isSel = selectedMood.name === m.name;
              return (
                <Pressable
                  key={m.name}
                  style={[styles.moodBtn, { backgroundColor: isSel ? m.color + '20' : isDark ? '#2D2030' : '#F9F7F8', borderColor: isSel ? m.color : 'transparent' }]}
                  onPress={() => setSelectedMood(m)}
                >
                  <Text style={{ fontSize: 30 }}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, { color: isSel ? m.color : colors.textMuted }]}>{m.name.split(' ')[0]}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Minnettar olduğun şey</Text>
          <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="İsteğe bağlı" placeholderTextColor={colors.textMuted} value={gratitude} onChangeText={setGratitude} />
          <Text style={[styles.inputLabel, { color: colors.text, marginTop: 10 }]}>Notlar</Text>
          <TextInput style={[styles.input, { height: 60, color: colors.text, borderColor: colors.border, textAlignVertical: 'top' }]} placeholder="İçinden geçenler" placeholderTextColor={colors.textMuted} multiline value={notes} onChangeText={setNotes} />
          <Pressable style={[styles.saveBtn, { backgroundColor: selectedMood.color }]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{editingId ? 'Değişiklikleri kaydet' : 'Günlüğe ekle'}</Text>
          </Pressable>
          {editingId ? (
            <Pressable onPress={resetForm} style={{ marginTop: 8, alignItems: 'center' }}>
              <Text style={{ color: colors.textMuted, fontWeight: '700' }}>Düzenlemeyi iptal et</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={[styles.histTitle, { color: colors.text }]}>Kayıtlar ({logs.length})</Text>
        {loaded && logs.length === 0 ? (
          <Text style={{ color: colors.textMuted }}>Henüz günlük yok. Eklediğiniz maddeleri buradan silip düzenleyebilirsiniz.</Text>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={[styles.logCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.logHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                  <Text style={{ fontSize: 24 }}>{log.moodEmoji}</Text>
                  <Text style={[styles.logMood, { color: colors.text }]}>{log.moodName}</Text>
                </View>
                <Text style={[styles.logDate, { color: colors.textMuted }]}>{log.date}</Text>
              </View>
              {log.gratitudeText ? (
                <View style={[styles.gratBox, { backgroundColor: isDark ? '#2D1F32' : '#FFF0F6' }]}>
                  <Text style={[styles.gratText, { color: colors.text }]}>{log.gratitudeText}</Text>
                </View>
              ) : null}
              {log.notes ? <Text style={[styles.notesText, { color: colors.textSecondary }]}>{log.notes}</Text> : null}
              <View style={styles.actions}>
                <Pressable onPress={() => startEdit(log)} style={styles.actBtn}>
                  <Ionicons name="pencil" size={16} color={Colors.floTeal} />
                  <Text style={{ color: Colors.floTeal, fontWeight: '700', fontSize: 12 }}>Düzenle</Text>
                </Pressable>
                <Pressable onPress={() => remove(log.id)} style={styles.actBtn}>
                  <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                  <Text style={{ color: Colors.danger, fontWeight: '700', fontSize: 12 }}>Sil</Text>
                </Pressable>
              </View>
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
  card: { padding: 18, borderRadius: 22, borderWidth: 1, marginVertical: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  moodRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  moodBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, borderWidth: 1.5 },
  moodLabel: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  inputLabel: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  input: { borderRadius: 14, borderWidth: 1, padding: 12, fontSize: 13, marginBottom: 6 },
  saveBtn: { alignItems: 'center', paddingVertical: 13, borderRadius: 16, marginTop: 10 },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  histTitle: { fontSize: 16, fontWeight: '800', marginTop: 12, marginBottom: 10 },
  logCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 10 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  logMood: { fontSize: 14, fontWeight: '800' },
  logDate: { fontSize: 12 },
  gratBox: { padding: 10, borderRadius: 12, marginVertical: 6 },
  gratText: { fontSize: 12.5, lineHeight: 17 },
  notesText: { fontSize: 13, lineHeight: 18, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 10 },
  actBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
