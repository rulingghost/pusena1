import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/src/api/customFetch';
import { presentIncomingAlert } from '@/src/notifications/bloomAlerts';

const SEEN_KEY = 'live_alert_seen_ids';
const ACTIVE_INTERVAL = 15_000;
const BACKGROUND_INTERVAL = 60_000;
const MAX_SEEN = 120;

interface RemoteNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  module?: string;
  referenceId?: string | null;
  isRead: boolean;
  createdAt: string;
}

/** Bu tipler telefonda banner olarak da gösterilir. */
const PUSH_TYPES = new Set([
  'couple_message',
  'partner_nudge',
  'couple_question',
  'partner_request',
  'period_reminder',
  'special_date',
]);

async function loadSeen(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(SEEN_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set<string>();
  }
}

async function saveSeen(seen: Set<string>) {
  const trimmed = Array.from(seen).slice(-MAX_SEEN);
  await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(trimmed)).catch(() => {});
}

/**
 * Sunucu tarafı push altyapısı olmadığı için bildirim tablosunu kısa aralıklarla
 * yoklar; yeni satırları hem cache'e yansıtır hem de yerel banner olarak gösterir.
 */
export function useLiveAlerts(enabled: boolean) {
  const qc = useQueryClient();
  const seenRef = useRef<Set<string> | null>(null);
  const bootstrappedRef = useRef(false);
  const busyRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      bootstrappedRef.current = false;
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let appState: AppStateStatus = AppState.currentState;

    const tick = async () => {
      if (cancelled || busyRef.current) return;
      busyRef.current = true;
      try {
        if (!seenRef.current) seenRef.current = await loadSeen();
        const res = await customFetch<{ items: RemoteNotification[]; unreadCount: number }>(
          '/api/notifications?page=1&limit=15',
        );
        if (cancelled) return;

        const items = res?.items ?? [];
        const seen = seenRef.current;
        const fresh = items.filter((n) => !n.isRead && !seen.has(n.id));

        for (const n of items) seen.add(n.id);
        await saveSeen(seen);

        // İlk turda geçmiş bildirimler için banner yağmuru olmasın.
        if (!bootstrappedRef.current) {
          bootstrappedRef.current = true;
          return;
        }

        if (fresh.length) {
          qc.invalidateQueries({ queryKey: ['/api/notifications'] });
          qc.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
          if (fresh.some((n) => n.type === 'couple_message' || n.type === 'partner_nudge')) {
            qc.invalidateQueries({ queryKey: ['relationship', 'messages'] });
            qc.invalidateQueries({ queryKey: ['relationship', 'nudges'] });
          }
        }

        for (const n of fresh.slice(0, 3)) {
          if (!PUSH_TYPES.has(n.type)) continue;
          await presentIncomingAlert({
            id: n.id,
            title: n.title,
            body: n.body,
            data: { type: n.type, referenceId: n.referenceId },
          });
        }
      } catch {
        /* çevrimdışı olabiliriz, sessizce geç */
      } finally {
        busyRef.current = false;
        if (!cancelled) {
          const delay = appState === 'active' ? ACTIVE_INTERVAL : BACKGROUND_INTERVAL;
          timer = setTimeout(tick, delay);
        }
      }
    };

    const sub = AppState.addEventListener('change', (next) => {
      const wasBackground = appState !== 'active';
      appState = next;
      if (next === 'active' && wasBackground) {
        if (timer) clearTimeout(timer);
        tick();
      }
    });

    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      sub.remove();
    };
  }, [enabled, qc]);
}
