import React, { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '@/src/theme/colors';
import { useTheme } from '@/src/theme/useTheme';
import {
  addCustomCoupleTool,
  hideCoupleTool,
  loadCoupleTools,
  restoreCoupleTool,
  type CoupleTool,
} from '@/src/utils/coupleTools';

export function CoupleToolsGrid({ isPaired }: { isPaired: boolean }) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [visible, setVisible] = useState<CoupleTool[]>([]);
  const [hidden, setHidden] = useState<CoupleTool[]>([]);
  const [manage, setManage] = useState(false);
  const [noteTool, setNoteTool] = useState<CoupleTool | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');

  const reload = useCallback(async () => {
    const data = await loadCoupleTools();
    setVisible(data.visible);
    setHidden(data.hidden);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const openTool = (tool: CoupleTool) => {
    if (!isPaired) return;
    if (tool.route) {
      router.push(tool.route as any);
      return;
    }
    setNoteTool(tool);
  };

  const addTool = async () => {
    const title = newTitle.trim();
    if (!title) return;
    await addCustomCoupleTool({
      title,
      sub: 'Ortak not',
      icon: 'bookmark',
      color: Colors.floPurple,
      note: newNote.trim() || 'Kısa bir ortak not.',
    });
    setNewTitle('');
    setNewNote('');
    await reload();
  };

  return (
    <View>
      <View style={styles.head}>
        <Text style={[styles.heading, { color: colors.text }]}>Çift araçları</Text>
        {isPaired && (
          <Pressable onPress={() => setManage(true)} style={[styles.editPill, { backgroundColor: Colors.floPinkLight }]}>
            <Ionicons name="options-outline" size={14} color={Colors.floPink} />
            <Text style={styles.editPillText}>Düzenle</Text>
          </Pressable>
        )}
      </View>

      {!isPaired ? (
        <View style={[styles.lockCard, { backgroundColor: isDark ? colors.card : '#FFF7FA', borderColor: colors.border }]}>
          <Ionicons name="lock-closed" size={22} color={Colors.floPink} />
          <Text style={[styles.lockTitle, { color: colors.text }]}>Partner bağlamalısınız</Text>
          <Text style={[styles.lockBody, { color: colors.textMuted }]}>
            Sohbet, istekler, konum, günün sorusu ve notlar eşleşmeden açılmaz. Yukarıdaki kodu paylaşın veya partner kodunu girin.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.grid}>
            {visible.map((tool) => (
              <Pressable
                key={tool.id}
                style={[styles.card, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border }]}
                onPress={() => openTool(tool)}
              >
                <View style={[styles.icon, { backgroundColor: tool.color + '15' }]}>
                  <Ionicons name={tool.icon as any} size={22} color={tool.color} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>{tool.title}</Text>
                <Text style={[styles.sub, { color: colors.textMuted }]}>{tool.sub}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <Modal visible={manage} transparent animationType="fade" onRequestClose={() => setManage(false)}>
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: colors.card }]}>
            <View style={styles.modalHead}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Araçları düzenle</Text>
              <Pressable onPress={() => setManage(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </Pressable>
            </View>
            {visible.map((tool) => (
              <View key={tool.id} style={styles.row}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{tool.title}</Text>
                <Pressable onPress={async () => { await hideCoupleTool(tool.id); await reload(); }}>
                  <Text style={{ color: Colors.danger, fontWeight: '800', fontSize: 12 }}>Çıkar</Text>
                </Pressable>
              </View>
            ))}
            {hidden.map((tool) => (
              <View key={tool.id} style={styles.row}>
                <Text style={[styles.rowTitle, { color: colors.textMuted }]}>{tool.title}</Text>
                <Pressable onPress={async () => { await restoreCoupleTool(tool.id); await reload(); }}>
                  <Text style={{ color: Colors.floTeal, fontWeight: '800', fontSize: 12 }}>Ekle</Text>
                </Pressable>
              </View>
            ))}
            <Text style={[styles.addLabel, { color: colors.textSecondary }]}>Küçük ortak not</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Başlık"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
            />
            <TextInput
              value={newNote}
              onChangeText={setNewNote}
              placeholder="Kısa not (isteğe bağlı)"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]}
            />
            <Pressable onPress={addTool} style={[styles.addBtn, { backgroundColor: Colors.floPink }]}>
              <Text style={styles.addBtnText}>Not aracı ekle</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={!!noteTool} transparent animationType="fade" onRequestClose={() => setNoteTool(null)}>
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{noteTool?.title}</Text>
            <Text style={[styles.lockBody, { color: colors.textSecondary, marginTop: 10 }]}>{noteTool?.note}</Text>
            <Pressable onPress={() => setNoteTool(null)} style={[styles.addBtn, { backgroundColor: Colors.primary, marginTop: 16 }]}>
              <Text style={styles.addBtnText}>Tamam</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  heading: { fontSize: 17, fontWeight: '800' },
  editPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  editPillText: { color: Colors.floPink, fontSize: 12, fontWeight: '700' },
  lockCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 24, gap: 6 },
  lockTitle: { fontSize: 15, fontWeight: '800' },
  lockBody: { fontSize: 13, lineHeight: 19 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  card: { width: '48%', padding: 14, borderRadius: 18, borderWidth: 1 },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 13.5, fontWeight: '800', marginBottom: 2 },
  sub: { fontSize: 10.5 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 22 },
  modal: { borderRadius: 22, padding: 18 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 17, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  rowTitle: { fontSize: 14, fontWeight: '700', flex: 1, paddingRight: 8 },
  addLabel: { fontSize: 12, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, height: 44, paddingHorizontal: 12, marginBottom: 8 },
  addBtn: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '800' },
});
