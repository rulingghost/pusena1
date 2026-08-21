import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { useSettingsControllerGetSettings } from '@/src/api/generated/api';
import { usePatchNotificationSettings } from '@/src/api/bloomClient';
import { ALARM_OFFSETS, ensureNotificationPermission } from '@/src/notifications/bloomAlerts';
import { useBloomAlertSync } from '@/src/notifications/useBloomAlertSync';

const OFFSET_LABELS: Record<number, string> = {
  30: '1 ay önce',
  7: '1 hafta önce',
  3: '3 gün önce',
  1: '1 gün önce',
};

export default function UnifiedRemindersScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { data: settings } = useSettingsControllerGetSettings();
  const patch = usePatchNotificationSettings();
  useBloomAlertSync(true);

  const n = (settings?.notifications || {}) as any;
  const [offsets, setOffsets] = useState<number[]>([30, 7, 3, 1]);

  useEffect(() => {
    if (Array.isArray(n.reminderOffsets) && n.reminderOffsets.length) setOffsets(n.reminderOffsets);
  }, [settings]);

  const enabled = {
    med: n.medicationReminder !== false,
    countdown: n.countdownReminder !== false,
    period: !!n.periodReminder,
    special: !!n.specialDateReminder,
    pregnancy: !!n.pregnancyWeekly,
  };

  const setFlag = (key: string, val: boolean) => {
    patch.mutate({ [key]: val }, { onError: () => Alert.alert('Hata', 'Ayar kaydedilemedi.') });
  };

  const toggleOffset = (day: number) => {
    const next = offsets.includes(day) ? offsets.filter((x) => x !== day) : [...offsets, day].sort((a, b) => b - a);
    setOffsets(next);
    patch.mutate({ reminderOffsets: next }, { onError: () => Alert.alert('Hata', 'Alarm süreleri kaydedilemedi.') });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Hatırlatma & alarm</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Sistem saatine yazılmaz; Pusena bildirimi çalar</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: isDark ? '#1F2E2E' : Colors.floTealLight, borderColor: Colors.floTeal + '30' }]}>
          <Ionicons name="alarm-outline" size={22} color={Colors.floTeal} />
          <Text style={[styles.bannerText, { color: colors.text }]}>
            Telefon üreticileri uygulama alarmını Saat uygulamasına eklemeyi engeller. Pusena, seçtiğiniz günlerde yüksek öncelikli bildirim kurar (ses + titreşim).
          </Text>
        </View>

        <Pressable
          style={styles.link}
          onPress={() =>
            ensureNotificationPermission().then((ok) =>
              Alert.alert(ok ? 'İzin verildi' : 'İzin yok', ok ? 'Alarmlar kurulabilir.' : 'Ayarlardan Pusena bildirimlerini açın.'),
            )
          }
        >
          <Text style={{ color: Colors.floTeal, fontWeight: '700' }}>Bildirim iznini aç</Text>
        </Pressable>

        <Text style={[styles.section, { color: colors.textSecondary }]}>Olaydan önce</Text>
        <View style={styles.chipRow}>
          {ALARM_OFFSETS.map((d) => {
            const on = offsets.includes(d);
            return (
              <Pressable
                key={d}
                onPress={() => toggleOffset(d)}
                style={[styles.chip, { backgroundColor: on ? Colors.floPink : isDark ? colors.card : '#F3F4F6' }]}
              >
                <Text style={{ color: on ? '#fff' : colors.text, fontWeight: '700', fontSize: 12 }}>{OFFSET_LABELS[d]}</Text>
              </Pressable>
            );
          })}
        </View>

        {[
          { key: 'medicationReminder', title: 'İlaç / vitamin saati', hint: 'Seçtiğiniz saatlerde günlük', on: enabled.med, color: Colors.floTeal, icon: 'medkit' as const },
          { key: 'countdownReminder', title: 'Kalan gün (doğum & regl)', hint: OFFSET_LABELS[offsets[0]] ? 'Seçili sürelerde' : 'Süre seçin', on: enabled.countdown, color: Colors.floPink, icon: 'hourglass' as const },
          { key: 'periodReminder', title: 'Regl tahmini', hint: 'Kalan gün alarmına dahildir', on: enabled.period, color: Colors.floPink, icon: 'calendar' as const },
          { key: 'specialDateReminder', title: 'Özel günler', hint: 'Yıldönümü vb.', on: enabled.special, color: Colors.relationship, icon: 'heart' as const },
          { key: 'pregnancyWeekly', title: 'Haftalık gebelik', hint: 'Sunucu bildirimi', on: enabled.pregnancy, color: Colors.floPurple, icon: 'mail' as const },
        ].map((rem) => (
          <View key={rem.key} style={[styles.remCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: rem.color + '15' }]}>
              <Ionicons name={rem.icon} size={22} color={rem.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.remTitle, { color: colors.text }]}>{rem.title}</Text>
              <Text style={[styles.remTime, { color: colors.textMuted }]}>{rem.hint}</Text>
            </View>
            <Switch
              value={rem.on}
              onValueChange={(v) => setFlag(rem.key, v)}
              trackColor={{ false: '#D1D5DB', true: rem.color }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>
        ))}

        <Pressable onPress={() => router.push('/profile/medications')} style={{ marginTop: 8 }}>
          <Text style={{ color: Colors.floTeal, fontWeight: '700' }}>İlaç saatlerini düzenle →</Text>
        </Pressable>
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
  banner: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, marginVertical: 12, alignItems: 'center' },
  bannerText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  link: { marginBottom: 8 },
  section: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginTop: 8, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14 },
  remCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 10 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  remTitle: { fontSize: 14, fontWeight: '800' },
  remTime: { fontSize: 12, marginTop: 2 },
});
