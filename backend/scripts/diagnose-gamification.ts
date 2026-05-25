/**
 * Quick check: badges + notifications tables and seed rows.
 * Run from backend/: npx tsx scripts/diagnose-gamification.ts
 */
import mysql from 'mysql2/promise';
import { loadBackendEnv } from './loadBackendEnv';

loadBackendEnv();

async function tableExists(conn: mysql.Connection, name: string): Promise<boolean> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?`,
    [name]
  );
  return rows.length > 0;
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'amharic_cpp_platform',
  });

  try {
    for (const t of ['badges', 'user_badges', 'notifications', 'course_reading_progress']) {
      const ok = await tableExists(conn, t);
      console.log(`table ${t}:`, ok ? 'OK' : 'MISSING');
    }
    if (await tableExists(conn, 'badges')) {
      const [b] = await conn.query<mysql.RowDataPacket[]>('SELECT COUNT(*) AS c FROM badges');
      console.log('badges seed count:', b[0]?.c);
    }
    if (await tableExists(conn, 'notifications')) {
      const [n] = await conn.query<mysql.RowDataPacket[]>('SELECT COUNT(*) AS c FROM notifications');
      console.log('notifications rows:', n[0]?.c);
    }
    const [u] = await conn.query<mysql.RowDataPacket[]>(
      'SHOW COLUMNS FROM users WHERE Field = ?',
      ['id']
    );
    console.log('users.id column:', u[0]);
    if (await tableExists(conn, 'notifications')) {
      const [nc] = await conn.query<mysql.RowDataPacket[]>(
        'SHOW COLUMNS FROM notifications WHERE Field = ?',
        ['user_id']
      );
      console.log('notifications.user_id column:', nc[0]);
    }
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
