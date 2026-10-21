import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, Modal, FlatList, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAdminControllerGetUsers } from '@/src/api/generated/api';
import { adminClient } from '@/src/api/adminClient';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getErrorMessage } from '@/src/api/customFetch';
import type { AdminUserDto } from '@/src/api/generated/schemas';
import { useQueryClient } from '@tanstack/react-query';

type TargetType = 'all' | 'module' | 'user';

const TEMPLATES = [
  { title: '🌸 Regl Hatırlatması', body: 'Yarın regl döneminiz başlayabilir. Hazırlıklı olun ve kendinize iyi bakın!', module: 'period', type: 'reminder' },
  { title: '🤰 Haftalık Gebelik İpucu', body: 'Bu hafta bebeğiniz hızla büyüyor! Günlük su tüketiminizi artırmayı unutmayın.', module: 'pregnancy', type: 'tip' },
  { title: '💕 Özel Gün Hatırlatması', body: 'Yaklaşan özel gününüz var! Partnerinize küçük bir sürpriz hazırlamaya ne dersiniz?', module: 'relationship', type: 'reminder' },
  { title: '📢 Pusena Duyurusu', body: 'Pusena uygulamasında yeni özellikler sizi bekliyor! Hemen keşfedin.', module: 'sistem', type: 'admin' },
  { title: '💬 Topluluk Etkinliği', body: 'Bu hafta toplulukta harika paylaşımlar var. Katılmak ister misiniz?', module: 'community', type: 'admin' },
];

const MODULES = [
  { id: 'sistem', label: 'Sistem', color: '#6366F1' },
  { id: 'pregnancy', label: 'Gebelik', color: Colors.pregnancy },
  { id: 'period', label: 'Regl', color: Colors.period },
  { id: 'relationship', label: 'İlişki', color: Colors.relationship },
  { id: 'community', label: 'Topluluk', color: Colors.community },
];

const TYPES = [
  { id: 'admin', label: 'Duyuru' },
  { id: 'tip', label: 'İpucu' },
  { id: 'reminder', label: 'Hatırlatma' },
];

