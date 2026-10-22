import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { usePeriodControllerGet, usePeriodControllerCalendar, usePeriodControllerStart } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { MedicalDisclaimer } from '@/src/components/MedicalDisclaimer';
import { customFetch } from '@/src/api/customFetch';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDateKey } from '@/src/utils/dateOnly';

import { useAuth } from '@/src/contexts/AuthContext';
import { isMaleUser } from '@/src/utils/gender';

const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function getCyclePhaseInfo(currentCycleDay: number, periodLength: number, cycleLength: number) {
  const ovulationDay = Math.max(12, cycleLength - 14);
  if (currentCycleDay <= periodLength) {
    return {
      phase: 'menstrual',
      title: 'Menstrüasyon (Adet) Fazı',
      badgeColor: '#E11D48',
      bgColor: '#FFE4E6',
      darkBgColor: '#3F121E',
      icon: 'water' as const,
      tip: 'Rahim iç dokusu yenileniyor. Sıcak bitki çayları tüketin, vücudunuzu dinlendirin ve hafif yürüyüşleri tercih edin.',
      hormone: 'Östrojen ve progesteron dinlenme seviyesinde',
    };
  } else if (currentCycleDay < ovulationDay - 1) {
    return {
      phase: 'follicular',
      title: 'Foliküler Faz',
      badgeColor: '#8B5CF6',
      bgColor: '#EDE9FE',
      darkBgColor: '#281744',
      icon: 'sparkles' as const,
      tip: 'Östrojen yükseliyor! Enerji seviyeniz, yaratıcılığınız ve odaklanma yeteneğiniz ayın en verimli seviyesine doğru çıkıyor.',
      hormone: 'Östrojen artıyor, foliküller olgunlaşıyor',
    };
  } else if (currentCycleDay <= ovulationDay + 1) {
    return {
      phase: 'ovulation',
      title: 'Yumurtlama (Ovülasyon) Fazı',
      badgeColor: '#059669',
      bgColor: '#D1FAE5',
      darkBgColor: '#0E3A2F',
      icon: 'flower' as const,
      tip: 'Doğurganlığın zirve yaptığı günlerdeyiz. Cilt parlaklığı, sosyalleşme isteği ve özgüven en yüksek noktada.',
      hormone: 'LH ve östrojen tepe noktasında',
    };
  } else {
    return {
      phase: 'luteal',
      title: 'Luteal Faz',
      badgeColor: '#D97706',
      bgColor: '#FEF3C7',
      darkBgColor: '#3F280D',
      icon: 'moon' as const,
      tip: 'Progesteron baskın. Bedeniniz sakinlik arar. Magnezyum, bitter çikolata, ılık duş ve düzenli uyku kendinizi iyi hissettirecektir.',
      hormone: 'Progesteron yüksek, vücut dinginlik arıyor',
    };
  }
}

