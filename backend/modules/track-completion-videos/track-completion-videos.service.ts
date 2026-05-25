import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db/connection';
import { isMissingTableError, warnMissingMigrationOnce } from '../../db/mysqlErrors';
import { parseYoutubeVideoId, youtubeDefaultThumbnail, youtubeEmbedUrl } from './youtube';

export type TrackKey = 'cpp';

export interface TrackCompletionVideoRow {
  id: string;
  track: TrackKey;
  youtube_url: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  sort_order: number;
}

export interface TrackCompletionVideoPublic extends TrackCompletionVideoRow {
  video_id: string;
  embed_url: string;
  preview_thumbnail_url: string;
}

function assertValidYoutube(url: string): void {
  const video_id = parseYoutubeVideoId(url);
  if (!video_id) {
    const err = new Error('Invalid YouTube URL') as Error & { code?: string };
    err.code = 'INVALID_YOUTUBE_URL';
    throw err;
  }
}

function toPublic(row: TrackCompletionVideoRow): TrackCompletionVideoPublic | null {
  const video_id = parseYoutubeVideoId(row.youtube_url);
  if (!video_id) return null;
  const embed_url = youtubeEmbedUrl(video_id);
  const preview_thumbnail_url =
    row.thumbnail_url?.trim() || youtubeDefaultThumbnail(video_id);
  return {
    ...row,
    video_id,
    embed_url,
    preview_thumbnail_url,
  };
}

async function nextSortOrder(track: TrackKey): Promise<number> {
  const rows = await query<{ m: number }[]>(
    `SELECT COALESCE(MAX(sort_order), -1) + 1 AS m FROM track_completion_videos WHERE track = ?`,
    [track]
  );
  const raw = rows[0]?.m;
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
}

/** True when migrate 010 has run (sort_order column exists). */
async function readSortOrderColumnPresent(): Promise<boolean> {
  try {
    const rows = await query<{ c: number }[]>(
      `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'track_completion_videos' AND COLUMN_NAME = 'sort_order'`
    );
    return Number(rows[0]?.c) > 0;
  } catch {
    return false;
  }
}

