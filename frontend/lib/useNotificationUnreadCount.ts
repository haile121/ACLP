'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { progressApi } from '@/lib/api';
import { GAMIFICATION_UPDATED_EVENT } from '@/lib/gamificationRefresh';
import { NOTIFICATIONS_REFRESH_EVENT } from '@/lib/notificationUnread';

const POLL_MS = 10_000;

/**
 * Keeps navbar unread notification count in sync with the server.
 * Uses the lightweight unread-count endpoint (works once migrate:011 is applied).
 */
export function useNotificationUnreadCount(enabled: boolean): number {
  const [count, setCount] = useState(0);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const refresh = useCallback(async () => {
    if (!enabledRef.current) {
      setCount(0);
      return;
    }
    try {
      const res = await progressApi.unreadNotificationCount();
      const unread = Number(res.data?.unread ?? 0);
      setCount(Number.isFinite(unread) && unread > 0 ? unread : 0);
    } catch {
      /* session invalid or table missing — leave prior count or 0 */
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    void refresh();
    const interval = setInterval(() => void refresh(), POLL_MS);

    const onRefresh = () => void refresh();
    const onGamification = () => {
      void refresh();
      window.setTimeout(() => void refresh(), 1500);
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };

    window.addEventListener(NOTIFICATIONS_REFRESH_EVENT, onRefresh);
    window.addEventListener(GAMIFICATION_UPDATED_EVENT, onGamification);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener(NOTIFICATIONS_REFRESH_EVENT, onRefresh);
      window.removeEventListener(GAMIFICATION_UPDATED_EVENT, onGamification);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled, refresh]);

  return count;
}
