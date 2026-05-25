'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { progressApi, type NotificationItem } from '@/lib/api';
import { GAMIFICATION_UPDATED_EVENT } from '@/lib/gamificationRefresh';
import { isNotificationUnread, NOTIFICATIONS_REFRESH_EVENT } from '@/lib/notificationUnread';
import { notificationToDialog } from '@/lib/notificationDialog';
import { useDialog } from '@/components/ui/DialogProvider';

const BASELINE_KEY = 'fyr_notif_popup_seen';
const POLL_MS = 15_000;

interface NotificationAlertsProps {
  enabled?: boolean;
}

/**
 * Shows Dialog popups for newly arrived notifications (does not mark them read —
 * unread count stays on the navbar until the user opens Progress or marks all read).
 */
export function NotificationAlerts({ enabled = true }: NotificationAlertsProps) {
  const { show, hide } = useDialog();
  const router = useRouter();
  const knownIdsRef = useRef<Set<string>>(new Set());
  const baselineReadyRef = useRef(false);
  const queueRef = useRef<NotificationItem[]>([]);
  const drainingRef = useRef(false);

  const saveBaseline = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(BASELINE_KEY, JSON.stringify([...knownIdsRef.current]));
    } catch {
      /* ignore */
    }
  }, []);

  const drainQueue = useCallback(() => {
    if (drainingRef.current) return;
    const next = queueRef.current.shift();
    if (!next) return;

    drainingRef.current = true;
    const cfg = notificationToDialog(next, {
      onViewBadges: () => router.push('/badges'),
    });

    const finish = () => {
      drainingRef.current = false;
      drainQueue();
    };

    show({
      ...cfg,
      onDismiss: finish,
      primaryAction: cfg.primaryAction
        ? {
            label: cfg.primaryAction.label,
            onClick: () => {
              cfg.primaryAction!.onClick();
              hide();
            },
          }
        : undefined,
      secondaryAction: cfg.secondaryAction
        ? { label: cfg.secondaryAction.label, onClick: () => hide() }
        : undefined,
    });
  }, [show, hide, router]);

  const enqueueNew = useCallback(
    (items: NotificationItem[]) => {
      for (const n of items) {
        if (knownIdsRef.current.has(n.id)) continue;
        knownIdsRef.current.add(n.id);
        if (!baselineReadyRef.current) continue;
        if (isNotificationUnread(n)) queueRef.current.push(n);
      }
      saveBaseline();
      if (baselineReadyRef.current && queueRef.current.length > 0) drainQueue();
    },
    [drainQueue, saveBaseline]
  );

  const syncForPopups = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await progressApi.notifications();
      const list = res.data.notifications ?? [];

      if (!baselineReadyRef.current) {
        for (const n of list) knownIdsRef.current.add(n.id);
        baselineReadyRef.current = true;
        saveBaseline();
        return;
      }

      enqueueNew(list);
    } catch {
      /* table missing or auth — popups are best-effort */
    }
  }, [enabled, enqueueNew, saveBaseline]);

  useEffect(() => {
    if (!enabled) return;

    try {
      const raw = sessionStorage.getItem(BASELINE_KEY);
      if (raw) {
        knownIdsRef.current = new Set(JSON.parse(raw) as string[]);
        baselineReadyRef.current = true;
      }
    } catch {
      /* ignore */
    }

    void syncForPopups();
    const interval = setInterval(() => void syncForPopups(), POLL_MS);

    const onRefresh = () => void syncForPopups();
    const onGamification = () => {
      void syncForPopups();
      window.setTimeout(() => void syncForPopups(), 1500);
    };

    window.addEventListener(NOTIFICATIONS_REFRESH_EVENT, onRefresh);
    window.addEventListener(GAMIFICATION_UPDATED_EVENT, onGamification);

    return () => {
      clearInterval(interval);
      window.removeEventListener(NOTIFICATIONS_REFRESH_EVENT, onRefresh);
      window.removeEventListener(GAMIFICATION_UPDATED_EVENT, onGamification);
    };
  }, [enabled, syncForPopups]);

  return null;
}
