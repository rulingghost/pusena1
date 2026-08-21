import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { usePregnancyControllerGet } from '@/src/api/generated/api';

type Mode = '478' | 'box' | 'labor';

const MODES: Record<Mode, {
  label: string;
  steps: { key: string; title: string; seconds: number; color: string }[];
  cycles: number;
  about: string;
}> = {
  '478': {
    label: '4-7-8 (uyku)',
    cycles: 4,
    about: 'Yatışta zihni yavaşlatmak için. Baş dönmesi olursa oturun ve normal nefese dönün.',
    steps: [
      { key: 'inhale', title: 'Burundan al', seconds: 4, color: Colors.floTeal },
      { key: 'hold', title: 'Tut', seconds: 7, color: Colors.floPurple },
      { key: 'exhale', title: 'Ağızdan bırak', seconds: 8, color: Colors.floPink },
    ],
  },
  box: {
    label: 'Kutu (sakinleşme)',
    cycles: 6,
    about: 'Kaygı veya bekleyişte 4 eşit süre. Hamilelikte nefesi tutmayı zorlamayın; rahatsızsanız 3-3-3-3 yapın.',
    steps: [
      { key: 'in', title: 'Al', seconds: 4, color: Colors.floTeal },
      { key: 'hold1', title: 'Tut', seconds: 4, color: Colors.floPurple },
      { key: 'out', title: 'Ver', seconds: 4, color: Colors.floPink },
      { key: 'hold2', title: 'Boş bekle', seconds: 4, color: Colors.floTeal },
    ],
  },
  labor: {
    label: 'Travay ritmi',
    cycles: 8,
    about: 'Kasılma sırasında: kasılma gelirken yavaş nefes al, zirvede üfleme gibi ver. Nefes tutmak ıkınmayı bozar.',
    steps: [
      { key: 'in', title: 'Yavaş al', seconds: 4, color: Colors.floTeal },
      { key: 'out', title: 'Uzun ver', seconds: 6, color: Colors.floPink },
    ],
  },
};

export default function BreathingExerciseScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: pregnancy } = usePregnancyControllerGet({ query: { retry: false } });
  const week = (pregnancy as any)?.currentWeek as number | undefined;

  const [mode, setMode] = useState<Mode>('478');
  const cfg = MODES[mode];
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(cfg.steps[0].seconds);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    setIsActive(false);
    setStep(0);
    setTimerSeconds(MODES[mode].steps[0].seconds);
    setCompletedCycles(0);
  }, [mode]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev > 1) return prev - 1;
        const nextStep = (step + 1) % cfg.steps.length;
        if (nextStep === 0) {
          setCompletedCycles((c) => {
            const n = c + 1;
            if (n >= cfg.cycles) setIsActive(false);
            return n;
          });
        }
        setStep(nextStep);
        return cfg.steps[nextStep].seconds;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, step, cfg]);

  const current = cfg.steps[step];
  const pregNote = week
    ? `${week}. hafta: sırtüstü uzun süre yatmayın; yan yatarak veya oturarak nefes alın.`
    : 'Rahat bir oturuş veya yan yatış seçin. Baş dönürse durun.';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Nefes & rahatlama</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{pregNote}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {(Object.keys(MODES) as Mode[]).map((id) => (
            <Pressable
              key={id}
              onPress={() => setMode(id)}
              style={[styles.chip, { backgroundColor: mode === id ? Colors.floTeal : isDark ? colors.card : '#F3F4F6' }]}
            >
              <Text style={{ color: mode === id ? '#fff' : colors.text, fontWeight: '700', fontSize: 12 }}>{MODES[id].label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.about, { color: colors.textSecondary }]}>{cfg.about}</Text>

        <View style={styles.circleCenter}>
          <View
            style={[
              styles.breathCircle,
              { borderColor: current.color, backgroundColor: current.color + '22' },
            ]}
          >
            <Text style={[styles.phaseTitle, { color: current.color }]}>{isActive ? current.title.toUpperCase() : 'BAŞLA'}</Text>
            <Text style={[styles.bigTimer, { color: current.color }]}>{isActive ? timerSeconds : ''}</Text>
          </View>
          <Text style={[styles.cycleCountText, { color: colors.text }]}>
            Döngü {Math.min(completedCycles, cfg.cycles)} / {cfg.cycles}
          </Text>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: isActive ? Colors.danger : Colors.floTeal }]}
            onPress={() => {
              if (!isActive) {
                setStep(0);
                setTimerSeconds(cfg.steps[0].seconds);
                if (completedCycles >= cfg.cycles) setCompletedCycles(0);
              }
              setIsActive(!isActive);
            }}
          >
            <Ionicons name={isActive ? 'pause' : 'play'} size={22} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>{isActive ? 'Duraklat' : 'Seansı başlat'}</Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Kısa rehber</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Omuzlar düşük, çene gevşek. Burundan alın, ağızdan yavaşça verin. Hamilelikte hiper-ventilasyon (çok hızlı nefes) baş dönmesi yapar; ritmi yavaş tutun.
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Ne zaman durmalı?</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Göğüs ağrısı, nefes darlığı, baygınlık hissi veya astım atağı şüphesinde egzersizi bırakın. Bu seanslar tıbbi tedavi yerine geçmez.
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
  subtitle: { fontSize: 12, marginTop: 1, paddingRight: 8 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  about: { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  circleCenter: { alignItems: 'center', marginVertical: 20 },
  breathCircle: {
    width: 230, height: 230, borderRadius: 115, borderWidth: 4,
    alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  phaseTitle: { fontSize: 16, fontWeight: '900', textAlign: 'center' },
  bigTimer: { fontSize: 44, fontWeight: '900', marginTop: 8 },
  cycleCountText: { fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 14 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 18 },
  actionBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  card: { padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 6 },
  body: { fontSize: 13, lineHeight: 19 },
});
