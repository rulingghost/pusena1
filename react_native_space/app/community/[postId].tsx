import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import {
  useCommunityControllerGetPost,
  useCommunityControllerGetComments,
  useCommunityControllerCreateComment,
  useCommunityControllerLikePost,
  useCommunityControllerSavePost,
  useCommunityControllerReportPost,
} from '@/src/api/generated/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { useQueryClient } from '@tanstack/react-query';
import type { CommentResponseDto } from '@/src/api/generated/schemas';
import { customFetch } from '@/src/api/customFetch';

export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { postId = '', focusComment = '' } = useLocalSearchParams();
  const commentInputRef = useRef<TextInput>(null);
  const pid = String(postId);
  const { user: me } = useAuth();
  const { data: post, isLoading, refetch: refetchPost } = useCommunityControllerGetPost(pid, { query: { enabled: !!pid } });
  const { data: commentsData, refetch: refetchComments } = useCommunityControllerGetComments(pid, { page: 1, limit: 50 }, { query: { enabled: !!pid } });
  const likeMutation = useCommunityControllerLikePost();
  const saveMutation = useCommunityControllerSavePost();
  const commentMutation = useCommunityControllerCreateComment();
  const reportMutation = useCommunityControllerReportPost();
  const [commentText, setCommentText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const isPostAuthor = me?.id === post?.authorId;
  const isAdmin = me?.isAdmin === true;
  const canModifyPost = isPostAuthor || isAdmin;

  useEffect(() => {
    if (focusComment === '1') {
      setTimeout(() => commentInputRef.current?.focus(), 350);
    }
  }, [focusComment]);

  const handleLike = () => {
    likeMutation.mutate({ postId: pid }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: [`/api/community/posts/${pid}`] }); },
    });
  };

  const handleSave = () => {
    saveMutation.mutate({ postId: pid }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: [`/api/community/posts/${pid}`] }); },
    });
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    commentMutation.mutate(
      { postId: pid, data: { content: commentText.trim() } },
      {
        onSuccess: () => {
          setCommentText('');
          refetchComments();
          queryClient.invalidateQueries({ queryKey: [`/api/community/posts/${pid}`] });
          queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
        },
        onError: () => Alert.alert('Hata', 'Yorum gönderilemedi.'),
      }
    );
  };

  const handleDeletePost = () => {
    Alert.alert('Gönderiyi Sil', 'Bu gönderiyi silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await customFetch(`/api/community/posts/${pid}`, { method: 'DELETE' });
            queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
            Alert.alert('Başarılı', 'Gönderiniz silindi.');
            router.back();
          } catch {
            Alert.alert('Hata', 'Gönderi silinemedi.');
          }
        },
      },
    ]);
  };

  const handleOpenEdit = () => {
    setEditContent(post?.content ?? '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      Alert.alert('Uyarı', 'Gönderi içeriği boş olamaz.');
      return;
    }
    setIsEditing(true);
    try {
      await customFetch(`/api/community/posts/${pid}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editContent.trim() }),
      });
      await refetchPost();
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      setShowEditModal(false);
      Alert.alert('Başarılı ✨', 'Gönderiniz düzenlendi.');
    } catch {
      Alert.alert('Hata', 'Gönderi güncellenemedi.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert('Yorumu Sil', 'Bu yorumu silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await customFetch(`/api/community/comments/${commentId}`, { method: 'DELETE' });
            refetchComments();
            queryClient.invalidateQueries({ queryKey: [`/api/community/posts/${pid}`] });
            queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
          } catch {
            Alert.alert('Hata', 'Yorum silinemedi.');
          }
        },
      },
    ]);
  };

  const handlePostOptionsMenu = () => {
    Alert.alert(
      'Gönderi Seçenekleri',
      'Bu gönderi veya yazarı hakkında ne yapmak istersiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: '🚩 Gönderiyi Şikayet Et',
          onPress: promptReportReason,
        },
        {
          text: '🚫 Kullanıcıyı Engelle',
          style: 'destructive',
          onPress: confirmBlockUser,
        },
      ],
    );
  };

  const promptReportReason = () => {
    Alert.alert(
      'Şikayet Nedeni',
      'Lütfen bir neden seçin:',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Taciz veya Zorbalık', onPress: () => sendReport('Taciz veya Zorbalık') },
        { text: 'Yanıltıcı Tıbbi Bilgi', onPress: () => sendReport('Yanıltıcı Tıbbi Bilgi') },
        { text: 'Uygunsuz veya Müstehcen', onPress: () => sendReport('Uygunsuz veya Müstehcen') },
        { text: 'Spam veya Reklam', onPress: () => sendReport('Spam veya Reklam') },
      ],
    );
  };

  const sendReport = (reason: string) => {
    reportMutation.mutate(
      { postId: pid, data: { reason } },
      {
        onSuccess: () => {
          Alert.alert('Şikayet Alındı', 'Bildiriminiz moderasyon ekibimize iletildi. Teşekkür ederiz.');
        },
        onError: () => {
          Alert.alert('Hata', 'Şikayet iletilemedi.');
        },
      },
    );
  };

  const confirmBlockUser = () => {
    if (!post?.authorId) return;
    Alert.alert(
      'Kullanıcıyı Engelle',
      `${post.authorName || 'Bu kullanıcı'} engellensin mi? Engellediğinizde birbirinizin gönderilerini, yorumlarını ve profilini göremezsiniz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Engelle',
          style: 'destructive',
          onPress: async () => {
            try {
              await customFetch(`/api/community/block/${post.authorId}`, { method: 'POST' });
              queryClient.invalidateQueries({ queryKey: ['/api/community'] });
              Alert.alert('Engellendi', 'Kullanıcı engellendi. Gönderileri artık akışınızda görünmeyecek.');
              router.back();
            } catch {
              Alert.alert('Hata', 'Kullanıcı engellenemedi.');
            }
          },
        },
      ],
    );
  };

  if (isLoading) return <LoadingScreen />;

  const comments = commentsData?.items ?? [];

  const renderComment = ({ item }: { item: CommentResponseDto }) => {
    const isCommentAuthor = me?.id === item?.authorId;
    const canDelete = isCommentAuthor || isPostAuthor || isAdmin;

    return (
      <View style={[styles.commentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.commentAvatar, { backgroundColor: Colors.lavender }]}>
          <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 12 }}>{(item?.authorName ?? '?')?.[0]?.toLocaleUpperCase('tr-TR')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.commentAuthor, { color: colors.text }]}>{item?.authorName ?? 'Anonim'}</Text>
          <Text style={[styles.commentContent, { color: colors.textSecondary }]}>{item?.content ?? ''}</Text>
        </View>
        {canDelete && (
          <Pressable onPress={() => item?.id && handleDeleteComment(item.id)} style={{ padding: 6 }} hitSlop={8}>
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Topluluk Paylaşımı</Text>
          
          <View style={styles.headerRightActions}>
            {canModifyPost ? (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Pressable onPress={handleOpenEdit} style={[styles.iconBtn, { backgroundColor: Colors.primary + '15', borderColor: Colors.primary + '30' }]}>
                  <Ionicons name="create-outline" size={18} color={Colors.primary} />
                </Pressable>
                <Pressable onPress={handleDeletePost} style={[styles.iconBtn, { backgroundColor: Colors.danger + '10', borderColor: Colors.danger + '25' }]}>
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={handlePostOptionsMenu} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item?.id ?? Math.random().toString()}
          renderItem={renderComment}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.postHeader}>
                <View style={[styles.avatar, { backgroundColor: Colors.lavender }]}>
                  <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 14 }}>{(post?.authorName ?? '?')?.[0]?.toLocaleUpperCase('tr-TR')}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.authorName, { color: colors.text }]}>{post?.authorName ?? 'Anonim'}</Text>
                  {post?.category && (
                    <View style={[styles.catBadge, { backgroundColor: Colors.community + '15' }]}>
                      <Text style={[styles.catBadgeText, { color: Colors.community }]}>{post.category}</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={[styles.postContent, { color: colors.text }]}>{post?.content ?? ''}</Text>

              {/* Düzenlendi Indicator */}
              {((post as any)?.isEdited || (post as any)?.is_edited) && (
                <View style={styles.editedBadge}>
                  <Ionicons name="pencil" size={12} color={colors.textMuted} />
                  <Text style={[styles.editedText, { color: colors.textMuted }]}> Düzenlendi</Text>
                </View>
              )}

              <View style={[styles.postActions, { borderTopColor: colors.border }]}>
                <Pressable
                  style={[styles.actionBtn, { backgroundColor: post?.isLiked ? Colors.period + '12' : 'transparent' }]}
                  onPress={handleLike}
                >
                  <Ionicons name={post?.isLiked ? 'heart' : 'heart-outline'} size={20} color={post?.isLiked ? Colors.period : colors.textMuted} />
                  <Text style={[styles.actionText, { color: post?.isLiked ? Colors.period : colors.textMuted }]}>{post?.likesCount ?? 0}</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => commentInputRef.current?.focus()}>
                  <Ionicons name="chatbubble-outline" size={18} color={colors.textMuted} />
                  <Text style={[styles.actionText, { color: colors.textMuted }]}>{post?.commentsCount ?? 0}</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, { backgroundColor: post?.isSaved ? Colors.primary + '12' : 'transparent' }]}
                  onPress={handleSave}
                >
                  <Ionicons name={post?.isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={post?.isSaved ? Colors.primary : colors.textMuted} />
                </Pressable>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.noCommentsBox}>
              <Text style={{ fontSize: 32, opacity: 0.6 }}>💭</Text>
              <Text style={[styles.noComments, { color: colors.textMuted }]}>Henüz yorum yapılmamış. İlk yorumu siz yazın!</Text>
            </View>
          }
        />

        {/* Comment Input */}
        <View style={[styles.commentInput, { backgroundColor: colors.card, paddingBottom: insets.bottom + 8, borderTopColor: colors.border }]}>
          <TextInput
            ref={commentInputRef}
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Düşünceni paylaş..."
            placeholderTextColor={colors.textMuted}
            value={commentText}
            onChangeText={setCommentText}
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: commentText.trim() ? Colors.primary : colors.inputBg }]}
            onPress={handleComment}
            disabled={commentMutation.isPending || !commentText.trim()}
          >
            <Ionicons name="send" size={16} color={commentText.trim() ? '#fff' : colors.textMuted} />
          </Pressable>
        </View>

        {/* Edit Post Modal */}
        <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Gönderiyi Düzenle ✏️</Text>
                  <Pressable onPress={() => setShowEditModal(false)} style={styles.iconBtn}>
                    <Ionicons name="close" size={20} color={colors.textMuted} />
                  </Pressable>
                </View>

                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                  value={editContent}
                  onChangeText={setEditContent}
                  placeholder="Gönderinizi düzenleyin..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />

                <Pressable
                  style={[styles.saveEditBtn, { backgroundColor: editContent.trim() ? Colors.primary : colors.border }]}
                  onPress={handleSaveEdit}
                  disabled={isEditing || !editContent.trim()}
                >
                  <Text style={styles.saveEditBtnText}>{isEditing ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: 0.2 },
  headerRightActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },

  postCard: {
    borderRadius: 22, padding: 18, marginBottom: 16, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  authorName: { fontSize: 15, fontWeight: '700' },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 3 },
  catBadgeText: { fontSize: 11, fontWeight: '700' },
  postContent: { fontSize: 15, lineHeight: 22, marginBottom: 12 },
  editedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  editedText: { fontSize: 11.5, fontWeight: '600' },
  postActions: { flexDirection: 'row', gap: 14, paddingTop: 10, borderTopWidth: 1 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  actionText: { fontSize: 13, fontWeight: '600' },

  commentCard: {
    flexDirection: 'row', padding: 14, borderRadius: 16, marginBottom: 8, gap: 10, borderWidth: 1,
  },
  commentAvatar: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  commentAuthor: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  commentContent: { fontSize: 13.5, lineHeight: 19 },
  noCommentsBox: { alignItems: 'center', marginTop: 24, gap: 6 },
  noComments: { textAlign: 'center', fontSize: 13.5 },

  commentInput: {
    flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, gap: 10, alignItems: 'center',
  },
  input: {
    flex: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, borderWidth: 1,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  editInput: { borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 15, minHeight: 120, marginBottom: 16 },
  saveEditBtn: { height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  saveEditBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
