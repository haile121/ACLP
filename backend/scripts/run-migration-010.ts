/**
 * Multiple optional videos per track: drops UNIQUE(track), adds sort_order + index.
 * Run from backend/: npm run migrate:010
 * Idempotent (safe to run more than once).
 */
import mysql from 'mysql2/promise';
import { loadBackendEnv } from './loadBackendEnv';

loadBackendEnv();

async function indexExists(
  conn: mysql.Connection,
  db: string,
  table: string,
  indexName: string
): Promise<boolean> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS c FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [db, table, indexName]
  );
  return Number((rows[0] as { c: number }).c) > 0;
}

async function columnExists(
  conn: mysql.Connection,
  db: string,
  table: string,
  column: string
): Promise<boolean> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [db, table, column]
  );
  return Number((rows[0] as { c: number }).c) > 0;
}

async function main() {
  const database = process.env.DB_NAME ?? 'amharic_cpp_platform';

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  try {
    const [tables] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT COUNT(*) AS c FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'track_completion_videos'`,
      [database]
    );
    if (Number((tables[0] as { c: number }).c) === 0) {
      console.log('Table `track_completion_videos` does not exist — run: npm run migrate:006 first.');
      return;
    }

    if (await indexExists(conn, database, 'track_completion_videos', 'uq_track_completion_track')) {
      await conn.query('ALTER TABLE track_completion_videos DROP INDEX uq_track_completion_track');
      console.log('Dropped unique index uq_track_completion_track.');
    } else {
      console.log('Unique index uq_track_completion_track already absent — skip.');
    }

    if (!(await columnExists(conn, database, 'track_completion_videos', 'sort_order'))) {
      await conn.query(
        'ALTER TABLE track_completion_videos ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER thumbnail_url'
      );
      console.log('Added column sort_order.');
    } else {
      console.log('Column sort_order already present — skip.');
    }

    if (!(await indexExists(conn, database, 'track_completion_videos', 'idx_track_completion_track_sort'))) {
      try {
        await conn.query(
          'CREATE INDEX idx_track_completion_track_sort ON track_completion_videos (track, sort_order, id)'
        );
        console.log('Created index idx_track_completion_track_sort.');
      } catch (e: unknown) {
        const err = e as { errno?: number };
        if (err.errno === 1061) console.log('Index idx_track_completion_track_sort already exists — skip.');
        else throw e;
      }
    } else {
      console.log('Index idx_track_completion_track_sort already present — skip.');
    }

    console.log('Migration 010 completed successfully.');
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
