import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useFertilityOverview } from '@/src/api/bloomClient';

const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const NEUTRAL_GREY = '#6B7280';

type TabKey = 'calc' | 'window' | 'tips';

function formatTrDate(value: string | null | undefined, withWeekday = true): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  const base = `${d.getDate()} ${MONTHS_TR[d.getMonth()] ?? ''}`;
  return withWeekday ? `${base} ${DAYS_TR[d.getDay()] ?? ''}`.trim() : base;
}

/** Maps the API's Turkish impact wording to a badge colour. */
function impactColor(impact: string | null | undefined): string {
  const key = (impact ?? '').toLocaleLowerCase('tr-TR').trim();
  if (key.includes('hafif') && key.includes('olumsuz')) return Colors.warning;
  if (key.includes('olumsuz')) return Colors.danger;
  if (key.includes('olumlu')) return Colors.floGreen;
  return NEUTRAL_GREY;
}

export default function FertilityGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>('calc');
  const { data, isLoading } = useFertilityOverview();

  const fertileWindow = data?.fertileWindow ?? [];
  const factors = data?.factors ?? [];
  const tips = data?.tips ?? [];

  // Bars are scaled against the best day in the window so the shape stays readable.
  const maxChance = useMemo(
    () => fertileWindow.reduce((acc, item) => Math.max(acc, item.chance ?? 0), 0) || 1,
    [fertileWindow],
  );

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={[styles.title, { color: colors.text }]}>Gebe Kalma & Doğurganlık Rehberi 🌸</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Kendi döngü kayıtlarınıza göre hesaplandı</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.floTeal} />
          <Text style={[styles.centerText, { color: colors.textMuted }]}>Doğurganlık verileriniz hazırlanıyor...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.hasData === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 52 }}>🌺</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Henüz yeterli veri yok</Text>
          <Text style={[styles.centerText, { color: colors.textSecondary }]}>
            {data?.message ?? 'Doğurganlık tahmini yapabilmemiz için önce regl döngünüzü kaydetmeniz gerekiyor.'}
          </Text>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: Colors.period }]}
            onPress={() => router.push('/setup/period')}
          >
            <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Regl Takibini Ayarla</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header}

      {/* Tabs */}
      <View style={styles.tabRow}>
        {([
          { key: 'calc', label: 'Şans Hesaplayıcı' },
          { key: 'window', label: 'Doğurganlık Pencerem' },
          { key: 'tips', label: 'Size Özel Öneriler' },
        ] as Array<{ key: TabKey; label: string }>).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[
                styles.tabChip,
                { backgroundColor: isActive ? Colors.floTeal : isDark ? colors.card : '#F3F4F6' },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, { color: isActive ? '#FFFFFF' : colors.text }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'calc' && (
          <View style={{ gap: 14 }}>
            {/* Monthly chance hero */}
            <View
              style={[
                styles.heroCard,
                { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' },
              ]}
            >
              <View
                style={[
                  styles.chanceCircle,
                  { borderColor: Colors.floTeal, backgroundColor: isDark ? '#162424' : '#FFFFFF' },
                ]}
              >
                <Text style={[styles.chancePercent, { color: Colors.floTeal }]}>
                  {data.monthlyChance != null ? `%${Math.round(data.monthlyChance)}` : '—'}
                </Text>
              </View>
              <Text style={[styles.heroSub, { color: colors.text }]}>Bu döngüdeki gebe kalma şansınız</Text>
              <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>
                Bu oran genel bir ortalama değil. Sizin kendi regl kayıtlarınız, döngü uzunluğunuz ve düzenliliğiniz,
                yaşınız ve profilinize girdiğiniz sağlık bilgileriniz birlikte değerlendirilerek hesaplandı.
              </Text>

              {(data.cycleLength != null || data.cycleCount != null || data.cycleVariation != null) && (
                <View style={styles.metaRow}>
                  {data.cycleLength != null && (
                    <Text style={[styles.metaChip, { color: Colors.floTeal, borderColor: Colors.floTeal + '40' }]}>
                      Döngü {data.cycleLength} gün
                    </Text>
                  )}
                  {data.cycleVariation != null && (
                    <Text style={[styles.metaChip, { color: Colors.floTeal, borderColor: Colors.floTeal + '40' }]}>
                      ±{data.cycleVariation} gün sapma
                    </Text>
                  )}
                  {data.cycleCount != null && (
                    <Text style={[styles.metaChip, { color: Colors.floTeal, borderColor: Colors.floTeal + '40' }]}>
                      {data.cycleCount} döngü kaydı
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Factors */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Bu Oranı Etkileyen Faktörler</Text>
              <Text style={[styles.cardSubText, { color: colors.textSecondary }]}>
                Aşağıdaki her başlık, sizin verilerinizden okunan ve şansınızı yukarı ya da aşağı çeken bir etkendir.
              </Text>

              {factors.length === 0 ? (
                <Text style={[styles.mucusDesc, { color: colors.textMuted }]}>
                  Faktör analizi için henüz yeterli bilgi yok. Profilinizi ve döngü kayıtlarınızı tamamladıkça burası
                  dolacak.
                </Text>
              ) : (
                <View style={styles.mucusList}>
                  {factors.map((factor, idx) => {
                    const badge = impactColor(factor.impact);
                    return (
                      <View key={`${factor.label}-${idx}`} style={[styles.mucusItem, { borderColor: colors.border }]}>
                        <View style={styles.mucusTop}>
                          <Text style={[styles.mucusPhase, { color: colors.text, flex: 1 }]}>{factor.label}</Text>
                          <View style={[styles.mucusTag, { backgroundColor: badge + '20' }]}>
                            <Text style={[styles.mucusTagText, { color: badge }]}>
                              {(factor.impact ?? 'bilinmiyor').toLocaleUpperCase('tr-TR')}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.mucusDesc, { color: colors.textSecondary }]}>{factor.detail}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'window' && (
          <View style={{ gap: 14 }}>
            {/* Phase summary */}
            <View
              style={[
                styles.card,
                { backgroundColor: isDark ? '#2D2030' : '#F9F7F8', borderColor: Colors.floPurple + '30' },
              ]}
            >
              {data.currentCycleDay != null && (
                <Text style={[styles.summaryDay, { color: Colors.floPurple }]}>
                  Döngünüzün {data.currentCycleDay}. günündesiniz
                </Text>
              )}
              {data.phase && (
                <>
                  <Text style={[styles.summaryPhase, { color: colors.text }]}>{data.phase.label}</Text>
                  <Text style={[styles.summaryDesc, { color: colors.textSecondary }]}>{data.phase.description}</Text>
                </>
              )}
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryMetaRow}>
                <Ionicons name="egg-outline" size={16} color={Colors.floPink} />
                <Text style={[styles.summaryMetaText, { color: colors.textSecondary }]}>
                  Tahmini sonraki yumurtlama: {formatTrDate(data.nextOvulationDate)}
                </Text>
              </View>
              {data.ovulationDay != null && (
                <View style={styles.summaryMetaRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.floPink} />
                  <Text style={[styles.summaryMetaText, { color: colors.textSecondary }]}>
                    Yumurtlama genellikle döngünüzün {data.ovulationDay}. gününde
                  </Text>
                </View>
              )}
            </View>

            {/* Fertile window rows */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Doğurganlık Pencerem</Text>
              <Text style={[styles.cardSubText, { color: colors.textSecondary }]}>
                Gebe kalma şansınızın en yüksek olduğu günler, kendi döngü uzunluğunuza göre sıralandı.
              </Text>

              {fertileWindow.length === 0 ? (
                <Text style={[styles.mucusDesc, { color: colors.textMuted }]}>
                  Doğurganlık pencereniz için henüz yeterli döngü kaydı bulunmuyor.
                </Text>
              ) : (
                <View style={styles.windowRow}>
                  {fertileWindow.map((item, idx) => (
                    <View
                      key={`${item.date}-${idx}`}
                      style={[
                        styles.winItem,
                        {
                          backgroundColor: item.isToday
                            ? Colors.floTeal + (isDark ? '25' : '18')
                            : isDark
                              ? '#2D2030'
                              : '#F9F7F8',
                          borderColor: item.isToday ? Colors.floTeal : 'transparent',
                        },
                      ]}
                    >
                      <View style={styles.winHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.winDate, { color: colors.text }]}>
                            {formatTrDate(item.date)}
                            {item.isToday ? ' • Bugün' : ''}
                          </Text>
                          <Text style={[styles.winLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                        </View>
                        <Text style={[styles.winChance, { color: item.isToday ? Colors.floTeal : colors.text }]}>
                          %{Math.round(item.chance ?? 0)}
                        </Text>
                      </View>
                      <View style={[styles.barTrack, { backgroundColor: isDark ? '#3D2D42' : '#EAE2EC' }]}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${Math.max(4, Math.round(((item.chance ?? 0) / maxChance) * 100))}%`,
                              backgroundColor: item.isToday ? Colors.floTeal : Colors.floPink,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* BBT Shortcut */}
            <Pressable
              style={[styles.bbtLinkBtn, { backgroundColor: Colors.floPurple }]}
              onPress={() => router.push('/period/bbt-chart')}
            >
              <Ionicons name="thermometer-outline" size={22} color="#FFFFFF" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.bbtLinkTitle}>Bazal Vücut Sıcaklığı (BBT) Grafiği</Text>
                <Text style={styles.bbtLinkSub}>Yumurtlama gününü sıcaklık artışıyla doğrula</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        )}

        {activeTab === 'tips' && (
          <View style={{ gap: 12 }}>
            {tips.length === 0 ? (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Öneri bulunamadı</Text>
                <Text style={[styles.cardSubText, { color: colors.textSecondary }]}>
                  Size özel öneriler oluşturabilmemiz için döngü kayıtlarınızı ve sağlık bilgilerinizi güncel tutun.
                </Text>
              </View>
            ) : (
              tips.map((tip, idx) => (
                <View
                  key={`${tip.title}-${idx}`}
                  style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={styles.tipHeaderRow}>
                    <View style={[styles.tipNumCircle, { backgroundColor: Colors.floPink }]}>
                      <Text style={styles.tipNumText}>{idx + 1}</Text>
                    </View>
                    <Text style={[styles.tipItemTitle, { color: colors.text }]}>{tip.title}</Text>
                  </View>
                  <Text style={[styles.tipItemDesc, { color: colors.textSecondary }]}>{tip.body}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 17, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  centerText: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  tabChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14 },
  tabText: { fontSize: 12, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroCard: { padding: 20, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
  chanceCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  chancePercent: { fontSize: 38, fontWeight: '900', letterSpacing: -1 },
  heroSub: { fontSize: 16, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  heroDesc: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 14 },
  metaChip: {
    fontSize: 11,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  card: { padding: 16, borderRadius: 20, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  cardSubText: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  summaryDay: { fontSize: 15, fontWeight: '900', marginBottom: 6 },
  summaryPhase: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  summaryDesc: { fontSize: 13, lineHeight: 19 },
  summaryDivider: { height: 1, marginVertical: 12 },
  summaryMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  summaryMetaText: { fontSize: 12.5, flex: 1 },
  windowRow: { gap: 10, marginTop: 2 },
  winItem: { padding: 12, borderRadius: 14, borderWidth: 1.5, gap: 8 },
  winHeader: { flexDirection: 'row', alignItems: 'center' },
  winDate: { fontSize: 13.5, fontWeight: '800' },
  winLabel: { fontSize: 11.5, marginTop: 1 },
  winChance: { fontSize: 16, fontWeight: '900', marginLeft: 8 },
  barTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  bbtLinkBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18 },
  bbtLinkTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  bbtLinkSub: { color: '#FFFFFF', fontSize: 12, opacity: 0.9, marginTop: 1 },
  mucusList: { gap: 10 },
  mucusItem: { padding: 12, borderRadius: 14, borderWidth: 1 },
  mucusTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 },
  mucusPhase: { fontSize: 14, fontWeight: '700' },
  mucusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  mucusTagText: { fontSize: 10, fontWeight: '800' },
  mucusDesc: { fontSize: 12.5, lineHeight: 18 },
  tipHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  tipNumCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tipNumText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  tipItemTitle: { fontSize: 15, fontWeight: '800', flex: 1 },
  tipItemDesc: { fontSize: 13, lineHeight: 19 },
});
