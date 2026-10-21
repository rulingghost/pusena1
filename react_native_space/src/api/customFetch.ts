/**
 * customFetch — single network layer for all generated API hooks. Edit
 * only to change auth scheme. Never edit anything under src/api/generated/
 * — orval overwrites it on every codegen run.
 */
import { getApiBase } from './apiBase';
import { getSecureItem, setSecureItem, removeSecureItem } from '../utils/secureStorage';

const TOKEN_KEY = process.env.EXPO_PUBLIC_AUTH_TOKEN_KEY ?? 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export type ErrorType<Error> = Error;
export type BodyType<BodyData> = BodyData;

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`İstek başarısız: ${status}`);
    this.status = status;
    this.body = body;
  }
}

/**
 * Use in catch blocks — under strict tsc, caught vars are `unknown`,
 * so direct `e.message`/`e.body` access fails TS18046.
 */
export function getErrorMessage(e: unknown, fallback = 'Bir hata oluştu'): string {
  if (e instanceof ApiError) {
    const body = e.body as { message?: unknown } | undefined;
    const msg = body?.message;
    if (typeof msg === 'string' && msg.trim()) return msg;
    if (Array.isArray(msg)) return msg.map(String).filter(Boolean).join('\n') || fallback;
    return e.message || fallback;
  }
  if (e instanceof Error) {
    const msg = e.message || '';
    if (/network request failed|failed to fetch|networkerror|aborted/i.test(msg)) {
      return 'Sunucuya ulaşılamadı. İnternetinizi kontrol edin; ilk açılış 30 sn sürebilir.';
    }
    return msg;
  }
  return fallback;
}

const AUTH_NO_REFRESH_PATHS = [
  '/api/auth/refresh',
  '/api/auth/login',
  '/api/signup',
  '/api/auth/forgot-password',
];

function shouldAttemptRefresh(url: string): boolean {
  const path = url.startsWith('http') ? new URL(url).pathname : url;
  return !AUTH_NO_REFRESH_PATHS.some((p) => path.includes(p));
}

let refreshInFlight: Promise<boolean> | null = null;

/** Refresh access token using stored refresh token. Returns true on success. */
export async function tryRefreshTokens(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await getSecureItem(REFRESH_TOKEN_KEY).catch(() => null);
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${getApiBase()}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) return false;

      const data = (await response.json()) as { token: string; refreshToken: string };
      await setSecureItem(TOKEN_KEY, data.token);
      await setSecureItem(REFRESH_TOKEN_KEY, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export async function clearAuthTokens(): Promise<void> {
  await removeSecureItem(TOKEN_KEY).catch(() => {});
  await removeSecureItem(REFRESH_TOKEN_KEY).catch(() => {});
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const raw = await response.text().catch(() => '');
    let body: unknown = raw;
    try {
      body = JSON.parse(raw);
    } catch {
      /* keep as text */
    }
    throw new ApiError(response.status, body);
  }
  if (response.status === 204 || response.status === 304) {
    return null as T;
  }
  return response.json() as Promise<T>;
}

async function executeFetch<T>(fullUrl: string, options: RequestInit, token: string | null): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((options.headers as Record<string, string> | undefined) ?? {}),
  };
  const method = (options.method ?? 'GET').toUpperCase();
  const hasBody = options.body != null && options.body !== '';
  if (hasBody && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(fullUrl, { ...options, headers, signal: controller.signal });
    return await parseResponse<T>(response);
  } finally {
    clearTimeout(timer);
  }
}

export async function customFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  // Ensure exactly one slash between the base URL and url.
  const fullUrl = url.startsWith('http')
    ? url
    : `${getApiBase()}${url.startsWith('/') ? url : '/' + url}`;

  let token = await getSecureItem(TOKEN_KEY).catch(() => null);

  try {
    return await executeFetch<T>(fullUrl, options, token);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 401 || !shouldAttemptRefresh(fullUrl)) {
      throw e;
    }

    const refreshed = await tryRefreshTokens();
    if (!refreshed) {
      await clearAuthTokens();
      throw e;
    }

    token = await getSecureItem(TOKEN_KEY).catch(() => null);
    return executeFetch<T>(fullUrl, options, token);
  }
}
