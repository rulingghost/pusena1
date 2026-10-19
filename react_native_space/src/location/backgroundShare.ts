import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { getApiBase } from '@/src/api/apiBase';

export const PARTNER_LOCATION_TASK = 'pusena-partner-location';

export type ShareMode = 'background' | 'foreground' | 'denied';

async function postLocation(body: {
  sharingEnabled: boolean;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}) {
  const token = await AsyncStorage.getItem('auth_token').catch(() => null);
  if (!token) return;
  await fetch(`${getApiBase()}/api/relationship/live/location`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }).catch(() => {});
}

if (Platform.OS !== 'web') {
  TaskManager.defineTask(PARTNER_LOCATION_TASK, async ({ data, error }) => {
    if (error) return;
    const locations = (data as { locations?: Location.LocationObject[] } | undefined)?.locations;
    const last = locations?.[locations.length - 1];
    if (!last) return;
    await postLocation({
      sharingEnabled: true,
      latitude: last.coords.latitude,
      longitude: last.coords.longitude,
      accuracy: last.coords.accuracy ?? undefined,
    });
  });
}

/**
 * Arka plan güncellemesini başlatır.
 *
 * iOS'ta "Her zaman" izni yoksa `startLocationUpdatesAsync` hata fırlatır.
 * Eskiden bu hata tüm paylaşım akışını çökertiyordu; artık ön plan moduna
 * düşüyoruz, böylece uygulama açıkken konum yine gidiyor.
 */
export async function startPartnerLocationShare(): Promise<ShareMode> {
  if (Platform.OS === 'web') return 'denied';

  const fg = await Location.requestForegroundPermissionsAsync().catch(() => null);
  if (fg?.status !== 'granted') return 'denied';

  const started = await Location.hasStartedLocationUpdatesAsync(PARTNER_LOCATION_TASK).catch(() => false);
  if (started) return 'background';

  const bg = await Location.getBackgroundPermissionsAsync().catch(() => null);
  const bgGranted =
    bg?.status === 'granted' ||
    (await Location.requestBackgroundPermissionsAsync().catch(() => null))?.status === 'granted';

  // "Her zaman" izni yoksa arka plan servisini hiç denemiyoruz: iOS bunu hatayla reddediyor.
  if (!bgGranted) return 'foreground';

  try {
    await Location.startLocationUpdatesAsync(PARTNER_LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 3 * 60 * 1000,
      distanceInterval: 75,
      deferredUpdatesInterval: 3 * 60 * 1000,
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
      activityType: Location.ActivityType.Other,
      foregroundService: {
        notificationTitle: 'Pusena konum paylaşımı',
        notificationBody: 'Paylaşım açık. Partneriniz güncel konumunuzu görür. Ayarlardan kapatabilirsiniz.',
        notificationColor: '#C96BAE',
      },
    });
    return 'background';
  } catch {
    return 'foreground';
  }
}

export async function stopPartnerLocationShare() {
  if (Platform.OS === 'web') return;
  const started = await Location.hasStartedLocationUpdatesAsync(PARTNER_LOCATION_TASK).catch(() => false);
  if (started) {
    await Location.stopLocationUpdatesAsync(PARTNER_LOCATION_TASK).catch(() => {});
  }
}

/**
 * Tek seferlik konum yayınlar. Son bilinen konumu önce deneyip GPS kilidini
 * beklemeden yayın yapar; iOS'ta ilk açılışta 20+ sn takılmayı önler.
 */
export async function publishPartnerLocationOnce() {
  const cached = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60 * 1000 }).catch(() => null);
  if (cached) {
    void postLocation({
      sharingEnabled: true,
      latitude: cached.coords.latitude,
      longitude: cached.coords.longitude,
      accuracy: cached.coords.accuracy ?? undefined,
    });
  }

  const pos =
    (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null)) ?? cached;
  if (!pos) throw new Error('Konum alınamadı. Konum servisleri açık mı?');

  await postLocation({
    sharingEnabled: true,
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy ?? undefined,
  });
  return pos;
}
