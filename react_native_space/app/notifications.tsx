import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import {
  useNotificationsControllerGetAll,
  useNotificationsControllerMarkRead,
  useNotificationsControllerMarkAllRead,
  useNotificationsControllerClearAll,
  useNotificationsControllerAnswerAction,
  usePregnancyControllerGet,
  usePeriodControllerGet,
  useSpecialDatesControllerGetAll,
} from '@/src/api/generated/api';
import type { NotificationItemDto } from '@/src/api/generated/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { InsightsCard } from '@/src/components/InsightsCard';
import { useAuth } from '@/src/contexts/AuthContext';
import { isMaleUser } from '@/src/utils/gender';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const male = isMaleUser(user);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useNotificationsControllerGetAll({ page: 1, limit: 50 });
  const { data: pregnancy } = usePregnancyControllerGet({ query: { retry: false } });
  const { data: period } = usePeriodControllerGet({ query: { retry: false } });
  const { data: dates } = useSpecialDatesControllerGetAll({ page: 1, limit: 8 });
  const markRead = useNotificationsControllerMarkRead();
  const markAllRead = useNotificationsControllerMarkAllRead();
  const clearAll = useNotificationsControllerClearAll();
  const answerAction = useNotificationsControllerAnswerAction();
  const [refreshing, setRefreshing] = useState(false);

  const periodDays = (() => {
    const next = (period as any)?.currentCycle?.nextPeriodDate;
    if (!next) return null;
    const days = Math.ceil((new Date(next).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    return Number.isNaN(days) ? null : days;
  })();
  const upcomingDates = (dates?.items ?? []).filter((d) => d.daysUntil >= 0 && d.daysUntil <= 30).slice(0, 3);

  const invalidateAll = useCallback(() => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
  }, [refetch, queryClient]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    setRefreshing(false);
  }, [refetch, queryClient]);

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, { onSuccess: invalidateAll });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Bildirimleri Temizle',
      'Tüm bildirimler silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle', style: 'destructive',
          onPress: () => clearAll.mutate(undefined, { onSuccess: invalidateAll }),
        },
      ],
    );
  };

  const handleAnswer = (item: NotificationItemDto, answer: string) => {
    answerAction.mutate(
      { id: item?.id, data: { answer } },
      {
        onSuccess: () => {
          invalidateAll();
          if (answer === 'yes' && item?.actionType === 'period_confirm') {
            Alert.alert('Kaydedildi 🌸', 'Regl başlangıcınız bugün olarak güncellendi.');
          }
        },
      },
    );
  };

  const handlePress = (item: NotificationItemDto) => {
    if (!item?.isRead) {
      markRead.mutate({ id: item?.id }, { onSuccess: invalidateAll });
    }
    const mod = item?.module;
    const type = (item as any)?.type as string | undefined;

    // Follow notifications carry a userId in referenceId, everything else in
    // the community module carries a postId.
    if (type === 'postpartum_task') router.push('/pregnancy/postpartum');
    else if (type === 'couple_question') router.push('/story/daily-questions');
    else if (type === 'partner_nudge') router.push('/story/couple-requests');
    else if (type === 'couple_message') router.push('/story/couple-chat');
    else if (type === 'partner_paired') router.push('/tabs/story');
    else if (type === 'community_follow' && item?.referenceId) {
      router.push(`/community/user/${item.referenceId}`);
    } else if (mod === 'community' && item?.referenceId) {
      router.push(`/community/${item.referenceId}`);
    } else if (mod === 'pregnancy') router.push('/pregnancy');
    else if (mod === 'period') router.push('/period');
    else if (mod === 'relationship') router.push('/tabs/story');
  };

  const getIcon = (mod?: string, type?: string): keyof typeof Ionicons.glyphMap => {
    if (type === 'postpartum_task') return 'flower';
    if (type === 'partner_nudge') return 'hand-left';
    if (type === 'couple_message') return 'chatbubble-ellipses';
    if (type === 'community_comment') return 'chatbubble-ellipses';
    if (type === 'community_like') return 'heart';
    if (type === 'community_follow') return 'person-add';
    if (mod === 'pregnancy') return 'flower';
    if (mod === 'period') return 'water';
    if (mod === 'community') return 'chatbubbles';
    if (mod === 'relationship') return 'heart';
    return 'notifications';
  };

  const getIconColor = (mod?: string) => {
    if (mod === 'pregnancy') return Colors.pregnancy;
    if (mod === 'period') return Colors.period;
    if (mod === 'community') return Colors.community;
    if (mod === 'relationship') return Colors.relationship;
    return Colors.primary;
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Az önce';
    if (diffMin < 60) return `${diffMin} dk önce`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} gün önce`;
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const renderItem = ({ item }: { item: NotificationItemDto }) => (
    <Pressable
      style={[
        styles.notifCard,
        {
          backgroundColor: item?.isRead ? colors.card : isDark ? '#2D1F30' : '#FFF2F8',
          borderColor: item?.isRead ? colors.border : Colors.primary + '30',
        },
      ]}
      onPress={() => handlePress(item)}
    >
      <View style={[styles.notifIcon, { backgroundColor: getIconColor(item?.module) + '18' }]}>
        <Ionicons name={getIcon(item?.module, (item as any)?.type)} size={20} color={getIconColor(item?.module)} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.notifTitle, { color: colors.text }]}>{item?.title ?? ''}</Text>
        <Text style={[styles.notifBody, { color: colors.textSecondary }]} numberOfLines={2}>{item?.body ?? ''}</Text>
        <Text style={[styles.notifTime, { color: colors.textMuted }]}>{formatTime(item?.createdAt as unknown as string)}</Text>

        {item?.actionType && !item?.actionDone && (
          <View style={styles.actionRow}>
            <Pressable style={[styles.actionBtnYes, { backgroundColor: Colors.success }]} onPress={() => handleAnswer(item, 'yes')}>
              <Text style={styles.actionBtnText}>Evet</Text>
            </Pressable>
            <Pressable style={[styles.actionBtnNo, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => handleAnswer(item, 'no')}>
              <Text style={[styles.actionBtnText, { color: colors.text }]}>Hayır</Text>
            </Pressable>
          </View>
        )}
      </View>
      {!item?.isRead && <View style={[styles.unreadDot, { backgroundColor: Colors.primary }]} />}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bildirimler 🔔</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/profile/notification-settings')} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="options-outline" size={18} color={colors.text} />
          </Pressable>
          <Pressable onPress={handleMarkAllRead} style={[styles.iconBtn, { backgroundColor: Colors.primary + '15', borderColor: Colors.primary + '30' }]}>
            <Ionicons name="checkmark-done" size={18} color={Colors.primary} />
          </Pressable>
          <Pressable onPress={handleClearAll} style={[styles.iconBtn, { backgroundColor: Colors.danger + '10', borderColor: Colors.danger + '25' }]}>
            <Ionicons name="trash-outline" size={18} color={Colors.danger} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data?.items ?? []}
        keyExtractor={(item) => item?.id ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 12, gap: 8 }}>
            {!male && (pregnancy as any)?.daysRemaining != null && (
              <View style={[styles.countdown, { backgroundColor: Colors.pregnancy + '14', borderColor: Colors.pregnancy + '30' }]}>
                <Text style={[styles.countdownTitle, { color: colors.text }]}>Tahmini doğuma {(pregnancy as any).daysRemaining} gün</Text>
                <Text style={[styles.countdownSub, { color: colors.textMuted }]}>Kalan gün alarmları bildirim ayarlarından açılır</Text>
              </View>
            )}
            {!male && periodDays != null && (
              <View style={[styles.countdown, { backgroundColor: Colors.period + '14', borderColor: Colors.period + '30' }]}>
                <Text style={[styles.countdownTitle, { color: colors.text }]}>Tahmini regl: {periodDays} gün</Text>
              </View>
            )}
            {upcomingDates.map((d) => (
              <View key={d.id} style={[styles.countdown, { backgroundColor: Colors.relationship + '14', borderColor: Colors.relationship + '30' }]}>
                <Text style={[styles.countdownTitle, { color: colors.text }]}>{d.title}: {d.daysUntil} gün kaldı</Text>
              </View>
            ))}
            <InsightsCard limit={12} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 44, opacity: 0.6 }}>🌸</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz yeni bildiriminiz yok</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14 },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.2 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  headerActions: { flexDirection: 'row', gap: 8 },

  notifCard: {
    flexDirection: 'row', padding: 16, borderRadius: 20, marginBottom: 10, gap: 12, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  notifIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 14.5, fontWeight: '700', marginBottom: 2 },
  notifBody: { fontSize: 13, lineHeight: 19 },
  notifTime: { fontSize: 11, marginTop: 4 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },

  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtnYes: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 },
  actionBtnNo: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 12.5 },

  emptyState: { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyText: { fontSize: 15 },
  countdown: { padding: 12, borderRadius: 14, borderWidth: 1 },
  countdownTitle: { fontSize: 14, fontWeight: '700' },
  countdownSub: { fontSize: 11, marginTop: 2 },
});
