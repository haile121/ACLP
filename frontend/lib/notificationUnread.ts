import type { NotificationItem } from '@/lib/api';

/** Fired when notification list / unread count should be re-fetched (e.g. mark all read). */
export const NOTIFICATIONS_REFRESH_EVENT = 'notifications:refresh';

export function requestNotificationRefresh(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_REFRESH_EVENT));
}

/** MySQL / JSON may return 0, 1, "0", "1", or booleans for is_read. */
export function isNotificationUnread(n: NotificationItem): boolean {
  const v = n.is_read as unknown;
  if (v === true || v === 1 || v === '1') return false;
  if (v === false || v === 0 || v === '0') return true;
  return !Boolean(v);
}

export function countUnreadNotifications(list: NotificationItem[]): number {
  return list.filter(isNotificationUnread).length;
}
