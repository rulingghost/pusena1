import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { getErrorMessage } from '@/src/api/customFetch';
import { useKeyboardOverlap } from '@/src/hooks/useKeyboardOverlap';
import { usePartnerInfo, useSendCoupleMessage, useCoupleMessages } from '@/src/api/bloomClient';

interface NoteItem {
  id: string;
  sender: string;
  message: string;
  theme: string;
  date: string;
}

const TEMPLATES = [
  'Bugün de varlığın için binlerce kez şükürler olsun aşkım. İyi ki varsın! 💕',
  'Gözlerindeki o sıcak bakış dünyadaki her şeye bedel. Seni çok seviyorum 🌸',
  'Birlikte kurduğumuz bu yuva ve minik bebeğimiz hayatımın en güzel hediyesi 🍼',
  'Bugün biraz yoruldun biliyorum, akşam sana harika bir masaj ve sıcak bir çay hazırlayacağım ☕',
  'Sen dünyanın en harika annesi / babası olacaksın, sana inanıyorum ve hayranım! ✨',
];

export default function LoveNotesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const { data: partnerInfo, isLoading: partnerLoading } = usePartnerInfo();
  const isPaired = Boolean(partnerInfo?.isPaired || partnerInfo?.paired);
  const { data: chat } = useCoupleMessages(isPaired);
  const sendNote = useSendCoupleMessage();

  const [customMsg, setCustomMsg] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyboardOverlap = useKeyboardOverlap();

  const sentNotes: NoteItem[] = (chat?.items ?? [])
    .filter((m) => m.kind === 'note' || m.body.startsWith('💌'))
    .slice()
    .reverse()
    .map((m) => ({
      id: m.id,
      sender: m.fromMe ? 'Sen' : partnerInfo?.pairedUserName || partnerInfo?.partnerName || 'Partnerin',
      message: m.body.replace(/^💌\s*/, ''),
      theme: 'romance',
      date: new Date(m.createdAt).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
    }));

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const handleSend = (text: string) => {
    const body = text.trim();
    if (!body) return;

    // Eşleşme bilgisi henüz gelmemişse engelleme; kararı sunucu versin.
    if (!isPaired && !partnerLoading && partnerInfo) {
      Alert.alert('Önce eşleşin', 'Not iletmek için partner kodu ile bağlanın.', [
        { text: 'Tamam', style: 'cancel' },
        { text: 'Bağlan', onPress: () => router.push('/tabs/story') },
      ]);
      return;
    }

    // Not listeye iyimser olarak eklendi; onayı ağı beklemeden göster.
    const isCustom = body === customMsg.trim();
    if (isCustom) setCustomMsg('');
    flash('İletildi ✓ Notunuz partnerinizin sohbetine düştü.');

    sendNote.mutate(
      { body: `💌 ${body}`, kind: 'note' },
      {
        onError: (err) => {
          if (isCustom) setCustomMsg(body);
          setToast(null);
          const status = (err as { status?: number } | undefined)?.status;
          if (status === 403) {
            Alert.alert('Önce eşleşin', 'Not iletmek için partner kodu ile bağlanın.', [
              { text: 'Tamam', style: 'cancel' },
              { text: 'Bağlan', onPress: () => router.push('/tabs/story') },
            ]);
            return;
          }
          Alert.alert('İletilemedi', getErrorMessage(err, 'Bağlantıyı kontrol edip tekrar deneyin.'));
        },
      },
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Aşk & Teşekkür Notları 💌</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Partnere Tatlı Sürpriz Mesajlar</Text>
        </View>
      </View>

      {toast ? (
        <View style={[styles.toast, { backgroundColor: Colors.relationship }]}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 40 + keyboardOverlap }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Send Box */}
        <View style={[styles.sendCard, { backgroundColor: colors.card, borderColor: Colors.relationship + '40' }]}>
          <Text style={[styles.sendTitle, { color: colors.text }]}>Partnere Özel Aşk Notu Gönder</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder="İçinden gelen romantik bir cümle yaz..."
            placeholderTextColor={colors.textMuted}
            multiline
            value={customMsg}
            onChangeText={setCustomMsg}
          />
          <Pressable style={[styles.sendBtn, { backgroundColor: Colors.relationship }]} onPress={() => handleSend(customMsg)}>
            <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
            <Text style={styles.sendBtnText}>Partnere Gönder</Text>
          </Pressable>
        </View>

        {/* Quick Templates */}
        <Text style={[styles.secTitle, { color: colors.text }]}>Hazır Romantik Telkinler (Tek Tıkla Gönder)</Text>
        <View style={styles.tplList}>
          {TEMPLATES.map((tpl, i) => (
            <Pressable
              key={i}
              style={[styles.tplCard, { backgroundColor: isDark ? '#2D1828' : '#FFF5F9', borderColor: Colors.floPink + '30' }]}
              onPress={() => handleSend(tpl)}
            >
              <Text style={[styles.tplText, { color: colors.text }]}>"{tpl}"</Text>
              <View style={styles.tplSendRow}>
                <Ionicons name="heart" size={14} color={Colors.floPink} />
                <Text style={[styles.tplSendLbl, { color: Colors.floPink }]}>Hemen İlet</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Sent & Received Notes */}
        <Text style={[styles.secTitle, { color: colors.text, marginTop: 16 }]}>Gelen ve Giden Notlar</Text>
        <View style={styles.notesList}>
          {sentNotes.length === 0 ? (
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Henüz iletilmiş not yok.</Text>
          ) : (
            sentNotes.map((n) => (
              <View key={n.id} style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.noteTop}>
                  <Text style={[styles.noteSender, { color: Colors.relationship }]}>{n.sender}</Text>
                  <Text style={[styles.noteDate, { color: colors.textMuted }]}>{n.date}</Text>
                </View>
                <Text style={[styles.noteMsg, { color: colors.text }]}>{n.message}</Text>
              </View>
            ))
          )}
        </View>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  toastText: { color: '#fff', fontWeight: '800', fontSize: 12.5, flex: 1 },
  sendCard: { padding: 18, borderRadius: 22, borderWidth: 1.5, marginVertical: 12 },
  sendTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  input: { minHeight: 70, borderRadius: 14, borderWidth: 1, padding: 12, fontSize: 13, marginBottom: 10, textAlignVertical: 'top' },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14 },
  sendBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  secTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  tplList: { gap: 8 },
  tplCard: { padding: 14, borderRadius: 16, borderWidth: 1 },
  tplText: { fontSize: 13, lineHeight: 18, fontStyle: 'italic', marginBottom: 6 },
  tplSendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  tplSendLbl: { fontSize: 11, fontWeight: '800' },
  notesList: { gap: 8 },
  noteCard: { padding: 14, borderRadius: 16, borderWidth: 1 },
  noteTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  noteSender: { fontSize: 12, fontWeight: '800' },
  noteDate: { fontSize: 11 },
  noteMsg: { fontSize: 13.5, lineHeight: 19 },
});
