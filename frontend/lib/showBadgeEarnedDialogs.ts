import type { DialogConfig } from '@/types';

export interface EarnedBadgeAlert {
  id: string;
  name_en: string;
  name_am?: string;
  description_en?: string | null;
  icon_emoji?: string | null;
}

type ShowFn = (config: DialogConfig) => void;

/** Show celebration dialogs for badges returned by the API (queued). */
export function showBadgeEarnedDialogs(show: ShowFn, badges: EarnedBadgeAlert[], onDone?: () => void): void {
  if (badges.length === 0) {
    onDone?.();
    return;
  }

  let i = 0;
  const next = () => {
    const b = badges[i];
    if (!b) {
      onDone?.();
      return;
    }
    const emoji = b.icon_emoji?.trim() || '🏅';
    show({
      variant: 'success',
      title: 'Badge earned!',
      message: `${emoji} ${b.name_en}${b.description_en ? ` — ${b.description_en}` : ''}`,
      autoDismissMs: 5500,
      onDismiss: () => {
        i += 1;
        next();
      },
    });
  };
  next();
}
