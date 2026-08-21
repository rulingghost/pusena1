import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';

export default function PcosGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'overview' | 'diet' | 'supplements' | 'lifestyle'>('overview');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>PCOS & Hormon Dengesi 🌿</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Polikistik Over Sendromu Kılavuzu</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {[
          { key: 'overview', label: 'PCOS Nedir?' },
          { key: 'diet', label: 'Anti-İnflamatuar Beslenme' },
          { key: 'supplements', label: 'İnositol & Vitaminler' },
          { key: 'lifestyle', label: 'Egzersiz & Yaşam' },
        ].map((t) => {
          const isSel = activeTab === t.key;
          return (
            <Pressable
              key={t.key}
              style={[
                styles.tabChip,
                { backgroundColor: isSel ? Colors.floTeal : isDark ? colors.card : '#F3F4F6' },
              ]}
              onPress={() => setActiveTab(t.key as any)}
            >
              <Text style={[styles.tabText, { color: isSel ? '#FFFFFF' : colors.text }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View style={{ gap: 12 }}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Polikistik Over Sendromu (PCOS) 4 Ana Kriteri</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                PCOS, üreme çağındaki kadınların %10-15’inde görülen yaygın bir endokrin durumdur. Rotterdam kriterlerine göre 3 durumdan en az 2'si varsa tanı konur:
              </Text>
              
              <View style={styles.criteriaList}>
                {[
                  { name: '1. Düzensiz veya Seyrek Adet (Oligomenore)', desc: '35 günden uzun süren döngüler veya yılda 9’dan az adet görme.' },
                  { name: '2. Yüksek Androjen Seviyesi', desc: 'Akne, tüylenme (hirsutizm) veya kanda testosteron yüksekliği.' },
                  { name: '3. Ultrason Bulgusu', desc: 'Yumurtalık çevresinde inci kolyesi şeklinde çok sayıda minik folikül görünümü.' },
                  { name: '4. İnsülin Direnci', desc: 'PCOS’lu kadınların %70’inde hücrelerin şekeri kullanmasını zorlaştıran insülin direnci eşlik eder.' },
                ].map((c, i) => (
                  <View key={i} style={[styles.criteriaBox, { borderColor: colors.border }]}>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.floTeal} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.critName, { color: colors.text }]}>{c.name}</Text>
                      <Text style={[styles.critDesc, { color: colors.textSecondary }]}>{c.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'diet' && (
          <View style={{ gap: 12 }}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Düşük Glisemik İndeksli Beslenme</Text>
              
              <View style={styles.criteriaList}>
                {[
                  { name: 'Protein ve Sağlıklı Yağ Dengesi', desc: 'Her öğüne zeytinyağı, avokado, yumurta veya balık eklemek insülin sıçramasını önler.' },
                  { name: 'Rafine Şeker ve Beyaz Unu Sınırlayın', desc: 'Yüksek glisemik gıdalar yumurtalıklarda erkeklik hormonu üretimini artırır.' },
                  { name: 'Lif Tüketimini Artırın (25-30g)', desc: 'Yeşil yapraklı sebzeler, chia tohumu ve mercimek fazla östrojenin atılmasını sağlar.' },
                ].map((d, i) => (
                  <View key={i} style={[styles.criteriaBox, { borderColor: colors.border }]}>
                    <Ionicons name="nutrition" size={18} color={Colors.floTeal} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.critName, { color: colors.text }]}>{d.name}</Text>
                      <Text style={[styles.critDesc, { color: colors.textSecondary }]}>{d.desc}</Text>
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
              <Text style={[styles.cardTitle, { color: colors.text }]}>PCOS’ta Bilimsel Olarak Kanıtlanmış Takviyeler</Text>
              
              <View style={styles.criteriaList}>
                {[
                  { name: 'Miyo-İnositol & D-Kiro-İnositol (40:1)', desc: 'İnsülin duyarlılığını artırır, yumurta kalitesini ve ovülasyon düzenini geri kazandırır.' },
                  { name: 'N-Asetil Sistein (NAC)', desc: 'Güçlü antioksidandır, insülin direncini kırar ve kist oluşumunu azaltır.' },
                  { name: 'D3 Vitamini + K2', desc: 'Yumurtalık folikül olgunlaşmasında ve hormon sentezinde kilit role sahiptir.' },
                  { name: 'Berberin', desc: 'Kan şekerini metformin benzeri mekanizmayla doğal olarak dengeler.' },
                ].map((s, i) => (
                  <View key={i} style={[styles.criteriaBox, { borderColor: colors.border }]}>
                    <Ionicons name="shield-checkmark" size={18} color={Colors.floPurple} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.critName, { color: colors.text }]}>{s.name}</Text>
                      <Text style={[styles.critDesc, { color: colors.textSecondary }]}>{s.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'lifestyle' && (
          <View style={{ gap: 12 }}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>PCOS İçin En İyi Egzersiz Türleri</Text>
              
              <View style={styles.criteriaList}>
                {[
                  { name: 'Ağırlık ve Direnç Antrenmanları', desc: 'Kas kütlesini artırarak glikozun depolanmasını sağlar ve insülin direncini hızla kırar.' },
                  { name: 'Kortizolü Yükseltmeyen Kardiyo (LISS)', desc: 'Aşırı yorucu maratonlar yerine tempolu yürüyüşler hormon dengesi için daha etkilidir.' },
                  { name: '7-8 Saat Kaliteli Gece Uykusu', desc: 'Melatonin hormonu yumurtalıkları oksidatif stresten korur.' },
                ].map((l, i) => (
                  <View key={i} style={[styles.criteriaBox, { borderColor: colors.border }]}>
                    <Ionicons name="barbell" size={18} color={Colors.floGreen} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.critName, { color: colors.text }]}>{l.name}</Text>
                      <Text style={[styles.critDesc, { color: colors.textSecondary }]}>{l.desc}</Text>
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
  tabText: { fontSize: 11.5, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { padding: 18, borderRadius: 20, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  cardDesc: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  criteriaList: { gap: 10 },
  criteriaBox: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: 14, borderWidth: 1 },
  critName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  critDesc: { fontSize: 12.5, lineHeight: 17 },
});
