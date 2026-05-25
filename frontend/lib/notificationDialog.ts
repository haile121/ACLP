import type { NotificationItem } from '@/lib/api';
import type { DialogConfig, DialogVariant } from '@/types';
import { t } from '@/lib/i18n';

function variantForType(type: string): DialogVariant {
  switch (type) {
    case 'badge':
    case 'xp_milestone':
      return 'success';
    case 'streak_warning':
      return 'warning';
    case 'new_lesson':
      return 'info';
    default:
      return 'info';
  }
}

/** Map a server notification row to a dialog popup config. */
export function notificationToDialog(
  n: NotificationItem,
  opts?: { onViewBadges?: () => void }
): DialogConfig {
  const title = t(n.title_en, n.title_am);
  const message = t(n.body_en, n.body_am);
  const variant = variantForType(n.type);

  const base: DialogConfig = {
    variant,
    title,
    message,
    autoDismissMs: variant === 'success' ? (n.type === 'badge' ? 6000 : 4500) : undefined,
  };

  if (n.type === 'badge' && opts?.onViewBadges) {
    return {
      ...base,
      autoDismissMs: 0,
      primaryAction: { label: 'View badges', onClick: opts.onViewBadges },
      secondaryAction: { label: 'Dismiss', onClick: () => {} },
    };
  }

  if (n.type === 'streak_warning') {
    return {
      ...base,
      autoDismissMs: 0,
      primaryAction: { label: 'Got it', onClick: () => {} },
    };
  }

  return base;
}
