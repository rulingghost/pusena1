import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { usePregnancyControllerGet } from '@/src/api/generated/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProgramId = 'beginner' | 'standard' | 'endurance';

const PROGRAMS: Record<ProgramId, { label: string; squeeze: number; relax: number; reps: number; note: string }> = {
  beginner: { label: 'Başlangıç', squeeze: 3, relax: 5, reps: 8, note: 'Kasları tanıyın. İdrarı keserek değil, asansör gibi yukarı çekerek çalışın.' },
  standard: { label: 'Günlük', squeeze: 5, relax: 5, reps: 10, note: 'Günde 2–3 set yeter. Nefes tutmayın; sıkarken nefes verin.' },
  endurance: { label: 'Dayanıklılık', squeeze: 8, relax: 8, reps: 12, note: 'Sadece ağrısız ve rahatsızlık yokken. Doğumdan sonra hekim onayıyla artırın.' },
};

const KEY = 'bloom_kegel_sessions';

export default function KegelTrainerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: pregnancy } = usePregnancyControllerGet({ query: { retry: false } });
  const week = (pregnancy as any)?.currentWeek as number | undefined;

  const [program, setProgram] = useState<ProgramId>('beginner');
  const cfg = PROGRAMS[program];
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'squeeze' | 'relax'>('squeeze');
  const [timerSeconds, setTimerSeconds] = useState(cfg.squeeze);
  const [completedReps, setCompletedReps] = useState(0);
  const [weekCount, setWeekCount] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (!raw) return;
      try {
        const dates: string[] = JSON.parse(raw);
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        setWeekCount(dates.filter((d) => new Date(d).getTime() >= weekAgo).length);
      } catch {}
    });
  }, []);

  useEffect(() => {
    if (!isActive) {
      setTimerSeconds(phase === 'squeeze' ? cfg.squeeze : cfg.relax);
    }
  }, [program]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev > 1) return prev - 1;
          if (phase === 'squeeze') {
            setPhase('relax');
            return cfg.relax;
          }
          setPhase('squeeze');
          setCompletedReps((r) => {
            const next = r + 1;
            if (next >= cfg.reps) {
              setIsActive(false);
              const stamp = new Date().toISOString();
              AsyncStorage.getItem(KEY).then((raw) => {
                const dates: string[] = raw ? JSON.parse(raw) : [];
                dates.push(stamp);
                AsyncStorage.setItem(KEY, JSON.stringify(dates.slice(-60)));
                const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                setWeekCount(dates.filter((d) => new Date(d).getTime() >= weekAgo).length + 1);
              });
            }
            return next;
          });
          return cfg.squeeze;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, cfg]);

  const handleStartStop = () => {
    if (completedReps >= cfg.reps) {
      setCompletedReps(0);
      setPhase('squeeze');
      setTimerSeconds(cfg.squeeze);
    }
    setIsActive(!isActive);
  };

  const contextNote = week
    ? week >= 36
      ? `${week}. haftadasınız. Ağır ıkınma yerine kısa, kontrollü sıkma tercih edin; ağrı olursa durun.`
      : week <= 12
        ? `İlk trimester: yavaş başlayın. Kanama veya kasık ağrısı varsa egzersizi bırakıp hekime danışın.`
        : `${week}. hafta: pelvik taban doğuma hazırlık için önemlidir; günde 2 kısa set yeter.`
    : 'Hamile değilseniz de düzenli Kegel, idrar kaçırma riskini azaltmaya yardımcı olabilir.';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Kegel egzersizi</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Bu hafta {weekCount} seans tamamlandı</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: isDark ? '#2D1F32' : '#F5F3FF', borderColor: Colors.floPurple + '30' }]}>
          <Ionicons name="body-outline" size={20} color={Colors.floPurple} />
          <Text style={[styles.infoText, { color: colors.text }]}>{contextNote}</Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Program</Text>
        <View style={styles.chipRow}>
          {(Object.keys(PROGRAMS) as ProgramId[]).map((id) => (
            <Pressable
              key={id}
              disabled={isActive}
              onPress={() => {
                setProgram(id);
                setCompletedReps(0);
                setPhase('squeeze');
                setTimerSeconds(PROGRAMS[id].squeeze);
              }}
              style={[
                styles.chip,
                { backgroundColor: program === id ? Colors.floPink : isDark ? colors.card : '#F3F4F6' },
              ]}
            >
              <Text style={{ color: program === id ? '#fff' : colors.text, fontWeight: '700', fontSize: 12 }}>
                {PROGRAMS[id].label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.hint, { color: colors.textMuted }]}>{cfg.note}</Text>

        <View style={styles.trainerCenter}>
          <View
            style={[
              styles.outerCircle,
              { borderColor: phase === 'squeeze' ? Colors.floPink : Colors.floTeal },
            ]}
          >
            <View style={[styles.innerCircle, { backgroundColor: phase === 'squeeze' ? Colors.floPink : Colors.floTeal }]}>
              <Text style={styles.phaseLabel}>
                {!isActive && completedReps === 0
                  ? 'HAZIR'
                  : completedReps >= cfg.reps
                    ? 'BİTTİ'
                    : phase === 'squeeze'
                      ? 'SIK'
                      : 'BIRAK'}
              </Text>
              <Text style={styles.timerNum}>{isActive ? timerSeconds : `${cfg.squeeze}s`}</Text>
            </View>
          </View>
          <Text style={[styles.repCounterText, { color: colors.text }]}>
            Tekrar {completedReps} / {cfg.reps}
          </Text>
          <Pressable
            style={[styles.startBtn, { backgroundColor: isActive ? Colors.danger : Colors.floPink }]}
            onPress={handleStartStop}
          >
            <Ionicons name={isActive ? 'pause' : 'play'} size={22} color="#FFFFFF" />
            <Text style={styles.startBtnText}>
              {isActive ? 'Duraklat' : completedReps >= cfg.reps ? 'Yeniden' : 'Başlat'}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Doğru kası nasıl bulunur?</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            İdrar akışını kesen kasları düşünün ama idrar yaparken egzersiz yapmayın. Anüs ve vajinayı nazikçe içeri-yukarı çekin; kalça, karın ve bacaklar gevşek kalsın.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Ne işe yarar?</Text>
          {[
            'Gebelikte pelvik tabanı destekler; doğum sonrası idrar kaçırmayı azaltmaya yardımcı olabilir.',
            'Sarkma riskini tek başına “yok etmez”; ağır kaldırma, kronik öksürük ve kabızlık da önemlidir.',
            'Cinsel fonksiyona katkı sağlayabilir; mucize vaat etmez.',
          ].map((t) => (
            <View key={t} style={styles.row}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.floTeal} />
              <Text style={[styles.body, { color: colors.textSecondary, flex: 1 }]}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.warn, { backgroundColor: isDark ? '#3A2020' : '#FEF2F2' }]}>
          <Ionicons name="alert-circle" size={18} color={Colors.danger} />
          <Text style={[styles.body, { color: colors.text, flex: 1 }]}>
            Ağrı, kanama, idrar yolu enfeksiyonu şüphesi veya pelvik organ sarkması tanınız varsa Kegel’e başlamadan hekiminize sorun. Aşırı sıkma bazı kişilerde ağrıyı artırabilir.
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
  scroll: { paddingHorizontal: 20, paddingBottom: 48 },
  infoCard: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginVertical: 12 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 19 },
  sectionLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  hint: { fontSize: 12, lineHeight: 18, marginBottom: 8 },
  trainerCenter: { alignItems: 'center', marginVertical: 16 },
  outerCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  innerCircle: { width: 172, height: 172, borderRadius: 86, alignItems: 'center', justifyContent: 'center' },
  phaseLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  timerNum: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', marginTop: 4 },
  repCounterText: { fontSize: 16, fontWeight: '800', marginTop: 16, marginBottom: 12 },
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 18 },
  startBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  card: { padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10, gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '800' },
  body: { fontSize: 13, lineHeight: 19 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  warn: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 14, marginTop: 4 },
});
