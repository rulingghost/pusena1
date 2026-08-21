import { getApiBase } from '@/src/api/apiBase';

/** Turns `/api/media/...` into a device-reachable URL. Data URIs and http(s) pass through. */
export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('data:') || /^https?:\/\//i.test(url) || url.startsWith('file:')) return url;
  if (url.startsWith('/')) return `${getApiBase()}${url}`;
  return url;
}
