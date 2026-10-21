import AsyncStorage from '@react-native-async-storage/async-storage';
import { cancelAllBloomScheduled } from '@/src/notifications/bloomAlerts';

/**
 * Cihaz üzerindeki wellness verilerini (ruh hali, ilaç, kilo, tekme, kasılma vb.)
 * kullanıcı ID'si bazında izole ederek saklar.
 */
export function getWellnessStorageKey(feature: string, userId?: string | null): string | null {
  if (!userId) return null;
  return `wellness_${userId}_${feature}`;
}

export async function getWellnessData<T>(feature: string, userId?: string | null, defaultValue: T = null as unknown as T): Promise<T> {
  const key = getWellnessStorageKey(feature, userId);
  if (!key) return defaultValue;

  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export async function setWellnessData<T>(feature: string, data: T, userId?: string | null): Promise<void> {
  const key = getWellnessStorageKey(feature, userId);
  if (!key) return;

  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* sessizce geç */
  }
}

export async function removeWellnessData(feature: string, userId?: string | null): Promise<void> {
  const key = getWellnessStorageKey(feature, userId);
  if (!key) return;

  try {
    await AsyncStorage.removeItem(key);
  } catch {
    /* sessizce geç */
  }
}

const KNOWN_WELLNESS_FEATURES = [
  'mood_journal',
  'medications',
  'weight_entries',
  'pre_pregnancy_weight',
  'kick_history',
  'contractions',
  'feeding_timer',
  'kegel_history',
  'bbt_records',
];

/**
 * Belirtilen kullanıcının cihaz üzerindeki tüm wellness kayıtlarını ve alarmlarını temizler.
 */
export async function clearAllUserWellnessData(userId: string): Promise<void> {
  if (!userId) return;

  const promises: Promise<unknown>[] = [];
  for (const feature of KNOWN_WELLNESS_FEATURES) {
    const key = getWellnessStorageKey(feature, userId);
    if (key) {
      promises.push(AsyncStorage.removeItem(key).catch(() => {}));
    }
  }

  // Planlanan bildirim/hatırlatıcı alarmlarını iptal et
  promises.push(cancelAllBloomScheduled().catch(() => {}));

  await Promise.all(promises);
}
