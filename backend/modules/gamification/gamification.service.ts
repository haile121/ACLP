import { query } from '../../db/connection';
import { isMissingTableError } from '../../db/mysqlErrors';
import type { Badge, User } from '../../db/types';
import { CPP_TRACK_FINAL_QUIZ_ID } from '../course-track-quizzes/courseReadingLessonIds';
import { notifyBadgeEarned } from '../notifications/notifications.service';

export interface EarnedBadgeAlert {
  id: string;
  name_en: string;
  name_am: string;
  description_en?: string | null;
  icon_emoji?: string | null;
}

/** Calendar YYYY-MM-DD in UTC (consistent with MySQL DATE string comparisons). */
function ymdUtc(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDaysUtc(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  return dt.toISOString().slice(0, 10);
}

/** Normalize MySQL DATE (string or Date from mysql2) to YYYY-MM-DD for comparison. */
function normalizeLastActiveDate(raw: string | Date | null | undefined): string | null {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const t = raw.trim();
    return t.length >= 10 ? t.slice(0, 10) : null;
  }
  if (raw instanceof Date) {
    return ymdUtc(raw);
  }
  return null;
}

export function mergeEarnedBadges(...groups: EarnedBadgeAlert[][]): EarnedBadgeAlert[] {
  const seen = new Set<string>();
  const out: EarnedBadgeAlert[] = [];
  for (const group of groups) {
    for (const b of group) {
      if (seen.has(b.id)) continue;
      seen.add(b.id);
      out.push(b);
    }
  }
  return out;
}

export async function awardXP(userId: string, amount: number): Promise<EarnedBadgeAlert[]> {
  await query('UPDATE users SET xp = xp + ? WHERE id = ?', [amount, userId]);
  return checkAndAwardBadges(userId);
}

export async function awardCoins(userId: string, amount: number): Promise<EarnedBadgeAlert[]> {
  await query('UPDATE users SET coins = coins + ? WHERE id = ?', [amount, userId]);
  return checkAndAwardBadges(userId);
}

/**
 * Daily streak: consecutive calendar days (UTC) the user **signed in** via POST /login or
 * POST /register. XP, lessons, and other activity do not change streak — only auth endpoints call this.
 */
export async function updateStreak(userId: string): Promise<EarnedBadgeAlert[]> {
  const rows = await query<Pick<User, 'streak' | 'last_active_date'>[]>(
    'SELECT streak, last_active_date FROM users WHERE id = ?',
    [userId]
  );
  if (rows.length === 0) return [];

  const { streak, last_active_date } = rows[0];
  const today = ymdUtc(new Date());
  const lastStr = normalizeLastActiveDate(last_active_date as string | Date | null | undefined);

  if (lastStr === today) return [];

  const yesterday = addDaysUtc(today, -1);
  const newStreak = lastStr === yesterday ? streak + 1 : 1;

  await query(
    'UPDATE users SET streak = ?, last_active_date = ? WHERE id = ?',
    [newStreak, today, userId]
  );

  return checkAndAwardBadges(userId);
}

async function loadBadgeMetrics(userId: string): Promise<{
  xp: number;
  streak: number;
  coins: number;
  maxExamScore: number;
  courseFinalBest: number;
  quizPassCount: number;
  lessonsDone: number;
} | null> {
  const userRows = await query<Pick<User, 'xp' | 'streak' | 'coins'>[]>(
    'SELECT xp, streak, coins FROM users WHERE id = ?',
    [userId]
  );
  if (userRows.length === 0) return null;
  const { xp, streak, coins } = userRows[0];

  let maxExamScore = 0;
  try {
    const examRows = await query<{ m: number | null }[]>(
      'SELECT MAX(score) AS m FROM exam_attempts WHERE user_id = ?',
      [userId]
    );
    maxExamScore = Number(examRows[0]?.m ?? 0);
  } catch (err: unknown) {
    if (!isMissingTableError(err)) throw err;
  }

  let courseFinalBest = 0;
  try {
    const finRows = await query<{ m: number | null }[]>(
      'SELECT MAX(score) AS m FROM course_track_quiz_attempts WHERE user_id = ? AND quiz_id = ?',
      [userId, CPP_TRACK_FINAL_QUIZ_ID]
    );
    courseFinalBest = Number(finRows[0]?.m ?? 0);
  } catch (err: unknown) {
    if (!isMissingTableError(err)) throw err;
  }

  let quizPassCount = 0;
  try {
    const qRows = await query<{ c: number }[]>(
      'SELECT COUNT(*) AS c FROM quiz_attempts WHERE user_id = ? AND passed = true',
      [userId]
    );
    quizPassCount += Number(qRows[0]?.c ?? 0);
  } catch (err: unknown) {
    if (!isMissingTableError(err)) throw err;
  }
  try {
    const ctRows = await query<{ c: number }[]>(
      'SELECT COUNT(*) AS c FROM course_track_quiz_attempts WHERE user_id = ? AND passed = 1',
      [userId]
    );
    quizPassCount += Number(ctRows[0]?.c ?? 0);
  } catch (err: unknown) {
    if (!isMissingTableError(err)) throw err;
  }

  let lessonsDone = 0;
  try {
    const crRows = await query<{ c: number }[]>(
      'SELECT COUNT(*) AS c FROM course_reading_progress WHERE user_id = ?',
      [userId]
    );
    lessonsDone += Number(crRows[0]?.c ?? 0);
  } catch (err: unknown) {
    if (!isMissingTableError(err)) throw err;
  }
  try {
    const lRows = await query<{ c: number }[]>(
      'SELECT COUNT(*) AS c FROM user_progress WHERE user_id = ? AND completed = true',
      [userId]
    );
    lessonsDone += Number(lRows[0]?.c ?? 0);
  } catch (err: unknown) {
    if (!isMissingTableError(err)) throw err;
  }

  return { xp, streak, coins, maxExamScore, courseFinalBest, quizPassCount, lessonsDone };
}

