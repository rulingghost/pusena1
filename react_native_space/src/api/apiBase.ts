/**
 * Sunucu adresi kullanıcıya sorulmaz; derlemeye gömülür
 * (app.json > extra.productionApiUrl, app.config.js üzerinden).
 *
 * Kayıtlı bir değer yalnızca geliştirme/destek amacıyla, gizli "Sunucu adresi"
 * ekranından yazıldığında devreye girer.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const STORAGE_KEY = 'api_base_url';

function clean(value?: string | null): string {
  return (value ?? '').trim().replace(/\/+$/, '');
}

const BUILT_IN_BASE =
  clean(Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  clean(process.env.EXPO_PUBLIC_API_URL) ||
  'http://localhost:3000';

let overrideBase = '';

export function normalizeApiBase(raw: string): string {
  const trimmed = clean(raw).replace(/\s/g, '');
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getApiBase(): string {
  return overrideBase || BUILT_IN_BASE;
}

export function getDefaultApiBase(): string {
  return BUILT_IN_BASE;
}

/** Uygulama açılışında bir kez çağrılır. */
export async function loadApiBase(): Promise<string> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
  overrideBase = saved ? normalizeApiBase(saved) : '';
  return getApiBase();
}

export async function setApiBase(raw: string): Promise<string> {
  overrideBase = normalizeApiBase(raw);
  if (overrideBase) {
    await AsyncStorage.setItem(STORAGE_KEY, overrideBase).catch(() => {});
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }
  return getApiBase();
}

/** Adres gerçekten cevap veriyor mu? */
export async function pingApiBase(base: string, timeoutMs = 10000): Promise<boolean> {
  const target = normalizeApiBase(base);
  if (!target) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${target}/health`, { method: 'GET', signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
