import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  RefreshControl,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';
import { BrandLogo } from '@/src/components/BrandLogo';
import { useDashboardControllerGetDashboard, useNotificationsControllerUnreadCount, usePeriodControllerStart, useSettingsControllerGetSettings } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { useAuth } from '@/src/contexts/AuthContext';
import { ModuleTransition } from '@/src/components/ModuleTransition';
import { filterModulesForGender, isMaleUser } from '@/src/utils/gender';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customFetch, getErrorMessage } from '@/src/api/customFetch';
import { localDateKey } from '@/src/utils/dateOnly';
import { useQueryClient } from '@tanstack/react-query';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const male = isMaleUser(user);
  const { data, isLoading, refetch } = useDashboardControllerGetDashboard();
  const { data: unreadData } = useNotificationsControllerUnreadCount();
  const startPeriodMutation = usePeriodControllerStart();
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [activeModule, setActiveModule] = useState<'period' | 'pregnancy' | 'relationship'>(male ? 'relationship' : 'period');
  const [periodActionLoading, setPeriodActionLoading] = useState(false);

  const { data: settingsData } = useSettingsControllerGetSettings();
  const activeModules = filterModulesForGender(settingsData?.activeModules ?? [], user?.gender);

  const MODULE_DEFS = [
    { id: 'period' as const, label: 'Regl & Döngü', icon: 'flower' as const, color: Colors.floPink },
    { id: 'pregnancy' as const, label: 'Gebelik', icon: 'happy' as const, color: Colors.pregnancy },
    { id: 'relationship' as const, label: 'İlişki & Biz', icon: 'heart' as const, color: Colors.relationship },
  ];
  const visibleModules = MODULE_DEFS.filter(m => activeModules.includes(m.id));

  useEffect(() => {
    if (!activeModules.length) return;
    AsyncStorage.getItem('active_home_module').then((mod) => {
      if (mod && activeModules.includes(mod)) {
        setActiveModule(mod as 'period' | 'pregnancy' | 'relationship');
      } else {
        const first = (activeModules.includes('relationship') && male)
          ? 'relationship'
          : (activeModules.includes('period') ? 'period' : (activeModules[0] as 'period' | 'pregnancy' | 'relationship'));
        setActiveModule(first);
      }
    });
  }, [activeModules.join(',')]);

  const switchModule = async (mod: 'period' | 'pregnancy' | 'relationship') => {
    if (!activeModules.includes(mod)) return;
    setActiveModule(mod);
    await AsyncStorage.setItem('active_home_module', mod);
  };

  const handleTogglePeriod = async () => {
    if (!period) {
      Alert.alert('Regl Takibi Yok', 'Regl takibini başlatmak için önce kurulum yapın.', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Kurulum', onPress: () => router.push('/setup/period') },
      ]);
      return;
    }

    const todayStr = localDateKey();
    setPeriodActionLoading(true);
    try {
      if (isPeriodActive) {
        await customFetch('/api/period/end', {
          method: 'POST',
          body: JSON.stringify({ date: todayStr }),
        });
        Alert.alert('Regl Tamamlandı ✓', 'Adet döneminiz tamamlandı olarak kaydedildi.');
      } else {
        await startPeriodMutation.mutateAsync({ data: { date: todayStr } });
        Alert.alert('Regl Başlangıcı Kaydedildi 🩸', 'Döngünüz bugün başladı olarak sisteme işlendi.');
      }
      await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/period'] });
      await refetch();
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'İşlem kaydedilemedi.'));
    } finally {
      setPeriodActionLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !data) return <LoadingScreen />;

  const pregnancy = data?.pregnancy as Record<string, unknown> | null;
  const period = data?.period as Record<string, unknown> | null;
  const relationship = data?.relationship as Record<string, unknown> | null;
  const dailyTip = data?.dailyTip as Record<string, unknown> | null;
  const unreadCount = unreadData?.count ?? 0;

  const isPeriodActive = Boolean(period?.isPeriodActive);
  const currentCycleDay = Number(period?.currentCycleDay ?? 0);
  const daysUntilOvulation = Number(period?.daysUntilOvulation ?? 0);

  const dashboardCalendar = (period?.calendarDays as Array<{ date: string; type: string }> | undefined) ?? [];
  const dayNames = ['P', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const calendarDays = dashboardCalendar.length > 0
    ? dashboardCalendar.map((item, idx) => {
        const offset = idx - 3;
        const key = String(item.date).slice(0, 10);
        const parts = key.split('-').map(Number);
        const d = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(item.date);
        return {
          offset,
          dayNum: d.getDate(),
          dayName: dayNames[d.getDay()],
          isToday: offset === 0,
          isPeriod: item.type === 'period',
          isFertile: item.type === 'fertile' || item.type === 'ovulation',
        };
      })
    : [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return {
          offset,
          dayNum: d.getDate(),
          dayName: dayNames[d.getDay()],
          isToday: offset === 0,
          isPeriod: false,
          isFertile: false,
        };
      });
  const monthName = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

  const periodHeroTitle = isPeriodActive
    ? `Regl Günü ${currentCycleDay}`
    : daysUntilOvulation > 0
      ? `Ovülasyona ${daysUntilOvulation} Gün`
      : 'Döngü Takibiniz';

  const fertilityLabel = isPeriodActive
    ? 'Adet dönemi — dinlenmeye öncelik verin'
    : daysUntilOvulation <= 3
      ? 'Gebe Kalma Şansı: Yüksek'
      : daysUntilOvulation <= 7
        ? 'Gebe Kalma Şansı: Orta'
        : 'Gebe Kalma Şansı: Düşük';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={[styles.avatarBtn, { backgroundColor: colors.accentLight }]}
          onPress={() => router.push('/tabs/profile')}
        >
          <Ionicons name="person" size={18} color={colors.accent} />
        </Pressable>

        <View style={styles.topBarCenter}>
          <BrandLogo size={34} />
          <Text style={[styles.topBarDate, { color: colors.text }]}>{monthName}</Text>
        </View>

        <View style={styles.topBarRight}>
          {/* Messages / AI Assistant Icon (Moved from tab bar to header) */}
          <Pressable
            style={[styles.iconBtn, { backgroundColor: isDark ? colors.card : '#F3F4F6' }]}
            onPress={() => router.push('/tabs/messages')}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.accent} />
          </Pressable>

          {!male && (
          <Pressable
            style={[styles.iconBtn, { backgroundColor: isDark ? colors.card : '#F3F4F6' }]}
            onPress={() => router.push('/period/history')}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.text} />
          </Pressable>
          )}

          <Pressable
            style={[styles.iconBtn, { backgroundColor: isDark ? colors.card : '#F3F4F6' }]}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Modül geçişi — yalnızca seçili modüller */}
        {visibleModules.length > 1 && (
        <View style={[styles.moduleSwitcherCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {visibleModules.map((mod) => (
          <Pressable
            key={mod.id}
            style={[
              styles.moduleBtn,
              activeModule === mod.id && { backgroundColor: mod.color },
              visibleModules.length === 2 && { flex: 1 },
            ]}
            onPress={() => switchModule(mod.id)}
          >
            <Ionicons name={mod.icon} size={16} color={activeModule === mod.id ? '#FFFFFF' : mod.color} />
            <Text style={[styles.moduleBtnText, { color: activeModule === mod.id ? '#FFFFFF' : colors.text }]}>
              {mod.label}
            </Text>
          </Pressable>
          ))}
        </View>
        )}

        {!male && (
        <View style={styles.calendarStrip}>
          {calendarDays.map((item) => {
            const isSelected = selectedDayOffset === item.offset;
            return (
              <Pressable
                key={item.offset}
                style={[styles.calendarDayCol, isSelected && styles.selectedDayCol]}
                onPress={() => setSelectedDayOffset(item.offset)}
              >
                <Text
                  style={[
                    styles.calDayName,
                    { color: item.isToday ? colors.accent : colors.textMuted },
                    item.isToday && { fontWeight: '800' },
                  ]}
                >
                  {item.isToday ? 'BUGÜN' : item.dayName}
                </Text>

                <View
                  style={[
                    styles.calDayBubble,
                    item.isPeriod && { backgroundColor: colors.accent },
                    item.isToday && !item.isPeriod && {
                      backgroundColor: isDark ? colors.card : '#E5E7EB',
                      borderWidth: 2,
                      borderColor: colors.accent,
                    },
                    isSelected && { transform: [{ scale: 1.08 }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.calDayNum,
                      item.isPeriod
                        ? { color: '#FFFFFF', fontWeight: '800' }
                        : item.isFertile
                        ? { color: Colors.floTeal, fontWeight: '800' }
                        : { color: colors.text },
                    ]}
                  >
                    {item.dayNum}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        )}

        <ModuleTransition activeKey={activeModule} backgroundColor={colors.background}>
        {activeModule === 'period' && activeModules.includes('period') && (
          <View style={{ gap: 14 }}>
            {/* Cycle Status Hero Card */}
            <View style={[styles.heroStatusCard, { backgroundColor: isDark ? '#2D1828' : '#FFF0F6', borderColor: Colors.floPink + '30' }]}>
              <View style={styles.heroCenterContent}>
                <Image source={AppImages.cycleHormoneFlow} style={styles.heroImageBanner} resizeMode="cover" />
                <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>
                  {isPeriodActive ? 'Adet Dönemi Aktif 🩸' : 'Tahmini Doğurganlık Penceresi'}
                </Text>
                <Text style={[styles.heroMainBig, { color: isPeriodActive ? Colors.floPink : colors.text }]}>
                  {periodHeroTitle}
                </Text>
                <View style={styles.ovulationTagRow}>
                  <Ionicons name="sparkles" size={16} color={Colors.floTeal} />
                  <Text style={[styles.ovulationTagText, { color: Colors.floTeal }]}>
                    {fertilityLabel}
                  </Text>
                </View>
              </View>

              {/* "Regl Oldum / Regl Bitti" Critical Action Button */}
              <Pressable
                style={[
                  styles.periodActionBtn,
                  { backgroundColor: isPeriodActive ? Colors.floTeal : Colors.floPink },
                ]}
                onPress={handleTogglePeriod}
                disabled={periodActionLoading || startPeriodMutation.isPending}
              >
                <Ionicons name={isPeriodActive ? 'checkmark-circle' : 'water'} size={20} color="#FFFFFF" />
                <Text style={styles.periodActionBtnText}>
                  {isPeriodActive ? '✓ Regl Bitti (Döngüyü Kapat)' : '🩸 Regl Oldum (Bugün Başladı)'}
                </Text>
              </Pressable>
            </View>

            {/* Period Quick Action Shortcuts */}
            <View style={styles.modeToolsGrid}>
              {[
                { title: 'Semptom kaydet', sub: 'Bugünkü notunuz', icon: 'clipboard', route: '/period/symptoms', color: Colors.floPink },
                { title: 'Döngü takvimi', sub: 'Tüm aylar', icon: 'calendar', route: '/period', color: Colors.floTeal },
              ].map((t, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.modeToolCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push(t.route as any)}
                >
                  <View style={[styles.modeToolIcon, { backgroundColor: t.color + '15' }]}>
                    <Ionicons name={t.icon as any} size={20} color={t.color} />
                  </View>
                  <Text style={[styles.modeToolTitle, { color: colors.text }]}>{t.title}</Text>
                  <Text style={[styles.modeToolSub, { color: colors.textMuted }]}>{t.sub}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 2: GEBELİK & BEBEK GÖRÜNÜMÜ */}
        {/* ---------------------------------------------------- */}
        {activeModule === 'pregnancy' && activeModules.includes('pregnancy') && (
          <View style={{ gap: 14 }}>
            <View style={[styles.heroStatusCard, { backgroundColor: isDark ? '#2D2214' : '#FFF9F0', borderColor: Colors.pregnancy + '40' }]}>
              <View style={styles.heroCenterContent}>
                <Image source={AppImages.babySleepingClouds} style={styles.heroImageBanner} resizeMode="cover" />
                <View style={[styles.pregnancyBadge, { backgroundColor: Colors.pregnancy + '20' }]}>
                  <Ionicons name="sparkles" size={14} color={Colors.pregnancy} />
                  <Text style={[styles.pregnancyBadgeText, { color: Colors.pregnancy }]}>
                    {String(pregnancy?.currentWeek || 14)}. Hafta Gebelik
                  </Text>
                </View>

                <Text style={[styles.heroMainNumber, { color: colors.text }]}>
                  {pregnancy?.babyName ? `${pregnancy.babyName} Bebeğin Doğumuna` : 'Bebeğin Doğumuna'}
                </Text>
                <Text style={[styles.heroMainHighlight, { color: Colors.pregnancy }]}>
                  {String(pregnancy?.daysRemaining ?? '-')} Gün Kaldı 💕
                </Text>
              </View>

              <Pressable
                style={[styles.periodActionBtn, { backgroundColor: Colors.pregnancy }]}
                onPress={() => router.push('/pregnancy')}
              >
                <Ionicons name="happy" size={20} color="#FFFFFF" />
                <Text style={styles.periodActionBtnText}>Gebelik Merkezine Git</Text>
              </Pressable>
            </View>

            {/* Pregnancy Quick Tools Grid */}
            <View style={styles.modeToolsGrid}>
              {[
                { title: 'Tekme sayacı', sub: 'Hareket takibi', icon: 'footsteps', route: '/pregnancy/kick-counter', color: Colors.floPink },
                { title: 'Kasılma sayacı', sub: 'Doğum zamanı', icon: 'timer', route: '/pregnancy/contraction-timer', color: '#EF4444' },
              ].map((t, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.modeToolCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push(t.route as any)}
                >
                  <View style={[styles.modeToolIcon, { backgroundColor: t.color + '15' }]}>
                    <Ionicons name={t.icon as any} size={20} color={t.color} />
                  </View>
                  <Text style={[styles.modeToolTitle, { color: colors.text }]}>{t.title}</Text>
                  <Text style={[styles.modeToolSub, { color: colors.textMuted }]}>{t.sub}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 3: İLİŞKİ & BİZİM HİKÂYEMİZ GÖRÜNÜMÜ */}
        {/* ---------------------------------------------------- */}
        {activeModule === 'relationship' && activeModules.includes('relationship') && (
          <View style={{ gap: 14 }}>
            <View style={[styles.heroStatusCard, { backgroundColor: isDark ? '#152028' : colors.accentLight, borderColor: colors.relationship + '30' }]}>
              <View style={styles.heroCenterContent}>
                <Image source={AppImages.coupleRomanticHug} style={styles.heroImageBanner} resizeMode="cover" />
                <View style={[styles.pregnancyBadge, { backgroundColor: Colors.relationship + '15' }]}>
                  <Ionicons name="heart" size={14} color={Colors.relationship} />
                  <Text style={[styles.pregnancyBadgeText, { color: Colors.relationship }]}>
                    Bizim Hikâyemiz 💕
                  </Text>
                </View>

                <Text style={[styles.heroMainBig, { color: Colors.relationship }]}>
                  {String(relationship?.daysTogether ?? 0)} Gün
                </Text>
                <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                  Birlikte sevgi dolu anlar biriktiriyoruz
                </Text>

                <View style={styles.ovulationTagRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.relationship} />
                  <Text style={[styles.ovulationTagText, { color: Colors.relationship }]}>
                    {relationship?.daysUntilAnniversary != null
                      ? `${relationship.nextAnniversaryYear}. Yıldönümüne: ${relationship.daysUntilAnniversary} Gün`
                      : 'Yaklaşan özel gün yok'}
                  </Text>
                </View>
              </View>

              <Pressable
                style={[styles.periodActionBtn, { backgroundColor: Colors.relationship }]}
                onPress={() => router.push('/tabs/story')}
              >
                <Ionicons name="people" size={20} color="#FFFFFF" />
                <Text style={styles.periodActionBtnText}>Partner</Text>
              </Pressable>
            </View>

            {/* Couple Quick Tools Grid */}
            <View style={styles.modeToolsGrid}>
              {[
                { title: 'Özel sohbet', sub: 'Sadece ikiniz', icon: 'chatbubble-ellipses', route: '/story/couple-chat', color: Colors.relationship },
                { title: 'Partner bağla', sub: 'Kod ile eşleş', icon: 'link', route: '/tabs/story', color: Colors.floTeal },
              ].map((t, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.modeToolCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push(t.route as any)}
                >
                  <View style={[styles.modeToolIcon, { backgroundColor: t.color + '15' }]}>
                    <Ionicons name={t.icon as any} size={20} color={t.color} />
                  </View>
                  <Text style={[styles.modeToolTitle, { color: colors.text }]}>{t.title}</Text>
                  <Text style={[styles.modeToolSub, { color: colors.textMuted }]}>{t.sub}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        </ModuleTransition>

        {/* Daily Tip Card */}
        {dailyTip && (
          <View style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb-outline" size={18} color={colors.accent} />
              <Text style={[styles.tipTitle, { color: colors.text }]}>Günün Sağlık İpucu</Text>
            </View>
            <Text style={[styles.tipBody, { color: colors.textSecondary }]}>
              {String(dailyTip?.content ?? dailyTip?.title ?? 'Yeterli su tüketimi ve hafif yürüyüşler döngü konforunuzu artırır.')}
            </Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10 },
  avatarBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  topBarCenter: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  topBarDate: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  unreadBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: Colors.danger, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  unreadBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  moduleSwitcherCard: { flexDirection: 'row', padding: 4, borderRadius: 16, borderWidth: 1, marginVertical: 10, gap: 4 },
  moduleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 12 },
  moduleBtnText: { fontSize: 12, fontWeight: '700' },
  calendarStrip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  calendarDayCol: { alignItems: 'center', paddingVertical: 4 },
  selectedDayCol: {},
  calDayName: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
  calDayBubble: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  calDayNum: { fontSize: 13, fontWeight: '700' },
  heroStatusCard: { padding: 18, borderRadius: 24, borderWidth: 1, alignItems: 'center', overflow: 'hidden' },
  heroCenterContent: { alignItems: 'center', marginBottom: 14, width: '100%' },
  heroImageBanner: { width: '100%', height: 110, borderRadius: 16, marginBottom: 12 },
  pregnancyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginBottom: 8 },
  pregnancyBadgeText: { fontSize: 12, fontWeight: '800' },
  heroSubtitle: { fontSize: 13, marginTop: 4 },
  heroMainBig: { fontSize: 36, fontWeight: '900', letterSpacing: -1, marginVertical: 4 },
  heroMainNumber: { fontSize: 16, fontWeight: '700' },
  heroMainHighlight: { fontSize: 24, fontWeight: '900', marginTop: 4 },
  ovulationTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  ovulationTagText: { fontSize: 12.5, fontWeight: '700' },
  periodActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', paddingVertical: 14, borderRadius: 18 },
  periodActionBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  modeToolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  modeToolCard: { width: '48%', padding: 14, borderRadius: 18, borderWidth: 1, ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 1 } }) },
  modeToolIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  modeToolTitle: { fontSize: 13.5, fontWeight: '800', marginBottom: 2 },
  modeToolSub: { fontSize: 10.5 },
  tipCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginTop: 4 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  tipTitle: { fontSize: 14, fontWeight: '800' },
  tipBody: { fontSize: 13, lineHeight: 18 },
});