/** Stable evaluation order without requiring legacy `badges` rows to have `sort_order`. */
function sortBadgesForEvaluation(rows: Badge[]): Badge[] {
  return [...rows].sort((a, b) => {
    const ar = (a as Badge & { sort_order?: number }).sort_order;
    const br = (b as Badge & { sort_order?: number }).sort_order;
    const ao = typeof ar === 'number' && Number.isFinite(ar) ? ar : 10_000;
    const bo = typeof br === 'number' && Number.isFinite(br) ? br : 10_000;
    if (ao !== bo) return ao - bo;
    return String(a.id).localeCompare(String(b.id));
  });
}

export async function checkAndAwardBadges(userId: string): Promise<EarnedBadgeAlert[]> {
  const newlyEarned: EarnedBadgeAlert[] = [];
  try {
    const metrics = await loadBadgeMetrics(userId);
    if (!metrics) return newlyEarned;

    const rawBadges = await query<Badge[]>('SELECT * FROM badges');
    const allBadges = sortBadgesForEvaluation(rawBadges);
    const earnedRows = await query<{ badge_id: string }[]>(
      'SELECT badge_id FROM user_badges WHERE user_id = ?',
      [userId]
    );
    const earned = new Set(earnedRows.map((r) => r.badge_id));

    for (const badge of allBadges) {
      if (earned.has(badge.id)) continue;

      const v = badge.criteria_value;
      const t = badge.criteria_type;
      let shouldAward = false;

      if (t === 'xp_milestone' && v !== null && v !== undefined) {
        shouldAward = metrics.xp >= v;
      } else if (t === 'streak' && v !== null && v !== undefined) {
        shouldAward = metrics.streak >= v;
      } else if (t === 'coins_milestone' && v !== null && v !== undefined) {
        shouldAward = metrics.coins >= v;
      } else if (t === 'exam_score_max' && v !== null && v !== undefined) {
        shouldAward = metrics.maxExamScore >= v;
      } else if (t === 'course_track_final_score' && v !== null && v !== undefined) {
        shouldAward = metrics.courseFinalBest >= v;
      } else if (t === 'quiz_pass_any' && v !== null && v !== undefined) {
        shouldAward = metrics.quizPassCount >= v;
      } else if (t === 'lessons_completed' && v !== null && v !== undefined) {
        shouldAward = metrics.lessonsDone >= v;
      }

      if (shouldAward) {
        try {
          await query(
            'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
            [userId, badge.id]
          );
          const nameEn = (badge as Badge & { name_en?: string }).name_en ?? 'Badge';
          const nameAm = (badge as Badge & { name_am?: string }).name_am ?? nameEn;
          const descriptionEn = (badge as Badge & { description_en?: string }).description_en ?? null;
          const iconEmoji = (badge as Badge & { icon_emoji?: string | null }).icon_emoji ?? null;
          await notifyBadgeEarned(userId, nameEn, nameAm);
          newlyEarned.push({
            id: badge.id,
            name_en: nameEn,
            name_am: nameAm,
            description_en: descriptionEn,
            icon_emoji: iconEmoji,
          });
        } catch (e: unknown) {
          const err = e as { code?: string };
          if (err.code !== 'ER_DUP_ENTRY') throw e;
        }
      }
    }
  } catch (err: unknown) {
    if (isMissingTableError(err)) return newlyEarned;
    throw err;
  }
  return newlyEarned;
}

export async function getProfile(userId: string) {
  const rows = await query<Pick<User, 'xp' | 'coins' | 'streak' | 'level'>[]>(
    'SELECT xp, coins, streak, level FROM users WHERE id = ?',
    [userId]
  );
  if (rows.length === 0) throw { code: 'USER_NOT_FOUND', message: 'User not found' };
  return rows[0];
}

export async function getBadges(userId: string): Promise<{
  badges: (Badge & {
    earned_at: string;
    name_en: string;
    name_am: string;
    description_en?: string;
    description_am?: string;
    icon_url: string;
    icon_emoji?: string | null;
  })[];
  new_badges: EarnedBadgeAlert[];
}> {
  try {
    const new_badges = await checkAndAwardBadges(userId);
    const badges = await query<
      (Badge & {
        earned_at: string;
        name_en: string;
        name_am: string;
        description_en?: string;
        description_am?: string;
        icon_url: string;
        icon_emoji?: string | null;
      })[]
    >(
      `SELECT b.*, ub.earned_at
       FROM badges b
       JOIN user_badges ub ON ub.badge_id = b.id
       WHERE ub.user_id = ?
       ORDER BY ub.earned_at DESC`,
      [userId]
    );
    return { badges, new_badges };
  } catch (err: unknown) {
    if (isMissingTableError(err)) return { badges: [], new_badges: [] };
    throw err;
  }
}
