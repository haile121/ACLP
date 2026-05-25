/**
 * Patches legacy `badges` when it predates 008 (CREATE TABLE IF NOT EXISTS skipped new columns).
 * Run from backend/: npm run migrate:009
 */
import mysql from 'mysql2/promise';
import { loadBackendEnv } from './loadBackendEnv';

loadBackendEnv();

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
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'badges'`,
      [database]
    );
    if (Number((tables[0] as { c: number }).c) === 0) {
      console.log('Table `badges` does not exist — run: npm run migrate:008 first.');
      return;
    }

    const alters: { col: string; ddl: string }[] = [
      { col: 'description_en', ddl: 'ADD COLUMN description_en VARCHAR(512) NULL' },
      { col: 'description_am', ddl: 'ADD COLUMN description_am VARCHAR(512) NULL' },
      { col: 'icon_emoji', ddl: 'ADD COLUMN icon_emoji VARCHAR(16) NULL' },
      { col: 'sort_order', ddl: 'ADD COLUMN sort_order INT NOT NULL DEFAULT 0' },
    ];

    for (const { col, ddl } of alters) {
      if (await columnExists(conn, database, 'badges', col)) {
        console.log(`Column badges.${col} already present — skip.`);
        continue;
      }
      await conn.query(`ALTER TABLE badges ${ddl}`);
      console.log(`Added badges.${col}`);
    }

    if (!(await indexExists(conn, database, 'badges', 'idx_badges_sort'))) {
      try {
        await conn.query('CREATE INDEX idx_badges_sort ON badges (sort_order)');
        console.log('Created index idx_badges_sort on badges(sort_order).');
      } catch (e: unknown) {
        const err = e as { errno?: number };
        if (err.errno === 1061) console.log('Index idx_badges_sort already exists — skip.');
        else throw e;
      }
    } else {
      console.log('Index idx_badges_sort already present — skip.');
    }

    console.log('Migration 009 completed successfully.');
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
