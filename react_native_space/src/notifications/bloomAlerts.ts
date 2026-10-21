import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notifications } from '@/src/notifications/expoLocal';

export const MEDS_KEY = 'medication_items';
export const ALARM_OFFSETS = [7, 3, 1] as const;
export type AlarmOffset = (typeof ALARM_OFFSETS)[number];

/** Regl uyarısı kullanıcı tercihinden bağımsız olarak hep 2 ve 1 gün önce çalar. */
const PERIOD_OFFSETS = [3, 2, 1, 0];

export interface MedItem {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  takenOn?: Record<string, string>;
}

export interface AlertTarget {
  id: string;
  title: string;
  date: Date;
}

export interface AlertPrefs {
  medicationReminder: boolean;
  countdownReminder: boolean;
  specialDateReminder: boolean;
  periodReminder: boolean;
  reminderOffsets: number[];
}

const CHANNEL = 'bloom-alarms';
const MESSAGE_CHANNEL = 'bloom-messages';

function parseTime(hhmm: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

export function formatTimeLabel(hhmm: string) {
  return hhmm;
}

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current?.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return !!asked?.granted;
  } catch {
    return false;
  }
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Pusena Alarmları',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    sound: 'default',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
  });
}

let messageChannelReady = false;

async function ensureMessageChannel() {
  if (Platform.OS !== 'android' || messageChannelReady) return;
  await Notifications.setNotificationChannelAsync(MESSAGE_CHANNEL, {
    name: 'Partner mesajları',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 200, 120, 200],
    sound: 'default',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
  });
  messageChannelReady = true;
}

/** Sunucudan yeni bir mesaj/istek görüldüğünde telefonda anında banner gösterir. */
export async function presentIncomingAlert(params: {
  id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}) {
  try {
    const granted = await ensureNotificationPermission();
    if (!granted) return false;
    await ensureMessageChannel();
    await Notifications.scheduleNotificationAsync({
      identifier: `bloom-live-${params.id}`,
      content: {
        title: params.title,
        body: params.body,
        sound: true,
        data: params.data ?? {},
      },
      // Android'de kanal belirtmek için trigger kullanılır; iOS'ta null = hemen göster.
      trigger: Platform.OS === 'android' ? { channelId: MESSAGE_CHANNEL } : null,
    });
    return true;
  } catch {
    return false;
  }
}

async function cancelBloomScheduled() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    all
      .filter((n) => String(n.identifier || '').startsWith('bloom-'))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

async function scheduleDaily(id: string, title: string, body: string, hour: number, minute: number) {
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL,
    },
  });
}

async function scheduleAt(id: string, title: string, body: string, when: Date) {
  if (when.getTime() <= Date.now() + 30_000) return;
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
      channelId: CHANNEL,
    },
  });
}

