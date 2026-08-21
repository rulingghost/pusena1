import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, TextInput, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAdminControllerGetUsers, useAdminControllerDeleteUser } from '@/src/api/generated/api';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { MODULE_LABELS, modLabel } from '@/src/api/adminClient';
import type { AdminUserDto } from '@/src/api/generated/schemas';

type FilterKey = 'all' | 'active' | 'pending' | 'admin';

export default function AdminUsersScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, refetch } = useAdminControllerGetUsers({ page: 1, limit: 300, search: search || undefined });
  const deleteMutation = useAdminControllerDeleteUser();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filtered = (data?.items ?? []).filter((u) => {
    if (filter === 'active') return u.hasCompletedSetup;
    if (filter === 'pending') return !u.hasCompletedSetup;
    if (filter === 'admin') return u.isAdmin;
    return true;
  });

  const handleDelete = (userId: string, name: string) => {
    Alert.alert(
      'Kullanıcıyı Sil',
      `"${name}" kullanıcısını kalıcı olarak silmek istediğinize emin misiniz?\n\nTüm verileri (regl, gebelik, gönderiler) silinecektir.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteMutation.mutate(
              { userId },
              {
                onSuccess: () => { refetch(); Alert.alert('Başarılı', 'Kullanıcı silindi.'); },
                onError: (e: any) => Alert.alert('Hata', e?.body?.message ?? 'Kullanıcı silinemedi.'),
              },
            );
          },
        },
      ],
    );
  };

  const renderUser = ({ item }: { item: AdminUserDto }) => (
    <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: Colors.primary + '25' }]}>
        <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 16 }}>
          {(item?.name ?? '?')?.[0]?.toLocaleUpperCase('tr-TR')}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>{item?.name ?? 'Anonim'}</Text>
          {item?.isAdmin && (
            <View style={[styles.adminBadge, { backgroundColor: '#6366F1' + '20' }]}>
              <Text style={{ color: '#6366F1', fontSize: 9, fontWeight: '800' }}>ADMIN</Text>
            </View>
          )}
        </View>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>{item?.email}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {item?.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : '-'}
          </Text>
          <Text style={[styles.setupBadge, { color: item?.hasCompletedSetup ? Colors.success : Colors.warning }]}>
            {item?.hasCompletedSetup ? '✓ Aktif' : '○ Bekliyor'}
          </Text>
          {(item?.activeModules ?? []).length > 0 && (
            <Text style={[styles.meta, { color: Colors.floTeal }]}>
              {(item.activeModules ?? []).map(modLabel).join(' · ')}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: Colors.floTeal + '15' }]}
          onPress={() => router.push(`/admin/user-detail?userId=${item.id}`)}
          hitSlop={4}
        >
          <Ionicons name="eye-outline" size={18} color={Colors.floTeal} />
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: Colors.primary + '15' }]}
          onPress={() => router.push(`/admin/user-detail?userId=${item.id}&mode=edit`)}
          hitSlop={4}
        >
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: Colors.danger + '12' }]}
          onPress={() => handleDelete(item.id, item.name)}
          hitSlop={4}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </Pressable>
      </View>
    </View>
  );

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'active', label: 'Aktif' },
    { key: 'pending', label: 'Bekleyen' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <AdminHeader
          title="Kullanıcı Yönetimi"
          subtitle={`${data?.total ?? 0} kayıtlı üye`}
          right={
            <View style={[styles.countBadge, { backgroundColor: Colors.primary + '15' }]}>
              <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 12 }}>{filtered.length}</Text>
            </View>
          }
        />
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="İsim, e-posta veya nickname ara..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <Pressable
            key={f.key}
            style={[styles.filterChip, { backgroundColor: filter === f.key ? Colors.primary : colors.card, borderColor: filter === f.key ? Colors.primary : colors.border }]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={{ color: filter === f.key ? '#FFF' : colors.text, fontSize: 12, fontWeight: '700' }}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.empty, { color: colors.textMuted }]}>{isLoading ? 'Yükleniyor...' : 'Kullanıcı bulunamadı'}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 14, paddingHorizontal: 14, height: 46, gap: 8, marginBottom: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, borderWidth: 1 },
  list: { paddingHorizontal: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 10, gap: 10, borderWidth: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  adminBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  userEmail: { fontSize: 12, marginTop: 1 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  meta: { fontSize: 10 },
  setupBadge: { fontSize: 10, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
  empty: { fontSize: 15 },
});