export default function AdminNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [notifModule, setNotifModule] = useState('sistem');
  const [notifType, setNotifType] = useState('admin');
  const [targetType, setTargetType] = useState<TargetType>('all');
  const [targetModule, setTargetModule] = useState('pregnancy');
  const [selectedUsers, setSelectedUsers] = useState<AdminUserDto[]>([]);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [schedulePreview, setSchedulePreview] = useState(true);

  const { data: usersData } = useAdminControllerGetUsers({ page: 1, limit: 200, search: userSearch || undefined });

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitle(tpl.title);
    setBody(tpl.body);
    setNotifModule(tpl.module);
    setNotifType(tpl.type);
    if (tpl.module === 'pregnancy' || tpl.module === 'period' || tpl.module === 'relationship') {
      setTargetType('module');
      setTargetModule(tpl.module);
    }
  };

  const toggleUser = (user: AdminUserDto) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
    );
  };

  const getTargetDescription = () => {
    if (targetType === 'all') return 'Tüm kayıtlı kullanıcılar';
    if (targetType === 'module') return `${MODULES.find((m) => m.id === targetModule)?.label ?? targetModule} modülü aktif kullanıcılar`;
    if (selectedUsers.length === 0) return 'Kullanıcı seçilmedi';
    if (selectedUsers.length === 1) return selectedUsers[0].name;
    return `${selectedUsers.length} seçili kullanıcı`;
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Hata', 'Başlık ve içerik zorunludur.');
      return;
    }
    if (targetType === 'user' && selectedUsers.length === 0) {
      Alert.alert('Hata', 'En az bir kullanıcı seçin.');
      return;
    }

    Alert.alert(
      'Bildirim Gönder',
      `"${title}" başlıklı bildirim ${getTargetDescription()} hedefine gönderilecek. Onaylıyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Gönder',
          onPress: async () => {
            setSending(true);
            try {
              const payload: Parameters<typeof adminClient.sendNotification>[0] = {
                title: title.trim(),
                body: body.trim(),
                module: notifModule,
                type: notifType,
              };
              if (targetType === 'all') {
                // all users - no extra fields
              } else if (targetType === 'module') {
                payload.targetModule = targetModule;
              } else {
                payload.userIds = selectedUsers.map((u) => u.id);
              }
              const res = await adminClient.sendNotification(payload);
              await queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
              Alert.alert('Başarılı ✨', `Bildirim ${res.sentCount} kullanıcıya gönderildi.`);
              setTitle('');
              setBody('');
              setSelectedUsers([]);
            } catch (e) {
              Alert.alert('Hata', getErrorMessage(e, 'Bildirim gönderilemedi.'));
            } finally {
              setSending(false);
            }
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ paddingTop: insets.top + 8 }}>
          <AdminHeader title="Bildirim Merkezi" subtitle="Kullanıcı bildirim merkezine duyuru ve ipucu gönder" />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Templates */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Hazır Şablonlar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {TEMPLATES.map((tpl, i) => (
              <Pressable
                key={i}
                style={[styles.templateCard, { backgroundColor: isDark ? colors.card : '#F9FAFB', borderColor: colors.border }]}
                onPress={() => applyTemplate(tpl)}
              >
                <Text style={[styles.templateTitle, { color: colors.text }]} numberOfLines={1}>{tpl.title}</Text>
                <Text style={[styles.templateBody, { color: colors.textMuted }]} numberOfLines={2}>{tpl.body}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Target */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Hedef Kitle</Text>
          <View style={styles.targetRow}>
            {([
              { key: 'all', label: 'Herkes', icon: 'globe' },
              { key: 'module', label: 'Modül', icon: 'apps' },
              { key: 'user', label: 'Kullanıcı', icon: 'person' },
            ] as const).map((t) => (
              <Pressable
                key={t.key}
                style={[styles.targetBtn, { backgroundColor: targetType === t.key ? Colors.primary : colors.card, borderColor: targetType === t.key ? Colors.primary : colors.border }]}
                onPress={() => setTargetType(t.key)}
              >
                <Ionicons name={t.icon as any} size={16} color={targetType === t.key ? '#FFF' : colors.text} />
                <Text style={{ color: targetType === t.key ? '#FFF' : colors.text, fontSize: 12, fontWeight: '700' }}>{t.label}</Text>
              </Pressable>
            ))}
          </View>

          {targetType === 'module' && (
            <View style={styles.chipRow}>
              {['pregnancy', 'period', 'relationship'].map((m) => (
                <Pressable
                  key={m}
                  style={[styles.chip, { backgroundColor: targetModule === m ? Colors.primary : colors.inputBg, borderColor: colors.border }]}
                  onPress={() => setTargetModule(m)}
                >
                  <Text style={{ color: targetModule === m ? '#FFF' : colors.text, fontWeight: '700', fontSize: 12 }}>
                    {MODULES.find((x) => x.id === m)?.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {targetType === 'user' && (
            <Pressable
              style={[styles.userPickerBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
              onPress={() => setShowUserPicker(true)}
            >
              <Ionicons name="people" size={20} color={Colors.primary} />
              <Text style={{ flex: 1, color: colors.text, fontWeight: '600' }}>
                {selectedUsers.length > 0 ? `${selectedUsers.length} kullanıcı seçildi` : 'Kullanıcı seç...'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          )}

          {/* Module & Type */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Bildirim Kategorisi</Text>
          <View style={styles.chipRow}>
            {MODULES.map((m) => (
              <Pressable
                key={m.id}
                style={[styles.chip, { backgroundColor: notifModule === m.id ? m.color : colors.inputBg, borderColor: colors.border }]}
                onPress={() => setNotifModule(m.id)}
              >
                <Text style={{ color: notifModule === m.id ? '#FFF' : colors.text, fontWeight: '700', fontSize: 11 }}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={[styles.chipRow, { marginTop: 8 }]}>
            {TYPES.map((t) => (
              <Pressable
                key={t.id}
                style={[styles.chip, { backgroundColor: notifType === t.id ? Colors.floPurple : colors.inputBg, borderColor: colors.border }]}
                onPress={() => setNotifType(t.id)}
              >
                <Text style={{ color: notifType === t.id ? '#FFF' : colors.text, fontWeight: '700', fontSize: 12 }}>{t.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Content */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Başlık</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Bildirim başlığı..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={[styles.charCount, { color: colors.textMuted }]}>{title.length}/100</Text>

          <Text style={[styles.sectionLabel, { color: colors.text }]}>İçerik</Text>
          <TextInput
            style={[styles.input, styles.multiline, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Bildirim mesajı..."
            placeholderTextColor={colors.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: colors.textMuted }]}>{body.length}/500</Text>

          {/* Preview */}
          <View style={styles.previewHeader}>
            <Text style={[styles.sectionLabel, { color: colors.text, marginBottom: 0 }]}>Önizleme</Text>
            <Switch value={schedulePreview} onValueChange={setSchedulePreview} trackColor={{ true: Colors.primary }} />
          </View>
          {schedulePreview && (
            <View style={[styles.previewCard, { backgroundColor: isDark ? '#2D2030' : '#FFF', borderColor: colors.border }]}>
              <View style={styles.previewTop}>
                <View style={[styles.previewIcon, { backgroundColor: Colors.primary + '20' }]}>
                  <Ionicons name="notifications" size={16} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.previewApp, { color: colors.textMuted }]}>PUSENA · {notifModule.toUpperCase()}</Text>
                  <Text style={[styles.previewTitle, { color: colors.text }]}>{title || 'Bildirim Başlığı'}</Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 10 }}>Şimdi</Text>
              </View>
              <Text style={[styles.previewBody, { color: colors.textSecondary }]}>{body || 'Bildirim içeriği burada görünecek...'}</Text>
              <Text style={[styles.previewTarget, { color: Colors.floTeal }]}>→ {getTargetDescription()}</Text>
            </View>
          )}

          <Pressable
            style={[styles.sendBtn, { backgroundColor: title.trim() && body.trim() ? Colors.primary : colors.border }]}
            onPress={handleSend}
            disabled={sending || !title.trim() || !body.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.sendBtnText}>{sending ? 'Gönderiliyor...' : 'Bildirimi Gönder'}</Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* User picker modal */}
        <Modal visible={showUserPicker} transparent animationType="slide" onRequestClose={() => setShowUserPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Kullanıcı Seç ({selectedUsers.length})</Text>
                <Pressable onPress={() => setShowUserPicker(false)}>
                  <Text style={{ color: Colors.primary, fontWeight: '700' }}>Tamam</Text>
                </Pressable>
              </View>
              <View style={[styles.searchBar, { backgroundColor: colors.inputBg }]}>
                <Ionicons name="search" size={18} color={colors.textMuted} />
                <TextInput
                  style={{ flex: 1, color: colors.text, fontSize: 15 }}
                  placeholder="Ara..."
                  placeholderTextColor={colors.textMuted}
                  value={userSearch}
                  onChangeText={setUserSearch}
                />
              </View>
              <FlatList
                data={usersData?.items ?? []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const sel = selectedUsers.some((u) => u.id === item.id);
                  return (
                    <Pressable style={[styles.userItem, { borderBottomColor: colors.border }]} onPress={() => toggleUser(item)}>
                      <View style={[styles.userAvatar, { backgroundColor: sel ? Colors.primary + '30' : Colors.primary + '15' }]}>
                        <Text style={{ color: Colors.primary, fontWeight: '700' }}>{item.name[0]}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text, fontWeight: '600' }}>{item.name}</Text>
                        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{item.email}</Text>
                      </View>
                      <Ionicons name={sel ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={sel ? Colors.primary : colors.textMuted} />
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '800', marginTop: 16, marginBottom: 10 },
  templateCard: { width: 160, padding: 12, borderRadius: 14, borderWidth: 1 },
  templateTitle: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  templateBody: { fontSize: 10, lineHeight: 14 },
  targetRow: { flexDirection: 'row', gap: 8 },
  targetBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  userPickerBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, height: 48, fontSize: 15 },
  multiline: { height: 110, paddingTop: 14, textAlignVertical: 'top' },
  charCount: { fontSize: 11, textAlign: 'right', marginTop: 4 },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  previewCard: { borderRadius: 16, padding: 14, borderWidth: 1, marginTop: 8 },
  previewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  previewIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  previewApp: { fontSize: 10, fontWeight: '600' },
  previewTitle: { fontSize: 14, fontWeight: '800' },
  previewBody: { fontSize: 13, lineHeight: 18 },
  previewTarget: { fontSize: 11, marginTop: 8, fontWeight: '600' },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 16, marginTop: 20 },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 42, borderRadius: 12, marginBottom: 10 },
  userItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  userAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
