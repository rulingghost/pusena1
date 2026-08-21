import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useAdminControllerGetUserDetail, useAdminControllerDeleteUser } from '@/src/api/generated/api';
import { adminClient } from '@/src/api/adminClient';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/api/customFetch';

const MODULES = [
  { id: 'pregnancy', label: 'Gebelik', color: Colors.pregnancy },
  { id: 'period', label: 'Regl', color: Colors.period },
  { id: 'relationship', label: 'İlişki', color: Colors.relationship },
];

function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={3}>{value}</Text>
    </View>
  );
}

export default function AdminUserDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId = '', mode = 'view' } = useLocalSearchParams<{ userId: string; mode?: string }>();
  const uid = String(userId);
  const isEditMode = mode === 'edit';

  const { data: user, isLoading, refetch } = useAdminControllerGetUserDetail(uid, { query: { enabled: !!uid } });
  const deleteMutation = useAdminControllerDeleteUser();

  const [editing, setEditing] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', nickname: '', biography: '',
    isAdmin: false, hasCompletedSetup: false, activeModules: [] as string[],
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        email: user.email ?? '',
        nickname: (user as any).nickname ?? '',
        biography: (user as any).biography ?? '',
        isAdmin: user.isAdmin ?? false,
        hasCompletedSetup: user.hasCompletedSetup ?? false,
        activeModules: user.activeModules ?? [],
      });
    }
  }, [user]);

  useEffect(() => { setEditing(isEditMode); }, [isEditMode]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      Alert.alert('Hata', 'Ad ve e-posta zorunludur.');
      return;
    }
    setSaving(true);
    try {
      await adminClient.updateUser(uid, {
        name: form.name.trim(),
        email: form.email.trim(),
        nickname: form.nickname.trim() || undefined,
        biography: form.biography.trim() || undefined,
        isAdmin: form.isAdmin,
        hasCompletedSetup: form.hasCompletedSetup,
        activeModules: form.activeModules,
      });
      await queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${uid}`] });
      await refetch();
      Alert.alert('Başarılı', 'Kullanıcı güncellendi.');
      setEditing(false);
    } catch (e) {
      Alert.alert('Hata', getErrorMessage(e, 'Güncelleme başarısız.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Kullanıcıyı Sil',
      `"${user?.name}" kullanıcısını kalıcı olarak silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil', style: 'destructive',
          onPress: () => {
            deleteMutation.mutate(
              { userId: uid },
              {
                onSuccess: () => { Alert.alert('Silindi', 'Kullanıcı silindi.'); router.back(); },
                onError: (e: any) => Alert.alert('Hata', e?.body?.message ?? 'Silinemedi.'),
              },
            );
          },
        },
      ],
    );
  };

  const toggleModule = (id: string) => {
    setForm((prev) => ({
      ...prev,
      activeModules: prev.activeModules.includes(id)
        ? prev.activeModules.filter((m) => m !== id)
        : [...prev.activeModules, id],
    }));
  };

  if (isLoading) return <LoadingScreen />;
  if (!user) return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <AdminHeader title="Kullanıcı Bulunamadı" />
      <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40 }}>Bu kullanıcı mevcut değil.</Text>
    </View>
  );

  const preg = user.pregnancy as any;
  const rel = user.relationship as any;
  const period = (user as any).period;
  const settings = (user as any).settings;
  const pairedUser = (user as any).pairedUser;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <AdminHeader
          title={editing ? 'Kullanıcı Düzenle' : 'Kullanıcı Detayı'}
          subtitle={user.email}
          right={
            editing ? (
              <Pressable onPress={handleSave} disabled={saving} style={[styles.saveBtn, { backgroundColor: Colors.primary }]}>
                {saving ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.saveBtnText}>Kaydet</Text>}
              </Pressable>
            ) : (
              <Pressable onPress={() => setEditing(true)} style={[styles.saveBtn, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="create-outline" size={18} color={Colors.primary} />
              </Pressable>
            )
          }
        />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 30 }]} showsVerticalScrollIndicator={false}>
        {/* Avatar + quick stats */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarLg, { backgroundColor: Colors.primary + '25' }]}>
            <Text style={{ fontSize: 32, color: Colors.primary, fontWeight: '700' }}>
              {(user.name ?? '?')[0]?.toLocaleUpperCase('tr-TR')}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
          {user.isAdmin && (
            <View style={[styles.adminBadge, { backgroundColor: '#6366F1' + '20' }]}>
              <Text style={{ color: '#6366F1', fontSize: 11, fontWeight: '800' }}>YÖNETİCİ</Text>
            </View>
          )}
        </View>

        {/* Activity stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: 'Gönderi', val: user.postsCount ?? 0 },
            { label: 'Yorum', val: user.commentsCount ?? 0 },
            { label: 'Semptom', val: (user as any).symptomsCount ?? 0 },
            { label: 'Bildirim', val: (user as any).notificationsCount ?? 0 },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={[styles.statNum, { color: Colors.primary }]}>{s.val}</Text>
              <Text style={[styles.statLbl, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Edit / View form */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Hesap Bilgileri</Text>

          {editing ? (
            <>
              {[
                { key: 'name', label: 'Ad Soyad', multiline: false },
                { key: 'email', label: 'E-posta', multiline: false },
                { key: 'nickname', label: 'Takma Ad', multiline: false },
                { key: 'biography', label: 'Biyografi', multiline: true },
              ].map((field) => (
                <View key={field.key} style={{ marginBottom: 12 }}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{field.label}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border, minHeight: field.multiline ? 80 : 46 }]}
                    value={(form as any)[field.key]}
                    onChangeText={(v) => setForm((p) => ({ ...p, [field.key]: v }))}
                    multiline={field.multiline}
                    textAlignVertical={field.multiline ? 'top' : 'center'}
                  />
                </View>
              ))}

              <View style={styles.switchRow}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Yönetici (Admin)</Text>
                <Switch value={form.isAdmin} onValueChange={(v) => setForm((p) => ({ ...p, isAdmin: v }))} trackColor={{ true: Colors.primary }} />
              </View>
              <View style={styles.switchRow}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Kurulum Tamamlandı</Text>
                <Switch value={form.hasCompletedSetup} onValueChange={(v) => setForm((p) => ({ ...p, hasCompletedSetup: v }))} trackColor={{ true: Colors.primary }} />
              </View>

              <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 8 }]}>Aktif Modüller</Text>
              <View style={styles.moduleChips}>
                {MODULES.map((m) => {
                  const sel = form.activeModules.includes(m.id);
                  return (
                    <Pressable
                      key={m.id}
                      style={[styles.chip, { backgroundColor: sel ? m.color : colors.inputBg, borderColor: sel ? m.color : colors.border }]}
                      onPress={() => toggleModule(m.id)}
                    >
                      <Text style={{ color: sel ? '#FFF' : colors.text, fontWeight: '700', fontSize: 12 }}>{m.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : (
            <>
              <InfoRow label="Kullanıcı ID" value={user.id} colors={colors} />
              <InfoRow label="Ad Soyad" value={user.name} colors={colors} />
              <InfoRow label="Takma Ad" value={(user as any).nickname || '—'} colors={colors} />
              <InfoRow label="E-posta" value={user.email} colors={colors} />
              <InfoRow label="Partner Kodu" value={(user as any).partnerCode || '—'} colors={colors} />
              <InfoRow label="Biyografi" value={(user as any).biography || '—'} colors={colors} />
              <InfoRow label="Admin" value={user.isAdmin ? 'Evet' : 'Hayır'} colors={colors} />
              <InfoRow label="Kurulum" value={user.hasCompletedSetup ? 'Tamamlandı' : 'Bekliyor'} colors={colors} />
              <InfoRow label="Google SSO" value={user.googleId ? 'Bağlı' : 'Yok'} colors={colors} />
              <InfoRow label="Kayıt" value={user.createdAt ? new Date(user.createdAt).toLocaleString('tr-TR') : '—'} colors={colors} />
              <InfoRow label="Modüller" value={(user.activeModules ?? []).map(m => MODULES.find(x => x.id === m)?.label ?? m).join(', ') || '—'} colors={colors} />
            </>
          )}
        </View>

        {/* Partner */}
        {pairedUser && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: Colors.relationship }]}>💑 Eşleşmiş Partner</Text>
            <InfoRow label="Ad" value={pairedUser.name} colors={colors} />
            <InfoRow label="E-posta" value={pairedUser.email} colors={colors} />
            <InfoRow label="Partner Kodu" value={pairedUser.partnerCode || '—'} colors={colors} />
          </View>
        )}

        {/* Pregnancy */}
        {preg && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: Colors.pregnancy }]}>🤰 Gebelik</Text>
            <InfoRow label="SAT" value={preg.lastMenstrualPeriod ? new Date(preg.lastMenstrualPeriod).toLocaleDateString('tr-TR') : '—'} colors={colors} />
            <InfoRow label="Termin" value={preg.dueDate ? new Date(preg.dueDate).toLocaleDateString('tr-TR') : '—'} colors={colors} />
            <InfoRow label="Bebek Adı" value={preg.babyName || '—'} colors={colors} />
            <InfoRow label="Durum" value={preg.isActive ? 'Aktif' : 'Pasif'} colors={colors} />
          </View>
        )}

        {/* Period */}
        {period && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: Colors.period }]}>🌸 Son Döngü</Text>
            <InfoRow label="Başlangıç" value={period.startDate ? new Date(period.startDate).toLocaleDateString('tr-TR') : '—'} colors={colors} />
            <InfoRow label="Döngü Uzunluğu" value={`${period.cycleLength} gün`} colors={colors} />
            <InfoRow label="Regl Uzunluğu" value={`${period.periodLength} gün`} colors={colors} />
            <InfoRow label="Toplam Döngü" value={`${(user as any).periodCyclesCount ?? 0} kayıt`} colors={colors} />
          </View>
        )}

        {/* Relationship */}
        {rel && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: Colors.relationship }]}>💕 İlişki</Text>
            <InfoRow label="Partner" value={rel.partnerName ?? '—'} colors={colors} />
            <InfoRow label="Başlangıç" value={rel.startDate ? new Date(rel.startDate).toLocaleDateString('tr-TR') : '—'} colors={colors} />
          </View>
        )}

        {/* Settings */}
        {settings && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>⚙️ Ayarlar</Text>
            {Object.entries({
              pregnancyWeekly: 'Gebelik haftalık',
              pregnancyTips: 'Gebelik ipuçları',
              periodReminder: 'Regl hatırlatma',
              fertilityAlert: 'Doğurganlık uyarısı',
              specialDateReminder: 'Özel gün hatırlatma',
              communityLikes: 'Topluluk beğeni',
              communityComments: 'Topluluk yorum',
              profilePublic: 'Profil herkese açık',
              showCommunityPosts: 'Gönderiler görünür',
            }).map(([k, label]) => (
              <InfoRow key={k} label={label} value={typeof settings[k] === 'boolean' ? (settings[k] ? 'Açık' : 'Kapalı') : String(settings[k] ?? '—')} colors={colors} />
            ))}
          </View>
        )}

        {((user as any).recentSymptoms ?? []).length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>🩺 Son Semptomlar</Text>
            {((user as any).recentSymptoms as any[]).slice(0, 8).map((s, i) => (
              <InfoRow key={i} label={s.type} value={`${new Date(s.date).toLocaleDateString('tr-TR')} · Şiddet ${s.severity}`} colors={colors} />
            ))}
          </View>
        )}

        {((user as any).periodCycles ?? []).length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: Colors.period }]}>📅 Döngü Geçmişi</Text>
            {((user as any).periodCycles as any[]).slice(0, 6).map((c, i) => (
              <InfoRow key={i} label={new Date(c.startDate).toLocaleDateString('tr-TR')} value={`${c.cycleLength}g döngü · ${c.periodLength}g regl`} colors={colors} />
            ))}
          </View>
        )}

        {((user as any).specialDates ?? []).length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: Colors.relationship }]}>🎂 Özel Günler</Text>
            {((user as any).specialDates as any[]).slice(0, 8).map((d, i) => (
              <InfoRow key={i} label={d.title} value={new Date(d.date).toLocaleDateString('tr-TR')} colors={colors} />
            ))}
          </View>
        )}

        {((user as any).recentNotifications ?? []).length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>🔔 Son Bildirimler</Text>
            {((user as any).recentNotifications as any[]).slice(0, 6).map((n, i) => (
              <InfoRow key={i} label={n.title} value={n.isRead ? 'Okundu' : 'Okunmadı'} colors={colors} />
            ))}
          </View>
        )}

        {((user as any).recentPosts ?? []).length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>💬 Son Gönderiler</Text>
            {((user as any).recentPosts as any[]).slice(0, 5).map((p, i) => (
              <InfoRow key={i} label={p.category} value={(p.content ?? '').slice(0, 60)} colors={colors} />
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionRow}>
          {!editing && (
            <Pressable style={[styles.actionBtn, { backgroundColor: Colors.primary }]} onPress={() => setEditing(true)}>
              <Ionicons name="create-outline" size={18} color="#FFF" />
              <Text style={styles.actionBtnText}>Düzenle</Text>
            </Pressable>
          )}
          <Pressable style={[styles.actionBtn, { backgroundColor: Colors.danger }]} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#FFF" />
            <Text style={styles.actionBtnText}>Kullanıcıyı Sil</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  avatarSection: { alignItems: 'center', marginBottom: 16 },
  avatarLg: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  userName: { fontSize: 20, fontWeight: '800' },
  adminBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  statsRow: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statNum: { fontSize: 20, fontWeight: '900' },
  statLbl: { fontSize: 10, marginTop: 2, fontWeight: '600' },
  card: { borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, gap: 12, borderBottomWidth: 1 },
  infoLabel: { fontSize: 12, fontWeight: '600', width: 120 },
  infoValue: { fontSize: 12, flex: 1, textAlign: 'right', fontWeight: '600' },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  moduleChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 20 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});
