import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';

interface Method {
  id: string;
  name: string;
  type: string;
  effectiveness: string;
  duration: string;
  pros: string[];
  cons: string[];
  reversibility: string;
}

const METHODS: Method[] = [
  {
    id: '1',
    name: 'Hormonlu Spiral (Mirena / Kyleena)',
    type: 'Uzun Etkili Rahim İçi Araç (RİA)',
    effectiveness: '%99.8',
    duration: '3 - 8 Yıl',
    pros: ['Günlük hatırlatma gerektirmez', 'Adet kanamalarını ve krampları belirgin azaltır', 'Çıkarıldığında doğurganlık hemen döner'],
    cons: ['İlk aylarda lekelenme yapabilir', 'Kadın doğum uzmanı tarafından takılmalıdır'],
    reversibility: 'Çıkarıldığı an geri döner',
  },
  {
    id: '2',
    name: 'Bakırlı Spiral (Hormonsuz RİA)',
    type: 'Hormonsuz Rahim İçi Araç',
    effectiveness: '%99.2',
    duration: '5 - 10 Yıl',
    pros: ['Tamamen hormonsuzdur', 'Emzirme döneminde güvenle kullanılır', '10 yıla kadar tam koruma'],
    cons: ['İlk aylarda adet kanamasını ve krampları artırabilir'],
    reversibility: 'Çıkarıldığı an geri döner',
  },
  {
    id: '3',
    name: 'Kombine Doğum Kontrol Hapı',
    type: 'Oral Kontraseptif (Östrojen + Progestin)',
    effectiveness: '%99.7 (Düzenli Kullanımda)',
    duration: 'Günlük',
    pros: ['Adet döngüsünü saat gibi düzenler', 'Akne ve tüylenmeyi azaltır', 'Yumurtalık kanseri riskini düşürür'],
    cons: ['Her gün aynı saatte içilmelidir', 'Unutulduğunda koruyuculuk azalır'],
    reversibility: 'Bırakıldıktan 1-3 ay sonra',
  },
  {
    id: '4',
    name: 'Deri Altı İmplant (Nexplanon)',
    type: 'Progestin İçeren Kol Çubuğu',
    effectiveness: '%99.9',
    duration: '3 Yıl',
    pros: ['En yüksek koruma oranına sahip yöntem', 'Östrojen içermez (östrojen alamayanlar için ideal)'],
    cons: ['Düzensiz kanamalar yapabilir', 'Küçük bir lokal anestezi ile kola takılır'],
    reversibility: 'Çıkarıldığı an geri döner',
  },
  {
    id: '5',
    name: 'Prezervatif (Kondom)',
    type: 'Bariyer Yöntem',
    effectiveness: '%98 (Doğru Kullanımda)',
    duration: 'İlişki Başına',
    pros: ['Cinsel Yolla Bulaşan Enfeksiyonlara (CYBE) karşı TEK koruyucu yöntemdir', 'Hormon içermez, reçetesizdir'],
    cons: ['Yırtılma veya kayma riski olabilir'],
    reversibility: 'Anında',
  },
];

export default function ContraceptionGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string>('1');

  const selectedMethod = METHODS.find((m) => m.id === selectedId) || METHODS[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Doğum Kontrol Kılavuzu 🛡️</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Yöntemlerin Etkinlik & Karşılaştırması</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Method Chips Horizontal */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {METHODS.map((m) => {
            const isSel = selectedId === m.id;
            return (
              <Pressable
                key={m.id}
                style={[
                  styles.chip,
                  { backgroundColor: isSel ? Colors.floPink : isDark ? colors.card : '#F3F4F6' },
                ]}
                onPress={() => setSelectedId(m.id)}
              >
                <Text style={[styles.chipText, { color: isSel ? '#FFFFFF' : colors.text }]}>{m.name.split(' ')[0]}...</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Selected Method Detail Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodName, { color: colors.text }]}>{selectedMethod.name}</Text>
              <Text style={[styles.methodType, { color: Colors.floPink }]}>{selectedMethod.type}</Text>
            </View>
            <View style={[styles.effBadge, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.effText}>{selectedMethod.effectiveness}</Text>
              <Text style={styles.effSub}>KORUMA</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.metaBox, { backgroundColor: isDark ? '#2D2030' : '#F9F7F8' }]}>
              <Text style={[styles.metaVal, { color: Colors.floTeal }]}>{selectedMethod.duration}</Text>
              <Text style={[styles.metaLbl, { color: colors.textMuted }]}>Kullanım Süresi</Text>
            </View>
            <View style={[styles.metaBox, { backgroundColor: isDark ? '#2D2030' : '#F9F7F8' }]}>
              <Text style={[styles.metaVal, { color: Colors.floPurple }]}>{selectedMethod.reversibility}</Text>
              <Text style={[styles.metaLbl, { color: colors.textMuted }]}>Doğurganlığa Dönüş</Text>
            </View>
          </View>

          {/* Pros */}
          <Text style={[styles.secHeader, { color: colors.text }]}>👍 Avantajları & Artıları</Text>
          <View style={styles.proList}>
            {selectedMethod.pros.map((p, i) => (
              <View key={i} style={styles.proRow}>
                <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                <Text style={[styles.proText, { color: colors.textSecondary }]}>{p}</Text>
              </View>
            ))}
          </View>

          {/* Cons */}
          <Text style={[styles.secHeader, { color: colors.text, marginTop: 14 }]}>⚠️ Dikkat Edilmesi Gerekenler</Text>
          <View style={styles.proList}>
            {selectedMethod.cons.map((c, i) => (
              <View key={i} style={styles.proRow}>
                <Ionicons name="alert-circle" size={18} color="#D97706" />
                <Text style={[styles.proText, { color: colors.textSecondary }]}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Doctor Note */}
        <View style={[styles.noteBox, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' }]}>
          <Ionicons name="medical" size={20} color={Colors.floTeal} />
          <Text style={[styles.noteText, { color: colors.text }]}>
            En uygun doğum kontrol yöntemi kişisel sağlık geçmişinize, gebelik planlarınıza ve hormon profilinize göre hekiminizle birlikte belirlenmelidir.
          </Text>
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
  chipScroll: { gap: 6, marginVertical: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  chipText: { fontSize: 12, fontWeight: '700' },
  heroCard: { padding: 18, borderRadius: 22, borderWidth: 1, marginVertical: 8 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  methodName: { fontSize: 17, fontWeight: '800', lineHeight: 22 },
  methodType: { fontSize: 11.5, fontWeight: '700', marginTop: 2 },
  effBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: 'center' },
  effText: { color: '#16A34A', fontSize: 14, fontWeight: '900' },
  effSub: { color: '#16A34A', fontSize: 8, fontWeight: '800' },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  metaBox: { flex: 1, padding: 10, borderRadius: 12, alignItems: 'center' },
  metaVal: { fontSize: 13, fontWeight: '800', marginBottom: 2, textAlign: 'center' },
  metaLbl: { fontSize: 10 },
  secHeader: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  proList: { gap: 6 },
  proRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  proText: { flex: 1, fontSize: 12.5, lineHeight: 17 },
  noteBox: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginTop: 12 },
  noteText: { flex: 1, fontSize: 12.5, lineHeight: 17 },
});
