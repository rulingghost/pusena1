import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { usePartnerGuide, type PartnerGuide } from '@/src/api/bloomClient';
import { isMaleUser } from '@/src/utils/gender';
import { useAuth } from '@/src/contexts/AuthContext';

const ACCENT = '#0284C7';

/** Builds the "personalised on ..." caption from whatever the API knows about the viewer. */
function buildPersonalizationCaption(guide: PartnerGuide): string {
  const parts: string[] = [];

  if (guide.perspective === 'male') parts.push('partner bakış açısı');
  else if (guide.perspective === 'female') parts.push('anne adayı bakış açısı');
  else parts.push('genel bakış açısı');

  if (guide.pregnancyWeek != null) {
    parts.push(`hamileliğin ${guide.pregnancyWeek}. haftası`);
  } else if (guide.cyclePhase) {
    parts.push(guide.cycleDay != null ? `${guide.cyclePhase} (döngünün ${guide.cycleDay}. günü)` : guide.cyclePhase);
  } else if (guide.cycleDay != null) {
    parts.push(`döngünün ${guide.cycleDay}. günü`);
  }

  if (guide.isPaired && guide.partnerName) {
    parts.push(`partneriniz ${guide.partnerName}`);
  }

  return `${parts.join(' · ')} bilgilerine göre kişiselleştirildi`;
}

export default function PartnerGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const male = isMaleUser(user);
  const router = useRouter();

  const { data, isLoading } = usePartnerGuide();
  const sections = data?.sections ?? [];
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (sections.length === 0) return;
    setActiveSectionId((current) =>
      current && sections.some((s) => s.id === current) ? current : sections[0].id,
    );
  }, [sections]);

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0] ?? null;

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={[styles.title, { color: colors.text }]}>{male ? 'Partner Rehberi' : 'Partner Rehberi 💙'}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {male ? 'Eşinizin dönemine göre sizin için yazılan destek ipuçları' : 'Size ve döneminize göre hazırlanan destek ipuçları'}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={[styles.centerText, { color: colors.textMuted }]}>Rehberiniz hazırlanıyor...</Text>
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 52 }}>💙</Text>
          <Text style={[styles.centerText, { color: colors.textSecondary }]}>
            Rehber şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: isDark ? '#152A38' : '#E8F4FC', borderColor: ACCENT + '30' },
          ]}
        >
          <Text style={[styles.heroHeadline, { color: colors.text }]}>{data.headline}</Text>
          <Text style={[styles.heroCaption, { color: colors.textSecondary }]}>
            {buildPersonalizationCaption(data)}
          </Text>
        </View>

        {/* Missing gender banner */}
        {data.viewerGender == null && (
          <View
            style={[
              styles.infoBanner,
              { backgroundColor: isDark ? '#33280F' : '#FEF6E6', borderColor: Colors.warning + '40' },
            ]}
          >
            <Ionicons name="information-circle" size={20} color={Colors.warning} />
            <View style={{ flex: 1, gap: 10 }}>
              <Text style={[styles.infoText, { color: colors.text }]}>
                Rehberi size göre kişiselleştirebilmemiz için profilinizde cinsiyet bilginiz gerekli.
              </Text>
              <Pressable
                style={[styles.infoBtn, { backgroundColor: Colors.warning }]}
                onPress={() => router.push('/profile/edit')}
              >
                <Text style={styles.infoBtnText}>Profili Düzenle</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Dynamic section tabs */}
        {sections.length > 1 && (
          <View style={styles.tabRow}>
            {sections.map((section) => {
              const isSel = activeSection?.id === section.id;
              return (
                <Pressable
                  key={section.id}
                  style={[
                    styles.tabChip,
                    { backgroundColor: isSel ? ACCENT : isDark ? colors.card : '#F3F4F6' },
                  ]}
                  onPress={() => setActiveSectionId(section.id)}
                >
                  <Text style={[styles.tabText, { color: isSel ? '#FFFFFF' : colors.text }]}>{section.title}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Active section */}
        {activeSection ? (
          <View style={{ gap: 12 }}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{activeSection.title}</Text>
              {!!activeSection.subtitle && (
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{activeSection.subtitle}</Text>
              )}

              <View style={styles.tipsList}>
                {activeSection.tips.map((tip, idx) => (
                  <View key={`${activeSection.id}-${idx}`} style={[styles.tipBox, { borderColor: colors.border }]}>
                    <Text style={styles.tipIcon}>{tip.icon || '💡'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tipTitle, { color: colors.text }]}>{tip.title}</Text>
                      <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>{tip.body}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Henüz içerik yok</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Profilinizi ve takip verilerinizi tamamladıkça size özel bölümler burada görünecek.
            </Text>
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
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  centerText: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  heroCard: { padding: 20, borderRadius: 24, borderWidth: 1 },
  heroHeadline: { fontSize: 19, fontWeight: '900', lineHeight: 26 },
  heroCaption: { fontSize: 12, lineHeight: 17, marginTop: 8 },
  infoBanner: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 14, borderRadius: 18, borderWidth: 1 },
  infoText: { fontSize: 13, lineHeight: 19, fontWeight: '600' },
  infoBtn: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12 },
  infoBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  tabRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tabChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14 },
  tabText: { fontSize: 11.5, fontWeight: '700' },
  card: { padding: 18, borderRadius: 20, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  tipsList: { gap: 10 },
  tipBox: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: 14, borderWidth: 1 },
  tipIcon: { fontSize: 20, lineHeight: 24 },
  tipTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  tipDesc: { fontSize: 12.5, lineHeight: 18 },
});
