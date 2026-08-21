import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AppImages } from '@/src/theme/images';

export default function PmsGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'symptoms' | 'cramps' | 'cravings' | 'supplements'>('symptoms');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>PMS & Kramplarla Başa Çıkma 🩸</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Premenstrüel Sendrom Yönetim Kılavuzu</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {[
          { key: 'symptoms', label: 'PMS Belirtileri' },
          { key: 'cramps', label: 'Kasık Ağrıları' },
          { key: 'cravings', label: 'Tatlı Krizleri' },
          { key: 'supplements', label: 'Takviyeler' },
        ].map((t) => {
          const isSel = activeTab === t.key;
          return (
            <Pressable
              key={t.key}
              style={[
                styles.tabChip,
                { backgroundColor: isSel ? Colors.floPink : isDark ? colors.card : '#F3F4F6' },
              ]}
              onPress={() => setActiveTab(t.key as any)}
            >
              <Text style={[styles.tabText, { color: isSel ? '#FFFFFF' : colors.text }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hormone Wellness Tea Hero Banner */}
        <View style={styles.heroTeaCard}>
          <Image source={AppImages.hormoneWellnessTea} style={styles.heroTeaImg} resizeMode="cover" />
        </View>
        {activeTab === 'symptoms' && (
          <View style={{ gap: 12 }}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>PMS Evresi (Luteal Dönem)</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                Yumurtlamadan sonraki 7-10 günlük luteal evrede progesteron yükselir ve regl başlangıcında aniden düşer. Bu hormonal değişim fiziksel ve duygusal semptomları tetikler:
              </Text>
              
              <View style={styles.symList}>
                {[
                  { name: 'Göğüs Hassasiyeti & Şişkinlik', desc: 'Östrojen-progesteron dalgalanması sıvı tutulmasına sebep olur.' },
                  { name: 'Duygu Durum Değişiklikleri', desc: 'Serotonin (mutluluk hormonu) seviyesindeki geçici düşüş huzursuzluk yaratır.' },
                  { name: 'Yorgunluk ve Halsizlik', desc: 'Bazal vücut sıcaklığının yüksek olması bedenin daha fazla enerji harcamasına yol açar.' },
                ].map((s, i) => (
                  <View key={i} style={[styles.symItem, { borderColor: colors.border }]}>
                    <Ionicons name="ellipse" size={8} color={Colors.floPink} style={{ marginTop: 5 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.symName, { color: colors.text }]}>{s.name}</Text>
                      <Text style={[styles.symSub, { color: colors.textSecondary }]}>{s.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'cramps' && (
          <View style={{ gap: 12 }}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Adet Kramplarını (Dismenore) Azaltma Yöntemleri</Text>
              
              <View style={styles.tipsList}>
                {[
                  { title: 'Sıcak Su Torbası veya Isı Bandı', desc: 'Alt karın bölgesine 15-20 dk ılık uygulama yapmak rahim kaslarındaki spazmları anında gevşetir.' },
                  { title: 'Magnezyum & Çinko Desteği', desc: 'Prostaglandin sentezini baskılayarak kas kasılmalarının şiddetini %50 oranında düşürür.' },
                  { title: 'Hafif Yürüyüş ve Esneme (Yin Yoga)', desc: 'Pelvik kan dolaşımını hızlandırır ve doğal ağrı kesici olan endorfin salgılatır.' },
                ].map((t, i) => (
                  <View key={i} style={[styles.tipBox, { borderColor: colors.border }]}>
                    <Ionicons name="flame" size={20} color={Colors.floPink} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tipTitle, { color: colors.text }]}>{t.title}</Text>
                      <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>{t.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'cravings' && (
          <View style={{ gap: 12 }}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Tatlı & Karbonhidrat Krizlerini Yönetme</Text>
              
              <View style={styles.tipsList}>
                {[
                  { title: 'Bitter Çikolata (%70+ Kakao)', desc: 'Yüksek magnezyum ve flavonoid içeriğiyle serotonin seviyesini destekler.' },
                  { title: 'Kompleks Karbonhidratlar', desc: 'Yulaf, kinoa ve tatlı patates kan şekerini sabit tutarak ani açlık krizlerini önler.' },
                  { title: 'Tuz ve Kafein Tüketimini Azaltın', desc: 'Aşırı tuz ödemi, aşırı kafein ise göğüs hassasiyetini ve anksiyeteyi tetikler.' },
                ].map((t, i) => (
                  <View key={i} style={[styles.tipBox, { borderColor: colors.border }]}>
                    <Ionicons name="nutrition" size={20} color={Colors.floTeal} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tipTitle, { color: colors.text }]}>{t.title}</Text>
                      <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>{t.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'supplements' && (
          <View style={{ gap: 12 }}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>PMS Döneminde Önerilen Takviyeler</Text>
              
              <View style={styles.tipsList}>
                {[
                  { title: 'Magnezyum Bisglisinat (300-400 mg)', desc: 'Kas kramplarını gevşetir ve uyku kalitesini artırır.' },
                  { title: 'B6 Vitamini (Piridoksin)', desc: 'Serotonin ve dopamin sentezine katılarak PMS kaynaklı ruh hali dalgalanmalarını yatıştırır.' },
                  { title: 'Hayıt Otu (Vitex Agnus-Castus)', desc: 'Prolaktini dengeleyerek göğüs şişkinliğini ve regl düzensizliğini azaltmaya yardımcı olur.' },
                ].map((t, i) => (
                  <View key={i} style={[styles.tipBox, { borderColor: colors.border }]}>
                    <Ionicons name="leaf" size={20} color={Colors.floGreen} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tipTitle, { color: colors.text }]}>{t.title}</Text>
                      <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>{t.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
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
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  tabChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14 },
  tabText: { fontSize: 12, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroTeaCard: { width: '100%', height: 140, borderRadius: 20, overflow: 'hidden', marginVertical: 10 },
  heroTeaImg: { width: '100%', height: '100%' },
  card: { padding: 18, borderRadius: 20, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  cardDesc: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  symList: { gap: 10 },
  symItem: { flexDirection: 'row', gap: 10, padding: 10, borderRadius: 12, borderWidth: 1 },
  symName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  symSub: { fontSize: 12, lineHeight: 16 },
  tipsList: { gap: 10 },
  tipBox: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: 14, borderWidth: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  tipDesc: { fontSize: 12.5, lineHeight: 17 },
});
