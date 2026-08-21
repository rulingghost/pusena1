import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { adminClient } from '@/src/api/adminClient';
import { customFetch } from '@/src/api/customFetch';
import { useQuery } from '@tanstack/react-query';

interface DeletedAccountItem {
  id: string;
  email: string;
  name: string;
  reason: string;
  note: string | null;
  createdAt: string;
}

export default function AdminDeletedAccountsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => adminClient.getStats(),
  });

  const { data, isLoading, refetch, isRefetching } = useQuery<{ items: DeletedAccountItem[]; total: number }>({
    queryKey: ['admin-deleted-accounts'],
    queryFn: () => customFetch('/api/admin/deleted-accounts?limit=100'),
  });

  const renderItem = ({ item }: { item: DeletedAccountItem }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{item.email}</Text>
        </View>
        <View style={[styles.reasonBadge, { backgroundColor: Colors.danger + '15' }]}>
          <Text style={[styles.reasonText, { color: Colors.danger }]}>{item.reason}</Text>
        </View>
      </View>

      {item.note ? (
        <View style={[styles.noteBox, { backgroundColor: colors.inputBg }]}>
          <Text style={[styles.noteLabel, { color: colors.textMuted }]}>Kullanıcı Notu:</Text>
          <Text style={[styles.noteVal, { color: colors.text }]}>{item.note}</Text>
        </View>
      ) : null}

      <Text style={[styles.dateText, { color: colors.textMuted }]}>
        Silinme Tarihi: {new Date(item.createdAt).toLocaleString('tr-TR')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <AdminHeader title="Silinen Hesaplar" subtitle={`${stats?.deletedAccounts ?? data?.total ?? 0} kayıt`} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data?.items ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 36 }}>📋</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Silinen Hesap Yok</Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>Kullanıcılar hesaplarını sildiğinde nedenleri burada listelenecektir.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '700' },

  card: {
    borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '700' },
  email: { fontSize: 13, marginTop: 2 },
  reasonBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  reasonText: { fontSize: 12, fontWeight: '700' },

  noteBox: { padding: 10, borderRadius: 12, marginBottom: 8 },
  noteLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  noteVal: { fontSize: 13, fontStyle: 'italic' },

  dateText: { fontSize: 11.5 },

  emptyBox: { alignItems: 'center', marginTop: 80, gap: 8, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center' },
});
