import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notifications } from '@/src/notifications/expoLocal';

export const MEDS_KEY = 'medication_items';
export const ALARM_OFFSETS = [30, 7, 3, 1] as const;
export type AlarmOffset = (typeof ALARM_OFFSETS)[number];

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
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
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
    content: { title, body, sound: true, channelId: CHANNEL },
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
    content: { title, body, sound: true, channelId: CHANNEL },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
      channelId: CHANNEL,
    },
  });
}

function atMidnightBefore(event: Date, daysBefore: number) {
  const d = new Date(event);
  d.setDate(d.getDate() - daysBefore);
  d.setHours(9, 0, 0, 0);
  return d;
}

export async function loadMedications(): Promise<MedItem[]> {
  try {
    const raw = await AsyncStorage.getItem(MEDS_KEY);
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

export async function saveMedications(items: MedItem[]) {
  await AsyncStorage.setItem(MEDS_KEY, JSON.stringify(items));
}

export async function syncBloomAlerts(params: {
  prefs: AlertPrefs;
  specialDates?: AlertTarget[];
  dueDate?: Date | null;
  nextPeriod?: Date | null;
}) {
  const ok = await ensureNotificationPermission();
  if (!ok) return { scheduled: 0, permission: false };
  await ensureAndroidChannel();
  await cancelBloomScheduled();

  const offsets = (params.prefs.reminderOffsets || [30, 7, 3, 1]).filter((n) =>
    ALARM_OFFSETS.includes(n as AlarmOffset),
  );

  if (params.prefs.medicationReminder) {
    const meds = await loadMedications();
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

  if (params.prefs.countdownReminder) {
    for (const offset of offsets) {
      if (params.dueDate) {
        await scheduleAt(
          `bloom-due-${offset}`,
          `Tahmini doğuma ${offset} gün`,
          'Kalan gün hatırlatması. Bu bir tıbbi uyarı değildir.',
          atMidnightBefore(params.dueDate, offset),
        );
      }
      if (params.prefs.periodReminder && params.nextPeriod) {
        await scheduleAt(
          `bloom-period-${offset}`,
          `Regl tahmini: ${offset} gün kaldı`,
          'Döngü kaydınıza göre yaklaşan regl hatırlatması.',
          atMidnightBefore(params.nextPeriod, offset),
        );
      }
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
