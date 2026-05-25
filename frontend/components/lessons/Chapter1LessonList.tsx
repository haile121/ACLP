"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock,
  Lock,
  TrendingUp,
} from "lucide-react";
import {
  ALL_LESSONS,
  CHAPTERS,
  CPP_CHAPTERS,
  STORAGE_KEY_PROGRESS,
  COURSE_CHAPTER_QUIZ_IDS,
  COURSE_TRACK_FINAL_QUIZ_IDS,
  type ChapterInfo,
} from "@/lib/chapter1Curriculum";

import { readCompletedLessonIds } from "@/lib/lessonProgressClient";
import {
  useAuthSyncHint,
  syncCourseReadingProgressWithServer,
} from "@/lib/courseReadingProgress";
import { getProgressionData } from "@/lib/courseLevelProgress";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  authApi,
  backendPublicUrl,
  certificatesApi,
  courseTrackQuizzesApi,
  progressApi,
  trackCompletionVideosApi,
  type TrackCertificateSummary,
  type TrackCompletionVideo,
  type LevelProgress,
} from "@/lib/api";
import { TrackAdditionalResource } from "@/components/lessons/TrackAdditionalResource";
import { useDialog } from "@/components/ui/DialogProvider";
import { showCertificateReadyDialog } from "@/lib/achievementDialogs";
import { canAccessLessonTrack } from "@/lib/trackAccess";
import { useGamificationRefresh } from "@/lib/gamificationRefresh";
import type { User } from "@/types";

const CPP_LESSON_IDS = CPP_CHAPTERS.flatMap((c) => c.lessons.map((l) => l.id));

const TRACK_RING_SIZE = 100;
const TRACK_RING_STROKE = 8;

function TrackLockedCard({ track, title }: { track: "cpp"; title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/15 bg-gradient-to-br from-gray-50/95 to-white/60 dark:from-white/[0.03] dark:to-transparent px-6 py-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 mb-4 ring-1 ring-black/5 dark:ring-white/10">
        <Lock className="h-6 w-6" aria-hidden />
      </div>
      <p className="text-base font-bold text-gray-900 dark:text-white">
        {title}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
        Complete a short placement quiz to unlock this track and open all
        reading sessions.
      </p>
      <Link
        href={`/assessment?track=${track}`}
        className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-md shadow-blue-600/15 transition-colors"
      >
        Start placement test
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

function ProgressChip({
  done,
  total,
  label,
  variant = "blue",
}: {
  done: number;
  total: number;
  label?: string;
  variant?: "blue" | "teal";
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const barClass =
    variant === "teal"
      ? "from-teal-600 to-cyan-500"
      : "from-blue-600 to-sky-500";
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/80 pl-2 pr-2.5 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 tabular-nums shadow-sm ring-1 ring-black/5 dark:ring-white/10">
      {label ? (
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 shrink-0">
          {label}
        </span>
      ) : null}
      <span className="relative h-2 w-12 sm:w-14 overflow-hidden rounded-full bg-gray-200/90 dark:bg-gray-700">
        <span
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out",
            barClass,
          )}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span>
        {done}/{total}
      </span>
    </span>
  );
}

