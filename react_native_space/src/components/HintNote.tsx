import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';

export function HintNote({ text }: { text: string }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.box, { backgroundColor: isDark ? colors.card : colors.accentLight, borderColor: colors.border }]}>
      <Ionicons name="information-circle-outline" size={15} color={colors.accent} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  text: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '600' },
});
