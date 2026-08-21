import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useSettingsControllerGetSettings } from '@/src/api/generated/api';
import { usePatchNotificationSettings } from '@/src/api/bloomClient';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { ALARM_OFFSETS, ensureNotificationPermission } from '@/src/notifications/bloomAlerts';

type BoolKeys =
  | 'pregnancyWeekly'
  | 'pregnancyTips'
  | 'periodReminder'
  | 'fertilityAlert'
  | 'specialDateReminder'
  | 'communityLikes'
  | 'communityComments'
  | 'medicationReminder'
  | 'countdownReminder';

const SETTINGS: { key: BoolKeys; label: string; desc?: string; section: string }[] = [
  { key: 'pregnancyWeekly', label: 'Haftalık gebelik bildirimi', desc: 'Haftalık gelişim özeti', section: 'Gebelik' },
  { key: 'pregnancyTips', label: 'Gebelik ipuçları', desc: 'Günlük öneriler', section: 'Gebelik' },
  { key: 'countdownReminder', label: 'Kalan gün alarmları', desc: 'Doğum ve regl için 1 ay / 1 hafta / 3 gün / 1 gün kala', section: 'Gebelik' },
  { key: 'periodReminder', label: 'Regl hatırlatması', section: 'Regl' },
  { key: 'fertilityAlert', label: 'Doğurganlık uyarısı', section: 'Regl' },
  { key: 'medicationReminder', label: 'İlaç / vitamin saati', desc: 'Seçtiğiniz saatlerde alarm tarzı bildirim', section: 'Sağlık' },
  { key: 'specialDateReminder', label: 'Özel gün hatırlatması', desc: 'Yıldönümü vb. kalan gün alarmları', section: 'İlişki' },
  { key: 'communityLikes', label: 'Beğeni bildirimi', section: 'Topluluk' },
  { key: 'communityComments', label: 'Yorum bildirimi', section: 'Topluluk' },
];

const OFFSET_LABELS: Record<number, string> = {
  30: '1 ay önce',
  7: '1 hafta önce',
  3: '3 gün önce',
  1: '1 gün önce',
};

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: settings, isLoading } = useSettingsControllerGetSettings();
  const updateMutation = usePatchNotificationSettings();
  const [values, setValues] = useState<Record<BoolKeys, boolean>>({} as any);
  const [offsets, setOffsets] = useState<number[]>([30, 7, 3, 1]);

  useEffect(() => {
    if (settings?.notifications) {
      const n = settings.notifications as any;
      setValues({
        pregnancyWeekly: !!n.pregnancyWeekly,
        pregnancyTips: !!n.pregnancyTips,
        periodReminder: !!n.periodReminder,
        fertilityAlert: !!n.fertilityAlert,
        specialDateReminder: !!n.specialDateReminder,
        communityLikes: !!n.communityLikes,
        communityComments: !!n.communityComments,
        medicationReminder: n.medicationReminder !== false,
        countdownReminder: n.countdownReminder !== false,
      });
      if (Array.isArray(n.reminderOffsets) && n.reminderOffsets.length) {
        setOffsets(n.reminderOffsets);
      }
    }
  }, [settings]);

  const patch = (data: Record<string, unknown>, rollback?: () => void) => {
    updateMutation.mutate(data, {
      onError: () => {
        rollback?.();
        Alert.alert('Kaydedilemedi', 'Bildirim ayarı güncellenemedi. İnternet bağlantınızı kontrol edin.');
      },
    });
  };

  const toggle = (key: BoolKeys) => {
    const prevVal = values[key];
    const newVal = !prevVal;
    setValues((prev) => ({ ...prev, [key]: newVal }));
    patch({ [key]: newVal }, () => setValues((prev) => ({ ...prev, [key]: prevVal })));
  };

  const toggleOffset = (n: number) => {
    const next = offsets.includes(n) ? offsets.filter((x) => x !== n) : [...offsets, n].sort((a, b) => b - a);
    const prev = offsets;
    setOffsets(next);
    patch({ reminderOffsets: next }, () => setOffsets(prev));
  };

  if (isLoading) return <LoadingScreen />;

  let lastSection = '';
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Bildirim ayarları</Text>
          <View style={{ width: 32 }} />
        </View>

        <Text style={[styles.infoBox, { color: colors.textSecondary, backgroundColor: Colors.primary + '10' }]}>
          iOS ve Android, üçüncü parti uygulamaların sistem Saat alarmına yazmasına izin vermez. Pusena, aynı saatte yüksek öncelikli bildirim (alarm tarzı) kurar. İzin vermeniz gerekir.
        </Text>

        <Pressable
          onPress={() => ensureNotificationPermission().then((ok) => Alert.alert(ok ? 'İzin açık' : 'İzin kapalı', ok ? 'Bildirimler gönderilebilir.' : 'Ayarlar → Pusena → Bildirimler'))}
          style={{ marginBottom: 8 }}
        >
          <Text style={{ color: Colors.floTeal, fontWeight: '700' }}>Bildirim iznini kontrol et</Text>
        </Pressable>

        {SETTINGS.map((item) => {
          const showSection = item.section !== lastSection;
          lastSection = item.section;
          return (
            <React.Fragment key={item.key}>
              {showSection && <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{item.section}</Text>}
              <View style={[styles.row, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowLabel, { color: colors.text }]}>{item.label}</Text>
                  {item.desc && <Text style={[styles.rowDesc, { color: colors.textMuted }]}>{item.desc}</Text>}
                </View>
                <Switch value={!!values[item.key]} onValueChange={() => toggle(item.key)} trackColor={{ true: Colors.primary }} />
              </View>
            </React.Fragment>
          );
        })}

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Kalan gün alarmları</Text>
        <Text style={[styles.rowDesc, { color: colors.textMuted, marginBottom: 10 }]}>
          Özel gün, tahmini doğum ve regl için hangi sürelerde çalsın?
        </Text>
        <View style={styles.chipRow}>
          {ALARM_OFFSETS.map((n) => {
            const on = offsets.includes(n);
            return (
              <Pressable
                key={n}
                onPress={() => toggleOffset(n)}
                style={[styles.chip, { backgroundColor: on ? Colors.floPink : isDark ? colors.card : '#F3F4F6' }]}
              >
                <Text style={{ color: on ? '#fff' : colors.text, fontWeight: '700', fontSize: 12 }}>{OFFSET_LABELS[n]}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700' },
  infoBox: { fontSize: 13, lineHeight: 19, padding: 14, borderRadius: 12, marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', marginTop: 20, marginBottom: 8, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  rowLabel: { fontSize: 15, fontWeight: '500' },
  rowDesc: { fontSize: 12, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14 },
});
