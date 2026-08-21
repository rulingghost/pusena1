import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/useTheme';
import { Colors } from '@/src/theme/colors';
import { Notifications } from '@/src/notifications/expoLocal';
import { customFetch } from '@/src/api/customFetch';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { POSTPARTUM_TASKS, tasksForDay, upcomingTasks } from '@/src/data/postpartumTasks';
import { ageInDays, loadBabyProfile, saveBabyProfile, type BabyProfile } from '@/src/data/babyProfile';
import { localDateKey } from '@/src/utils/dateOnly';

async function ensureNotifPermission() {
  const cur = await Notifications.getPermissionsAsync();
  if (cur.status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

export default function PostpartumGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [profile, setProfile] = useState<BabyProfile>({ birthDate: null, sex: 'unknown' });
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const day = ageInDays(profile.birthDate);

  useEffect(() => {
    loadBabyProfile().then(setProfile);
  }, []);

  const scheduleLocal = useCallback(async (birthDate: string) => {
    try {
      await ensureNotifPermission();
      const existing = await Notifications.getAllScheduledNotificationsAsync();
      await Promise.all(
        existing
          .filter((n) => n.identifier.startsWith('postpartum-'))
          .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
      );
      const birth = new Date(birthDate + 'T09:00:00');
      for (const task of POSTPARTUM_TASKS) {
        const fire = new Date(birth.getTime() + task.dayFrom * 24 * 60 * 60 * 1000);
        if (fire.getTime() <= Date.now()) continue;
        await Notifications.scheduleNotificationAsync({
          identifier: `postpartum-${task.id}`,
          content: { title: task.notifyTitle, body: task.body, sound: true },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: fire,
          },
        });
      }
    } catch {
      /* cihaz izni yoksa sessizce geç */
    }
  }, []);

  const syncServer = useCallback(async (birthDate: string) => {
    try {
      const res = await customFetch<{ day: number; created: number }>('/api/pregnancy/postpartum/reminders', {
        method: 'POST',
        body: JSON.stringify({ birthDate }),
      });
      if (res.created > 0) setSyncMsg(`Bugün ${res.created} lohusalık görevi bildirimlere eklendi.`);
    } catch {
      setSyncMsg(null);
    }
  }, []);

  useEffect(() => {
    if (!profile.birthDate) return;
    scheduleLocal(profile.birthDate);
    syncServer(profile.birthDate);
  }, [profile.birthDate, scheduleLocal, syncServer]);

  const todayTasks = day == null ? [] : tasksForDay(day);
  const soon = day == null ? [] : upcomingTasks(day);
  const inWindow = day != null && day >= 0 && day <= 42;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>Lohusalık 40 Gün</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Görevler + bildirim — doğum tarihine göre</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowPicker(true)}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Doğum tarihi</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            {profile.birthDate
              ? `${new Date(profile.birthDate + 'T00:00:00').toLocaleDateString('tr-TR')} · ${day}. gün`
              : 'Girin; bugünün görevleri ve hatırlatmalar buna göre üretilir.'}
          </Text>
        </Pressable>

        {syncMsg ? <Text style={[styles.sync, { color: Colors.floTeal }]}>{syncMsg}</Text> : null}

        {!profile.birthDate && (
          <Text style={{ color: colors.textMuted, lineHeight: 20, marginBottom: 12 }}>
            Tarih olmadan örnek lohusa günü uydurulmaz. Bildirim de planlanmaz.
          </Text>
        )}

        {profile.birthDate && !inWindow && day != null && day > 42 && (
          <Text style={{ color: colors.textMuted, marginBottom: 12 }}>
            6 haftalık lohusa penceresi bitti. Şikâyet varsa kadın doğuma başvurun; bu ekran artık günlük görev üretmez.
          </Text>
        )}

        {inWindow && (
          <>
            <Text style={[styles.sec, { color: colors.text }]}>Bugün yapmanız gerekenler</Text>
            {todayTasks.length === 0 ? (
              <Text style={{ color: colors.textMuted, marginBottom: 12 }}>Bu güne özel madde yok; aşağıdaki yaklaşanlara bakın.</Text>
            ) : todayTasks.map((t) => {
              const done = doneIds.includes(t.id);
              return (
                <Pressable
                  key={t.id}
                  style={[styles.task, { backgroundColor: colors.card, borderColor: colors.border, opacity: done ? 0.6 : 1 }]}
                  onPress={() => setDoneIds((prev) => prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id])}
                >
                  <Ionicons name={done ? 'checkbox' : 'square-outline'} size={22} color={Colors.floPink} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{t.title}</Text>
                    <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>{t.body}</Text>
                    <Text style={{ color: Colors.floPink, fontSize: 11, marginTop: 4, fontWeight: '700' }}>
                      {t.dayFrom === t.dayTo ? `${t.dayFrom}. gün` : `${t.dayFrom}–${t.dayTo}. günler`}
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            {soon.length > 0 && (
              <>
                <Text style={[styles.sec, { color: colors.text }]}>Önümüzdeki 7 gün</Text>
                {soon.map((t) => (
                  <View key={t.id} style={[styles.task, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Ionicons name="notifications-outline" size={20} color={Colors.floTeal} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemTitle, { color: colors.text }]}>{t.title}</Text>
                      <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>{t.body}</Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}

        <View style={[styles.warn, { backgroundColor: Colors.danger + '12', borderColor: Colors.danger + '30' }]}>
          <Text style={{ color: Colors.danger, fontWeight: '800', marginBottom: 4 }}>Aynı gün hekim / 112</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12.5, lineHeight: 18 }}>
            1 saatte ped dolduran kanama, pıhtı, ateş, nefes darlığı, bacakta şiş-kızarıklık, göğüste kızarıklık+ateş, bebekte emmeme veya zor uyandırma. Bu liste tanı koymaz.
          </Text>
        </View>
      </ScrollView>

      <DatePickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={async (d) => {
          const next = { ...profile, birthDate: localDateKey(d) };
          setProfile(next);
          await saveBabyProfile(next);
          setShowPicker(false);
        }}
        selectedDate={profile.birthDate ? new Date(profile.birthDate + 'T00:00:00') : new Date()}
        maxDate={new Date()}
        accentColor={Colors.floPink}
      />
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
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800' },
  sync: { fontSize: 12, fontWeight: '700', marginBottom: 10 },
  sec: { fontSize: 16, fontWeight: '800', marginTop: 8, marginBottom: 10 },
  task: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 8, ...Platform.select({ ios: { shadowOpacity: 0 }, android: {} }) },
  itemTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  itemDesc: { fontSize: 12.5, lineHeight: 17 },
  warn: { padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 16 },
});