function formatDateTr(dStr?: string | Date | null) {
  if (!dStr) return '-';
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

function getDaysRemaining(nextDateStr?: string | Date | null) {
  if (!nextDateStr) return null;
  const target = new Date(nextDateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function PeriodScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const male = isMaleUser(user);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const { data: periodData, isLoading, refetch } = usePeriodControllerGet({
    query: { enabled: !male },
  });
  const { data: calendarData, refetch: refetchCal } = usePeriodControllerCalendar(
    { month: viewMonth, year: viewYear },
    { query: { enabled: !male } },
  );
  const startMutation = usePeriodControllerStart();
  const [refreshing, setRefreshing] = useState(false);
  const [periodStartedToday, setPeriodStartedToday] = useState(false);
  const [lastActionDate, setLastActionDate] = useState<string | null>(null);
  const [lastActionType, setLastActionType] = useState<'started' | 'ended' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showStartFeedback, setShowStartFeedback] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const todayStr = localDateKey(now);

  useEffect(() => {
    if (male) {
      Alert.alert('Erişim Kısıtlandı', 'Regl takibi erkek kullanıcılar için geçerli değildir.');
      router.replace('/tabs/home');
    }
  }, [male, router]);

  // Load last period action from storage
  useEffect(() => {
    const checkLastAction = async () => {
      try {
        const [d, t, legacyStart] = await Promise.all([
          AsyncStorage.getItem('last_period_action_date'),
          AsyncStorage.getItem('last_period_action_type'),
          AsyncStorage.getItem('last_period_start_date'),
        ]);
        if (d) setLastActionDate(d);
        if (t) setLastActionType(t as 'started' | 'ended');
        if (legacyStart === todayStr || (d === todayStr && t === 'started')) {
          setPeriodStartedToday(true);
        }
      } catch {}
    };
    checkLastAction();
  }, [todayStr]);

  const calDays = calendarData?.days ?? [];
  const calMap = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const d of calDays) {
      if (!d?.date) continue;
      const key = String(d.date).slice(0, 10);
      map.set(key, d.type ?? 'normal');
    }
    return map;
  }, [calDays]);

  useEffect(() => {
    if (calMap.get(todayStr) === 'period') {
      setPeriodStartedToday(true);
    }
  }, [calMap, todayStr]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchCal()]);
    setRefreshing(false);
  }, [refetch, refetchCal]);

  const currentCycle = periodData?.currentCycle as Record<string, unknown> | null;
  const avgCycleLength = Number(periodData?.averageCycleLength ?? 28);
  const currentCycleDayNum = Number(currentCycle?.currentCycleDay ?? 1);
  const periodLengthNum = Number(currentCycle?.periodLength ?? 5);
  const cycleLengthNum = Number(currentCycle?.cycleLength ?? avgCycleLength ?? 28);

  const isInPeriod = currentCycle
    ? (typeof currentCycle.isPeriodActive === 'boolean'
      ? Boolean(currentCycle.isPeriodActive)
      : currentCycleDayNum <= periodLengthNum)
    : false;

  const phaseInfo = getCyclePhaseInfo(currentCycleDayNum, periodLengthNum, cycleLengthNum);
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentCycleDayNum / cycleLengthNum) * 100)));
  const daysRemaining = getDaysRemaining(currentCycle?.nextPeriodDate as string);

  const invalidatePeriodQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ['/api/period'] });
    await queryClient.invalidateQueries({ queryKey: ['/api/period/calendar'] });
    await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    await Promise.all([refetch(), refetchCal()]);
  };

  const handleStartPeriod = async () => {
    if (actionLoading || startMutation.isPending) return;

    if (periodStartedToday || isInPeriod) {
      const isSameDayStart = (lastActionDate === todayStr && lastActionType === 'started') || currentCycleDayNum <= 1;
      const warningTitle = isSameDayStart ? 'Aynı Gün Regl Bitişi ⚠️' : 'Regl Dönemini Bitir ✓';
      const warningMsg = isSameDayStart
        ? 'Adet kanamanızın bugün başladığını kaydetmiştiniz. Tıbbi olarak bir adet döngüsünde kanama genellikle 3 ila 7 gün sürer.\n\nHenüz ilk günde kanamanızın bittiğini onaylamak istiyor musunuz?'
        : 'Adet kanamanızın bittiğini onaylamak istiyor musunuz?';

      Alert.alert(
        warningTitle,
        warningMsg,
        [
          { text: 'Vazgeç', style: 'cancel' },
          {
            text: 'Evet, Regl Bitti',
            style: isSameDayStart ? 'destructive' : 'default',
            onPress: async () => {
              setActionLoading(true);
              try {
                await customFetch('/api/period/end', {
                  method: 'POST',
                  body: JSON.stringify({ date: todayStr }),
                });
                setPeriodStartedToday(false);
                setLastActionDate(todayStr);
                setLastActionType('ended');
                await AsyncStorage.setItem('last_period_action_date', todayStr);
                await AsyncStorage.setItem('last_period_action_type', 'ended');
                await AsyncStorage.removeItem('last_period_start_date');
                await invalidatePeriodQueries();
                Alert.alert('Tamamlandı ✨', 'Regl döneminiz tamamlandı olarak kaydedildi.');
              } catch {
                Alert.alert('Hata', 'Regl bitişi kaydedilemedi.');
              } finally {
                setActionLoading(false);
              }
            },
          },
        ]
      );
      return;
    }

    const isSameDayEnd = lastActionDate === todayStr && lastActionType === 'ended';
    const startTitle = isSameDayEnd ? 'Aynı Gün Yeniden Başlatma ⚠️' : 'Regl Başladı 🌸';
    const startMsg = isSameDayEnd
      ? 'Bugün adetinizin bittiğini kaydetmiştiniz. Yeniden adet başlangıcı kaydetmek döngünüzü güncelleyecektir. Onaylıyor musunuz?'
      : 'Regl döneminizin bugün başladığını onaylamak istiyor musunuz?';

    Alert.alert(
      startTitle,
      startMsg,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet, Başladı',
          onPress: () => {
            setActionLoading(true);
            startMutation.mutate({ data: { date: todayStr } }, {
              onSuccess: async () => {
                await AsyncStorage.setItem('last_period_action_date', todayStr);
                await AsyncStorage.setItem('last_period_action_type', 'started');
                await AsyncStorage.setItem('last_period_start_date', todayStr);
                setLastActionDate(todayStr);
                setLastActionType('started');
                setPeriodStartedToday(true);
                setShowStartFeedback(true);
                setTimeout(() => setShowStartFeedback(false), 3500);
                await invalidatePeriodQueries();
                Alert.alert('Kaydedildi 🌸', 'Regl başlangıcınız başarıyla kaydedildi.');
                setActionLoading(false);
              },
              onError: () => {
                setActionLoading(false);
                Alert.alert('Hata', 'Regl başlangıcı kaydedilemedi.');
              },
            });
          },
        },
      ]
    );
  };

  const handleLogCustomDate = async (selectedDate: Date) => {
    const dateStr = localDateKey(selectedDate);
    try {
      await customFetch('/api/period/start', {
        method: 'POST',
        body: JSON.stringify({ date: dateStr }),
      });
      if (dateStr === todayStr) {
        await AsyncStorage.setItem('last_period_action_date', todayStr);
        await AsyncStorage.setItem('last_period_action_type', 'started');
        await AsyncStorage.setItem('last_period_start_date', todayStr);
        setLastActionDate(todayStr);
        setLastActionType('started');
        setPeriodStartedToday(true);
      }
      await queryClient.invalidateQueries({ queryKey: ['/api/period'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/period/calendar'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/period/history'] });
      await Promise.all([refetch(), refetchCal()]);
      Alert.alert('Başarılı ✨', 'Regl başlangıç tarihi kaydedildi.');
    } catch {
      Alert.alert('Hata', 'Kayıt yapılamadı.');
    }
  };

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthName = `${MONTHS_TR[(viewMonth - 1 + 12) % 12]} ${viewYear}`;

  const firstDay = new Date(viewYear, viewMonth - 1, 1);
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const startDow = (firstDay.getDay() + 6) % 7;

  const getColor = (type?: string) => {
    if (type === 'period') return Colors.period;
    if (type === 'fertile') return Colors.success;
    if (type === 'ovulation') return Colors.pregnancy;
    if (type === 'predicted') return Colors.period + '40';
    return 'transparent';
  };

  if (isLoading) return <LoadingScreen />;

  if (!currentCycle) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Regl Takibi 🌺</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 52 }}>🌺</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz regl takibi başlatılmamış</Text>
          <Pressable style={[styles.startBtn, { backgroundColor: Colors.period }]} onPress={() => router.push('/setup/period')}>
            <Text style={styles.startBtnText}>Takibi Başlat</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.period} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Regl Takibi 🌺</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[styles.iconBtn, { backgroundColor: Colors.period + '15', borderColor: Colors.period + '30' }]}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.period} />
          </Pressable>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: isDark ? '#2D1820' : '#FFF0F3', borderColor: Colors.period + '25' }]}>
          {/* Phase Badge */}
          <View style={[styles.phaseBadge, { backgroundColor: isDark ? phaseInfo.darkBgColor : phaseInfo.bgColor }]}>
            <Ionicons name={phaseInfo.icon} size={14} color={phaseInfo.badgeColor} />
            <Text style={[styles.phaseBadgeText, { color: phaseInfo.badgeColor }]}>
              {phaseInfo.title}
            </Text>
          </View>

          <View style={[styles.flowerCircle, { backgroundColor: Colors.period + '18' }]}>
            <Text style={{ fontSize: 32 }}>🌸</Text>
          </View>

          <Text style={[styles.cycleDay, { color: Colors.period }]}>
            Döngünün {currentCycleDayNum}. Günü
          </Text>
          <Text style={[styles.nextPeriod, { color: colors.textSecondary }]}>
            Sonraki regl: {formatDateTr(currentCycle?.nextPeriodDate as string)} {daysRemaining !== null && `(${daysRemaining > 0 ? `${daysRemaining} gün kaldı` : 'Bekleniyor'})`}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBarTrack, { backgroundColor: isDark ? '#3D2530' : '#FCE7F3' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%`, backgroundColor: phaseInfo.badgeColor },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabelText, { color: colors.textMuted }]}>1. Gün</Text>
              <Text style={[styles.progressLabelText, { color: phaseInfo.badgeColor, fontWeight: '700' }]}>
                {progressPercent}%
              </Text>
              <Text style={[styles.progressLabelText, { color: colors.textMuted }]}>{cycleLengthNum}. Gün</Text>
            </View>
          </View>

          {/* Feedback banner */}
          {showStartFeedback && (
            <View style={[styles.feedbackBanner, { backgroundColor: Colors.success + '20' }]}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={{ color: Colors.success, fontWeight: '700', fontSize: 13 }}>Regl başlangıcınız kaydedildi!</Text>
            </View>
          )}

          {/* Same Day Action Notification pill */}
          {lastActionDate === todayStr && !showStartFeedback && (
            <View style={[styles.todayActionPill, { backgroundColor: Colors.primary + '14' }]}>
              <Ionicons name="shield-checkmark-outline" size={14} color={Colors.primary} />
              <Text style={[styles.todayActionPillText, { color: Colors.primary }]}>
                {lastActionType === 'started'
                  ? 'Bugün adet başlangıcı kaydedildi (1. Gün)'
                  : 'Bugün adet tamamlandı olarak kaydedildi'}
              </Text>
            </View>
          )}

          <Pressable
            style={[
              styles.startPeriodBtn,
              { backgroundColor: (periodStartedToday || isInPeriod) ? Colors.floTeal : Colors.period },
              (actionLoading || startMutation.isPending) && styles.startPeriodBtnDisabled,
            ]}
            onPress={handleStartPeriod}
            disabled={actionLoading || startMutation.isPending}
          >
            <Ionicons name={(periodStartedToday || isInPeriod) ? 'checkmark-circle' : 'water'} size={18} color="#fff" />
            <Text style={styles.startPeriodBtnText}>
              {actionLoading || startMutation.isPending
                ? 'İşleniyor...'
                : (periodStartedToday || isInPeriod)
                  ? '✓ Regl Bitti (Tamamla)'
                  : '🩸 Bugün Regl Başladı'}
            </Text>
          </Pressable>
        </View>

        {/* 3 Quick Stat Metric Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="repeat-outline" size={16} color={Colors.period} />
            <Text style={[styles.statChipValue, { color: colors.text }]}>{avgCycleLength} Gün</Text>
            <Text style={[styles.statChipLabel, { color: colors.textMuted }]}>Ortalama Döngü</Text>
          </View>

          <View style={[styles.statChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="water-outline" size={16} color={Colors.floPink} />
            <Text style={[styles.statChipValue, { color: colors.text }]}>{periodLengthNum} Gün</Text>
            <Text style={[styles.statChipLabel, { color: colors.textMuted }]}>Regl Süresi</Text>
          </View>

          <View style={[styles.statChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="sparkles-outline" size={16} color={Colors.floTeal} />
            <Text style={[styles.statChipValue, { color: colors.text }]}>{formatDateTr(currentCycle?.ovulationDate as string)}</Text>
            <Text style={[styles.statChipLabel, { color: colors.textMuted }]}>Tahmini Ovülasyon</Text>
          </View>
        </View>

        {/* Daily Cycle Phase Wellness Card */}
        <View style={[styles.wellnessCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.wellnessHeader}>
            <View style={[styles.wellnessIconBox, { backgroundColor: phaseInfo.badgeColor + '20' }]}>
              <Ionicons name={phaseInfo.icon} size={18} color={phaseInfo.badgeColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.wellnessTitle, { color: colors.text }]}>Günün Döngü Rehberi</Text>
              <Text style={[styles.wellnessSubtitle, { color: phaseInfo.badgeColor }]}>{phaseInfo.hormone}</Text>
            </View>
          </View>
          <Text style={[styles.wellnessTip, { color: colors.textSecondary }]}>
            {phaseInfo.tip}
          </Text>
        </View>

        {/* Calendar */}
        <View style={[styles.calCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.calHeader}>
            <Pressable onPress={prevMonth} style={[styles.calNavBtn, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </Pressable>
            <Text style={[styles.calMonth, { color: colors.text }]}>{monthName?.charAt(0)?.toLocaleUpperCase('tr-TR')}{monthName?.slice(1)}</Text>
            <Pressable onPress={nextMonth} style={[styles.calNavBtn, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="chevron-forward" size={18} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.dayNamesRow}>
            {DAY_NAMES.map(d => <Text key={d} style={[styles.dayName, { color: colors.textMuted }]}>{d}</Text>)}
          </View>
          <View style={styles.calGrid}>
            {Array.from({ length: startDow }).map((_, i) => <View key={`e${i}`} style={styles.calCell} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const type = calMap.get(dateStr);
              const bg = getColor(type);
              const isToday = dateStr === todayStr;
              const hasBg = type === 'period' || type === 'fertile' || type === 'ovulation';

              return (
                <View key={day} style={styles.calCell}>
                  <View style={[
                    styles.calDay,
                    { backgroundColor: bg },
                    isToday && styles.calToday,
                    isToday && !type && { borderColor: Colors.period, borderWidth: 2 },
                  ]}>
                    <Text style={[
                      styles.calDayText,
                      { color: hasBg ? '#fff' : type === 'predicted' ? Colors.period : colors.text },
                      (hasBg || isToday) && { fontWeight: '700' },
                      isToday && !hasBg && { color: Colors.period },
                    ]}>{day}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          {/* Legend */}
          <View style={styles.legend}>
            <LegendDot color={Colors.period} label="Regl" />
            <LegendDot color={Colors.success} label="Doğurgan" />
            <LegendDot color={Colors.pregnancy} label="Yumurtlama" />
            <LegendDot color={Colors.period + '60'} label="Tahmini" />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/period/symptoms')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: Colors.period + '15' }]}>
              <Ionicons name="sparkles" size={20} color={Colors.period} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.text }]}>Semptom Ekle</Text>
            <Text style={[styles.actionSub, { color: colors.textMuted }]}>Ruh hali, ağrı, akıntı</Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/period/history')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: Colors.primary + '15' }]}>
              <Ionicons name="time" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.text }]}>Döngü Geçmişi</Text>
            <Text style={[styles.actionSub, { color: colors.textMuted }]}>Geçmiş dönemler</Text>
          </Pressable>
        </View>

        {/* Rehber & Araçlar */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Rehber & Araçlar</Text>
        <View style={styles.toolsGrid}>
          {[
            { title: 'Doğurganlık', icon: 'flower', route: '/period/fertility-guide', color: Colors.floTeal },
            { title: 'BBT grafiği', icon: 'thermometer', route: '/period/bbt-chart', color: Colors.floPurple },
            { title: 'PMS notları', icon: 'flame', route: '/period/pms-guide', color: '#EF4444' },
          ].map((t, idx) => (
            <Pressable
              key={idx}
              style={[styles.toolCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(t.route as any)}
            >
              <View style={[styles.toolIcon, { backgroundColor: t.color + '15' }]}>
                <Ionicons name={t.icon as any} size={18} color={t.color} />
              </View>
              <Text style={[styles.toolTitle, { color: colors.text }]} numberOfLines={2}>{t.title}</Text>
            </Pressable>
          ))}
        </View>

        <MedicalDisclaimer variant="fertility" style={{ marginHorizontal: 4, marginTop: 8 }} />
        <View style={{ height: 28 }} />

        {/* Date Picker Modal for Past Period Date */}
        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={handleLogCustomDate}
          selectedDate={new Date()}
          maxDate={new Date()}
          accentColor={Colors.period}
        />
      </ScrollView>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 11, color: '#888', fontWeight: '500' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.2 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },

  statusCard: {
    borderRadius: 24, padding: 22, alignItems: 'center', marginBottom: 16, borderWidth: 1,
    shadowColor: Colors.period, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3,
  },
  phaseBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 14,
  },
  phaseBadgeText: { fontSize: 12, fontWeight: '700' },
  flowerCircle: {
    width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  cycleDay: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  nextPeriod: { fontSize: 13, marginTop: 3 },

  progressContainer: { width: '100%', marginTop: 14, marginBottom: 2 },
  progressBarTrack: { height: 8, borderRadius: 4, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  progressLabelText: { fontSize: 11, fontWeight: '500' },

  feedbackBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginTop: 12,
  },
  todayActionPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 12,
  },
  todayActionPillText: { fontSize: 12, fontWeight: '600' },

  startPeriodBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 22, paddingVertical: 12, borderRadius: 16, marginTop: 16,
    shadowColor: Colors.period, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  startPeriodBtnDisabled: { opacity: 0.65 },
  startPeriodBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statChip: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 16, borderWidth: 1,
    alignItems: 'center', gap: 3,
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1,
  },
  statChipValue: { fontSize: 14, fontWeight: '800', marginTop: 2 },
  statChipLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },

  wellnessCard: {
    borderRadius: 20, padding: 16, borderWidth: 1, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 6, elevation: 1,
  },
  wellnessHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  wellnessIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  wellnessTitle: { fontSize: 14, fontWeight: '700' },
  wellnessSubtitle: { fontSize: 11.5, fontWeight: '600', marginTop: 1 },
  wellnessTip: { fontSize: 12.5, lineHeight: 18 },

  calCard: {
    borderRadius: 22, padding: 18, marginBottom: 16, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
  },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calNavBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  calMonth: { fontSize: 16, fontWeight: '700' },
  dayNamesRow: { flexDirection: 'row', marginBottom: 8 },
  dayName: { flex: 1, textAlign: 'center', fontSize: 11.5, fontWeight: '600' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', alignItems: 'center', marginBottom: 6 },
  calDay: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  calToday: { borderWidth: 2, borderColor: Colors.primary },
  calDayText: { fontSize: 13, fontWeight: '500' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 14, flexWrap: 'wrap' },

  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  actionCard: {
    flex: 1, padding: 16, borderRadius: 20, alignItems: 'center', gap: 4, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  actionIconBox: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  actionLabel: { fontSize: 14, fontWeight: '700' },
  actionSub: { fontSize: 11, textAlign: 'center' },

  disclaimer: { fontSize: 11.5, textAlign: 'center', lineHeight: 16, marginHorizontal: 20 },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginBottom: 12, marginTop: 4 },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  toolCard: { width: '31%', minWidth: 100, padding: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center', gap: 6 },
  toolIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toolTitle: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
  startBtn: {
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, marginTop: 8,
    shadowColor: Colors.period, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
