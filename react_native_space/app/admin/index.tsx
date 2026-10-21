import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, RefreshControl, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { adminClient } from '@/src/api/adminClient';
import { useQuery } from '@tanstack/react-query';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { BrandLogo } from '@/src/components/BrandLogo';
import { getApiBase } from '@/src/api/apiBase';

const MENU_ITEMS = [
  { icon: 'people' as const, label: 'Kullanıcı Yönetimi', desc: 'Görüntüle, düzenle, sil', route: '/admin/users', color: '#6366F1', stat: 'totalUsers' as const },
  { icon: 'trash' as const, label: 'Silinen Hesaplar', desc: 'Denetim kaydı ve silme nedenleri', route: '/admin/deleted-accounts', color: Colors.danger, stat: 'deletedAccounts' as const },
  { icon: 'chatbubbles' as const, label: 'Topluluk Moderasyonu', desc: 'Gönderi ve yorum yönetimi', route: '/admin/posts', color: Colors.community, stat: 'totalPosts' as const },
  { icon: 'notifications' as const, label: 'Bildirim Merkezi', desc: 'Hedefli duyuru ve ipuçları', route: '/admin/notifications', color: '#F59E0B', stat: 'notificationsSent' as const },
  { icon: 'library' as const, label: 'İçerik Yönetimi', desc: 'Haftalar, semptomlar, makaleler, SSS', route: '/admin/pregnancy-content', color: Colors.pregnancy, stat: 'pregnancyWeeksCount' as const },
];

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { logout, user } = useAuth();

  const { data: stats, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => adminClient.getStats(),
  });

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Yönetici oturumunu sonlandırmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: async () => { await logout(); router.replace('/auth/login'); } },
    ]);
  };

  if (isLoading && !stats) return <LoadingScreen />;

  const portalUrl = `${getApiBase()}/admin-portal`;

  const statCards = [
    { label: 'Toplam Üye', value: stats?.totalUsers ?? 0, icon: 'people', color: '#6366F1' },
    { label: 'Aktif Kullanıcı', value: stats?.activeUsers ?? 0, icon: 'checkmark-circle', color: Colors.success },
    { label: 'Bugün Kayıt', value: stats?.newUsersToday ?? 0, icon: 'today', color: Colors.pregnancy },
    { label: '7 Gün Kayıt', value: stats?.newUsersWeek ?? 0, icon: 'trending-up', color: Colors.floTeal },
    { label: 'Gönderi', value: stats?.totalPosts ?? 0, icon: 'chatbubbles', color: Colors.community },
    { label: 'Yorum', value: stats?.totalComments ?? 0, icon: 'chatbox', color: Colors.floPurple },
    { label: 'Eşleşmiş Çift', value: stats?.pairedCouples ?? 0, icon: 'heart', color: Colors.relationship },
    { label: 'Açık İstek', value: stats?.openNudges ?? 0, icon: 'hand-left', color: '#F59E0B' },
    { label: 'Kurulum Bekleyen', value: stats?.pendingSetup ?? 0, icon: 'hourglass', color: colors.textMuted },
  ];

  const moduleStats = [
    { label: 'Gebelik Modülü', value: stats?.pregnancyUsers ?? 0, color: Colors.pregnancy },
    { label: 'Regl Modülü', value: stats?.periodUsers ?? 0, color: Colors.period },
    { label: 'İlişki Modülü', value: stats?.relationshipUsers ?? 0, color: Colors.relationship },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />}
      >
        <View style={styles.headerRow}>
          <BrandLogo size={44} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.title, { color: colors.text }]}>Pusena Yönetim</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {user?.name} · {user?.email}
            </Text>
          </View>
          <Pressable onPress={handleLogout} style={[styles.logoutBtn, { backgroundColor: Colors.danger + '15', borderColor: Colors.danger + '30' }]}>
            <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          </Pressable>
        </View>

        {/* Stats Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Genel Bakış</Text>
        <View style={styles.statsGrid}>
          {statCards.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={s.icon as any} size={20} color={s.color} />
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Module breakdown */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Modül Dağılımı</Text>
        <View style={[styles.moduleRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {moduleStats.map((m, i) => (
            <View key={m.label} style={[styles.moduleItem, i < moduleStats.length - 1 && { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[styles.moduleValue, { color: m.color }]}>{m.value}</Text>
              <Text style={[styles.moduleLabel, { color: colors.textMuted }]}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Web portal */}
        <Pressable
          onPress={() => Linking.openURL(portalUrl).catch(() => Alert.alert('Açılamadı', portalUrl))}
          style={[styles.webPortalCard, { backgroundColor: isDark ? '#2D1F32' : '#F5F3FF', borderColor: Colors.floPurple + '30' }]}
        >
          <Ionicons name="laptop-outline" size={22} color={Colors.floPurple} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.webPortalTitle, { color: Colors.floPurple }]}>Web Yönetim Portalı</Text>
            <Text style={[styles.webPortalDesc, { color: colors.textSecondary }]}>
              Aynı API · {portalUrl}
            </Text>
          </View>
          <Ionicons name="open-outline" size={18} color={Colors.floPurple} />
        </Pressable>

        {/* Menu */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Yönetim Modülleri</Text>
        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.route}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
              </View>
              {item.stat && stats ? (
                <View style={[styles.badge, { backgroundColor: item.color + '20' }]}>
                  <Text style={{ color: item.color, fontWeight: '800', fontSize: 12 }}>
                    {stats[item.stat] ?? 0}
                  </Text>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 12, marginTop: 4 },
  logoutBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '31%', padding: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 10, textAlign: 'center', fontWeight: '600' },
  moduleRow: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  moduleItem: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  moduleValue: { fontSize: 22, fontWeight: '900' },
  moduleLabel: { fontSize: 10, marginTop: 2, fontWeight: '600', textAlign: 'center' },
  webPortalCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  webPortalTitle: { fontSize: 13, fontWeight: '700' },
  webPortalDesc: { fontSize: 11, marginTop: 2 },
  grid: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, borderWidth: 1, gap: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  cardLabel: { fontSize: 15, fontWeight: '700' },
  cardDesc: { fontSize: 11, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
});
