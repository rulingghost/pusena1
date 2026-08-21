import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

interface Contraction {
  id: string;
  startTime: number;
  durationSeconds: number;
  intervalMinutes?: number;
}

const KEY = 'contraction_history';

export default function ContractionTimerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [isContracting, setIsContracting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const startedAt = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((data) => {
      if (!data) return;
      try {
        const parsed = JSON.parse(data) as Contraction[];
        const dayAgo = Date.now() - 36 * 60 * 60 * 1000;
        setContractions(parsed.filter((c) => c.startTime >= dayAgo).slice(0, 80));
      } catch {}
    });
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isContracting) {
      activateKeepAwakeAsync().catch(() => {});
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      deactivateKeepAwake();
    }
    return () => {
      if (interval) clearInterval(interval);
      deactivateKeepAwake();
    };
  }, [isContracting]);

  const persist = (updated: Contraction[]) => {
    setContractions(updated);
    AsyncStorage.setItem(KEY, JSON.stringify(updated));
  };

  const lastHour = useMemo(() => {
    const from = Date.now() - 60 * 60 * 1000;
    return contractions.filter((c) => c.startTime >= from);
  }, [contractions]);

  const avgDuration = lastHour.length
    ? Math.round(lastHour.reduce((a, c) => a + c.durationSeconds, 0) / lastHour.length)
    : 0;
  const intervals = lastHour.map((c) => c.intervalMinutes).filter((n): n is number => n != null && n > 0);
  const avgInterval = intervals.length ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : 0;

  const rule511 =
    lastHour.length >= 6 &&
    avgDuration >= 45 &&
    avgInterval > 0 &&
    avgInterval <= 5;

  const handleToggle = () => {
    if (!isContracting) {
      startedAt.current = Date.now();
      setSeconds(0);
      setIsContracting(true);
      return;
    }
    setIsContracting(false);
    const startTime = startedAt.current || Date.now();
    const durationSeconds = seconds;
    let intervalMins: number | undefined;
    if (contractions.length > 0) {
      intervalMins = Math.max(0, Math.round((startTime - contractions[0].startTime) / 60000));
    }
    const item: Contraction = {
      id: startTime.toString(),
      startTime,
      durationSeconds,
      intervalMinutes: intervalMins,
    };
    persist([item, ...contractions].slice(0, 80));

    if (intervalMins != null && intervalMins <= 5 && durationSeconds >= 45) {
      Alert.alert(
        'Sık ve uzun kasılma',
        'Bu bir tanı değildir. 5-1-1 kuralı (5 dk ara, ~1 dk süre, 1 saat) doluyorsa hekiminizi veya doğum birimini arayın. Su geldiyse, şiddetli kanama veya bebek hareketlerinde belirgin azalma varsa beklemeyin.',
      );
    }
  };

  const handleClear = () => {
    Alert.alert('Kayıtlar silinsin mi?', 'Son 36 saatin kasılma listesi temizlenir.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => persist([]) },
    ]);
  };

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const rem = s % 60;
    return `${mins > 0 ? mins + ' dk ' : ''}${rem} sn`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Kasılma sayacı</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>5-1-1 kuralı · tıbbi tanı değil</Text>
        </View>
        {contractions.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoBanner, { backgroundColor: isDark ? '#2D1F32' : '#F5F3FF', borderColor: Colors.floPurple + '30' }]}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.floPurple} />
          <Text style={[styles.infoBannerText, { color: colors.text }]}>
            Kasılma başlayınca bas<Text style={{ fontWeight: '800' }}>ın</Text>, bitince tekrar basın. Ekran açık kalır. Braxton-Hicks genelde düzensiz ve kısa olur; gerçek travay düzenli sıklaşır.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statVal, { color: Colors.floPink }]}>{lastHour.length}</Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Son 1 saat</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statVal, { color: Colors.floTeal }]}>{avgDuration ? formatSecs(avgDuration) : '—'}</Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Ort. süre</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statVal, { color: Colors.floPurple }]}>{avgInterval ? `${avgInterval} dk` : '—'}</Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Ort. aralık</Text>
          </View>
        </View>

        {rule511 && (
          <View style={[styles.warn, { backgroundColor: isDark ? '#3A2020' : '#FEF2F2' }]}>
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>
              5-1-1 eşiğine yaklaşıyorsunuz. Hastane / hekim ile iletişime geçmeyi düşünün.
            </Text>
          </View>
        )}

        <View style={styles.centerAction}>
          <Pressable
            style={[styles.mainBtn, { backgroundColor: isContracting ? Colors.danger : Colors.floPink }]}
            onPress={handleToggle}
          >
            <Ionicons name={isContracting ? 'stop' : 'play'} size={40} color="#FFFFFF" />
            <Text style={styles.mainBtnDuration}>{isContracting ? `${seconds} sn` : 'BAŞLADI'}</Text>
            <Text style={styles.mainBtnSub}>{isContracting ? 'BİTİNCE DOKUN' : 'Kasılmayı kaydet'}</Text>
          </Pressable>
        </View>

        <Text style={[styles.tableTitle, { color: colors.text }]}>Kayıtlar (son 36 saat)</Text>
        {contractions.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz kasılma yok.</Text>
          </View>
        ) : (
          contractions.map((item, idx) => {
            const hot = item.durationSeconds >= 45 && (item.intervalMinutes ?? 99) <= 5;
            return (
              <View key={item.id} style={[styles.rowItem, { backgroundColor: colors.card, borderColor: hot ? Colors.floPink : colors.border }]}>
                <View>
                  <Text style={[styles.rowTime, { color: colors.text }]}>
                    {new Date(item.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={[styles.rowSub, { color: colors.textMuted }]}>#{contractions.length - idx}</Text>
                </View>
                <View style={styles.statsRight}>
                  <Text style={{ color: Colors.floPink, fontWeight: '700', fontSize: 12 }}>{formatSecs(item.durationSeconds)}</Text>
                  {item.intervalMinutes != null && (
                    <Text style={{ color: Colors.floTeal, fontWeight: '700', fontSize: 12 }}>{item.intervalMinutes} dk ara</Text>
                  )}
                </View>
                <Pressable
                  onPress={() => persist(contractions.filter((c) => c.id !== item.id))}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={16} color={colors.textMuted} />
                </Pressable>
              </View>
            );
          })
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
  clearBtn: { padding: 6 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  infoBanner: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginVertical: 12 },
  infoBannerText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, padding: 10, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  statVal: { fontSize: 14, fontWeight: '900' },
  statLbl: { fontSize: 10, marginTop: 2 },
  warn: { padding: 12, borderRadius: 12, marginTop: 10 },
  centerAction: { alignItems: 'center', marginVertical: 20 },
  mainBtn: {
    width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 6 },
    }),
  },
  mainBtnDuration: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 8 },
  mainBtnSub: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', marginTop: 2, opacity: 0.9 },
  tableTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  emptyBox: { padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  emptyText: { fontSize: 13 },
  rowItem: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  rowTime: { fontSize: 15, fontWeight: '700' },
  rowSub: { fontSize: 12, marginTop: 2 },
  statsRight: { flex: 1, alignItems: 'flex-end', gap: 2 },
});
