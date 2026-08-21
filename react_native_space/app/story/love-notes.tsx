import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';

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

  const [customMsg, setCustomMsg] = useState('');
  const [sentNotes, setSentNotes] = useState<NoteItem[]>([
    { id: '1', sender: 'Partnerinden', message: 'Günaydın birtanem, bugün senin ve bebeğimizin günü harika geçsin! Seni çok seviyorum ❤️', theme: 'romance', date: 'Bugün 08:15' },
    { id: '2', sender: 'Sen', message: 'Dün akşamki desteğin ve anlayışın için çok teşekkür ederim sevgilim.', theme: 'gratitude', date: 'Dün 22:30' },
  ]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newNote: NoteItem = {
      id: Date.now().toString(),
      sender: 'Sen',
      message: text.trim(),
      theme: 'romance',
      date: 'Az önce',
    };
    setSentNotes([newNote, ...sentNotes]);
    setCustomMsg('');
    Alert.alert('Not Kaydedildi 💌', 'Notunuz bu cihazda kaydedildi. (Partner eşleştirmesi yapıldığında senkronizasyon eklenecek.)');
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

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
          {sentNotes.map((n) => (
            <View key={n.id} style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.noteTop}>
                <Text style={[styles.noteSender, { color: Colors.relationship }]}>{n.sender}</Text>
                <Text style={[styles.noteDate, { color: colors.textMuted }]}>{n.date}</Text>
              </View>
              <Text style={[styles.noteMsg, { color: colors.text }]}>{n.message}</Text>
            </View>
          ))}
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
