import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useSettingsControllerGetSettings } from '@/src/api/generated/api';

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: settings } = useSettingsControllerGetSettings();
  const modules = settings?.activeModules ?? [];

  const cards = [
    { key: 'pregnancy', title: 'Gebelik Takibi', icon: '🤰', color: Colors.pregnancy, bgLight: '#FFF5E6', bgDark: '#3D2D20', route: '/pregnancy' as const, desc: 'Haftalık gelişim ve ipuçları' },
    { key: 'period', title: 'Regl Takibi', icon: '🌺', color: Colors.period, bgLight: '#FFF0F3', bgDark: '#3D1C28', route: '/period' as const, desc: 'Döngü takvimi ve semptomlar' },
    { key: 'relationship', title: 'Partner', icon: '💕', color: Colors.relationship, bgLight: '#FFF0F6', bgDark: '#3D1C30', route: '/tabs/story' as const, desc: 'Sohbet, istek, konum ve özel günler' },
  ];

  const activeCards = cards.filter(c => modules.includes(c.key));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Takiplerim 📋</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Aktif modüllerinizi yönetin</Text>

        {activeCards.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 52, opacity: 0.6 }}>🌸</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz aktif modül yok</Text>
            <Pressable style={[styles.emptyBtn, { backgroundColor: Colors.primary }]} onPress={() => router.push('/setup')}>
              <Text style={styles.emptyBtnText}>Modül Ekle</Text>
            </Pressable>
          </View>
        )}

        {activeCards.map(card => (
          <Pressable
            key={card.key}
            style={[styles.card, { backgroundColor: isDark ? card.bgDark : card.bgLight, borderColor: card.color + '25' }]}
            onPress={() => router.push(card.route)}
          >
            <View style={[styles.cardIcon, { backgroundColor: card.color + '20' }]}>
              <Text style={{ fontSize: 28 }}>{card.icon}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{card.desc}</Text>
            </View>
            <View style={[styles.chevronCircle, { backgroundColor: card.color + '18' }]}>
              <Ionicons name="chevron-forward" size={18} color={card.color} />
            </View>
          </Pressable>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 4, letterSpacing: 0.3 },
  subtitle: { fontSize: 13, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 18,
    borderRadius: 20, borderWidth: 1, marginBottom: 14, gap: 14,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  cardIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  cardDesc: { fontSize: 12.5, lineHeight: 17 },
  chevronCircle: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
  emptyBtn: {
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, marginTop: 8,
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
