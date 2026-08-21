import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useCommunityControllerLikePost, useCommunityControllerSavePost } from '@/src/api/generated/api';
import type { CommunityPostResponseDto } from '@/src/api/generated/schemas';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useSearchUsers, useToggleFollow, useMyPosts } from '@/src/api/bloomClient';
import type { CommunityUser, MyPostWithComments } from '@/src/api/bloomClient';
import { customFetch } from '@/src/api/customFetch';

const CATEGORIES = [
  { key: undefined, label: 'Tümü' },
  { key: 'genel', label: 'Genel' },
  { key: 'gebelik', label: 'Gebelik' },
  { key: 'regl', label: 'Regl' },
  { key: 'ilişki', label: 'İlişki' },
  { key: 'sağlık', label: 'Sağlık' },
];

type TabKey = 'feed' | 'people' | 'mine';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'feed', label: 'Gönderiler' },
  { key: 'people', label: 'Kişiler' },
  { key: 'mine', label: 'Paylaşımların' },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} sa`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} gün`;
}

function initial(name?: string | null) {
  return (name ?? '?')?.[0]?.toLocaleUpperCase('tr-TR') ?? '?';
}

function FollowButton({ user }: { user: CommunityUser }) {
  const { colors } = useTheme();
  const toggleFollow = useToggleFollow();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const following = optimistic ?? user.isFollowing;

  useEffect(() => {
    setOptimistic(null);
  }, [user.isFollowing]);

  const onPress = () => {
    setOptimistic(!following);
    toggleFollow.mutate(user.id, { onError: () => setOptimistic(null) });
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={[
        styles.followBtn,
        following
          ? { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 }
          : { backgroundColor: Colors.primary },
      ]}
    >
      <Text style={[styles.followBtnText, { color: following ? colors.textSecondary : '#fff' }]}>
        {following ? 'Takiptesin' : 'Takip Et'}
      </Text>
    </Pressable>
  );
}

function PersonRow({ user, onPress }: { user: CommunityUser; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.personRow, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
      <View style={[styles.personAvatar, { backgroundColor: Colors.lavender }]}>
        <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 16 }}>{initial(user.name)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.personName, { color: colors.text }]} numberOfLines={1}>{user.name}</Text>
        {!!user.biography && (
          <Text style={[styles.personBio, { color: colors.textSecondary }]} numberOfLines={1}>{user.biography}</Text>
        )}
        <Text style={[styles.personMeta, { color: colors.textMuted }]}>
        {user.postsCount ?? 0} gönderi · {user.followersCount ?? 0} takipçi
        {user.matchReason ? ` · ${user.matchReason}` : ''}
        </Text>
      </View>
      <FollowButton user={user} />
    </Pressable>
  );
}

