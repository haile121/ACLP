'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, Medal } from 'lucide-react';
import { gamificationApi } from '@/lib/api';
import { useGamificationRefresh } from '@/lib/gamificationRefresh';
import { applyGamificationRewards } from '@/lib/gamificationAlerts';
import { useDialog } from '@/components/ui/DialogProvider';
import { BadgeIcon } from '@/components/gamification/BadgeIcon';
import { Spinner } from '@/components/ui/Spinner';

type EarnedBadge = {
  id: string;
  name_en: string;
  name_am: string;
  description_en?: string | null;
  description_am?: string | null;
  icon_url: string;
  icon_emoji?: string | null;
  earned_at: string;
};

export default function BadgesPage() {
  const { show } = useDialog();
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBadges = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await gamificationApi.badges();
      setBadges(res.data.badges);
      if (res.data.new_badges?.length) {
        applyGamificationRewards(show, res.data.new_badges);
      }
    } catch {
      if (showSpinner) setBadges([]);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, [show]);

  useEffect(() => {
    void loadBadges(true);
  }, [loadBadges]);

  useGamificationRefresh(() => loadBadges(false));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft size={16} aria-hidden />
          Back to dashboard
        </Link>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Medal className="h-7 w-7" aria-hidden />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Your badges</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">
              Earned for streaks, quizzes, finals, XP, coins, and reading milestones — keep going.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="scroll-mt-24 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm"
      >
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                title={badge.description_en ?? undefined}
                className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 text-left"
              >
                <BadgeIcon emoji={badge.icon_emoji} iconUrl={badge.icon_url} label={badge.name_en} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{badge.name_en}</p>
                  {badge.name_am && badge.name_am !== badge.name_en ? (
                    <p className="text-xs text-blue-700/90 dark:text-blue-300/90 mt-0.5 leading-snug">{badge.name_am}</p>
                  ) : null}
                  {badge.description_en ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{badge.description_en}</p>
                  ) : null}
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                    Earned {new Date(badge.earned_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No badges yet.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm mx-auto px-2">
              Log in daily for streaks, pass quizzes and module finals, collect coins, and complete readings — badges unlock
              automatically.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
