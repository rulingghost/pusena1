import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useInsights, type Insight, type InsightLevel } from '@/src/api/bloomClient';

const LEVEL_STYLE: Record<InsightLevel, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  info: { color: '#0EA5E9', icon: 'information-circle' },
  tip: { color: Colors.floPurple, icon: 'bulb' },
  warning: { color: '#F59E0B', icon: 'alert-circle' },
  danger: { color: Colors.danger, icon: 'warning' },
  success: { color: Colors.success, icon: 'checkmark-circle' },
};

function InsightRow({ item }: { item: Insight }) {
  const { colors } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const style = LEVEL_STYLE[item.level] ?? LEVEL_STYLE.info;

  return (
    <Pressable
      onPress={() => setOpen((v) => !v)}
      style={[styles.card, { backgroundColor: colors.card, borderColor: style.color + '35' }]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: style.color + '18' }]}>
          <Ionicons name={style.icon} size={16} color={style.color} />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={open ? undefined : 2}>
          {item.title}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </View>
      {open && (
        <View style={styles.detail}>
          <Text style={[styles.cardBody, { color: colors.textSecondary }]}>{item.body}</Text>
          {!!item.route && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: style.color + '15' }]}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={[styles.actionText, { color: style.color }]}>{item.action ?? 'Detay'}</Text>
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}

export function InsightsCard({ limit = 2, showHeader = true }: { limit?: number; showHeader?: boolean }) {
  const { colors } = useTheme();
  const { data, isLoading } = useInsights();
  const items = (data?.items ?? []).slice(0, Math.min(2, limit));

  if (isLoading && !data) return <ActivityIndicator style={{ marginVertical: 12 }} color={Colors.primary} />;
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {showHeader && (
        <Text style={[styles.heading, { color: colors.text }]}>Size özel bilgilendirmeler</Text>
      )}
      {items.map((item) => (
        <InsightRow key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, marginBottom: 16 },
  heading: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  card: { padding: 12, borderRadius: 14, borderWidth: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '700', lineHeight: 19 },
  detail: { marginTop: 10, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#00000014' },
  cardBody: { fontSize: 13, lineHeight: 19 },
  actionBtn: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  actionText: { fontSize: 12, fontWeight: '700' },
});