function TrackProgressRing({
  pct,
  mounted,
  gradientId,
  strokeGradientFrom,
  strokeGradientMid,
  strokeGradientTo,
}: {
  pct: number;
  mounted: boolean;
  gradientId: string;
  strokeGradientFrom: string;
  strokeGradientMid: string;
  strokeGradientTo: string;
}) {
  const radius = (TRACK_RING_SIZE - TRACK_RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = mounted
    ? circumference - (pct / 100) * circumference
    : circumference;
  return (
    <div
      className="relative shrink-0"
      style={{ width: TRACK_RING_SIZE, height: TRACK_RING_SIZE }}
    >
      <svg
        width={TRACK_RING_SIZE}
        height={TRACK_RING_SIZE}
        viewBox={`0 0 ${TRACK_RING_SIZE} ${TRACK_RING_SIZE}`}
        className="-rotate-90"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokeGradientFrom} />
            <stop offset="55%" stopColor={strokeGradientMid} />
            <stop offset="100%" stopColor={strokeGradientTo} />
          </linearGradient>
        </defs>
        <circle
          cx={TRACK_RING_SIZE / 2}
          cy={TRACK_RING_SIZE / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={TRACK_RING_STROKE}
          className="text-gray-200/95 dark:text-gray-700/90"
        />
        <circle
          cx={TRACK_RING_SIZE / 2}
          cy={TRACK_RING_SIZE / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={TRACK_RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">
          {mounted ? `${pct}` : "—"}
          {mounted ? (
            <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
              %
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

function OverallProgressPanel({
  cpp,
  mounted,
  done,
  authHint,
  activeChapters,
  activeLevelName,
}: {
  cpp: { done: number; total: number; pct: number };
  mounted: boolean;
  done: string[];
  authHint: { ready: boolean; signedIn: boolean };
  activeChapters: ChapterInfo[];
  activeLevelName: string;
}) {
  const gradCpp = useId();

  return (
    <div className="relative isolate rounded-2xl border border-gray-200/90 dark:border-gray-700/90 bg-gradient-to-br from-slate-50/95 via-white to-blue-50/40 dark:from-gray-900 dark:via-gray-900/95 dark:to-blue-950/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/10"
        aria-hidden
      />
      <div className="relative z-[1] min-w-0 p-4 sm:p-6 lg:p-7">
        <div className="flex min-w-0 flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8 lg:[&>*]:min-w-0">
          <div className="min-w-0 space-y-6">
            <div className="flex w-full min-w-0 flex-col items-center justify-center gap-10 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-8 md:gap-x-14">
              <div className="flex w-full min-w-0 max-w-[12rem] flex-col items-center text-center sm:w-auto">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  C++ ({activeLevelName}) progress
                </div>
                <TrackProgressRing
                  pct={cpp.pct}
                  mounted={mounted}
                  gradientId={gradCpp}
                  strokeGradientFrom="#2563eb"
                  strokeGradientMid="#0ea5e9"
                  strokeGradientTo="#38bdf8"
                />
                <p className="mt-2 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
                  {mounted ? (
                    <>
                      {cpp.done}/{cpp.total}{" "}
                      <span className="font-normal text-gray-500 dark:text-gray-400">
                        sessions
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-2xl text-center sm:mx-0 sm:text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Reading
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {!authHint.ready
                  ? "Reading progress syncs to your account when you’re signed in; it’s also cached in this browser."
                  : authHint.signedIn
                    ? "Signed in: reading progress is saved to your account and cached here for speed. Open any session below to continue."
                    : "Sign in to sync reading progress across devices. Until then, completions stay on this browser only."}
              </p>
            </div>
          </div>

          <div className="min-w-0 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="min-w-0 truncate capitalize">
                  C++ curriculum ({activeLevelName})
                </span>
                <span className="shrink-0 tabular-nums text-gray-700 dark:text-gray-300">
                  {mounted ? `${cpp.pct}%` : "—"}
                </span>
              </div>
              <div className="h-3.5 overflow-hidden rounded-full bg-gray-200/90 ring-1 ring-inset ring-black/[0.06] dark:bg-gray-800 dark:ring-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-[0_0_20px_rgba(14,165,233,0.25)] transition-[width] duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: `${mounted ? cpp.pct : 0}%` }}
                />
              </div>
            </div>

            <div className="min-w-0">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                By chapter
              </p>
              <ul className="space-y-2.5" aria-label="C++ chapters progress">
                {activeChapters.map((chapter) => {
                  const chDone = chapter.lessons.filter((l) =>
                    done.includes(l.id),
                  ).length;
                  const chTotal = chapter.lessons.length;
                  const chPct = chTotal
                    ? Math.round((chDone / chTotal) * 100)
                    : 0;
                  const complete = chDone === chTotal && chTotal > 0;
                  return (
                    <li key={chapter.slug} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums",
                          complete
                            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                        )}
                      >
                        {chapter.chapterNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">
                            {chapter.titleEn.replace(/^Chapter \d+:\s*/i, "")}
                          </span>
                          <span className="shrink-0 text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
                            {mounted ? `${chDone}/${chTotal}` : "—"}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/90">
                          <div
                            className={cn(
                              "h-full rounded-full transition-[width] duration-500 ease-out",
                              complete
                                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                : "bg-gradient-to-r from-blue-600 to-sky-400",
                            )}
                            style={{ width: `${mounted ? chPct : 0}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChapterQuizFooter({
  chapterSlug,
  done,
}: {
  chapterSlug: string;
  done: string[];
}) {
  const quizId = COURSE_CHAPTER_QUIZ_IDS[chapterSlug];
  if (!quizId) return null;
  const chapterMeta = CPP_CHAPTERS.find((c) => c.slug === chapterSlug);
  if (!chapterMeta) return null;
  const complete = chapterMeta.lessons.every((l) => done.includes(l.id));
  return (
    <div className="mt-4 pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Chapter quiz
      </h4>
      {complete ? (
        <Link
          href={`/course-quiz/${quizId}`}
          className={cn(
            "inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors",
            "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/15",
          )}
        >
          Take quiz (XP)
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete all sessions in this chapter to unlock the quiz.
        </p>
      )}
    </div>
  );
}

function trackReadingsUnlocked(
  track: "cpp",
  done: string[],
  accessibleLessonIds: Set<string>,
): boolean {
  const ids = CPP_LESSON_IDS;
  const acc = ids.filter((id) => accessibleLessonIds.has(id));
  return acc.length > 0 && acc.every((id) => done.includes(id));
}

function ModuleFinalCard({
  track,
  done,
  accessibleLessonIds,
}: {
  track: "cpp";
  done: string[];
  accessibleLessonIds: Set<string>;
}) {
  const unlocked = trackReadingsUnlocked(track, done, accessibleLessonIds);
  const quizId = COURSE_TRACK_FINAL_QUIZ_IDS[track];
  const title = "C++ final exam — all chapters";
  const desc =
    "20 questions from Chapters 1–5 (foundations, basics, control flow, functions, arrays). Unlocks after every reading session. Pass: 70%. Certificate needs 90%+ here and 85% reading progress.";
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 mt-2",
        "border-blue-200/90 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20",
      )}
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <ClipboardList className="h-4 w-4 shrink-0" aria-hidden />
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
        {desc}
      </p>
      <div className="mt-4">
        {unlocked ? (
          <Link
            href={`/course-quiz/${quizId}`}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors",
              "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/15",
            )}
          >
            Take final exam
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete every reading session in this track to unlock the final
            exam.
          </p>
        )}
      </div>
    </div>
  );
}

export function Chapter1LessonList() {
  const authHint = useAuthSyncHint();
  const { show } = useDialog();
  const [done, setDone] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [summaryCpp, setSummaryCpp] = useState<TrackCertificateSummary | null>(
    null,
  );
  const [levelsProgress, setLevelsProgress] = useState<LevelProgress[]>([]);
  const [generatedCerts, setGeneratedCerts] = useState<Record<string, string>>(
    {},
  );
  const [genLevelCertLoading, setGenLevelCertLoading] = useState<string | null>(
    null,
  );

  const [genCertLoading, setGenCertLoading] = useState<"cpp" | null>(null);
  const [completionVideos, setCompletionVideos] = useState<
    TrackCompletionVideo[]
  >([]);

  const refresh = useCallback(async () => {
    const ids = await syncCourseReadingProgressWithServer();
    setDone(ids);
  }, []);

  const refetchTrackSummaries = useCallback(() => {
    if (!authHint.ready || !authHint.signedIn) return;
    void courseTrackQuizzesApi
      .trackSummary("cpp")
      .then((r) => setSummaryCpp(r.data));
    void progressApi.get().then((r) => setLevelsProgress(r.data.levels));
    void certificatesApi.list().then((r) => {
      const map: Record<string, string> = {};
      r.data.certificates.forEach((c) => {
        map[c.level_id] = c.pdf_url;
      });
      setGeneratedCerts(map);
    });
  }, [authHint.ready, authHint.signedIn]);

  const refetchTrackSummariesRef = useRef(refetchTrackSummaries);
  refetchTrackSummariesRef.current = refetchTrackSummaries;

  const handleGenerateLevelCert = async (levelId: string) => {
    try {
      setGenLevelCertLoading(levelId);
      const res = await certificatesApi.generate(levelId);
      setGeneratedCerts((prev) => ({
        ...prev,
        [levelId]: res.data.certificate.pdf_url,
      }));
      showCertificateReadyDialog(show, `${levelId} level`);
    } catch (e: any) {
      show({
        variant: "error",
        title: "Requirement not met",
        message: e.response?.data?.error || "Failed to generate certificate.",
      });
    } finally {
      setGenLevelCertLoading(null);
    }
  };

  useGamificationRefresh(() => {
    refetchTrackSummariesRef.current();
  });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await refresh();
      if (!cancelled) setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (!authHint.ready || !authHint.signedIn) {
      setUser(null);
      return;
    }
    let cancelled = false;
    void authApi
      .me()
      .then((r) => {
        if (!cancelled) setUser(r.data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [authHint.ready, authHint.signedIn]);

  useEffect(() => {
    let cancelled = false;
    void trackCompletionVideosApi
      .list()
      .then((r) => {
        if (cancelled) return;
        const cpp = r.data.videos.filter((v) => v.track === "cpp");
        cpp.sort((a, b) =>
          a.sort_order !== b.sort_order
            ? a.sort_order - b.sort_order
            : a.id.localeCompare(b.id),
        );
        setCompletionVideos(cpp);
      })
      .catch(() => {
        if (!cancelled) setCompletionVideos([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authHint.ready || !authHint.signedIn) {
      setSummaryCpp(null);

      return;
    }
    let cancelled = false;
    void courseTrackQuizzesApi.trackSummary("cpp").then((r) => {
      if (!cancelled) setSummaryCpp(r.data);
    });
    return () => {
      cancelled = true;
    };
  }, [authHint.ready, authHint.signedIn, done]);

  async function handleGenerateTrackCert(track: "cpp") {
    setGenCertLoading(track);
    try {
      const r = await certificatesApi.generateTrack(track);
      window.open(backendPublicUrl(r.data.certificate.pdf_url), "_blank");
      showCertificateReadyDialog(show, track === "cpp" ? "C++" : "Web");
      const next = await courseTrackQuizzesApi.trackSummary(track);
      setSummaryCpp(next.data);
    } catch {
      show({
        variant: "error",
        title: "Could not generate certificate",
        message:
          "Make sure you meet reading progress (85%+) and final exam (90%+) requirements for this track.",
      });
    } finally {
      setGenCertLoading(null);
    }
  }

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") {
        void refresh();
        refetchTrackSummariesRef.current();
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_PROGRESS) setDone(readCompletedLessonIds());
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("storage", onStorage);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const accessibleLessons = useMemo(() => {
    if (!user) return ALL_LESSONS;
    return ALL_LESSONS.filter((l) => canAccessLessonTrack(user, l.id));
  }, [user]);

  const accessibleLessonIds = useMemo(
    () => new Set(accessibleLessons.map((l) => l.id)),
    [accessibleLessons],
  );

  const progData = useMemo(() => {
    return getProgressionData(done, user?.cpp_level);
  }, [done, user?.cpp_level]);

  const trackProgress = useMemo(() => {
    const active = progData.activeStats;
    return {
      cppDone: active.doneLessons,
      cppTotal: active.totalLessons,
      cppPct: active.pct,
    };
  }, [progData]);

  const cppLocked = useMemo(() => {
    if (!user) return false;
    return !canAccessLessonTrack(user, "ch1-p1");
  }, [user]);

  const completedCount = useMemo(
    () => accessibleLessons.filter((l) => done.includes(l.id)).length,
    [done, accessibleLessons],
  );
  const totalLessons = accessibleLessons.length;

  const firstIncomplete = accessibleLessons.find((l) => !done.includes(l.id));

  const expandedChapterSlug = useMemo(() => {
    if (!firstIncomplete) return CHAPTERS[0]?.slug;
    const ch = CHAPTERS.find((c) =>
      c.lessons.some((l) => l.id === firstIncomplete.id),
    );
    return ch?.slug ?? CHAPTERS[0]?.slug;
  }, [firstIncomplete]);

  return (
    <div className="space-y-5">
      {firstIncomplete && mounted && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-blue-200/90 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-950/35 dark:to-gray-900/80 px-5 py-4 sm:px-6 shadow-sm ring-1 ring-blue-100/60 dark:ring-blue-900/30">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Continue learning
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1 font-semibold line-clamp-2">
              {firstIncomplete.titleEn}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {!authHint.ready
                ? "Pick up where you left off — progress is saved here; sign in to sync across devices."
                : authHint.signedIn
                  ? "Pick up where you left off — progress is tied to your account."
                  : "Pick up where you left off — sign in to sync across devices."}
            </p>
          </div>
          <Link
            href={`/lessons/${firstIncomplete.id}`}
            className={cn(
              "inline-flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto",
              "px-5 py-3 text-sm font-semibold rounded-xl transition-colors duration-150",
              "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-gray-950",
            )}
          >
            Resume
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}

      {completedCount === totalLessons && totalLessons > 0 && mounted && (
        <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-900/45 bg-emerald-50/80 dark:bg-emerald-950/30 px-5 py-4 text-center ring-1 ring-emerald-100/80 dark:ring-emerald-900/30">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            You&apos;ve completed every published lesson.
          </p>
          <p className="text-xs text-emerald-700/90 dark:text-emerald-500/85 mt-1">
            Expand a chapter below to revisit any session.
          </p>
        </div>
      )}

      <CollapsibleSection
        title="Course overview"
        description="Reading progress and chapter quizzes for the C++ curriculum."
        defaultOpen
        trailing={
          mounted ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <ProgressChip
                label="C++"
                done={trackProgress.cppDone}
                total={trackProgress.cppTotal}
                variant="blue"
              />
            </div>
          ) : undefined
        }
      >
        <div className="pt-1">
          <OverallProgressPanel
            cpp={{
              done: trackProgress.cppDone,
              total: trackProgress.cppTotal,
              pct: trackProgress.cppPct,
            }}
            mounted={mounted}
            done={done}
            authHint={authHint}
            activeChapters={progData.activeStats.chapters}
            activeLevelName={progData.activeLevel}
          />
          {authHint.signedIn && mounted && (
            <div className="mt-6 rounded-xl border border-gray-200/90 dark:border-gray-700/80 bg-white/60 dark:bg-gray-900/35 p-4 sm:p-5 space-y-4">
              <div className="flex items-start gap-2">
                <Award
                  className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Track certificates (PDF)
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    When you reach 85% reading progress and score 90% or higher
                    on the <strong>module final exam</strong> (the &quot;Take
                    final exam&quot; button at the bottom of the curriculum—not
                    the smaller chapter quizzes), you can generate a verified
                    PDF certificate.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-1 max-w-lg">
                {(["beginner", "intermediate", "advanced"] as const).map(
                  (level) => {
                    if (!progData.tiers[level].unlocked) return null;

                    const lp = levelsProgress.find(
                      (l) => l.level_name === level,
                    );
                    if (!lp) {
                      return (
                        <p
                          key={level}
                          className="text-xs text-gray-500 dark:text-gray-400 mt-2"
                        >
                          Loading {level}…
                        </p>
                      );
                    }

                    const pdfUrl = generatedCerts[lp.level_id];
                    const isEligible = lp.completion_pct === 100;

                    return (
                      <div
                        key={level}
                        className={cn(
                          "rounded-lg border p-3 text-sm",
                          "border-blue-200/80 dark:border-blue-900/45 bg-blue-50/40 dark:bg-blue-950/15",
                        )}
                      >
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                          {level} level certificate
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 tabular-nums">
                          Overall {level} progress: {lp.completion_pct}%
                        </p>
                        {!isEligible && !pdfUrl ? (
                          <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1 list-disc pl-4 leading-relaxed">
                            <li>
                              Complete all parts for this level (
                              {lp.lessons.completed}/{lp.lessons.total} lessons,{" "}
                              {lp.quizzes.passed}/{lp.quizzes.total} quizzes,{" "}
                              {lp.exams.passed}/{lp.exams.total} exams).
                            </li>
                          </ul>
                        ) : null}
                        {pdfUrl ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() =>
                              window.open(backendPublicUrl(pdfUrl), "_blank")
                            }
                          >
                            Download PDF
                          </Button>
                        ) : isEligible ? (
                          <Button
                            type="button"
                            size="sm"
                            className={cn(
                              "mt-3",
                              "bg-blue-600 hover:bg-blue-500 text-white",
                            )}
                            disabled={genLevelCertLoading === lp.level_id}
                            onClick={() =>
                              void handleGenerateLevelCert(lp.level_id)
                            }
                          >
                            {genLevelCertLoading === lp.level_id
                              ? "Generating…"
                              : "Generate certificate"}
                          </Button>
                        ) : null}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-0.5 flex flex-wrap items-center gap-2">
            <span>C++ sessions</span>
            {user?.primary_track === "cpp" && (
              <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Your focus
              </span>
            )}
            {cppLocked && user ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <Lock className="h-3 w-3" aria-hidden /> Locked
              </span>
            ) : null}
          </h2>
          {cppLocked ? (
            <TrackLockedCard track="cpp" title="C++ track locked" />
          ) : (
            <>
              {(CPP_CHAPTERS as unknown as ChapterInfo[])
                .filter((c) => progData.tiers[c.level].unlocked)
                .map((chapter) => {
                  const chDone = chapter.lessons.filter((l) =>
                    done.includes(l.id),
                  ).length;
                  const chTotal = chapter.lessons.length;
                  return (
                    <CollapsibleSection
                      key={chapter.slug}
                      title={chapter.titleEn}
                      description={chapter.titleAm}
                      defaultOpen={chapter.slug === expandedChapterSlug}
                      trailing={
                        mounted ? (
                          <ProgressChip done={chDone} total={chTotal} />
                        ) : undefined
                      }
                      panelClassName="pt-3"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 max-w-2xl">
                        {chapter.descriptionEn}
                      </p>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Sessions
                      </h3>
                      <ol className="space-y-2">
                        {chapter.lessons.map((lesson, i) => {
                          const isDone = done.includes(lesson.id);
                          return (
                            <li key={lesson.id}>
                              <Link
                                href={`/lessons/${lesson.id}`}
                                className={cn(
                                  "group flex items-start gap-4 rounded-xl border p-4 transition-all duration-200",
                                  isDone
                                    ? "border-emerald-200/90 dark:border-emerald-900/45 bg-emerald-50/40 dark:bg-emerald-950/15"
                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                                    isDone
                                      ? "bg-emerald-500 text-white"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
                                  )}
                                >
                                  {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {lesson.titleEn}
                                    </p>
                                    {isDone ? (
                                      <CheckCircle2
                                        className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                                        aria-label="Completed"
                                      />
                                    ) : (
                                      <Circle
                                        className="h-5 w-5 shrink-0 text-gray-300 dark:text-gray-600"
                                        aria-label="Not completed"
                                      />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {lesson.blurbEn}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                                    <span className="inline-flex items-center gap-1">
                                      <Clock
                                        className="h-3.5 w-3.5"
                                        aria-hidden
                                      />
                                      ~{lesson.estMinutes} min
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ol>
                      <ChapterQuizFooter
                        chapterSlug={chapter.slug}
                        done={done}
                      />
                    </CollapsibleSection>
                  );
                })}
              <ModuleFinalCard
                track="cpp"
                done={done}
                accessibleLessonIds={accessibleLessonIds}
              />
              <TrackAdditionalResource
                unlocked={trackReadingsUnlocked(
                  "cpp",
                  done,
                  accessibleLessonIds,
                )}
                videos={completionVideos}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
