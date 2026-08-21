import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/useTheme';
import { BrandLogo } from '@/src/components/BrandLogo';

export function LoadingScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BrandLogo size="lg" />
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      <Text style={[styles.text, { color: colors.primary }]}>Pusena yükleniyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  text: { fontSize: 13, fontWeight: '600', marginTop: 12, letterSpacing: 0.8 },
});
