import { CPP_CHAPTERS, type ChapterInfo } from "./courseCurriculum";
import type { Level } from "@/types";

export type LevelTier = Level;

export interface TierStats {
  level: LevelTier;
  chapters: ChapterInfo[];
  totalLessons: number;
  doneLessons: number;
  pct: number;
  unlocked: boolean;
}

export interface ProgressionData {
  tiers: Record<LevelTier, TierStats>;
  activeLevel: LevelTier;
  activeStats: TierStats;
}

export function getProgressionData(
  doneIds: string[],
  userLevel: LevelTier | null | undefined,
): ProgressionData {
  const groups: Record<LevelTier, ChapterInfo[]> = {
    beginner: [],
    intermediate: [],
    advanced: [],
  };

  for (const ch of CPP_CHAPTERS) {
    if (ch.level === "beginner") groups.beginner.push(ch);
    else if (ch.level === "intermediate") groups.intermediate.push(ch);
    else if (ch.level === "advanced") groups.advanced.push(ch);
  }

  const buildStats = (level: LevelTier): Omit<TierStats, "unlocked"> => {
    const chapters = groups[level];
    const totalLessons = chapters.reduce(
      (cnt, ch) => cnt + ch.lessons.length,
      0,
    );
    const doneLessons = chapters.reduce(
      (cnt, ch) =>
        cnt + ch.lessons.filter((l) => doneIds.includes(l.id)).length,
      0,
    );
    const pct =
      totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
    return { level, chapters, totalLessons, doneLessons, pct };
  };

  const beginnerStats = buildStats("beginner");
  const intermediateStats = buildStats("intermediate");
  const advancedStats = buildStats("advanced");

  const bUnlocked = true;
  const iUnlocked =
    beginnerStats.pct >= 60 ||
    userLevel === "intermediate" ||
    userLevel === "advanced";
  const aUnlocked = intermediateStats.pct >= 60 || userLevel === "advanced";

  const tiers: Record<LevelTier, TierStats> = {
    beginner: { ...beginnerStats, unlocked: bUnlocked },
    intermediate: { ...intermediateStats, unlocked: iUnlocked },
    advanced: { ...advancedStats, unlocked: aUnlocked },
  };

  let activeLevel: LevelTier = "beginner";
  if (tiers.advanced.unlocked) {
    activeLevel = "advanced";
  } else if (tiers.intermediate.unlocked) {
    activeLevel = "intermediate";
  }

  return {
    tiers,
    activeLevel,
    activeStats: tiers[activeLevel],
  };
}
