import { randomUUID } from 'crypto';
import { query } from '../../db/connection';
import { isMissingTableError, warnMissingMigrationOnce } from '../../db/mysqlErrors';

const MAX_TEXT = 60000;

function clip(s: string): string {
  if (s.length <= MAX_TEXT) return s;
  return s.slice(0, MAX_TEXT);
}

export interface AiTutorHistoryRow {
  id: string;
  question: string;
  response: string;
  language: 'am' | 'en';
  created_at: Date | string;
}

export async function saveAiTutorExchange(
  userId: string,
  question: string,
  response: string,
  language: 'am' | 'en',
): Promise<void> {
  const id = randomUUID();
  const q = clip(question.trim());
  const r = clip(response.trim());
  if (!q || !r) return;

  try {
    await query(
      `INSERT INTO ai_tutor_messages (id, user_id, question, response, language)
       VALUES (?, ?, ?, ?, ?)`,
      [id, userId, q, r, language],
    );
  } catch (err) {
    if (isMissingTableError(err)) {
      warnMissingMigrationOnce(
        'ai_tutor_messages',
        '[ai-tutor] Table ai_tutor_messages missing — run: npm run migrate:007 (from backend/)',
      );
      return;
    }
    throw err;
  }
}

/** Oldest first (chat order). */
export async function listAiTutorHistory(userId: string, limit = 100): Promise<AiTutorHistoryRow[]> {
  try {
    const rows = await query<AiTutorHistoryRow[]>(
      `SELECT id, question, response, language, created_at
       FROM ai_tutor_messages
       WHERE user_id = ?
       ORDER BY created_at ASC
       LIMIT ?`,
      [userId, Math.min(500, Math.max(1, limit))],
    );
    return rows.map((row) => ({
      ...row,
      language: row.language === 'am' ? 'am' : 'en',
    }));
  } catch (err) {
    if (isMissingTableError(err)) {
      warnMissingMigrationOnce(
        'ai_tutor_messages',
        '[ai-tutor] Table ai_tutor_messages missing — run: npm run migrate:007 (from backend/)',
      );
      return [];
    }
    throw err;
  }
}
