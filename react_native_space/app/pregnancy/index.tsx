import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl, Alert, Platform, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';
import { usePregnancyControllerGet, usePregnancyControllerGetWeekContent } from '@/src/api/generated/api';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { MedicalDisclaimer } from '@/src/components/MedicalDisclaimer';
import { customFetch } from '@/src/api/customFetch';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDateKey } from '@/src/utils/dateOnly';

import { useAuth } from '@/src/contexts/AuthContext';
import { isMaleUser } from '@/src/utils/gender';

export default function PregnancyScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const male = isMaleUser(user);

  const { data: preg, isLoading, isError, refetch } = usePregnancyControllerGet({
    query: { retry: false, enabled: !male },
  });
  const currentWeek = preg?.currentWeek ?? 1;
  const { data: weekContent } = usePregnancyControllerGetWeekContent(currentWeek, { query: { enabled: !male && !!preg } });
  
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [babyGender, setBabyGender] = useState<'girl' | 'boy' | 'unisex'>('girl');
  const [sizeMode, setSizeMode] = useState<'fruit' | 'object'>('fruit');

  useEffect(() => {
    if (male) {
      Alert.alert('Erişim Kısıtlandı', 'Gebelik takibi erkek kullanıcılar için geçerli değildir.');
      router.replace('/tabs/home');
    }
  }, [male, router]);

  useEffect(() => {
    AsyncStorage.getItem('baby_gender_theme').then((g) => {
      if (g === 'girl' || g === 'boy' || g === 'unisex') setBabyGender(g);
    });
  }, []);

  const handleSetGender = async (gender: 'girl' | 'boy' | 'unisex') => {
    setBabyGender(gender);
    await AsyncStorage.setItem('baby_gender_theme', gender);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUpdateLmp = async (newDate: Date) => {
    try {
      const lmpStr = localDateKey(newDate);
      await customFetch('/api/pregnancy', {
        method: 'PUT',
        body: JSON.stringify({ lastMenstrualPeriod: lmpStr }),
      });
      await queryClient.invalidateQueries({ queryKey: ['/api/pregnancy'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      await refetch();
      Alert.alert('Başarılı ✨', 'Son adet tarihi ve gebelik haftanız güncellendi.');
    } catch {
      Alert.alert('Hata', 'Tarih güncellenemedi.');
    }
  };

  // Theme tokens based on baby gender
  const themeColor = babyGender === 'girl' ? Colors.floPink : babyGender === 'boy' ? '#0284C7' : Colors.floTeal;
  const themeBgLight = babyGender === 'girl' ? '#FFF0F6' : babyGender === 'boy' ? '#E0F2FE' : '#ECFDF5';

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8, paddingHorizontal: 16 }]}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gebelik Takibi 🤰</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.floPink} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Gebelik verileriniz yükleniyor…</Text>
        </View>
      </View>
    );
  }

  if (isError && !preg) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8, paddingHorizontal: 16 }]}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gebelik Takibi 🤰</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 52 }}>🤰</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Kayıt alınamadı. Bağlantıyı kontrol edip tekrar deneyin.</Text>
          <Pressable style={[styles.startBtn, { backgroundColor: Colors.floPink }]} onPress={() => refetch()}>
            <Text style={styles.startBtnText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!preg) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gebelik Takibi 🤰</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 52 }}>🤰</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz gebelik takibi başlatılmamış</Text>
          <Pressable style={[styles.startBtn, { backgroundColor: Colors.floPink }]} onPress={() => router.push('/pregnancy/due-date')}>
            <Text style={styles.startBtnText}>Doğum Tarihi Hesapla & Başlat</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const lmpDate = preg.lastMenstrualPeriod ? new Date(preg.lastMenstrualPeriod) : new Date();
  const babyName = (preg as any)?.babyName;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColor} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gebelik Takibi 🤰</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[styles.iconBtn, { backgroundColor: themeColor + '15', borderColor: themeColor + '30' }]}
          >
            <Ionicons name="calendar-outline" size={20} color={themeColor} />
          </Pressable>
        </View>

        {/* Baby Gender Theme Selector */}
        <View style={[styles.genderSelectorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.genderLabel, { color: colors.textMuted }]}>BEBEK TEMASI & CİNSİYET</Text>
          <View style={styles.genderButtons}>
            {[
              { key: 'girl', label: '👧 Kız Bebeğim', color: Colors.floPink },
              { key: 'boy', label: '👦 Erkek Bebeğim', color: '#0284C7' },
              { key: 'unisex', label: '✨ Sürpriz / Nötr', color: Colors.floTeal },
            ].map((g) => {
              const isSel = babyGender === g.key;
              return (
                <Pressable
                  key={g.key}
                  style={[
                    styles.genderBtn,
                    {
                      backgroundColor: isSel ? g.color : isDark ? '#2D2030' : '#F9F7F8',
                      borderColor: isSel ? g.color : colors.border,
                    },
                  ]}
                  onPress={() => handleSetGender(g.key as any)}
                >
                  <Text style={[styles.genderBtnText, { color: isSel ? '#FFFFFF' : colors.text }]}>{g.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Baby Countdown & Name Banner */}
        {babyName ? (
          <View style={[styles.babyNameCountdownCard, { backgroundColor: isDark ? '#2D1F32' : themeBgLight, borderColor: themeColor + '30' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.babyNameCircle, { backgroundColor: themeColor + '20' }]}>
                <Text style={{ fontSize: 24 }}>🍼</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.babyCountdownTitle, { color: themeColor }]}>
                  {babyName} bebeğin aramıza katılmasına
                </Text>
                <Text style={[styles.babyCountdownDays, { color: colors.text }]}>
                  Son {preg.daysRemaining ?? 0} gün kaldı 💕
                </Text>
              </View>
            </View>
            <Pressable style={styles.changeBabyNameBtn} onPress={() => router.push('/pregnancy/baby-names' as any)}>
              <Text style={{ color: themeColor, fontSize: 12, fontWeight: '700' }}>İsmi Değiştir</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.babyNamePromptCard, { backgroundColor: isDark ? '#2D1F32' : themeBgLight, borderColor: themeColor + '30' }]}
            onPress={() => router.push('/pregnancy/baby-names' as any)}
          >
            <Ionicons name="sparkles" size={20} color={themeColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.babyNamePromptTitle, { color: colors.text }]}>Bebek İsimleri Sözlüğü (200+ İsim)</Text>
              <Text style={[styles.babyNamePromptSub, { color: colors.textSecondary }]}>Anlamlar, kökenler, A-Z filtre ve Şans Çarkı</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={themeColor} />
          </Pressable>
        )}

        {/* Week Hero Card */}
        <View style={[styles.weekCard, { backgroundColor: isDark ? '#2D1F32' : themeBgLight, borderColor: themeColor + '30' }]}>
          <Image source={AppImages.babyFetusWomb} style={styles.weekFetusImage} resizeMode="cover" />
          <Text style={[styles.weekNumber, { color: themeColor }]}>{preg.currentWeek}. Hafta</Text>
          <Text style={[styles.weekDay, { color: colors.textSecondary }]}>{preg.currentDay}. Gün • {preg.trimester}. Trimester</Text>

          <View style={[styles.progressBar, { backgroundColor: isDark ? '#3D2032' : '#E5E7EB' }]}>
            <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, Math.round(Number(preg.progressPercent) || 0)))}%` as any, backgroundColor: themeColor }]} />
          </View>

          <View style={styles.dueRow}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.dueLabel, { color: colors.textMuted }]}>Tahmini Doğum</Text>
              <Text style={[styles.dueValue, { color: colors.text }]}>
                {preg.dueDate ? new Date(preg.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
              </Text>
            </View>
            <View style={[styles.remainingBadge, { backgroundColor: themeColor + '20' }]}>
              <Text style={[styles.remaining, { color: themeColor }]}>{preg.daysRemaining ?? 0} gün kaldı</Text>
            </View>
          </View>

          <Pressable style={[styles.editDateBtn, { backgroundColor: themeColor + '15' }]} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="pencil" size={13} color={themeColor} />
            <Text style={[styles.editDateText, { color: themeColor }]}>
              SAT: {lmpDate.toLocaleDateString('tr-TR')} (Tarihi Düzenle)
            </Text>
          </Pressable>
        </View>

        {/* 12 Essential Pregnancy, Baby & Postpartum Tools Grid */}
        <View style={styles.toolsGridSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Araçlar</Text>
          <View style={styles.toolsGrid}>
            {[
              { title: 'Tekme sayacı', sub: 'Hareket kaydı', icon: 'footsteps', route: '/pregnancy/kick-counter', color: Colors.floPink },
              { title: 'Kasılma sayacı', sub: '5-1-1 takibi', icon: 'timer', route: '/pregnancy/contraction-timer', color: '#EF4444' },
              { title: 'Doğum çantası', sub: 'Kontrol listesi', icon: 'briefcase', route: '/pregnancy/hospital-bag', color: Colors.floPurple },
              { title: 'Kilo takibi', sub: 'Haftalık kayıt', icon: 'scale', route: '/pregnancy/weight-tracker', color: Colors.floTeal },
            ].map((tool, idx) => (
              <Pressable
                key={idx}
                style={[styles.toolCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(tool.route as any)}
              >
                <View style={[styles.toolIconCircle, { backgroundColor: tool.color + '15' }]}>
                  <Ionicons name={tool.icon as any} size={22} color={tool.color} />
                </View>
                <Text style={[styles.toolTitle, { color: colors.text }]}>{tool.title}</Text>
                <Text style={[styles.toolSub, { color: colors.textMuted }]}>{tool.sub}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Letter from Baby to Mom — always visible during pregnancy */}
        <View style={[styles.letterCard, { backgroundColor: isDark ? '#2D1F32' : '#FFF0F7', borderColor: themeColor + '30' }]}>
          <Image source={AppImages.babySleepingClouds} style={styles.letterBabyImg} resizeMode="cover" />
          <View style={styles.letterHeader}>
            <Text style={{ fontSize: 24 }}>💌</Text>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.letterTitle, { color: Colors.floPink }]}>Bebekten Anneye Mektup</Text>
              <Text style={[styles.letterWeekSub, { color: colors.textMuted }]}>{currentWeek}. Hafta Mesajı</Text>
            </View>
          </View>
          <Text style={[styles.letterText, { color: colors.text }]}>
            {(weekContent as any)?.letterFromBaby
              ?? `Anneciğim, ${currentWeek}. haftamdayım! Her geçen gün büyüyorum ve seninle buluşmak için sabırsızlanıyorum. Seni çok seviyorum! 💕`}
          </Text>
        </View>

        {/* Current Week Content */}
        {weekContent && (
          <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.contentHeader}>
              <Ionicons name="sparkles" size={18} color={themeColor} />
              <Text style={[styles.contentTitle, { color: colors.text }]}>{weekContent.title ?? `${currentWeek}. Hafta`}</Text>
            </View>

            <View style={styles.sizeRow}>
              <View style={[styles.sizeBox, { backgroundColor: isDark ? '#2D2030' : '#F9F7F8', borderColor: themeColor + '20' }]}>
                <Text style={{ fontSize: 20, marginBottom: 2 }}>🥑</Text>
                <Text style={[styles.sizeLabel, { color: colors.textMuted }]}>Boyut Karşılaştırması</Text>
                <Text style={[styles.sizeValue, { color: themeColor }]}>{weekContent.babySize ?? '-'}</Text>
              </View>
              <View style={[styles.sizeBox, { backgroundColor: isDark ? '#2D2030' : '#F9F7F8', borderColor: themeColor + '20' }]}>
                <Text style={{ fontSize: 20, marginBottom: 2 }}>⚖️</Text>
                <Text style={[styles.sizeLabel, { color: colors.textMuted }]}>Ağırlık</Text>
                <Text style={[styles.sizeValue, { color: themeColor }]}>{weekContent.babyWeight ?? '-'}</Text>
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: colors.text }]}>🌱 Bebeğinizdeki Gelişmeler</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{weekContent.babyDevelopment ?? ''}</Text>

            <Text style={[styles.sectionLabel, { color: colors.text }]}>🤱 Bedeninizdeki Değişimler</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{weekContent.motherChanges ?? ''}</Text>

            {(weekContent.tips?.length ?? 0) > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.text }]}>💡 Uzman Tavsiyeleri</Text>
                {(weekContent.tips ?? []).map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={{ color: themeColor, fontSize: 16 }}>•</Text>
                    <Text style={[styles.tipText, { color: colors.textSecondary }]}>{tip}</Text>
                  </View>
                ))}
              </>
            )}

            {(weekContent.warnings?.length ?? 0) > 0 && (
              <View style={[styles.warningBox, { backgroundColor: Colors.danger + '10', borderColor: Colors.danger + '20' }]}>
                <Ionicons name="warning-outline" size={18} color={Colors.danger} />
                {(weekContent.warnings ?? []).map((w, i) => (
                  <Text key={i} style={[styles.warningText, { color: Colors.danger }]}>{w}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Date Picker Modal */}
        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={handleUpdateLmp}
          selectedDate={lmpDate}
          maxDate={new Date()}
          accentColor={themeColor}
        />

        <MedicalDisclaimer variant="pregnancy" style={{ marginTop: 12 }} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  genderSelectorCard: { padding: 12, borderRadius: 18, borderWidth: 1, marginBottom: 12 },
  genderLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
  genderButtons: { flexDirection: 'row', gap: 6 },
  genderBtn: { flex: 1, paddingVertical: 8, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  genderBtnText: { fontSize: 11, fontWeight: '700' },
  babyNameCountdownCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 12 },
  babyNameCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  babyCountdownTitle: { fontSize: 12, fontWeight: '700' },
  babyCountdownDays: { fontSize: 15, fontWeight: '800', marginTop: 2 },
  changeBabyNameBtn: { padding: 4 },
  babyNamePromptCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 12 },
  babyNamePromptTitle: { fontSize: 14, fontWeight: '800' },
  babyNamePromptSub: { fontSize: 11.5, marginTop: 2 },
  weekCard: { padding: 18, borderRadius: 24, borderWidth: 1, alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  weekFetusImage: { width: '100%', height: 130, borderRadius: 16, marginBottom: 10 },
  weekNumber: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  weekDay: { fontSize: 13, marginTop: 2, marginBottom: 12 },
  progressBar: { width: '100%', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 14 },
  progressFill: { height: 8, borderRadius: 4 },
  dueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 12 },
  dueLabel: { fontSize: 11 },
  dueValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  remainingBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  remaining: { fontSize: 12, fontWeight: '800' },
  editDateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  editDateText: { fontSize: 12, fontWeight: '700' },
  toolsGridSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toolCard: { width: '48%', padding: 14, borderRadius: 18, borderWidth: 1, ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 1 } }) },
  toolIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  toolTitle: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  toolSub: { fontSize: 11 },
  letterCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  letterBabyImg: { width: '100%', height: 110, borderRadius: 14, marginBottom: 10 },
  letterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  letterTitle: { fontSize: 15, fontWeight: '800' },
  letterWeekSub: { fontSize: 11, marginTop: 1 },
  letterText: { fontSize: 13.5, lineHeight: 20 },
  contentCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  contentHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  contentTitle: { fontSize: 16, fontWeight: '800' },
  sizeRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  sizeBox: { flex: 1, padding: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  sizeLabel: { fontSize: 10, marginBottom: 2 },
  sizeValue: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  sectionLabel: { fontSize: 14, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  sectionText: { fontSize: 13, lineHeight: 19 },
  tipRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginBottom: 4 },
  tipText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  warningBox: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 14, borderWidth: 1, marginTop: 12, alignItems: 'center' },
  warningText: { flex: 1, fontSize: 12, fontWeight: '600' },
  disclaimer: { fontSize: 11, textAlign: 'center', marginTop: 4 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: '600' },
  startBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 18 },
  startBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
