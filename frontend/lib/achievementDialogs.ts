import type { DialogConfig } from '@/types';
import type { SubmitResult } from '@/lib/api';
import { t } from '@/lib/i18n';

type ShowFn = (config: DialogConfig) => void;

function rewardLine(xp: number, coins: number): string {
  const parts: string[] = [];
  if (xp > 0) parts.push(`+${xp} XP`);
  if (coins > 0) parts.push(`+${coins} coins`);
  return parts.join(' · ');
}

/** Quiz or exam passed — celebratory popup. */
export function showQuizPassedDialog(show: ShowFn, result: SubmitResult, label = 'Quiz'): void {
  if (!result.passed) return;
  const rewards = rewardLine(result.xpAwarded, result.coinsAwarded);
  show({
    variant: 'success',
    title: `${label} passed!`,
    message: rewards
      ? `Score ${result.score}%. ${rewards} added to your profile.`
      : `Score ${result.score}%. Great work — keep going!`,
    autoDismissMs: 4500,
  });
}

/** Placement / track assessment completed. */
export function showAssessmentCompleteDialog(
  show: ShowFn,
  levelLabel: string,
  trackLabel: string
): void {
  show({
    variant: 'success',
    title: 'Assessment complete',
    message: `You were placed at ${levelLabel} for ${trackLabel}. Your lessons are now unlocked at that level.`,
    autoDismissMs: 5000,
  });
}

/** Track certificate generated successfully. */
export function showCertificateReadyDialog(show: ShowFn, trackLabel: string): void {
  show({
    variant: 'success',
    title: 'Certificate ready',
    message: `Your ${trackLabel} track certificate opened in a new tab. You can download it anytime from Certificates.`,
    autoDismissMs: 5000,
  });
}
