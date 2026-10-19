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
const PUBLIC_API = 'https://pusena-api.onrender.com';

function clean(value?: string | null): string {
  return (value ?? '').trim().replace(/\/+$/, '');
}

function isPrivateHost(url: string): boolean {
  try {
    const host = new URL(normalizeApiBase(url) || url).hostname;
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.local') ||
      /^192\.168\./.test(host) ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host)
    );
  } catch {
    return true;
  }
}

function pickPublicBase(...candidates: Array<string | undefined>): string {
  for (const raw of candidates) {
    const value = clean(raw);
    if (value && !isPrivateHost(value)) return value;
  }
  return PUBLIC_API;
}

const BUILT_IN_BASE = pickPublicBase(
  Constants.expoConfig?.extra?.productionApiUrl as string | undefined,
  Constants.expoConfig?.extra?.apiUrl as string | undefined,
  process.env.EXPO_PUBLIC_API_URL,
);

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
  const normalized = saved ? normalizeApiBase(saved) : '';
  // Ev ağı adresi başka şehirde çalışmaz; yok say.
  overrideBase = normalized && !isPrivateHost(normalized) ? normalized : '';
  const base = getApiBase();
  // Render'ın uykudaki örneğini erkenden uyandırır; açılışı bekletmemesi için
  // hem beklenmez hem de kısa timeout ile çalışır.
  pingApiBase(base, 6000).catch(() => {});
  return base;
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
