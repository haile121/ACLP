import { requestGamificationRefresh } from '@/lib/gamificationRefresh';
import { showBadgeEarnedDialogs, type EarnedBadgeAlert } from '@/lib/showBadgeEarnedDialogs';
import type { DialogConfig } from '@/types';

type ShowFn = (config: DialogConfig) => void;

export function applyGamificationRewards(
  show: ShowFn,
  newBadges?: EarnedBadgeAlert[] | null
): void {
  const badges = newBadges ?? [];
  if (badges.length > 0) {
    showBadgeEarnedDialogs(show, badges, () => requestGamificationRefresh());
  } else {
    requestGamificationRefresh();
  }
}
