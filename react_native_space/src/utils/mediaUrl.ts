import { getApiBase } from '@/src/api/apiBase';
import { getSecureItem } from './secureStorage';

let cachedMediaToken: string | null = null;

// Initialize token from storage at startup
getSecureItem('auth_token')
  .then((token) => {
    if (token) cachedMediaToken = token;
  })
  .catch(() => {});

export function setMediaAuthToken(token: string | null) {
  cachedMediaToken = token;
}

/** Turns `/api/media/...` into a device-reachable URL. Data URIs and http(s) pass through. */
export function resolveMediaUrl(url?: string | null, explicitToken?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('data:') || url.startsWith('file:')) return url;
  const token = explicitToken ?? cachedMediaToken;
  const tokenQuery = token ? `token=${encodeURIComponent(token)}` : '';

  const mediaId = url.match(/\/api\/media\/([a-zA-Z0-9-]+)/)?.[1];
  if (mediaId) {
    const base = `${getApiBase()}/api/media/${mediaId}`;
    return tokenQuery ? `${base}?${tokenQuery}` : base;
  }
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) {
    const base = `${getApiBase()}${url}`;
    return tokenQuery ? `${base}${base.includes('?') ? '&' : '?'}${tokenQuery}` : base;
  }
  return url;
}
