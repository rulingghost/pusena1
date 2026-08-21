import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';
import { usePeriodControllerGet, usePregnancyControllerGet } from '@/src/api/generated/api';
import { FITNESS_PHASES, resolvePhase, type FitnessPhaseId } from '@/src/data/cycleFitness';
import { ageInDays, loadBabyProfile } from '@/src/data/babyProfile';

export default function CycleFitnessScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: period } = usePeriodControllerGet({ query: { retry: false } });
  const { data: preg } = usePregnancyControllerGet({ query: { retry: false } });
  const [birthDays, setBirthDays] = React.useState<number | null>(null);
  const [override, setOverride] = useState<FitnessPhaseId | null>(null);

  React.useEffect(() => {
    loadBabyProfile().then((p) => setBirthDays(ageInDays(p.birthDate)));
  }, []);

  const cycleDay = period?.currentCycle?.currentCycleDay ?? null;
  const periodLength = period?.currentCycle?.periodLength ?? 5;
  const cycleLength = period?.currentCycle?.cycleLength ?? period?.averageCycleLength ?? 28;
  const isPregnant = !!preg?.isActive;
  const isPostpartum = birthDays != null && birthDays >= 0 && birthDays <= 42;

  const autoId = resolvePhase({ isPregnant, isPostpartum, cycleDay, periodLength, cycleLength });
  const selectedId = override ?? autoId;
  const currentPhase = FITNESS_PHASES.find((p) => p.id === selectedId) ?? FITNESS_PHASES[1];

  const autoLabel = useMemo(() => {
    if (isPostpartum) return `Lohusalık ${birthDays}. gün — hekim onayı olmadan spor yok`;
    if (isPregnant) return `Gebelik ${preg?.currentWeek}. hafta — konuşma temposu`;
    if (cycleDay == null) return 'Döngü kaydı yok; foliküler içerik varsayılan gösterilir, kişisel gün hesaplanamaz';
    return `Bugün döngünün ${cycleDay}. günü (${cycleLength} günlük ortalama)`;
  }, [isPostpartum, isPregnant, birthDays, preg, cycleDay, cycleLength]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Döngüye Göre Fitness</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{autoLabel}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroFitCard}>
          <Image source={AppImages.prenatalYogaMom} style={styles.heroFitImg} resizeMode="cover" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.phaseChips}>
          {FITNESS_PHASES.map((p) => {
            const isSel = selectedId === p.id;
            const isAuto = autoId === p.id;
            return (
              <Pressable
                key={p.id}
                style={[styles.phaseChip, { backgroundColor: isSel ? Colors.floPink : isDark ? colors.card : '#F3F4F6' }]}
                onPress={() => setOverride(p.id)}
              >
                <Text style={[styles.phaseChipText, { color: isSel ? '#FFFFFF' : colors.text }]}>
                  {p.title.split(' ')[0]}{isAuto ? ' · siz' : ''}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.heroCard, { backgroundColor: isDark ? '#2D1F32' : '#FFF0F6', borderColor: Colors.floPink + '30' }]}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{currentPhase.title}</Text>
          <Text style={[styles.heroDays, { color: Colors.floPink }]}>{currentPhase.dayHint} · {currentPhase.intensity}</Text>
          <Text style={[styles.energy, { color: colors.textSecondary }]}>{currentPhase.energy}</Text>
          <View style={styles.whyBox}>
            <Text style={[styles.whyTitle, { color: colors.text }]}>Hormon / neden bu tempo?</Text>
            <Text style={[styles.whyDesc, { color: colors.textSecondary }]}>{currentPhase.hormone}</Text>
          </View>
          <Text style={[styles.secTitle, { color: colors.text }]}>Bugün için hareketler</Text>
          {currentPhase.workouts.map((w, i) => (
            <View key={i} style={[styles.workoutRow, { backgroundColor: isDark ? '#3D2032' : '#FFFFFF' }]}>
              <Ionicons name="barbell-outline" size={18} color={Colors.floPink} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.workoutName, { color: colors.text }]}>{w.name} · {w.minutes}</Text>
                <Text style={[styles.how, { color: colors.textSecondary }]}>{w.how}</Text>
              </View>
            </View>
          ))}
          <Text style={[styles.secTitle, { color: colors.text, marginTop: 12 }]}>Bu evrede kaçının</Text>
          {currentPhase.avoid.map((a, i) => (
            <Text key={i} style={{ color: colors.textSecondary, marginBottom: 4 }}>• {a}</Text>
          ))}
          <Text style={[styles.secTitle, { color: colors.text, marginTop: 12 }]}>Beslenme notu</Text>
          <Text style={{ color: colors.textSecondary, lineHeight: 18 }}>{currentPhase.nutrition}</Text>
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
  heroFitCard: { width: '100%', height: 140, borderRadius: 20, overflow: 'hidden', marginVertical: 10 },
  heroFitImg: { width: '100%', height: '100%' },
  phaseChips: { gap: 8, marginVertical: 10 },
  phaseChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  phaseChipText: { fontSize: 12.5, fontWeight: '700' },
  heroCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginVertical: 8 },
  heroTitle: { fontSize: 17, fontWeight: '800' },
  heroDays: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  energy: { fontSize: 13, marginTop: 6, marginBottom: 10 },
  whyBox: { padding: 12, borderRadius: 14, backgroundColor: '#00000008', marginBottom: 16 },
  whyTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  whyDesc: { fontSize: 12.5, lineHeight: 18 },
  secTitle: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  workoutRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 14, marginBottom: 8 },
  workoutName: { fontSize: 13.5, fontWeight: '700' },
  how: { fontSize: 12, lineHeight: 17, marginTop: 2 },
});
