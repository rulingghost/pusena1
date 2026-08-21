import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useCoupleMessages, useSendCoupleMessage } from '@/src/api/bloomClient';

function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export default function CoupleChatScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data, isLoading, error } = useCoupleMessages();
  const send = useSendCoupleMessage();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const items = data?.items ?? [];

  useEffect(() => {
    if (items.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [items.length]);

  const onSend = () => {
    const body = text.trim();
    if (!body || send.isPending) return;
    setText('');
    send.mutate(body);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={8}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{data?.partnerName || 'Özel sohbet'}</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>Sadece ikiniz görürsünüz</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.floPink} />
      ) : error ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>Sohbet yalnızca eşleşmiş çiftler için.</Text>
      ) : (
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.row, item.fromMe ? styles.rowMe : styles.rowThem]}>
              <View
                style={[
                  styles.bubble,
                  item.fromMe
                    ? { backgroundColor: Colors.floPink }
                    : { backgroundColor: isDark ? colors.card : '#FFF', borderColor: colors.border, borderWidth: 1 },
                ]}
              >
                <Text style={{ color: item.fromMe ? '#fff' : colors.text, fontSize: 15, lineHeight: 21 }}>{item.body}</Text>
                <Text style={{ color: item.fromMe ? 'rgba(255,255,255,0.75)' : colors.textMuted, fontSize: 10, marginTop: 4 }}>
                  {timeLabel(item.createdAt)}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              İlk mesajı siz yazın. İsteklerin altına da yanıt düşebilirsiniz.
            </Text>
          }
        />
      )}

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 10), borderTopColor: colors.border, backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg }]}
          placeholder="Mesaj yazın…"
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={onSend}
        />
        <Pressable
          onPress={onSend}
          disabled={!text.trim() || send.isPending}
          style={[styles.send, { backgroundColor: text.trim() ? Colors.floPink : colors.border }]}
        >
          <Ionicons name="arrow-up" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  empty: { textAlign: 'center', marginTop: 48, paddingHorizontal: 28, fontSize: 14, lineHeight: 20 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1 },
  input: { flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16, fontSize: 15 },
  send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
