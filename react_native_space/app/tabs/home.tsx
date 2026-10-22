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
import { useDashboardControllerGetDashboard, useNotificationsControllerUnreadCount, usePeriodControllerStart, useSettingsControllerGetSettings } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { useAuth } from '@/src/contexts/AuthContext';
import { ModuleTransition } from '@/src/components/ModuleTransition';
import { filterModulesForGender, isMaleUser } from '@/src/utils/gender';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customFetch, getErrorMessage } from '@/src/api/customFetch';
import { localDateKey } from '@/src/utils/dateOnly';
import { useQueryClient } from '@tanstack/react-query';
import { resolveMediaUrl } from '@/src/utils/mediaUrl';

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
    { id: 'period' as const, label: 'Döngü', icon: 'water' as const, color: Colors.floPink },
    { id: 'pregnancy' as const, label: 'Gebelik', icon: 'leaf' as const, color: Colors.pregnancy },
    { id: 'relationship' as const, label: 'İlişki', icon: 'heart' as const, color: Colors.relationship },
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
    const actionDate = await AsyncStorage.getItem('last_period_action_date');
    const actionType = await AsyncStorage.getItem('last_period_action_type');

    if (isPeriodActive) {
      const isSameDayStart = (actionDate === todayStr && actionType === 'started') || currentCycleDay <= 1;
      const warningTitle = isSameDayStart ? 'Aynı Gün Regl Bitişi ⚠️' : 'Regl Dönemini Bitir ✓';
      const warningMessage = isSameDayStart
        ? 'Adet kanamanızın bugün başladığını kaydetmiştiniz. Tıbbi olarak normal bir adet kanaması genellikle 3 ila 7 gün sürer.\n\nHenüz ilk günde kanamanızın bittiğini onaylamak istiyor musunuz?'
        : 'Adet kanamanızın bittiğini onaylamak istiyor musunuz?';

      Alert.alert(warningTitle, warningMessage, [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Regl Bitti',
          style: isSameDayStart ? 'destructive' : 'default',
          onPress: async () => {
            setPeriodActionLoading(true);
            try {
              await customFetch('/api/period/end', {
                method: 'POST',
                body: JSON.stringify({ date: todayStr }),
              });
              await AsyncStorage.setItem('last_period_action_date', todayStr);
              await AsyncStorage.setItem('last_period_action_type', 'ended');
              await AsyncStorage.removeItem('last_period_start_date');
              Alert.alert('Kaydedildi ✨', 'Adet dönemi tamamlandı.');
              await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
              await queryClient.invalidateQueries({ queryKey: ['/api/period'] });
              await refetch();
            } catch (e) {
              Alert.alert('Hata', getErrorMessage(e, 'İşlem kaydedilemedi.'));
            } finally {
              setPeriodActionLoading(false);
            }
          },
        },
      ]);
      return;
    }

    const isSameDayEnd = actionDate === todayStr && actionType === 'ended';
    const startTitle = isSameDayEnd ? 'Aynı Gün Yeniden Başlatma ⚠️' : 'Regl Başladı 🌸';
    const startMessage = isSameDayEnd
      ? 'Bugün adetinizin bittiğini kaydetmiştiniz. Yeniden adet başlangıcı kaydetmek döngünüzü güncelleyecektir. Onaylıyor musunuz?'
      : 'Adet döneminizin bugün başladığını kaydetmek istiyor musunuz?';

    Alert.alert(startTitle, startMessage, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Evet, Başladı',
        onPress: async () => {
          setPeriodActionLoading(true);
          try {
            await startPeriodMutation.mutateAsync({ data: { date: todayStr } });
            await AsyncStorage.setItem('last_period_action_date', todayStr);
            await AsyncStorage.setItem('last_period_action_type', 'started');
            await AsyncStorage.setItem('last_period_start_date', todayStr);
            Alert.alert('Kaydedildi 🌸', 'Adet dönemi bugün başladı.');
            await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
            await queryClient.invalidateQueries({ queryKey: ['/api/period'] });
            await refetch();
          } catch (e) {
            Alert.alert('Hata', getErrorMessage(e, 'İşlem kaydedilemedi.'));
          } finally {
            setPeriodActionLoading(false);
          }
        },
      },
    ]);
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
    ? 'Adet dönemi'
    : daysUntilOvulation <= 3
      ? 'Doğurganlık yüksek'
      : daysUntilOvulation <= 7
        ? 'Doğurganlık orta'
        : 'Doğurganlık düşük';
  const firstName = (user?.name || 'Merhaba').split(' ')[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={[styles.avatarBtn, { backgroundColor: colors.accentLight, overflow: 'hidden' }]}
          onPress={() => router.push('/tabs/profile')}
        >
          {user?.avatarUrl ? (
            <Image source={{ uri: resolveMediaUrl(user.avatarUrl) }} style={{ width: 38, height: 38 }} />
          ) : (
            <Ionicons name="person" size={18} color={colors.accent} />
          )}
        </Pressable>

        <View style={styles.topBarCenter}>
          <Text style={[styles.hello, { color: colors.text }]}>{firstName}</Text>
          <Text style={[styles.topBarDate, { color: colors.textMuted }]}>{monthName}</Text>
        </View>

        <View style={styles.topBarRight}>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => router.push('/tabs/messages')}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.text} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={18} color={colors.text} />
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
            <View style={[styles.heroStatusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.heroKicker, { color: colors.textMuted }]}>{fertilityLabel}</Text>
              <Text style={[styles.heroMainBig, { color: colors.text }]}>{periodHeroTitle}</Text>
              <Pressable
                style={[styles.periodActionBtn, { backgroundColor: isPeriodActive ? Colors.floTeal : colors.accent }]}
                onPress={handleTogglePeriod}
                disabled={periodActionLoading || startPeriodMutation.isPending}
              >
                <Text style={styles.periodActionBtnText}>
                  {isPeriodActive ? 'Regl bitti' : 'Regl başladı'}
                </Text>
              </Pressable>
            </View>

            {/* Period Quick Action Shortcuts */}
            <View style={styles.modeToolsGrid}>
              {[
                { title: 'Semptom', sub: 'Bugün', icon: 'clipboard-outline', route: '/period/symptoms', color: Colors.floPink },
                { title: 'Takvim', sub: 'Aylar', icon: 'calendar-outline', route: '/period', color: Colors.floTeal },
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
            <View style={[styles.heroStatusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.heroKicker, { color: colors.textMuted }]}>
                {String(pregnancy?.currentWeek || '—')}. hafta
              </Text>
              <Text style={[styles.heroMainBig, { color: colors.text }]}>
                {String(pregnancy?.daysRemaining ?? '—')} gün
              </Text>
              <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                {pregnancy?.babyName ? `${pregnancy.babyName} için tahmini doğuma` : 'Tahmini doğuma'}
              </Text>
              <Pressable
                style={[styles.periodActionBtn, { backgroundColor: Colors.pregnancy }]}
                onPress={() => router.push('/pregnancy')}
              >
                <Text style={styles.periodActionBtnText}>Gebelik</Text>
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
            <View style={[styles.heroStatusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.heroKicker, { color: colors.textMuted }]}>Birlikte</Text>
              <Text style={[styles.heroMainBig, { color: colors.text }]}>
                {String(relationship?.daysTogether ?? 0)} gün
              </Text>
              <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                {relationship?.daysUntilAnniversary != null
                  ? `Yıldönümüne ${relationship.daysUntilAnniversary} gün`
                  : 'Özel gün ekleyebilirsiniz'}
              </Text>
              <Pressable
                style={[styles.periodActionBtn, { backgroundColor: colors.relationship }]}
                onPress={() => router.push('/tabs/story')}
              >
                <Text style={styles.periodActionBtnText}>Partner</Text>
              </Pressable>
            </View>

            {/* Couple Quick Tools Grid */}
            <View style={styles.modeToolsGrid}>
              {[
                { title: 'Sohbet', sub: 'Çift', icon: 'chatbubble-ellipses-outline', route: '/story/couple-chat', color: Colors.relationship },
                { title: 'Bağlan', sub: 'Kod', icon: 'link-outline', route: '/tabs/story', color: Colors.floTeal },
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
              <Text style={[styles.tipTitle, { color: colors.text }]}>
                {String(dailyTip?.title ?? 'Günün sağlık ipucu')}
              </Text>
            </View>
            <Text style={[styles.tipBody, { color: colors.textSecondary }]}>
              {String(dailyTip?.content ?? 'Su, uyku ve kısa yürüyüş çoğu günde en güvenli üçlüdür.')}
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
  topBarCenter: { flex: 1, marginLeft: 10 },
  hello: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  topBarDate: { fontSize: 12, fontWeight: '600', marginTop: 1 },
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
  heroStatusCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
  heroKicker: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2, textTransform: 'uppercase' },
  heroSubtitle: { fontSize: 13, marginTop: 2, marginBottom: 14 },
  heroMainBig: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8, marginVertical: 6 },
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
