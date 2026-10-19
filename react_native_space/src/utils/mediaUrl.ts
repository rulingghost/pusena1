import { getApiBase } from '@/src/api/apiBase';

/** Turns `/api/media/...` into a device-reachable URL. Data URIs and http(s) pass through. */
export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('data:') || url.startsWith('file:')) return url;
  const mediaId = url.match(/\/api\/media\/([a-zA-Z0-9-]+)/)?.[1];
  if (mediaId) return `${getApiBase()}/api/media/${mediaId}`;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${getApiBase()}${url}`;
  return url;
}
