import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet, RefreshControl, Alert,
  Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { adminClient, type AdminPostWithComments } from '@/src/api/adminClient';
import { getErrorMessage } from '@/src/api/customFetch';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function AdminPostsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editPost, setEditPost] = useState<AdminPostWithComments | null>(null);
  const [editComment, setEditComment] = useState<{ id: string; content: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-posts-with-comments'],
    queryFn: () => adminClient.getPostsWithComments(1, 100),
  });

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-posts-with-comments'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/community'] }),
    ]);
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert('Gönderiyi Sil', 'Bu gönderi ve yorumları silinecek. Devam edilsin mi?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await adminClient.deletePost(postId);
            await invalidate();
          } catch (e) {
            Alert.alert('Hata', getErrorMessage(e, 'Gönderi silinemedi.'));
          }
        },
      },
    ]);
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert('Yorumu Sil', 'Bu yorumu silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await adminClient.deleteComment(commentId);
            await invalidate();
          } catch (e) {
            Alert.alert('Hata', getErrorMessage(e, 'Yorum silinemedi.'));
          }
        },
      },
    ]);
  };

  const savePost = async () => {
    if (!editPost) return;
    setSaving(true);
    try {
      await adminClient.updatePost(editPost.id, { content: editPost.content, category: editPost.category });
      await invalidate();
      setEditPost(null);
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Gönderi güncellenemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const saveComment = async () => {
    if (!editComment) return;
    setSaving(true);
    try {
      await adminClient.updateComment(editComment.id, editComment.content);
      await invalidate();
      setEditComment(null);
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Yorum güncellenemedi.'));
    } finally {
      setSaving(false);
    }
  };

  const q = search.trim().toLowerCase();
  const items = (data?.items ?? []).filter((p) => {
    if (!q) return true;
    const comments = (p.comments ?? []).map((c) => c.content).join(' ');
    return `${p.content} ${p.category} ${p.authorName} ${comments}`.toLowerCase().includes(q);
  });

  const renderPost = ({ item }: { item: AdminPostWithComments }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.authorName, { color: colors.text }]}>{item.authorName}</Text>
          <Text style={[styles.dateText, { color: colors.textMuted }]}>
            {item.createdAt ? new Date(item.createdAt).toLocaleString('tr-TR') : ''}
            {item.isEdited ? ' · düzenlendi' : ''}
          </Text>
        </View>
        {!!item.category && (
          <View style={[styles.catBadge, { backgroundColor: Colors.community + '20' }]}>
            <Text style={[styles.catBadgeText, { color: Colors.community }]}>{item.category}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.contentText, { color: colors.text }]}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.statsRow}>
          <Ionicons name="heart" size={14} color={Colors.period} />
          <Text style={[styles.stat, { color: colors.textMuted }]}>{item.likesCount ?? 0}</Text>
          <Ionicons name="chatbubble" size={14} color={Colors.community} />
          <Text style={[styles.stat, { color: colors.textMuted }]}>{item.commentsCount ?? 0}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => setEditPost({ ...item })} style={styles.actionBtn}>
            <Ionicons name="create-outline" size={16} color={Colors.primary} />
            <Text style={{ color: Colors.primary, fontSize: 12, fontWeight: '700' }}>Düzenle</Text>
          </Pressable>
          <Pressable onPress={() => handleDeletePost(item.id)} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
            <Text style={{ color: Colors.danger, fontSize: 12, fontWeight: '700' }}>Sil</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.commentsWrap, { borderLeftColor: colors.border }]}>
        {(item.comments ?? []).length === 0 ? (
          <Text style={[styles.stat, { color: colors.textMuted }]}>Yorum yok</Text>
        ) : (item.comments ?? []).map((c) => (
          <View key={c.id} style={[styles.comment, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.commentAuthor, { color: colors.text }]}>{c.authorName}</Text>
              <Text style={[styles.dateText, { color: colors.textMuted }]}>
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString('tr-TR') : ''}
              </Text>
            </View>
            <Text style={[styles.commentBody, { color: colors.text }]}>{c.content}</Text>
            <View style={styles.actions}>
              <Pressable onPress={() => setEditComment({ id: c.id, content: c.content })} style={styles.actionBtn}>
                <Text style={{ color: Colors.primary, fontSize: 12, fontWeight: '700' }}>Düzenle</Text>
              </Pressable>
              <Pressable onPress={() => handleDeleteComment(c.id)} style={styles.actionBtn}>
                <Text style={{ color: Colors.danger, fontSize: 12, fontWeight: '700' }}>Sil</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <AdminHeader title="Topluluk Moderasyonu" subtitle={`${data?.total ?? 0} gönderi · web ile aynı kayıtlar`} />
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <TextInput
          style={[styles.search, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
          placeholder="Gönderi veya yorum ara..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textMuted }]}>{isLoading ? 'Yükleniyor...' : 'Henüz gönderi yok'}</Text>}
      />

      <Modal visible={!!editPost} transparent animationType="slide" onRequestClose={() => setEditPost(null)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Gönderi Düzenle</Text>
              {editPost && (
                <ScrollView keyboardShouldPersistTaps="handled">
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Kategori</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                    value={editPost.category}
                    onChangeText={(v) => setEditPost({ ...editPost, category: v })}
                  />
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>İçerik</Text>
                  <TextInput
                    style={[styles.input, styles.multiline, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                    value={editPost.content}
                    onChangeText={(v) => setEditPost({ ...editPost, content: v })}
                    multiline
                    textAlignVertical="top"
                  />
                </ScrollView>
              )}
              <View style={styles.modalActions}>
                <Pressable style={[styles.saveBtn, { backgroundColor: colors.inputBg }]} onPress={() => setEditPost(null)}>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>İptal</Text>
                </Pressable>
                <Pressable style={[styles.saveBtn, { backgroundColor: Colors.primary, flex: 1 }]} onPress={savePost} disabled={saving}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!editComment} transparent animationType="slide" onRequestClose={() => setEditComment(null)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Yorum Düzenle</Text>
              {editComment && (
                <TextInput
                  style={[styles.input, styles.multiline, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                  value={editComment.content}
                  onChangeText={(v) => setEditComment({ ...editComment, content: v })}
                  multiline
                  textAlignVertical="top"
                />
              )}
              <View style={styles.modalActions}>
                <Pressable style={[styles.saveBtn, { backgroundColor: colors.inputBg }]} onPress={() => setEditComment(null)}>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>İptal</Text>
                </Pressable>
                <Pressable style={[styles.saveBtn, { backgroundColor: Colors.primary, flex: 1 }]} onPress={saveComment} disabled={saving}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  card: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
  authorName: { fontSize: 15, fontWeight: '700' },
  dateText: { fontSize: 11, marginTop: 2 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catBadgeText: { fontSize: 11, fontWeight: '700' },
  contentText: { fontSize: 14, lineHeight: 21, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stat: { fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  commentsWrap: { borderLeftWidth: 3, marginTop: 12, paddingLeft: 12, gap: 8 },
  comment: { borderRadius: 10, padding: 10, borderWidth: 1 },
  commentAuthor: { fontSize: 13, fontWeight: '700' },
  commentBody: { fontSize: 13, lineHeight: 19, marginBottom: 6 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  multiline: { minHeight: 100 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  saveBtn: { height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
});
