import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { Pedometer } from 'expo-sensors';

const TARGET = 8000;
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

const DAY_LABELS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function ActivityTrackerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [available, setAvailable] = useState<boolean | null>(null);
  const [steps, setSteps] = useState(0);
  const [week, setWeek] = useState<Array<{ label: string; val: number; isToday: boolean }>>([]);
  const [message, setMessage] = useState('Telefon adım verisi okunuyor…');

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const ok = await Pedometer.isAvailableAsync().catch(() => false);
      if (cancelled) return;
      if (!ok) {
        setAvailable(false);
        setSteps(0);
        setWeek([]);
        setMessage('Bu telefonda adım sensörü yok veya izin verilmedi. Sahte adım gösterilmez; değer 0.');
        return;
      }
      setAvailable(true);

      const todayStart = startOfDay(new Date());
      const todayEnd = new Date();
      try {
        const today = await Pedometer.getStepCountAsync(todayStart, todayEnd);
        if (!cancelled) setSteps(today.steps ?? 0);
      } catch {
        if (!cancelled) {
          setSteps(0);
          setMessage('Adım geçmişi okunamadı (iOS Hareket izni veya Android etkinlik izni gerekir). 0 gösterilir.');
        }
      }

      const days: Array<{ label: string; val: number; isToday: boolean }> = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(todayStart.getTime() - i * DAY_MS);
        const dayEnd = i === 0 ? new Date() : new Date(dayStart.getTime() + DAY_MS - 1);
        let val = 0;
        try {
          const r = await Pedometer.getStepCountAsync(dayStart, dayEnd);
          val = r.steps ?? 0;
        } catch {
          val = 0;
        }
        days.push({
          label: DAY_LABELS[dayStart.getDay()],
          val,
          isToday: i === 0,
        });
      }
      if (!cancelled) {
        setWeek(days);
        setMessage('Veri cihazın adım sayacından. Google Fit/Sağlık uygulaması yoksa bazı Android modeller 0 döner.');
      }

      sub = Pedometer.watchStepCount((result) => {
        setSteps((s) => s + (result.steps || 0));
      });
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  const percent = Math.min(100, Math.round((steps / TARGET) * 100));
  const distanceKm = steps > 0 ? (steps * 0.7) / 1000 : 0;
  const calories = steps > 0 ? Math.round(steps * 0.04) : 0;
  const activeMin = steps > 0 ? Math.round(steps / 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Günlük Aktivite & Adım</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {available === false ? 'Sensör yok' : Platform.OS === 'ios' ? 'Hareket ve Fitness' : 'Cihaz adım sayacı'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' }]}>
          <View style={[styles.stepCircle, { borderColor: Colors.floTeal }]}>
            <Ionicons name="footsteps" size={32} color={Colors.floTeal} />
            <Text style={[styles.stepNumber, { color: colors.text }]}>{steps.toLocaleString('tr-TR')}</Text>
            <Text style={[styles.stepTarget, { color: colors.textMuted }]}>Hedef {TARGET.toLocaleString('tr-TR')}</Text>
          </View>
          <Text style={[styles.stepStatus, { color: Colors.floTeal }]}>
            {available === false ? '0 adım (kaynak yok)' : `%${percent} (bugün)`}
          </Text>
          <Text style={[styles.msg, { color: colors.textSecondary }]}>{message}</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.metricVal, { color: colors.text }]}>{calories} kcal</Text>
            <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Tahmini (adımdan)</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.metricVal, { color: colors.text }]}>{activeMin} dk</Text>
            <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Kabaca aktif süre</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.metricVal, { color: colors.text }]}>{distanceKm.toFixed(2)} km</Text>
            <Text style={[styles.metricLbl, { color: colors.textMuted }]}>~0,7 m/adım</Text>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Son 7 gün (cihaz)</Text>
          {week.length === 0 ? (
            <Text style={{ color: colors.textMuted }}>Grafik için adım geçmişi okunamadı — çubuklar uydurulmaz.</Text>
          ) : (
            <View style={styles.bars}>
              {week.map((d, i) => {
                const max = Math.max(TARGET, ...week.map((x) => x.val), 1);
                const h = Math.min(100, (d.val / max) * 100);
                return (
                  <View key={i} style={styles.barCol}>
                    <Text style={[styles.barVal, { color: colors.textMuted }]}>{d.val > 0 ? Math.round(d.val / 100) / 10 + 'k' : '0'}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${Math.max(d.val > 0 ? 4 : 0, h)}%`, backgroundColor: d.isToday ? Colors.floTeal : Colors.floPink }]} />
                    </View>
                    <Text style={[styles.barDay, { color: d.isToday ? Colors.floTeal : colors.textMuted }]}>{d.label}</Text>
                  </View>
                );
              })}
            </View>
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
  heroCard: { padding: 24, borderRadius: 26, borderWidth: 1, alignItems: 'center', marginVertical: 12 },
  stepCircle: { width: 170, height: 170, borderRadius: 85, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  stepNumber: { fontSize: 32, fontWeight: '900', marginTop: 4 },
  stepTarget: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  stepStatus: { fontSize: 14, fontWeight: '800', marginTop: 14 },
  msg: { fontSize: 12, textAlign: 'center', marginTop: 8, lineHeight: 17, paddingHorizontal: 8 },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  metricCard: { flex: 1, padding: 14, borderRadius: 18, borderWidth: 1, alignItems: 'center' },
  metricVal: { fontSize: 14, fontWeight: '800' },
  metricLbl: { fontSize: 10, marginTop: 2, textAlign: 'center' },
  chartCard: { padding: 18, borderRadius: 22, borderWidth: 1 },
  chartTitle: { fontSize: 15, fontWeight: '800', marginBottom: 14 },
  bars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, paddingBottom: 8 },
  barCol: { alignItems: 'center', flex: 1 },
  barVal: { fontSize: 9, marginBottom: 4 },
  barTrack: { width: 14, height: 95, backgroundColor: '#00000008', borderRadius: 7, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 7 },
  barDay: { fontSize: 11, fontWeight: '700', marginTop: 6 },
});
