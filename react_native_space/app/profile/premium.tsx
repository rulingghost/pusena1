import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { BrandLogo } from '@/src/components/BrandLogo';

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [trialEnabled, setTrialEnabled] = useState(true);

  const handleSubscribe = () => {
    Alert.alert(
      'Pusena Premium 🌟',
      `${selectedPlan === 'yearly' ? 'Yıllık Plan (%70 İndirimli)' : 'Aylık Plan'} başarıyla etkinleştirildi! Tüm premium özelliklerin keyfini çıkarın.`,
      [{ text: 'Harika!', onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Close */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <BrandLogo size="sm" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Planınızı Seçin</Text>

        {/* 5-Star Testimonial */}
        <View style={styles.testimonialCard}>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <Ionicons key={i} name="star" size={20} color="#F59E0B" />
            ))}
          </View>
          <Text style={[styles.reviewQuote, { color: colors.text }]}>
            “Kesinlikle her kadının telefonunda yüklü olmalı. Döngü ve doğurganlık tahminleri muhteşem çalışıyor. Gebe kalmak veya bedenini tanımak isteyen herkes edinmeli.”
          </Text>
          <Text style={[styles.reviewAuthor, { color: colors.textMuted }]}>
            Gülcan Y. • Pusena Premium Üyesi
          </Text>
        </View>

        {/* 70% Discount Promo Banner */}
        <View style={[styles.promoBanner, { backgroundColor: Colors.floPurple }]}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>%70 İNDİRİMLİ</Text>
          </View>
          <Text style={styles.promoPrice}>
            <Text style={styles.strikePrice}>₺779,88 </Text>
            Yılda Sadece ₺226,99
          </Text>
          <Text style={styles.promoSub}>
            Bu teklif sınırlı sürelidir. Yıllık planı seçin ve %70 tasarruf edin!
          </Text>
        </View>

        {/* Free Trial Toggle */}
        <View style={[styles.toggleCard, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleTitle, { color: colors.text }]}>
              14 Günlük Ücretsiz Deneme
            </Text>
            <Text style={[styles.toggleSub, { color: colors.textMuted }]}>
              İstediğiniz an tek tıkla iptal edebilirsiniz
            </Text>
          </View>
          <Switch
            value={trialEnabled}
            onValueChange={setTrialEnabled}
            trackColor={{ false: '#D1D5DB', true: Colors.floPink }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Plan Cards */}
        <View style={styles.plansContainer}>
          {/* Yearly Plan */}
          <Pressable
            style={[
              styles.planCard,
              {
                backgroundColor: selectedPlan === 'yearly' ? Colors.floPinkLight : isDark ? colors.card : '#FFFFFF',
                borderColor: selectedPlan === 'yearly' ? Colors.floPink : colors.border,
                borderWidth: selectedPlan === 'yearly' ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            {trialEnabled && (
              <View style={[styles.trialHeaderTag, { backgroundColor: Colors.floPink }]}>
                <Text style={styles.trialHeaderText}>14 GÜNLÜK ÜCRETSİZ DENEME</Text>
              </View>
            )}
            <View style={styles.planCardContent}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.planName, { color: colors.text }]}>Yıllık Plan</Text>
                <Text style={[styles.planDetail, { color: colors.textMuted }]}>12 ay • ₺226,99</Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={[styles.priceMonthly, { color: colors.text }]}>₺18,92/ay</Text>
                <Ionicons
                  name={selectedPlan === 'yearly' ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={selectedPlan === 'yearly' ? Colors.floPink : colors.textMuted}
                />
              </View>
            </View>
          </Pressable>

          {/* Monthly Plan */}
          <Pressable
            style={[
              styles.planCard,
              {
                backgroundColor: selectedPlan === 'monthly' ? Colors.floPinkLight : isDark ? colors.card : '#FFFFFF',
                borderColor: selectedPlan === 'monthly' ? Colors.floPink : colors.border,
                borderWidth: selectedPlan === 'monthly' ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planCardContent}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.planName, { color: colors.text }]}>Aylık Plan</Text>
                <Text style={[styles.planDetail, { color: colors.textMuted }]}>Her ay yenilenir</Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={[styles.priceMonthly, { color: colors.text }]}>₺64,99/ay</Text>
                <Ionicons
                  name={selectedPlan === 'monthly' ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={selectedPlan === 'monthly' ? Colors.floPink : colors.textMuted}
                />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Feature List */}
        <View style={styles.featureList}>
          <Text style={[styles.featureListTitle, { color: colors.text }]}>
            Pusena Premium Neleri İçerir?
          </Text>

          {[
            'Kişiselleştirilmiş ovülasyon ve gebelik tahminleri (%99 doğruluk)',
            'Tüm hekim onaylı makaleler ve sesli rehberlere sınırsız erişim',
            'Pusena for Partners canlı partner senkronizasyonu',
            'Günlük Sağlık Asistanı sınırsız soru-cevap',
            'Gelişmiş döngü geçmişi analitiği ve hekim PDF raporu',
          ].map((item, i) => (
            <View key={i} style={styles.featureItemRow}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.floPink} />
              <Text style={[styles.featureItemText, { color: colors.text }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Subscribe Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <Pressable
          style={[styles.subscribeBtn, { backgroundColor: Colors.floPink }]}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeBtnText}>
            {trialEnabled
              ? '14 Günlük Ücretsiz Denemeyi Başlatın'
              : 'Hemen Abone Olun'}
          </Text>
        </Pressable>
        <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
          Ücretsiz deneme istediğiniz zaman Google Play veya App Store üzerinden iptal edilebilir.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 20 },
  testimonialCard: { alignItems: 'center', marginBottom: 24 },
  starRow: { flexDirection: 'row', gap: 4, marginBottom: 12 },
  reviewQuote: { fontSize: 14, lineHeight: 22, textAlign: 'center', fontStyle: 'italic', marginBottom: 8 },
  reviewAuthor: { fontSize: 12, fontWeight: '600' },
  promoBanner: {
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  discountBadge: { backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  discountBadgeText: { color: Colors.floPurple, fontSize: 13, fontWeight: '900' },
  promoPrice: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  strikePrice: { textDecorationLine: 'line-through', opacity: 0.7, fontSize: 15 },
  promoSub: { color: '#FFFFFF', fontSize: 11, textAlign: 'center', opacity: 0.9 },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  toggleTitle: { fontSize: 14, fontWeight: '700' },
  toggleSub: { fontSize: 11, marginTop: 2 },
  plansContainer: { gap: 12, marginBottom: 24 },
  planCard: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  trialHeaderTag: { paddingVertical: 4, alignItems: 'center' },
  trialHeaderText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  planCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  planName: { fontSize: 16, fontWeight: '800' },
  planDetail: { fontSize: 12, marginTop: 2 },
  priceCol: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  priceMonthly: { fontSize: 15, fontWeight: '800' },
  featureList: { gap: 12 },
  featureListTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  featureItemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  featureItemText: { fontSize: 13, flex: 1, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, alignItems: 'center' },
  subscribeBtn: { height: 52, borderRadius: 16, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  subscribeBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  disclaimerText: { fontSize: 11, textAlign: 'center', lineHeight: 15 },
});
