import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { useUserProfile, useUserPosts, useToggleFollow, useFollowList } from '@/src/api/bloomClient';
import type { PostSummary } from '@/src/api/bloomClient';
import { getErrorMessage } from '@/src/api/customFetch';

type FollowKind = 'followers' | 'following';

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} sa`;
  return `${Math.floor(diffH / 24)} gün`;
}

function initial(name?: string | null) {
  return (name ?? '?')?.[0]?.toLocaleUpperCase('tr-TR') ?? '?';
}

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { userId = '' } = useLocalSearchParams();
  const uid = String(userId);

  const { data: profile, isLoading } = useUserProfile(uid);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(profile?.canSeePosts ? uid : undefined);
  const toggleFollow = useToggleFollow();

  const [followKind, setFollowKind] = useState<FollowKind | null>(null);
  const { data: followData, isLoading: followLoading } = useFollowList(
    followKind ? uid : undefined,
    followKind ?? 'followers',
  );

  const [optimisticFollow, setOptimisticFollow] = useState<boolean | null>(null);
  const isFollowing = optimisticFollow ?? profile?.isFollowing ?? false;

  useEffect(() => {
    setOptimisticFollow(null);
  }, [profile?.isFollowing]);

  const followersCount = (profile?.followersCount ?? 0) + (
    optimisticFollow == null || optimisticFollow === profile?.isFollowing ? 0 : optimisticFollow ? 1 : -1
  );

  const handleToggleFollow = () => {
    if (!uid) return;
    if (!isFollowing && profile?.canFollow === false) return;
    setOptimisticFollow(!isFollowing);
    toggleFollow.mutate(uid, {
      onError: (err: unknown) => {
        setOptimisticFollow(null);
        Alert.alert('Takip', getErrorMessage(err, 'Takip işlemi yapılamadı'));
      },
    });
  };

  const openProfile = (nextId: string) => {
    setFollowKind(null);
    if (nextId === uid) return;
    router.push(`/community/user/${nextId}`);
  };

  if (isLoading) return <LoadingScreen />;

  const posts = profile?.canSeePosts ? postsData?.items ?? [] : [];

  const renderPost = ({ item }: { item: PostSummary }) => (
    <Pressable
      style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/community/${item.id}`)}
    >
      <View style={styles.postTopRow}>
        {!!item.category && (
          <View style={[styles.catBadge, { backgroundColor: Colors.community + '15' }]}>
            <Text style={[styles.catBadgeText, { color: Colors.community }]}>{item.category}</Text>
          </View>
        )}
        <Text style={[styles.postTime, { color: colors.textMuted }]}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={[styles.postContent, { color: colors.text }]}>{item.content}</Text>
      {item.isEdited && <Text style={[styles.editedHint, { color: colors.textMuted }]}>✏️ Düzenlendi</Text>}
      <View style={[styles.postActions, { borderTopColor: colors.border }]}>
        <View style={styles.actionBtn}>
          <Ionicons name={item.isLiked ? 'heart' : 'heart-outline'} size={16} color={item.isLiked ? Colors.period : colors.textMuted} />
          <Text style={[styles.actionText, { color: item.isLiked ? Colors.period : colors.textMuted }]}>{item.likesCount ?? 0}</Text>
        </View>
        <View style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={15} color={colors.textMuted} />
          <Text style={[styles.actionText, { color: colors.textMuted }]}>{item.commentsCount ?? 0}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>Profil</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.profileHeader}>
            <View style={[styles.bigAvatar, { backgroundColor: Colors.lavender }]}>
              <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 32 }}>{initial(profile?.name)}</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]}>{profile?.name ?? 'Anonim'}</Text>
            {!!profile?.biography && (
              <Text style={[styles.bio, { color: colors.textSecondary }]}>{profile.biography}</Text>
            )}

            <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>{profile?.postsCount ?? 0}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>gönderi</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <Pressable style={styles.statItem} onPress={() => setFollowKind('followers')}>
                <Text style={[styles.statValue, { color: colors.text }]}>{followersCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>takipçi</Text>
              </Pressable>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <Pressable style={styles.statItem} onPress={() => setFollowKind('following')}>
                <Text style={[styles.statValue, { color: colors.text }]}>{profile?.followingCount ?? 0}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>takip</Text>
              </Pressable>
            </View>

            {!profile?.isSelf && profile?.canFollow !== false && (
              <Pressable
                onPress={handleToggleFollow}
                style={[
                  styles.followBtn,
                  isFollowing
                    ? { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 }
                    : { backgroundColor: Colors.primary },
                ]}
              >
                <Ionicons
                  name={isFollowing ? 'checkmark' : 'person-add-outline'}
                  size={16}
                  color={isFollowing ? colors.textSecondary : '#fff'}
                />
                <Text style={[styles.followBtnText, { color: isFollowing ? colors.textSecondary : '#fff' }]}>
                  {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
                </Text>
              </Pressable>
            )}
            {!profile?.isSelf && profile?.canFollow === false && (
              <Text style={[styles.sectionTitle, { color: colors.textMuted, fontSize: 13, fontWeight: '500' }]}>
                Bu kullanıcı takip edilmeyi kapattı
              </Text>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Gönderiler</Text>
          </View>
        }
        ListEmptyComponent={
          profile?.canSeePosts === false ? (
            <View style={styles.emptyState}>
              <Ionicons name="lock-closed-outline" size={44} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Bu kullanıcı gönderilerini gizlemiş</Text>
            </View>
          ) : postsLoading ? (
            <ActivityIndicator style={{ marginTop: 30 }} color={Colors.primary} />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={44} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz paylaşım yok</Text>
            </View>
          )
        }
      />

      <Modal visible={followKind !== null} transparent animationType="slide" onRequestClose={() => setFollowKind(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {followKind === 'following' ? 'Takip Edilenler' : 'Takipçiler'}
              </Text>
              <Pressable onPress={() => setFollowKind(null)} style={[styles.iconBtn, { borderColor: colors.border }]}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </Pressable>
            </View>

            <FlatList
              data={followData?.items ?? []}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 420 }}
              renderItem={({ item }) => (
                <Pressable style={styles.followRow} onPress={() => openProfile(item.id)}>
                  <View style={[styles.rowAvatar, { backgroundColor: Colors.lavender }]}>
                    <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 14 }}>{initial(item.name)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                    {!!item.biography && (
                      <Text style={[styles.rowBio, { color: colors.textMuted }]} numberOfLines={1}>{item.biography}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Pressable>
              )}
              ListEmptyComponent={
                followLoading ? (
                  <ActivityIndicator style={{ marginTop: 24 }} color={Colors.primary} />
                ) : (
                  <Text style={[styles.modalEmpty, { color: colors.textMuted }]}>
                    {followKind === 'following' ? 'Henüz kimseyi takip etmiyor' : 'Henüz takipçisi yok'}
                  </Text>
                )
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: 0.2 },
  iconBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  listContent: { paddingHorizontal: 20, paddingBottom: 32 },
  profileHeader: { alignItems: 'center', marginBottom: 8 },
  bigAvatar: { width: 88, height: 88, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700' },
  bio: { fontSize: 13.5, lineHeight: 20, textAlign: 'center', marginTop: 6, paddingHorizontal: 12 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch',
    marginTop: 16, paddingVertical: 14, borderRadius: 20, borderWidth: 1,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, height: 26 },
  statValue: { fontSize: 17, fontWeight: '700' },
  statLabel: { fontSize: 11.5, fontWeight: '600' },

  followBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    alignSelf: 'stretch', height: 46, borderRadius: 16, marginTop: 14,
  },
  followBtnText: { fontSize: 14, fontWeight: '700' },

  sectionTitle: { alignSelf: 'flex-start', fontSize: 16, fontWeight: '700', marginTop: 22, marginBottom: 12 },

  postCard: {
    borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  postTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  catBadgeText: { fontSize: 11, fontWeight: '600' },
  postTime: { fontSize: 11 },
  postContent: { fontSize: 14, lineHeight: 21, marginBottom: 12 },
  editedHint: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
  postActions: { flexDirection: 'row', gap: 12, paddingTop: 10, borderTopWidth: 1 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  actionText: { fontSize: 12, fontWeight: '600' },

  emptyState: { alignItems: 'center', marginTop: 24, gap: 10 },
  emptyText: { fontSize: 14, textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  followRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rowAvatar: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rowName: { fontSize: 14, fontWeight: '700' },
  rowBio: { fontSize: 12, marginTop: 2 },
  modalEmpty: { fontSize: 13.5, textAlign: 'center', marginTop: 24 },
});
