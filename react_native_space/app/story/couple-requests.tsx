import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { getErrorMessage } from '@/src/api/customFetch';
import { useKeyboardOverlap } from '@/src/hooks/useKeyboardOverlap';
import { useCoupleNudges, useSendNudge, useReplyNudge, useDeleteNudge, useTransferNudgeToChat } from '@/src/api/bloomClient';

const QUICK = ['Şimdi mi gerçekten?', 'Birazdan olur', 'Şimdi olmaz', 'Tamam, geliyorum'];

export default function CoupleRequestsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const keyboardOverlap = useKeyboardOverlap();
  const { data, isLoading, error } = useCoupleNudges();
  const sendNudge = useSendNudge();
  const replyNudge = useReplyNudge();
  const deleteNudge = useDeleteNudge();
  const transfer = useTransferNudgeToChat();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const catalog = data?.catalog ?? [];
  const items = data?.items ?? [];

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const send = (type: string, label: string) => {
    const comment = newComment.trim();
    // Ağı beklemeden onay göster: istek listeye iyimser olarak zaten eklendi.
    setNewComment('');
    flash(`${label} isteği gönderildi ✓`);
    sendNudge.mutate(
      { type, comment: comment || undefined },
      {
        onError: (err) => {
          setNewComment(comment);
          setToast(null);
          Alert.alert('Gönderilemedi', getErrorMessage(err, 'Biraz bekleyip tekrar deneyin.'));
        },
      },
    );
  };

  const toChat = (nudgeId: string) => {
    transfer.mutate(nudgeId, {
      onSuccess: () => router.push('/story/couple-chat'),
      onError: (err) => Alert.alert('Aktarılamadı', getErrorMessage(err)),
    });
  };

  const remove = (nudgeId: string, label: string) => {
    Alert.alert('İsteği kaldır', `"${label}" isteği listeden silinsin mi?`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Kaldır',
        style: 'destructive',
        onPress: () =>
          deleteNudge.mutate(nudgeId, {
            onError: (err) => Alert.alert('Silinemedi', getErrorMessage(err, 'İstek kaldırılamadı.')),
          }),
      },
    ]);
  };

  const reply = (nudgeId: string, body?: string) => {
    const text = (body ?? drafts[nudgeId] ?? '').trim();
    if (!text) return;
    setDrafts((d) => ({ ...d, [nudgeId]: '' }));
    flash('Yanıt gönderildi ✓');
    replyNudge.mutate(
      { nudgeId, body: text },
      {
        onError: (err) => {
          setDrafts((d) => ({ ...d, [nudgeId]: text }));
          setToast(null);
          Alert.alert('Yanıt gitmedi', getErrorMessage(err));
        },
      },
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>İstekler</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>Masaj, huzur, yakınlık — tek dokunuş</Text>
        </View>
        <Pressable
          onPress={() => router.push('/story/couple-chat')}
          style={[styles.iconBtn, { backgroundColor: Colors.relationship + '18', borderColor: 'transparent' }]}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color={Colors.relationship} />
        </Pressable>
      </View>

      {toast ? (
        <View style={[styles.toast, { backgroundColor: Colors.floPink }]}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {isLoading && !data ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.floPink} />
      ) : error && !data ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>Önce partner kodu ile eşleşin.</Text>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 + keyboardOverlap }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <Text style={[styles.section, { color: colors.text }]}>Şimdi iste</Text>
          <TextInput
            style={[styles.replyInput, { color: colors.text, backgroundColor: colors.inputBg, marginBottom: 10, height: 44 }]}
            placeholder="İsteğe yorum ekle (isteğe bağlı)"
            placeholderTextColor={colors.textMuted}
            value={newComment}
            onChangeText={setNewComment}
          />
          <View style={styles.grid}>
            {catalog.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => send(item.id, item.label)}
                style={({ pressed }) => [
                  styles.nudgeBtn,
                  { backgroundColor: isDark ? colors.card : '#FFF', borderColor: colors.border },
                  pressed && { opacity: 0.6, transform: [{ scale: 0.97 }] },
                ]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={[styles.nudgeLabel, { color: colors.text }]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.section, { color: colors.text, marginTop: 22 }]}>Son istekler</Text>
          {items.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>Henüz istek yok.</Text>
          ) : (
            items.map((n) => (
              <View key={n.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardTop}>
                  <Text style={[styles.cardTitle, { color: colors.text, flex: 1 }]}>
                    {n.emoji} {n.fromMe ? 'Siz' : 'Partneriniz'} · {n.label}
                    {n.status === 'sending' ? ' · gönderiliyor' : ''}
                  </Text>
                  <Pressable
                    onPress={() => remove(n.id, n.label)}
                    hitSlop={8}
                    disabled={deleteNudge.isPending}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                  </Pressable>
                </View>
                <Text style={[styles.cardBody, { color: colors.textSecondary }]}>{n.body}</Text>
                {n.replies.length > 0 && (
                  <Text style={[styles.commentLabel, { color: colors.textMuted }]}>Yorumlar</Text>
                )}
                {n.replies.map((r) => (
                  <View key={r.id} style={[styles.reply, { backgroundColor: isDark ? colors.inputBg : '#F8F5F6' }]}>
                    <Text style={{ color: colors.text, fontSize: 13 }}>{r.fromMe ? 'Siz: ' : 'Partner: '}{r.body}</Text>
                  </View>
                ))}
                <Pressable
                  onPress={() => toChat(n.id)}
                  disabled={transfer.isPending}
                  style={[styles.toChatBtn, { borderColor: Colors.relationship + '40' }]}
                >
                  <Ionicons name="arrow-forward-circle" size={16} color={Colors.relationship} />
                  <Text style={{ color: Colors.relationship, fontSize: 12, fontWeight: '800' }}>Sohbete aktar</Text>
                </Pressable>
                <View style={styles.quickRow}>
                  {QUICK.map((q) => (
                    <Pressable key={q} onPress={() => reply(n.id, q)} style={[styles.chip, { borderColor: colors.border }]}>
                      <Text style={{ color: Colors.floPink, fontSize: 11, fontWeight: '700' }}>{q}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.replyRow}>
                  <TextInput
                    style={[styles.replyInput, { color: colors.text, backgroundColor: colors.inputBg }]}
                    placeholder="Yorum yaz…"
                    placeholderTextColor={colors.textMuted}
                    value={drafts[n.id] ?? ''}
                    onChangeText={(v) => setDrafts((d) => ({ ...d, [n.id]: v }))}
                  />
                  <Pressable onPress={() => reply(n.id)} style={[styles.miniSend, { backgroundColor: Colors.floPink }]}>
                    <Ionicons name="send" size={14} color="#fff" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 1 },
  section: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  nudgeBtn: {
    width: '47%',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  emoji: { fontSize: 22 },
  nudgeLabel: { fontSize: 13, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 14 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  toastText: { color: '#fff', fontWeight: '800', fontSize: 13, flex: 1 },
  card: { borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '800' },
  cardBody: { fontSize: 13, marginTop: 4, marginBottom: 8 },
  reply: { borderRadius: 12, padding: 8, marginBottom: 6 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 5 },
  replyRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  replyInput: { flex: 1, height: 40, borderRadius: 14, paddingHorizontal: 12, fontSize: 13 },
  miniSend: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  commentLabel: { fontSize: 11, fontWeight: '800', marginBottom: 6, marginTop: 2 },
  toChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
});
