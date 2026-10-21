import AsyncStorage from '@react-native-async-storage/async-storage';
import type { QueryClient } from '@tanstack/react-query';

const BASE_STORAGE_KEY = 'pusena_query_cache_v2';
const LEGACY_STORAGE_KEY = 'pusena_query_cache_v1';
/** Açılışta parse edilecek JSON'u sınırlı tut; büyük cache ilk kareyi geciktiriyor. */
const MAX_CACHE_BYTES = 400 * 1024;

let currentCacheUserId: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastSerialized = '';

export function setCurrentCacheUserId(userId: string | null) {
  currentCacheUserId = userId;
  lastSerialized = '';
}

export function getCurrentCacheUserId(): string | null {
  return currentCacheUserId;
}

export function clearPersistSaveTimer() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
}

function getStorageKey(userId?: string | null): string {
  const id = userId || currentCacheUserId;
  return id ? `${BASE_STORAGE_KEY}_${id}` : `${BASE_STORAGE_KEY}_anonymous`;
}

const PERSIST_MATCHERS = [
  '/api/dashboard',
  '/api/settings',
  '/api/auth/me',
  '/api/articles',
  '/api/symptoms/types',
  '/api/pregnancy/weeks',
  'dashboard',
  'partner-info',
  'coupleQuestions',
  'settings',
];

function shouldPersist(queryKey: unknown): boolean {
  const s = JSON.stringify(queryKey);
  if (s.includes('messages') || s.includes('nudges') || s.includes('live')) return false;
  return PERSIST_MATCHERS.some((m) => s.includes(m));
}

function snapshot(qc: QueryClient): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const q of qc.getQueryCache().getAll()) {
    if (q.state.status !== 'success' || q.state.data == null) continue;
    if (!shouldPersist(q.queryKey)) continue;
    out[JSON.stringify(q.queryKey)] = q.state.data;
  }
  return out;
}

function scheduleSave(qc: QueryClient) {
  clearPersistSaveTimer();
  // Kullanıcı oturumu kapalıysa veya çıkış yapılıyorsa diske yazma
  if (!currentCacheUserId) return;

  saveTimer = setTimeout(() => {
    try {
      if (!currentCacheUserId) return;
      const targetKey = getStorageKey(currentCacheUserId);
      const serialized = JSON.stringify(snapshot(qc));
      if (serialized === lastSerialized) return;
      if (serialized.length > MAX_CACHE_BYTES) return;
      lastSerialized = serialized;
      AsyncStorage.setItem(targetKey, serialized).catch(() => {});
    } catch {
      /* serileştirilemeyen veri varsa atla */
    }
  }, 2500);
}

export async function hydrateQueryCache(qc: QueryClient, userId?: string | null): Promise<void> {
  try {
    const targetUserId = userId !== undefined ? userId : currentCacheUserId;
    if (targetUserId) {
      setCurrentCacheUserId(targetUserId);
    }
    const key = getStorageKey(targetUserId);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return;
    if (raw.length > MAX_CACHE_BYTES) {
      await AsyncStorage.removeItem(key).catch(() => {});
      return;
    }
    lastSerialized = raw;
    const data = JSON.parse(raw) as Record<string, unknown>;
    for (const [k, value] of Object.entries(data)) {
      try {
        qc.setQueryData(JSON.parse(k), value);
      } catch {
        /* skip bad key */
      }
    }
  } catch {
    /* ignore corrupt cache */
  }
}

export function watchQueryCache(qc: QueryClient) {
  return qc.getQueryCache().subscribe((event) => {
    if (event?.type === 'updated' || event?.type === 'removed') scheduleSave(qc);
  });
}

export async function clearQueryCache(userId?: string | null) {
  clearPersistSaveTimer();
  lastSerialized = '';
  const targetKey = getStorageKey(userId);
  await Promise.all([
    AsyncStorage.removeItem(targetKey).catch(() => {}),
    AsyncStorage.removeItem(LEGACY_STORAGE_KEY).catch(() => {}),
    AsyncStorage.removeItem(`${BASE_STORAGE_KEY}_anonymous`).catch(() => {}),
  ]);
  currentCacheUserId = null;
}
