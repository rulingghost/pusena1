import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useInsights, type Insight, type InsightLevel } from '@/src/api/bloomClient';

const LEVEL_STYLE: Record<InsightLevel, { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  info: { color: '#0EA5E9', icon: 'information-circle', label: 'Bilgi' },
  tip: { color: Colors.floPurple, icon: 'bulb', label: 'İpucu' },
  warning: { color: '#F59E0B', icon: 'alert-circle', label: 'Dikkat' },
  danger: { color: Colors.danger, icon: 'warning', label: 'Önemli' },
  success: { color: Colors.success, icon: 'checkmark-circle', label: 'İyi gidiyor' },
};

function InsightRow({ item }: { item: Insight }) {
  const { colors } = useTheme();
  const router = useRouter();
  const [showReason, setShowReason] = useState(false);
  const style = LEVEL_STYLE[item.level] ?? LEVEL_STYLE.info;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: style.color + '35' }]}>
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: style.color + '18' }]}>
          <Ionicons name={style.icon} size={18} color={style.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.badgeRow}>
            <View style={[styles.levelBadge, { backgroundColor: style.color + '18' }]}>
              <Text style={[styles.levelText, { color: style.color }]}>{style.label}</Text>
            </View>
            <Text style={[styles.moduleText, { color: colors.textMuted }]}>{item.module}</Text>
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
        </View>
      </View>

      <Text style={[styles.cardBody, { color: colors.textSecondary }]}>{item.body}</Text>

      <Pressable style={styles.reasonToggle} onPress={() => setShowReason((v) => !v)} hitSlop={6}>
        <Ionicons name={showReason ? 'chevron-up' : 'help-circle-outline'} size={14} color={colors.textMuted} />
        <Text style={[styles.reasonToggleText, { color: colors.textMuted }]}>
          {showReason ? 'Gizle' : 'Bu bilgi neye göre hesaplandı?'}
        </Text>
      </Pressable>

      {showReason && (
        <View style={[styles.reasonBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.reasonText, { color: colors.textSecondary }]}>{item.reason}</Text>
        </View>
      )}

      {!!item.route && (
        <Pressable
          style={[styles.actionBtn, { backgroundColor: style.color + '15' }]}
          onPress={() => router.push(item.route as any)}
        >
          <Text style={[styles.actionText, { color: style.color }]}>{item.action ?? 'Detayları gör'}</Text>
          <Ionicons name="arrow-forward" size={14} color={style.color} />
        </Pressable>
      )}
    </View>
  );
}

export function InsightsCard({ limit = 3, showHeader = true }: { limit?: number; showHeader?: boolean }) {
  const { colors } = useTheme();
  const { data, isLoading } = useInsights();
  const [expanded, setExpanded] = useState(false);

  const items = data?.items ?? [];
  const visible = expanded ? items : items.slice(0, limit);

  if (isLoading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} color={Colors.primary} />;
  }
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heading, { color: colors.text }]}>Size Özel Bilgilendirmeler</Text>
            <Text style={[styles.headingSub, { color: colors.textMuted }]}>
              Girdiğiniz verilerden hesaplandı
            </Text>
          </View>
          <View style={[styles.countPill, { backgroundColor: Colors.primary + '15' }]}>
            <Text style={[styles.countText, { color: Colors.primary }]}>{items.length}</Text>
          </View>
        </View>
      )}

      {visible.map((item) => (
        <InsightRow key={item.id} item={item} />
      ))}

      {items.length > limit && (
        <Pressable
          style={[styles.moreBtn, { borderColor: colors.border }]}
          onPress={() => setExpanded((v) => !v)}
        >
          <Text style={[styles.moreText, { color: Colors.primary }]}>
            {expanded ? 'Daha az göster' : `${items.length - limit} bilgilendirme daha`}
          </Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={15} color={Colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10, marginBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  heading: { fontSize: 17, fontWeight: '800' },
  headingSub: { fontSize: 11.5, marginTop: 1 },
  countPill: { minWidth: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  countText: { fontSize: 12.5, fontWeight: '800' },
  card: { padding: 15, borderRadius: 18, borderWidth: 1.2 },
  cardTop: { flexDirection: 'row', gap: 11, marginBottom: 9 },
  iconBox: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 2.5, borderRadius: 8 },
  levelText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  moduleText: { fontSize: 10.5, fontWeight: '600', textTransform: 'capitalize' },
  cardTitle: { fontSize: 14.5, fontWeight: '800', lineHeight: 20 },
  cardBody: { fontSize: 13, lineHeight: 19.5 },
  reasonToggle: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  reasonToggleText: { fontSize: 11.5, fontWeight: '600' },
  reasonBox: { marginTop: 8, padding: 11, borderRadius: 12, borderWidth: 1 },
  reasonText: { fontSize: 12, lineHeight: 17.5, fontStyle: 'italic' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginTop: 11, paddingVertical: 10, borderRadius: 13,
  },
  actionText: { fontSize: 13, fontWeight: '700' },
  moreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 11, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed',
  },
  moreText: { fontSize: 13, fontWeight: '700' },
});
