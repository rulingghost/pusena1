import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useKeyboardOverlap } from '@/src/hooks/useKeyboardOverlap';
import { useCoupleMessages, useSendCoupleMessage, type CoupleChatMessage } from '@/src/api/bloomClient';

function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function Receipt({ message }: { message: CoupleChatMessage }) {
  const tint = 'rgba(255,255,255,0.85)';
  if (message.failed) {
    return <Ionicons name="alert-circle" size={13} color="#FFE0E0" />;
  }
  if (message.pending) {
    return <Ionicons name="time-outline" size={13} color={tint} />;
  }
  if (message.readAt) {
    return <Ionicons name="checkmark-done" size={14} color="#BFF3FF" />;
  }
  return <Ionicons name="checkmark" size={14} color={tint} />;
}

export default function CoupleChatScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const keyboardOverlap = useKeyboardOverlap();
  const { data, isLoading, error } = useCoupleMessages();
  const send = useSendCoupleMessage();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const items = data?.items ?? [];
  const lastMine = [...items].reverse().find((m) => m.fromMe);

  const scrollToEnd = useCallback((animated = true) => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated }));
  }, []);

  useEffect(() => {
    if (items.length) scrollToEnd();
  }, [items.length, scrollToEnd]);

  useEffect(() => {
    if (keyboardOverlap > 0) scrollToEnd();
  }, [keyboardOverlap, scrollToEnd]);

  const onSend = () => {
    const body = text.trim();
    if (!body) return;
    setText('');
    send.mutate(body);
    scrollToEnd();
  };

  const retry = (message: CoupleChatMessage) => {
    if (!message.failed) return;
    send.mutate(message.body);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{data?.partnerName || 'Özel sohbet'}</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            {lastMine?.readAt ? 'Mesajlarınız okundu' : 'Sadece ikiniz görürsünüz'}
          </Text>
        </View>
      </View>

      {isLoading && !data ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.floPink} />
      ) : error && !data ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>Sohbet yalnızca eşleşmiş çiftler için.</Text>
      ) : (
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onScrollBeginDrag={Keyboard.dismiss}
          onContentSizeChange={() => scrollToEnd(false)}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => retry(item)}
              style={[styles.row, item.fromMe ? styles.rowMe : styles.rowThem]}
            >
              <View
                style={[
                  styles.bubble,
                  item.fromMe
                    ? { backgroundColor: Colors.floPink, opacity: item.pending ? 0.75 : 1 }
                    : { backgroundColor: isDark ? colors.card : '#FFF', borderColor: colors.border, borderWidth: 1 },
                ]}
              >
                <Text style={{ color: item.fromMe ? '#fff' : colors.text, fontSize: 15, lineHeight: 21 }}>{item.body}</Text>
                <View style={styles.metaRow}>
                  <Text style={{ color: item.fromMe ? 'rgba(255,255,255,0.75)' : colors.textMuted, fontSize: 10 }}>
                    {item.failed ? 'Gitmedi · dokunup tekrar deneyin' : timeLabel(item.createdAt)}
                  </Text>
                  {item.fromMe && <Receipt message={item} />}
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              İlk mesajı siz yazın. İsteklerin altına da yanıt düşebilirsiniz.
            </Text>
          }
        />
      )}

      <View
        style={[
          styles.composer,
          {
            paddingBottom: keyboardOverlap > 0 ? 10 : Math.max(insets.bottom, 10),
            marginBottom: keyboardOverlap,
            borderTopColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg }]}
          placeholder="Mesaj yazın…"
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={onSend}
          onFocus={() => scrollToEnd()}
          multiline
          blurOnSubmit={false}
          returnKeyType="send"
        />
        <Pressable
          onPress={onSend}
          disabled={!text.trim()}
          style={[styles.send, { backgroundColor: text.trim() ? Colors.floPink : colors.border }]}
        >
          <Ionicons name="arrow-up" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 17, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 1 },
  list: { padding: 16, paddingBottom: 24 },
  row: { marginBottom: 10, maxWidth: '84%' },
  rowMe: { alignSelf: 'flex-end' },
  rowThem: { alignSelf: 'flex-start' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 48, paddingHorizontal: 28, fontSize: 14, lineHeight: 20 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1 },
  input: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15 },
  send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
