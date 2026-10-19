import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';
import { useTheme } from '@/src/theme/useTheme';
import { usePartnerInfo } from '@/src/api/bloomClient';

export function PartnerGate({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { data, isLoading } = usePartnerInfo();
  const paired = Boolean(data?.isPaired || data?.paired);

  if (isLoading && !data) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (paired) return <>{children}</>;

  return (
    <View style={[styles.box, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <Pressable onPress={() => router.back()} style={[styles.back, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="lock-closed" size={28} color={Colors.floPink} />
        <Text style={[styles.title, { color: colors.text }]}>Partner bağlamalısınız</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Bu bölüm yalnızca eşleşmiş çiftler için açılır. Partner sekmesinden kodunuzu paylaşın veya partner kodunu girin.
        </Text>
        <Pressable onPress={() => router.replace('/tabs/story')} style={styles.btn}>
          <Text style={styles.btnText}>Partner bağla</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, paddingHorizontal: 20 },
  back: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  card: { borderWidth: 1, borderRadius: 22, padding: 22, gap: 8 },
  title: { fontSize: 18, fontWeight: '800' },
  body: { fontSize: 14, lineHeight: 21 },
  btn: { marginTop: 10, height: 46, borderRadius: 14, backgroundColor: Colors.floPink, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '800' },
});
