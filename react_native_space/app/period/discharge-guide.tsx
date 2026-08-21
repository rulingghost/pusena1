import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';

interface DischargeType {
  id: string;
  colorName: string;
  colorHex: string;
  badge: string;
  badgeType: 'normal' | 'caution' | 'urgent';
  description: string;
  cause: string;
  doctorAdvice: string;
}

const DISCHARGE_DATA: DischargeType[] = [
  {
    id: '1',
    colorName: 'Şeffaf & Akışkan / Yumurta Akı',
    colorHex: '#E0F2FE',
    badge: 'TAMAMEN NORMAL & DOĞAL',
    badgeType: 'normal',
    description: 'Yumurtlama (ovülasyon) döneminde veya uyarılma anında görülen doğal servikal sıvıdır.',
    cause: 'Yüksek östrojen seviyesi. Bedenin spermin rahme geçişini kolaylaştırma mekanizmasıdır.',
    doctorAdvice: 'Hiçbir tedavi gerekmez, sağlıklı doğurganlığın göstergesidir.',
  },
  {
    id: '2',
    colorName: 'Beyaz & Krem / Süt Kıvamı',
    colorHex: '#F3F4F6',
    badge: 'NORMAL DÖNGÜ AKINTISI',
    badgeType: 'normal',
    description: 'Döngünün başında veya sonunda kokusuz ve kaşıntısız olan beyaz akıntıdır.',
    cause: 'Vajinanın kendi kendini temizleme mekanizması ve laktobasil florası.',
    doctorAdvice: 'Koku veya kaşıntı eşlik etmediği sürece tamamen sağlıklıdır.',
  },
  {
    id: '3',
    colorName: 'Beyaz & Peynir Kesiği (Pütürlü)',
    colorHex: '#FFFFFF',
    badge: 'MANTAR ENFEKSİYONU (KANDİDA)',
    badgeType: 'caution',
    description: 'Yoğun kaşıntı, yanma ve kızarıklıkla birlikte görülen parça parça beyaz akıntı.',
    cause: 'Candida albicans mantarının vajinal flora dengesi bozulduğunda aşırı çoğalması.',
    doctorAdvice: 'Hekim kontrolünde 1-3 günlük antifungal krem veya fitil tedavisi gerekir.',
  },
  {
    id: '4',
    colorName: 'Sarı - Yeşil & Köpüklü',
    colorHex: '#FEF08A',
    badge: 'BAKTERİYEL / PARAZİTER ENFEKSİYON',
    badgeType: 'urgent',
    description: 'Kötü balık kokulu, köpüklü ve idrarda yanma hissi yaratan akıntı.',
    cause: 'Bakteriyel Vajinozis (Gardnerella) veya Trichomonas enfeksiyonu.',
    doctorAdvice: 'Vakit kaybetmeden kadın doğum hekimine muayene olunmalı ve antibiyotik tedavisi alınmalıdır.',
  },
  {
    id: '5',
    colorName: 'Pembe & Açık Kırmızı',
    colorHex: '#FECDD3',
    badge: 'LEKELENME / YERLEŞME KANAMASI',
    badgeType: 'caution',
    description: 'Çok az miktarda açık pembe akıntı.',
    cause: 'Ovülasyon kanaması, hamilelikte yerleşme (implantasyon) veya rahim ağzı hassasiyeti.',
    doctorAdvice: '2 günden uzun sürerse veya şiddetlenirse gebelik testi yapıp doktorunuza danışın.',
  },
  {
    id: '6',
    colorName: 'Kahverengi & Koyu Lekelenme',
    colorHex: '#D6D3D1',
    badge: 'ESKİ KAN / REGL SONU',
    badgeType: 'normal',
    description: 'Reglin hemen öncesinde veya son günlerinde oksitlenmiş kahverengi kalıntı kan.',
    cause: 'Rahmin geciken eski kanı dışarı atması.',
    doctorAdvice: 'Döngü günlerinde beklenen bir durumdur.',
  },
];

export default function DischargeGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Vajinal Akıntı & Renk Skalası 🔬</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Renklerine Göre Anlamlar & Sağlık Rehberi</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={[styles.introCard, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' }]}>
          <Ionicons name="shield-checkmark" size={22} color={Colors.floTeal} />
          <Text style={[styles.introText, { color: colors.text }]}>
            Vajinal akıntı dişi üreme sisteminin doğal bir temizleme kalkanıdır. Renk, koku ve kıvam değişimleri genel hormon ve enfeksiyon durumunu gösterir.
          </Text>
        </View>

        {/* Color List */}
        <View style={styles.list}>
          {DISCHARGE_DATA.map((item) => {
            const isNormal = item.badgeType === 'normal';
            const isCaution = item.badgeType === 'caution';
            const badgeBg = isNormal ? '#DCFCE7' : isCaution ? '#FEF3C7' : '#FEE2E2';
            const badgeColor = isNormal ? '#16A34A' : isCaution ? '#D97706' : '#DC2626';

            return (
              <View key={item.id} style={[styles.colorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.topRow}>
                  <View style={[styles.colorBubble, { backgroundColor: item.colorHex, borderColor: colors.border }]} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.colorName, { color: colors.text }]}>{item.colorName}</Text>
                    <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                      <Text style={[styles.badgeText, { color: badgeColor }]}>{item.badge}</Text>
                    </View>
                  </View>
                </View>

                <Text style={[styles.descText, { color: colors.textSecondary }]}>{item.description}</Text>

                <View style={styles.metaRow}>
                  <Text style={[styles.metaTitle, { color: colors.text }]}>🩺 Olası Neden: </Text>
                  <Text style={[styles.metaBody, { color: colors.textSecondary }]}>{item.cause}</Text>
                </View>

                <View style={[styles.adviceBox, { backgroundColor: isDark ? '#2D2030' : '#F9F7F8' }]}>
                  <Ionicons name="information-circle" size={16} color={Colors.floTeal} />
                  <Text style={[styles.adviceText, { color: colors.textSecondary }]}>{item.doctorAdvice}</Text>
                </View>
              </View>
            );
          })}
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
  introCard: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginVertical: 12 },
  introText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  list: { gap: 12 },
  colorCard: { padding: 16, borderRadius: 20, borderWidth: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  colorBubble: { width: 36, height: 36, borderRadius: 18, borderWidth: 2 },
  colorName: { fontSize: 15, fontWeight: '800' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 },
  badgeText: { fontSize: 9.5, fontWeight: '900' },
  descText: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  metaTitle: { fontSize: 12.5, fontWeight: '800' },
  metaBody: { fontSize: 12.5 },
  adviceBox: { flexDirection: 'row', gap: 8, padding: 10, borderRadius: 12, alignItems: 'center' },
  adviceText: { flex: 1, fontSize: 12, lineHeight: 16 },
});
