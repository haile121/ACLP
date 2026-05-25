"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  progressApi,
  type ProgressData,
  type NotificationItem,
} from "@/lib/api";
import { useGamificationRefresh } from "@/lib/gamificationRefresh";
import {
  countUnreadNotifications,
  isNotificationUnread,
  requestNotificationRefresh,
} from "@/lib/notificationUnread";
import { useDialog } from "@/components/ui/DialogProvider";
import { ClientFormattedDate } from "@/components/ui/ClientFormattedDate";
import { XPBar } from "@/components/shared/XPBar";
import { StreakIndicator } from "@/components/shared/StreakIndicator";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import {
  Zap,
  Coins,
  Medal,
  BarChart,
  BookOpen,
  FileQuestion,
  GraduationCap,
} from "lucide-react";

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { show } = useDialog();

  const refreshProgress = useCallback(async () => {
    try {
      const [progressRes, notifRes] = await Promise.all([
        progressApi.get(),
        progressApi.notifications(),
      ]);
      setData(progressRes.data);
      setNotifications(notifRes.data.notifications);
    } catch {
      /* keep existing data on background refresh */
    }
  }, []);

  const fetchInitial = useCallback(async () => {
    try {
      const [progressRes, notifRes] = await Promise.all([
        progressApi.get(),
        progressApi.notifications(),
      ]);
      setData(progressRes.data);
      setNotifications(notifRes.data.notifications);
    } catch {
      show({
        variant: "error",
        title: "Error",
        message: "Failed to load progress data.",
      });
    } finally {
      setLoading(false);
    }
  }, [show]);

  useEffect(() => {
    void fetchInitial();
    const interval = setInterval(() => {
      progressApi
        .notifications()
        .then((r) => setNotifications(r.data.notifications))
        .catch(() => {});
    }, 30_000);
    return () => clearInterval(interval);
  }, [fetchInitial]);

  useGamificationRefresh(refreshProgress);

  async function markAllRead() {
    await progressApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    requestNotificationRefresh();
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  if (!data) return null;

  const unreadCount = countUnreadNotifications(notifications);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Progress
      </h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "XP",
            value: data.xp.toLocaleString(),
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            href: null as string | null,
          },
          {
            label: "Coins",
            value: data.coins.toLocaleString(),
            icon: <Coins className="w-6 h-6 text-amber-500" />,
            href: null,
          },
          {
            label: "Badges",
            value: data.badge_count,
            icon: <Medal className="w-6 h-6 text-blue-500" />,
            href: "/badges",
          },
          {
            label: "Level",
            value: data.level ?? "—",
            icon: <BarChart className="w-6 h-6 text-emerald-500" />,
            href: null,
          },
        ].map((s) => {
          const inner = (
            <div className="flex flex-col items-center justify-center p-2">
              <div className="mb-2">{s.icon}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {s.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {s.label}
              </div>
            </div>
          );
          const cardClass =
            "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2 text-center";
          if (s.href) {
            return (
              <Link
                key={s.label}
                href={s.href}
                className={`${cardClass} block transition-shadow hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
              >
                {inner}
              </Link>
            );
          }
          return (
            <div key={s.label} className={cardClass}>
              {inner}
            </div>
          );
        })}
      </div>

      {/* Streak + XP bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-3">
        <StreakIndicator streak={data.streak} />
        <XPBar xp={data.xp} />
      </div>

      {/* Per-level progress */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Level Progress
        </h2>
        <div className="space-y-4">
          {data.levels.map((lvl) => (
            <div
              key={lvl.level_id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {lvl.label_en}
                </span>
                <Badge
                  variant={lvl.completion_pct === 100 ? "success" : "default"}
                >
                  {lvl.completion_pct}%
                </Badge>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${lvl.completion_pct}%` }}
                />
              </div>
              <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />{" "}
                  {lvl.lessons.completed}/{lvl.lessons.total} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <FileQuestion className="w-3.5 h-3.5 text-teal-500" />{" "}
                  {lvl.quizzes.passed}/{lvl.quizzes.total} quizzes
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-500" />{" "}
                  {lvl.exams.passed}/{lvl.exams.total} exams
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications{" "}
            {unreadCount > 0 && <Badge variant="default">{unreadCount}</Badge>}
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-accent hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No notifications yet.
          </p>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border text-sm ${
                  isNotificationUnread(n)
                    ? "border-accent/30 bg-accent/5 text-gray-900 dark:text-white"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <p className="font-medium">{n.title_en}</p>
                <p className="mt-0.5">{n.body_en}</p>
                <ClientFormattedDate
                  iso={n.created_at}
                  className="text-xs text-gray-400 mt-1 block"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