function atMidnightBefore(event: Date, daysBefore: number, hour = 9) {
  const d = new Date(event);
  d.setDate(d.getDate() - daysBefore);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function periodCopy(offset: number): { title: string; body: string } {
  if (offset === 0) {
    return {
      title: 'Reglin bugün başlayabilir',
      body: 'Tahmini başlangıç günü. Başladıysa uygulamadan işaretleyebilirsin.',
    };
  }
  if (offset === 1) {
    return {
      title: 'Yarın regl başlayabilir',
      body: 'Ped/tampon, ağrı kesici ve sıcak su torbanı hazırlamak için iyi bir zaman.',
    };
  }
  if (offset === 2) {
    return {
      title: 'Regl 2 gün sonra bekleniyor',
      body: 'Döngü kaydına göre yaklaşıyor. Hazırlığını şimdiden yapabilirsin.',
    };
  }
  return {
    title: `Regl tahmini: ${offset} gün kaldı`,
    body: 'Döngü kaydına göre yaklaşan regl hatırlatması.',
  };
}

export async function loadMedications(userId?: string | null): Promise<MedItem[]> {
  try {
    const key = userId ? `wellness_${userId}_medications` : MEDS_KEY;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return (parsed || []).map((m) => {
      const times: string[] = Array.isArray(m.times)
        ? m.times
        : m.time
          ? [String(m.time)]
          : ['09:00'];
      return {
        id: String(m.id),
        name: String(m.name || 'İlaç'),
        dosage: String(m.dosage || ''),
        times: times.filter(Boolean),
        takenOn: m.takenOn && typeof m.takenOn === 'object' ? m.takenOn : {},
      } as MedItem;
    });
  } catch {
    return [];
  }
}

export async function saveMedications(items: MedItem[], userId?: string | null) {
  const key = userId ? `wellness_${userId}_medications` : MEDS_KEY;
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export async function syncBloomAlerts(params: {
  prefs: AlertPrefs;
  specialDates?: AlertTarget[];
  dueDate?: Date | null;
  nextPeriod?: Date | null;
  userId?: string | null;
}) {
  const ok = await ensureNotificationPermission();
  if (!ok) return { scheduled: 0, permission: false };
  await ensureAndroidChannel();
  await cancelBloomScheduled();

  const offsets = (params.prefs.reminderOffsets || [30, 7, 3, 1]).filter((n) =>
    ALARM_OFFSETS.includes(n as AlarmOffset),
  );

  if (params.prefs.medicationReminder) {
    const meds = await loadMedications(params.userId);
    for (const med of meds) {
      for (const t of med.times) {
        const parsed = parseTime(t);
        if (!parsed) continue;
        await scheduleDaily(
          `bloom-med-${med.id}-${parsed.hour}-${parsed.minute}`,
          `${med.name} saati`,
          `${med.dosage || 'Doz'} — hatırlatma alarmı (${t})`,
          parsed.hour,
          parsed.minute,
        );
      }
    }
  }

  if (params.prefs.countdownReminder && params.dueDate) {
    for (const offset of offsets) {
      await scheduleAt(
        `bloom-due-${offset}`,
        `Tahmini doğuma ${offset} gün`,
        'Kalan gün hatırlatması. Bu bir tıbbi uyarı değildir.',
        atMidnightBefore(params.dueDate, offset),
      );
    }
  }

  // Regl uyarısı "geri sayım" tercihine bağlı değil; kendi anahtarı ile çalışır.
  if (params.prefs.periodReminder && params.nextPeriod) {
    for (const offset of PERIOD_OFFSETS) {
      const copy = periodCopy(offset);
      await scheduleAt(
        `bloom-period-${offset}`,
        copy.title,
        copy.body,
        atMidnightBefore(params.nextPeriod, offset, 10),
      );
    }
  }

  if (params.prefs.specialDateReminder && params.specialDates) {
    for (const ev of params.specialDates) {
      for (const offset of offsets) {
        await scheduleAt(
          `bloom-date-${ev.id}-${offset}`,
          `${ev.title} — ${offset} gün kaldı`,
          'Özel gün alarmı. Telefon saati uygulamasına yazılmaz; Pusena bildirimi olarak çalar.',
          atMidnightBefore(ev.date, offset),
        );
      }
    }
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return { scheduled: scheduled.filter((n) => String(n.identifier).startsWith('bloom-')).length, permission: true };
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Cevaplanmamışsa 20:00'de hatırlatır; gün değişince eski bildirim kalkar. */
export async function syncDailyQuestionAlert(answered: boolean) {
  const ok = await ensureNotificationPermission();
  if (!ok) return;
  await ensureAndroidChannel();
  const key = todayKey();
  const id = `bloom-dailyq-${key}`;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => String(n.identifier || '').startsWith('bloom-dailyq-'))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );

  try {
    const presented = await Notifications.getPresentedNotificationsAsync();
    await Promise.all(
      presented
        .filter((n) => {
          const nid = String(n.request.identifier || '');
          return nid.startsWith('bloom-dailyq-') && (answered || nid !== id);
        })
        .map((n) => Notifications.dismissNotificationAsync(n.request.identifier)),
    );
  } catch {
    /* Expo Go bazı sürümlerde yok */
  }

  if (answered) return;

  const when = new Date();
  when.setHours(20, 0, 0, 0);
  if (when.getTime() > Date.now() + 30_000) {
    await scheduleAt(id, 'Günün sorusunu cevaplamadınız', 'Bugünün çift sorusu sizi bekliyor.', when);
  }
}

/** Kullanıcı çıkış yaptığında veya veriler temizlendiğinde tüm Pusena yerel bildirimlerini iptal eder. */
export async function cancelAllBloomScheduled(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      scheduled
        .filter((n) => String(n.identifier || '').startsWith('bloom-'))
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
    );
  } catch {
    /* sessizce geç */
  }
}
