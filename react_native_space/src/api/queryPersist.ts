import AsyncStorage from '@react-native-async-storage/async-storage';
import type { QueryClient } from '@tanstack/react-query';

const STORAGE_KEY = 'pusena_query_cache_v1';
/** Açılışta parse edilecek JSON'u sınırlı tut; büyük cache ilk kareyi geciktiriyor. */
const MAX_CACHE_BYTES = 400 * 1024;

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

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastSerialized = '';

function scheduleSave(qc: QueryClient) {
  if (saveTimer) clearTimeout(saveTimer);
  // Her cache dokunuşunda tüm snapshot'ı stringify etmek pahalıydı; seyrek yaz.
  saveTimer = setTimeout(() => {
    try {
      const serialized = JSON.stringify(snapshot(qc));
      if (serialized === lastSerialized) return;
      if (serialized.length > MAX_CACHE_BYTES) return;
      lastSerialized = serialized;
      AsyncStorage.setItem(STORAGE_KEY, serialized).catch(() => {});
    } catch {
      /* serileştirilemeyen veri varsa atla */
    }
  }, 2500);
}

export async function hydrateQueryCache(qc: QueryClient): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    if (raw.length > MAX_CACHE_BYTES) {
      await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      return;
    }
    lastSerialized = raw;
    const data = JSON.parse(raw) as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      try {
        qc.setQueryData(JSON.parse(key), value);
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

export async function clearQueryCache() {
  lastSerialized = '';
  await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
}