async function selectRowById(id: string): Promise<TrackCompletionVideoRow | null> {
  const hasSort = await readSortOrderColumnPresent();
  const cols = hasSort
    ? `id, track, youtube_url, title, description, thumbnail_url, sort_order`
    : `id, track, youtube_url, title, description, thumbnail_url, 0 AS sort_order`;
  const rows = await query<TrackCompletionVideoRow[]>(
    `SELECT ${cols} FROM track_completion_videos WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function listTrackCompletionVideos(): Promise<TrackCompletionVideoPublic[]> {
  const hasSort = await readSortOrderColumnPresent();
  const orderSql = hasSort
    ? 'ORDER BY track ASC, sort_order ASC, created_at ASC'
    : 'ORDER BY track ASC, created_at ASC';

  try {
    const selectCols = hasSort
      ? `id, track, youtube_url, title, description, thumbnail_url, sort_order`
      : `id, track, youtube_url, title, description, thumbnail_url, 0 AS sort_order`;

    const rows = await query<TrackCompletionVideoRow[]>(
      `SELECT ${selectCols}
       FROM track_completion_videos
       ${orderSql}`
    );
    const out: TrackCompletionVideoPublic[] = [];
    for (const row of rows) {
      const pub = toPublic(row);
      if (pub) out.push(pub);
    }
    return out;
  } catch (err: unknown) {
    if (isMissingTableError(err)) {
      warnMissingMigrationOnce(
        'track_completion_videos',
        '[track-completion-videos] table missing — run: npm run migrate:006 (from backend/)'
      );
      return [];
    }
    throw err;
  }
}

export async function createTrackCompletionVideo(
  track: TrackKey,
  data: {
    youtube_url: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    sort_order?: number | null;
  }
): Promise<TrackCompletionVideoPublic> {
  assertValidYoutube(data.youtube_url);

  const yt = data.youtube_url.trim();
  const title = data.title.trim();
  if (!title) {
    const err = new Error('Title required') as Error & { code?: string };
    err.code = 'INVALID_BODY';
    throw err;
  }
  const desc = data.description?.trim() || null;
  const thumb = data.thumbnail_url?.trim() || null;
  const id = uuidv4();

  const hasSort = await readSortOrderColumnPresent();

  try {
    if (!hasSort) {
      const cntRows = await query<{ c: number }[]>(
        `SELECT COUNT(*) AS c FROM track_completion_videos WHERE track = ?`,
        [track]
      );
      if (Number(cntRows[0]?.c) > 0) {
        const err = new Error(
          'This track already has one optional resource. Run npm run migrate:010 (from backend/) to allow multiple resources.'
        ) as Error & { code?: string };
        err.code = 'SCHEMA_MULTIPLE_RESOURCES';
        throw err;
      }
      await query(
        `INSERT INTO track_completion_videos (id, track, youtube_url, title, description, thumbnail_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, track, yt, title, desc, thumb]
      );
    } else {
      const sortOrder =
        data.sort_order != null && Number.isFinite(Number(data.sort_order))
          ? Number(data.sort_order)
          : await nextSortOrder(track);
      await query(
        `INSERT INTO track_completion_videos (id, track, youtube_url, title, description, thumbnail_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, track, yt, title, desc, thumb, sortOrder]
      );
    }
  } catch (err: unknown) {
    if (isMissingTableError(err)) {
      const e = new Error('track_completion_videos table missing') as Error & { code?: string };
      e.code = 'TABLE_MISSING';
      throw e;
    }
    throw err;
  }

  const row = await selectRowById(id);
  if (!row) {
    const err = new Error('Could not read row after create') as Error & { code?: string };
    err.code = 'READ_FAILED';
    throw err;
  }
  const pub = toPublic(row);
  if (!pub) {
    const err = new Error('Invalid YouTube URL') as Error & { code?: string };
    err.code = 'INVALID_YOUTUBE_URL';
    throw err;
  }
  return pub;
}

export async function updateTrackCompletionVideoById(
  id: string,
  data: {
    youtube_url: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    sort_order?: number | null;
  }
): Promise<TrackCompletionVideoPublic> {
  assertValidYoutube(data.youtube_url);

  const yt = data.youtube_url.trim();
  const title = data.title.trim();
  if (!title) {
    const err = new Error('Title required') as Error & { code?: string };
    err.code = 'INVALID_BODY';
    throw err;
  }
  const desc = data.description?.trim() || null;
  const thumb = data.thumbnail_url?.trim() || null;

  const hasSort = await readSortOrderColumnPresent();

  const sortVal =
    data.sort_order != null && Number.isFinite(Number(data.sort_order)) ? Number(data.sort_order) : null;

  try {
    if (!hasSort) {
      await query(
        `UPDATE track_completion_videos
         SET youtube_url = ?, title = ?, description = ?, thumbnail_url = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [yt, title, desc, thumb, id]
      );
    } else if (sortVal !== null) {
      await query(
        `UPDATE track_completion_videos
         SET youtube_url = ?, title = ?, description = ?, thumbnail_url = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [yt, title, desc, thumb, sortVal, id]
      );
    } else {
      await query(
        `UPDATE track_completion_videos
         SET youtube_url = ?, title = ?, description = ?, thumbnail_url = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [yt, title, desc, thumb, id]
      );
    }
  } catch (err: unknown) {
    if (isMissingTableError(err)) {
      const e = new Error('track_completion_videos table missing') as Error & { code?: string };
      e.code = 'TABLE_MISSING';
      throw e;
    }
    throw err;
  }

  const row = await selectRowById(id);
  if (!row) {
    const err = new Error('Resource not found') as Error & { code?: string };
    err.code = 'NOT_FOUND';
    throw err;
  }
  const pub = toPublic(row);
  if (!pub) {
    const err = new Error('Invalid YouTube URL') as Error & { code?: string };
    err.code = 'INVALID_YOUTUBE_URL';
    throw err;
  }
  return pub;
}

export async function deleteTrackCompletionVideoById(id: string): Promise<boolean> {
  const r = await query<unknown>('DELETE FROM track_completion_videos WHERE id = ?', [id]);
  if (Array.isArray(r)) return false;
  const n = (r as { affectedRows?: number }).affectedRows ?? 0;
  return n > 0;
}
