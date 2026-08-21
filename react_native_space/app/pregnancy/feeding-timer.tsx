import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDateKey } from '@/src/utils/dateOnly';

const STORAGE_KEY = 'baby_feeding_history';

interface FeedSession {
  id: string;
  type: 'breast_left' | 'breast_right' | 'bottle';
  durationSeconds?: number;
  amountMl?: number;
  startedAt: string;
  endedAt: string;
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function FeedingTimerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [bottleAmount, setBottleAmount] = useState('90');
  const [history, setHistory] = useState<FeedSession[]>([]);
  const [loaded, setLoaded] = useState(false);
  const startedAtRef = useRef<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data) as FeedSession[];
          if (Array.isArray(parsed)) setHistory(parsed);
        } catch { /* ignore */ }
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history, loaded]);

  useEffect(() => {
    if (activeSide === null) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [activeSide]);

  const persistSession = (session: FeedSession) => {
    setHistory((prev) => [session, ...prev]);
  };

  const finishSide = (side: 'left' | 'right') => {
    const endedAt = new Date().toISOString();
    persistSession({
      id: `${Date.now()}`,
      type: side === 'left' ? 'breast_left' : 'breast_right',
      durationSeconds: seconds,
      startedAt: startedAtRef.current || endedAt,
      endedAt,
    });
    setActiveSide(null);
    setSeconds(0);
    startedAtRef.current = null;
  };

  const toggleSide = (side: 'left' | 'right') => {
    if (activeSide === side) {
      finishSide(side);
      return;
    }
    if (activeSide && activeSide !== side) {
      finishSide(activeSide);
    }
    startedAtRef.current = new Date().toISOString();
    setActiveSide(side);
    setSeconds(0);
  };

  const handleAddBottle = () => {
    const ml = parseInt(bottleAmount, 10);
    if (isNaN(ml) || ml <= 0) {
      Alert.alert('Eksik', 'Mililitre değerini girin.');
      return;
    }
    const now = new Date().toISOString();
    persistSession({
      id: `${Date.now()}`,
      type: 'bottle',
      amountMl: ml,
      startedAt: now,
      endedAt: now,
    });
    Alert.alert('Kaydedildi', `${ml} ml biberon kaydı eklendi.`);
  };

  const deleteSession = (id: string) => {
    Alert.alert('Kaydı sil', 'Bu emzirme/biberon kaydı silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => setHistory((prev) => prev.filter((x) => x.id !== id)) },
    ]);
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const todayIso = localDateKey();
  const todaySessions = history.filter((h) => localDateKey(new Date(h.endedAt || h.startedAt)) === todayIso);
  const todayBreastMin = Math.round(todaySessions.filter((h) => h.type !== 'bottle').reduce((s, h) => s + (h.durationSeconds || 0), 0) / 60);
  const todayMl = todaySessions.filter((h) => h.type === 'bottle').reduce((s, h) => s + (h.amountMl || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Emzirme & Beslenme Sayacı 🍼</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Bugün: {todaySessions.length} kayıt · {todayBreastMin} dk emzirme · {todayMl} ml biberon
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.timerCard, { backgroundColor: isDark ? '#2D1F32' : '#FFF0F6', borderColor: Colors.floPink + '30' }]}>
          <Text style={[styles.timerLabel, { color: colors.textMuted }]}>
            {activeSide === 'left' ? 'SOL GÖĞÜS — durdurunca kaydedilir' : activeSide === 'right' ? 'SAĞ GÖĞÜS — durdurunca kaydedilir' : 'HAZIRDA'}
          </Text>
          <Text style={[styles.bigTimerText, { color: Colors.floPink }]}>{formatTimer(seconds)}</Text>
          <View style={styles.breastButtonsRow}>
            <Pressable
              style={[styles.breastBtn, { backgroundColor: activeSide === 'left' ? Colors.floPink : isDark ? '#3D2032' : '#FFFFFF', borderColor: Colors.floPink }]}
              onPress={() => toggleSide('left')}
            >
              <Ionicons name="heart" size={28} color={activeSide === 'left' ? '#FFFFFF' : Colors.floPink} />
              <Text style={[styles.breastBtnText, { color: activeSide === 'left' ? '#FFFFFF' : colors.text }]}>
                {activeSide === 'left' ? 'Kaydet & Durdur' : 'Sol Göğüs'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.breastBtn, { backgroundColor: activeSide === 'right' ? Colors.floPink : isDark ? '#3D2032' : '#FFFFFF', borderColor: Colors.floPink }]}
              onPress={() => toggleSide('right')}
            >
              <Ionicons name="heart" size={28} color={activeSide === 'right' ? '#FFFFFF' : Colors.floPink} />
              <Text style={[styles.breastBtnText, { color: activeSide === 'right' ? '#FFFFFF' : colors.text }]}>
                {activeSide === 'right' ? 'Kaydet & Durdur' : 'Sağ Göğüs'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.bottleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.bottleTop}>
            <Ionicons name="beaker-outline" size={22} color={Colors.floTeal} />
            <Text style={[styles.bottleTitle, { color: colors.text }]}>Biberon / sağılmış süt</Text>
          </View>
          <View style={styles.bottleInputRow}>
            <TextInput
              style={[styles.bottleInput, { color: colors.text, borderColor: colors.border }]}
              keyboardType="numeric"
              value={bottleAmount}
              onChangeText={setBottleAmount}
            />
            <Text style={[styles.mlLabel, { color: colors.textMuted }]}>ml</Text>
            <Pressable style={[styles.saveBottleBtn, { backgroundColor: Colors.floTeal }]} onPress={handleAddBottle}>
              <Text style={styles.saveBottleText}>Kaydet</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.histWrap}>
          <Text style={[styles.histTitle, { color: colors.text }]}>Tüm kayıtlar ({history.length})</Text>
          {!loaded ? (
            <Text style={{ color: colors.textMuted }}>Kayıtlar yükleniyor…</Text>
          ) : history.length === 0 ? (
            <Text style={{ color: colors.textMuted, lineHeight: 20 }}>
              Henüz kayıt yok. Sol/sağ göğsü durdurduğunuzda veya biberon eklediğinizde burada saklanır; sahte örnek gösterilmez.
            </Text>
          ) : (
            history.map((item) => {
              const isLeft = item.type === 'breast_left';
              const isRight = item.type === 'breast_right';
              return (
                <View key={item.id} style={[styles.histCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View style={[styles.histIcon, { backgroundColor: item.type === 'bottle' ? Colors.floTealLight : Colors.floPinkLight }]}>
                      <Ionicons name={item.type === 'bottle' ? 'beaker' : 'heart'} size={18} color={item.type === 'bottle' ? Colors.floTeal : Colors.floPink} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.histLabel, { color: colors.text }]}>
                        {isLeft ? 'Sol göğüs' : isRight ? 'Sağ göğüs' : `${item.amountMl} ml biberon`}
                      </Text>
                      <Text style={[styles.histTime, { color: colors.textMuted }]}>{formatWhen(item.endedAt)}</Text>
                    </View>
                  </View>
                  {item.durationSeconds != null && (
                    <View style={[styles.durPill, { backgroundColor: isDark ? '#3D2032' : '#FFF0F6' }]}>
                      <Text style={[styles.durText, { color: Colors.floPink }]}>{Math.max(1, Math.round(item.durationSeconds / 60))} dk</Text>
                    </View>
                  )}
                  <Pressable onPress={() => deleteSession(item.id)} hitSlop={8} style={{ marginLeft: 8 }}>
                    <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                  </Pressable>
                </View>
              );
            })
          )}
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
  timerCard: { padding: 20, borderRadius: 24, borderWidth: 1, alignItems: 'center', marginVertical: 12 },
  timerLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4, textAlign: 'center' },
  bigTimerText: { fontSize: 44, fontWeight: '900', marginVertical: 10 },
  breastButtonsRow: { flexDirection: 'row', gap: 14, width: '100%', marginTop: 8 },
  breastBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 20, borderWidth: 2, gap: 6 },
  breastBtnText: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  bottleCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  bottleTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  bottleTitle: { fontSize: 15, fontWeight: '800' },
  bottleInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bottleInput: { width: 70, height: 44, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  mlLabel: { fontSize: 14, fontWeight: '700' },
  saveBottleBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  saveBottleText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  histWrap: { marginTop: 8 },
  histTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  histCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  histIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  histLabel: { fontSize: 14, fontWeight: '700' },
  histTime: { fontSize: 11.5, marginTop: 1 },
  durPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  durText: { fontSize: 12, fontWeight: '700' },
});
