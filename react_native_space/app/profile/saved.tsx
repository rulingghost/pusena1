import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { apiClient } from '@/src/api/client';
import { useSavedPosts, useSavedArticles, useToggleSavedArticle } from '@/src/api/bloomClient';

type Tab = 'posts' | 'articles';

interface ArticleLite {
  id: string;
  title: string;
  subtitle?: string;
  categoryName?: string;
  author?: string;
  readTime?: string;
  summary?: string;
}

function relativeTime(dateStr?: string) {
  if (!dateStr) return '';
  const diffMin = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} saat önce`;
  return `${Math.floor(diffH / 24)} gün önce`;
}

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('posts');
  const [allArticles, setAllArticles] = useState<ArticleLite[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const { data: postsData, isLoading: postsLoading, refetch: refetchPosts, isRefetching } = useSavedPosts();
  const { data: savedArticlesData, isLoading: savedArtLoading, refetch: refetchSavedArticles } = useSavedArticles();
  const toggleSavedArticle = useToggleSavedArticle();

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<any>('/api/articles?category=all&search=')
      .then((res) => {
        if (cancelled) return;
        setAllArticles(res?.items ?? res?.data?.items ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setArticlesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const savedPosts = postsData?.items ?? [];
  const savedArticleIds = new Set((savedArticlesData?.items ?? []).map((s) => s.articleId));
  const savedArticles = allArticles.filter((a) => savedArticleIds.has(a.id));

  // Articles saved before their source entry disappeared still have an id we can show.
  const orphanArticleIds = [...savedArticleIds].filter((id) => !allArticles.some((a) => a.id === id));

  const renderPosts = () => {
    if (postsLoading) return <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />;
    if (savedPosts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={44} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Kaydedilen gönderi yok</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Toplulukta beğendiğiniz bir gönderinin yer imi simgesine dokunarak buraya kaydedebilirsiniz.
          </Text>
          <Pressable style={[styles.emptyBtn, { backgroundColor: Colors.primary }]} onPress={() => router.push('/tabs/community')}>
            <Text style={styles.emptyBtnText}>Topluluğa Git</Text>
          </Pressable>
        </View>
      );
    }
    return savedPosts.map((post) => (
      <Pressable
        key={post.id}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push(`/community/${post.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: Colors.lavender }]}>
            <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 13 }}>
              {(post.authorName ?? '?')[0]?.toLocaleUpperCase('tr-TR')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.authorName, { color: colors.text }]}>{post.authorName}</Text>
            <Text style={[styles.timeText, { color: colors.textMuted }]}>{relativeTime(post.createdAt)}</Text>
          </View>
          <View style={[styles.catPill, { backgroundColor: Colors.community + '15' }]}>
            <Text style={[styles.catPillText, { color: Colors.community }]}>{post.category}</Text>
          </View>
        </View>
        <Text style={[styles.cardBody, { color: colors.text }]} numberOfLines={4}>
          {post.content}
        </Text>
        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View style={styles.metaItem}>
            <Ionicons name="heart-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>{post.likesCount}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="chatbubble-outline" size={13} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>{post.commentsCount}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <Ionicons name="bookmark" size={16} color={Colors.primary} />
        </View>
      </Pressable>
    ));
  };

  const renderArticles = () => {
    if (savedArtLoading || articlesLoading) return <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />;
    if (savedArticles.length === 0 && orphanArticleIds.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={44} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Kaydedilen makale yok</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Rehber sekmesindeki makalelerin yer imi simgesine dokunarak buraya ekleyebilirsiniz.
          </Text>
          <Pressable style={[styles.emptyBtn, { backgroundColor: Colors.primary }]} onPress={() => router.push('/tabs/articles')}>
            <Text style={styles.emptyBtnText}>Rehbere Git</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <>
        {savedArticles.map((article) => (
          <Pressable
            key={article.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/tabs/articles')}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.articleIcon, { backgroundColor: Colors.floTeal + '18' }]}>
                <Ionicons name="document-text" size={17} color={Colors.floTeal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.articleTitle, { color: colors.text }]} numberOfLines={2}>
                  {article.title}
                </Text>
                {!!article.categoryName && (
                  <Text style={[styles.timeText, { color: colors.textMuted }]}>
                    {article.categoryName}
                    {article.readTime ? ` · ${article.readTime}` : ''}
                  </Text>
                )}
              </View>
              <Pressable hitSlop={10} onPress={() => toggleSavedArticle.mutate({ articleId: article.id })}>
                <Ionicons name="bookmark" size={18} color={Colors.floPink} />
              </Pressable>
            </View>
            {!!(article.summary || article.subtitle) && (
              <Text style={[styles.cardBody, { color: colors.textSecondary }]} numberOfLines={3}>
                {article.summary || article.subtitle}
              </Text>
            )}
          </Pressable>
        ))}
        {orphanArticleIds.map((id) => (
          <View key={id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.articleIcon, { backgroundColor: colors.border }]}>
                <Ionicons name="alert-circle-outline" size={17} color={colors.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.articleTitle, { color: colors.text }]}>Bu içerik artık mevcut değil</Text>
                <Text style={[styles.timeText, { color: colors.textMuted }]}>Kayıt: {id}</Text>
              </View>
              <Pressable hitSlop={10} onPress={() => toggleSavedArticle.mutate({ articleId: id })}>
                <Ionicons name="close-circle-outline" size={19} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Kaydedilenler 🔖</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Gönderiler ve makaleler tek yerde</Text>
        </View>
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {([
          { key: 'posts' as Tab, label: `Gönderiler${savedPosts.length ? ` (${savedPosts.length})` : ''}` },
          { key: 'articles' as Tab, label: `Makaleler${savedArticleIds.size ? ` (${savedArticleIds.size})` : ''}` },
        ]).map((tItem) => (
          <Pressable
            key={tItem.key}
            style={[styles.tabItem, tab === tItem.key && { backgroundColor: Colors.primary }]}
            onPress={() => setTab(tItem.key)}
          >
            <Text style={[styles.tabText, { color: tab === tItem.key ? '#FFFFFF' : colors.textSecondary }]}>
              {tItem.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetchPosts();
              refetchSavedArticles();
            }}
            tintColor={Colors.primary}
          />
        }
      >
        {tab === 'posts' ? renderPosts() : renderArticles()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 1 },
  tabBar: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 12,
    padding: 4, borderRadius: 16, borderWidth: 1, gap: 4,
  },
  tabItem: { flex: 1, paddingVertical: 9, borderRadius: 12, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  card: { padding: 16, borderRadius: 20, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  articleIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  authorName: { fontSize: 14, fontWeight: '700' },
  articleTitle: { fontSize: 14.5, fontWeight: '700', lineHeight: 20 },
  timeText: { fontSize: 11, marginTop: 2 },
  catPill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  catPillText: { fontSize: 10.5, fontWeight: '700' },
  cardBody: { fontSize: 13.5, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12, paddingTop: 10, borderTopWidth: 1 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontWeight: '600' },
  emptyState: { alignItems: 'center', gap: 8, paddingVertical: 60, paddingHorizontal: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginTop: 6 },
  emptyText: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  emptyBtn: { marginTop: 14, paddingHorizontal: 22, paddingVertical: 11, borderRadius: 14 },
  emptyBtnText: { color: '#FFFFFF', fontSize: 13.5, fontWeight: '700' },
});