function MyPostCard({ post, onPress }: { post: MyPostWithComments; onPress: () => void }) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const comments = post.comments ?? [];
  const visibleComments = expanded ? comments : comments.slice(0, 2);

  return (
    <View style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={onPress}>
        <View style={styles.myPostTopRow}>
          {!!post.category && (
            <View style={[styles.catBadge, { backgroundColor: Colors.community + '15' }]}>
              <Text style={[styles.catBadgeText, { color: Colors.community }]}>{post.category}</Text>
            </View>
          )}
          <Text style={[styles.postTime, { color: colors.textMuted }]}>{formatDate(post.createdAt)}</Text>
        </View>
        <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>
        {post.isEdited && <Text style={[styles.editedHint, { color: colors.textMuted }]}>✏️ Düzenlendi</Text>}
        <View style={[styles.postActions, { borderTopColor: colors.border }]}>
          <View style={styles.actionBtn}>
            <Ionicons name="heart-outline" size={16} color={colors.textMuted} />
            <Text style={[styles.actionText, { color: colors.textMuted }]}>{post.likesCount ?? 0}</Text>
          </View>
          <View style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={15} color={colors.textMuted} />
            <Text style={[styles.actionText, { color: colors.textMuted }]}>{post.commentsCount ?? 0}</Text>
          </View>
        </View>
      </Pressable>

      {comments.length > 0 && (
        <View style={[styles.commentThread, { borderLeftColor: colors.border }]}>
          {visibleComments.map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <View style={[styles.commentAvatar, { backgroundColor: Colors.lavender }]}>
                <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 11 }}>{initial(c.authorName)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.commentHeaderRow}>
                  <Text style={[styles.commentAuthor, { color: colors.text }]} numberOfLines={1}>{c.authorName}</Text>
                  <Text style={[styles.commentTime, { color: colors.textMuted }]}>{formatDate(c.createdAt)}</Text>
                </View>
                <Text style={[styles.commentContent, { color: colors.textSecondary }]}>{c.content}</Text>
              </View>
            </View>
          ))}
          {comments.length > 2 && (
            <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={6}>
              <Text style={[styles.expandText, { color: Colors.primary }]}>
                {expanded ? 'Yorumları gizle' : `${comments.length} yorumun tümünü gör`}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabKey>('feed');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/community/posts', category, searchQuery, tab],
    queryFn: () =>
      customFetch<{ items: CommunityPostResponseDto[] }>(
        `/api/community/posts?page=1&limit=20${category ? `&category=${encodeURIComponent(category)}` : ''}${
          tab === 'feed' && searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''
        }`,
      ),
    enabled: tab === 'feed',
  });
  const [refreshing, setRefreshing] = useState(false);
  const likeMutation = useCommunityControllerLikePost();
  const saveMutation = useCommunityControllerSavePost();

  const { data: usersData, isLoading: usersLoading } = useSearchUsers(searchQuery, tab === 'people');
  const { data: myPostsData, isLoading: myPostsLoading, refetch: refetchMyPosts } = useMyPosts();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const onRefreshMine = useCallback(async () => {
    setRefreshing(true);
    await refetchMyPosts();
    setRefreshing(false);
  }, [refetchMyPosts]);

  const handleLike = (postId: string) => {
    likeMutation.mutate({ postId }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] }); },
      onError: () => Alert.alert('Hata', 'Beğeni kaydedilemedi.'),
    });
  };

  const handleSave = (postId: string) => {
    saveMutation.mutate({ postId }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] }); },
      onError: () => Alert.alert('Hata', 'Kaydetme işlemi başarısız.'),
    });
  };

  const openProfile = (userId?: string) => {
    if (!userId) return;
    router.push(`/community/user/${userId}`);
  };

  const renderPost = ({ item }: { item: CommunityPostResponseDto }) => (
    <Pressable style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.push(`/community/${item?.id}`)}>
      <View style={styles.postHeader}>
        <Pressable style={styles.authorTap} onPress={() => openProfile(item?.authorId)} hitSlop={4}>
          <View style={[styles.avatar, { backgroundColor: Colors.lavender }]}>
            <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 13 }}>{initial(item?.authorName)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.authorName, { color: colors.text }]}>{item?.authorName ?? 'Anonim'}</Text>
            <Text style={[styles.postTime, { color: colors.textMuted }]}>{formatDate(item?.createdAt)}</Text>
          </View>
        </Pressable>
        {item?.category && (
          <View style={[styles.catBadge, { backgroundColor: Colors.community + '15' }]}>
            <Text style={[styles.catBadgeText, { color: Colors.community }]}>{item.category}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.postContent, { color: colors.text }]}>{item?.content ?? ''}</Text>
      {((item as any)?.isEdited || (item as any)?.is_edited) && (
        <Text style={[styles.editedHint, { color: colors.textMuted }]}>✏️ Düzenlendi</Text>
      )}
      <View style={[styles.postActions, { borderTopColor: colors.border }]}>
        <Pressable style={[styles.actionBtn, { backgroundColor: item?.isLiked ? Colors.period + '12' : 'transparent' }]} onPress={() => handleLike(item?.id)}>
          <Ionicons name={item?.isLiked ? 'heart' : 'heart-outline'} size={18} color={item?.isLiked ? Colors.period : colors.textMuted} />
          <Text style={[styles.actionText, { color: item?.isLiked ? Colors.period : colors.textMuted }]}>{item?.likesCount ?? 0}</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => router.push(`/community/${item?.id}?focusComment=1`)}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.actionText, { color: colors.textMuted }]}>{item?.commentsCount ?? 0}</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: item?.isSaved ? Colors.primary + '12' : 'transparent' }]} onPress={() => handleSave(item?.id)}>
          <Ionicons name={item?.isSaved ? 'bookmark' : 'bookmark-outline'} size={16} color={item?.isSaved ? Colors.primary : colors.textMuted} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Topluluk</Text>
        <Pressable style={[styles.createBtn, { backgroundColor: Colors.primary }]} onPress={() => router.push('/community/create')}>
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={[styles.segmented, { backgroundColor: colors.inputBg }]}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.segment, tab === t.key && { backgroundColor: Colors.primary }]}
            onPress={() => setTab(t.key)}
          >
            <Text
              style={[styles.segmentText, { color: tab === t.key ? '#fff' : colors.textSecondary }]}
              numberOfLines={1}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === 'feed' && (
        <>
          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Gönderilerde ara"
              placeholderTextColor={colors.textMuted}
              value={searchInput}
              onChangeText={setSearchInput}
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchInput.length > 0 && (
              <Pressable onPress={() => setSearchInput('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={(item) => item.key ?? 'all'}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.chip, category === item.key ? { backgroundColor: Colors.primary } : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => setCategory(item.key)}
              >
                <Text style={[styles.chipText, { color: category === item.key ? '#fff' : colors.text }]}>{item.label}</Text>
              </Pressable>
            )}
            style={styles.chipList}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            showsHorizontalScrollIndicator={false}
          />
          <FlatList
            data={data?.items ?? []}
            keyExtractor={(item) => item?.id ?? Math.random().toString()}
            renderItem={renderPost}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
            ListEmptyComponent={
              isLoading ? (
                <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz paylaşım yok</Text>
                </View>
              )
            }
          />
        </>
      )}

      {tab === 'people' && (
        <>
          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="İsim veya benzer isim ara"
              placeholderTextColor={colors.textMuted}
              value={searchInput}
              onChangeText={setSearchInput}
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchInput.length > 0 && (
              <Pressable onPress={() => setSearchInput('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <FlatList
            data={usersData?.items ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PersonRow user={item} onPress={() => openProfile(item.id)} />}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              usersLoading ? null : (
                <Text style={[styles.peopleHint, { color: colors.textMuted }]}>
                  {searchQuery ? 'Benzer isimler ve profiller' : 'Sana yakın kişiler'}
                </Text>
              )
            }
            ListEmptyComponent={
              usersLoading ? (
                <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    {searchQuery ? 'Eşleşen kişi yok' : 'Henüz önerilecek kişi yok'}
                  </Text>
                </View>
              )
            }
          />
        </>
      )}

      {tab === 'mine' && (
        <FlatList
          data={myPostsData?.items ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MyPostCard post={item} onPress={() => router.push(`/community/${item.id}`)} />}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshMine} tintColor={Colors.primary} />}
          ListEmptyComponent={
            myPostsLoading ? (
              <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="create-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz bir paylaşımın yok</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: 0.3 },
  createBtn: {
    width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },

  segmented: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 12,
    padding: 4, borderRadius: 18, gap: 4,
  },
  segment: { flex: 1, paddingVertical: 9, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  segmentText: { fontSize: 12.5, fontWeight: '700' },

  chipList: { flexGrow: 0, marginBottom: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 13, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  postCard: {
    borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  authorTap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  authorName: { fontSize: 14, fontWeight: '600' },
  postTime: { fontSize: 11 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  catBadgeText: { fontSize: 11, fontWeight: '600' },
  postContent: { fontSize: 14, lineHeight: 21, marginBottom: 12 },
  editedHint: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
  postActions: {
    flexDirection: 'row', gap: 12, paddingTop: 10, borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  actionText: { fontSize: 12, fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },

  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginBottom: 12,
    paddingHorizontal: 14, height: 46, borderRadius: 16, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  peopleHint: { fontSize: 12, fontWeight: '700', marginBottom: 10 },

  personRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: 18, marginBottom: 10, borderWidth: 1,
  },
  personAvatar: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  personName: { fontSize: 14.5, fontWeight: '700' },
  personBio: { fontSize: 12.5, marginTop: 2 },
  personMeta: { fontSize: 11.5, marginTop: 3, fontWeight: '600' },
  followBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  followBtnText: { fontSize: 12.5, fontWeight: '700' },

  myPostTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  commentThread: { marginTop: 12, marginLeft: 8, paddingLeft: 12, borderLeftWidth: 2, gap: 10 },
  commentRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  commentAvatar: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  commentHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  commentAuthor: { fontSize: 12.5, fontWeight: '700', flexShrink: 1 },
  commentTime: { fontSize: 10.5 },
  commentContent: { fontSize: 13, lineHeight: 18, marginTop: 1 },
  expandText: { fontSize: 12.5, fontWeight: '700', marginTop: 2 },
});
