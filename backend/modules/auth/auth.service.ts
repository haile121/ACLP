import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db/connection';
import { isMissingTableError, warnMissingMigrationOnce } from '../../db/mysqlErrors';
import { User } from '../../db/types';
import { sendPasswordResetEmail } from './auth.mail';

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const MIN_PASSWORD_LENGTH = 8;

function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export function validateNewPassword(password: string): string | null {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

type SafeUser = Omit<User, 'password_hash'>;

/** Trim + lowercase so sign-in matches regardless of casing or accidental spaces. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function register(
  email: string,
  displayName: string,
  password: string
): Promise<SafeUser> {
  const emailNorm = normalizeEmail(email);
  const existing = await query<User[]>(
    'SELECT id FROM users WHERE LOWER(TRIM(email)) = ?',
    [emailNorm]
  );
  if (existing.length > 0) {
    throw { code: 'EMAIL_EXISTS', message: 'Email already in use' };
  }

  const password_hash = await bcrypt.hash(password, 12);
  const id = uuidv4();

  await query(
    `INSERT INTO users (id, email, display_name, password_hash, role, assessment_completed, primary_track)
     VALUES (?, ?, ?, ?, 'student', false, 'cpp')`,
    [id, emailNorm, displayName.trim(), password_hash]
  );

  const rows = await query<SafeUser[]>(
    `SELECT id, email, display_name, role, level, assessment_completed,
            primary_track, cpp_level, web_level, cpp_assessment_completed, web_assessment_completed,
            language_pref, theme_pref, xp, coins, streak, last_active_date,
            is_active, created_at, updated_at
     FROM users WHERE id = ?`,
    [id]
  );

  return rows[0];
}

export async function login(
  email: string,
  password: string
): Promise<{ user: SafeUser; token: string }> {
  const emailNorm = normalizeEmail(email);
  const rows = await query<User[]>(
    `SELECT id, email, display_name, password_hash, role, level, assessment_completed,
            primary_track, cpp_level, web_level, cpp_assessment_completed, web_assessment_completed,
            language_pref, theme_pref, xp, coins, streak, last_active_date,
            is_active, created_at, updated_at
     FROM users WHERE LOWER(TRIM(email)) = ?`,
    [emailNorm]
  );

  if (rows.length === 0) {
    throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  // Keep behavior consistent with `middleware/authenticate.ts` which allows a dev fallback.
  // In production, JWT_SECRET should always be set.
  const secret = process.env.JWT_SECRET ?? 'dev-secret';
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      assessment_completed: user.assessment_completed,
    },
    secret,
    { expiresIn: '7d' }
  );

  const { password_hash, ...safeUser } = user;
  return { user: safeUser as SafeUser, token };
}

/**
 * Validate the JWT from the httpOnly cookie without returning 401.
 * Used by the marketing shell to show signed-in UI without noisy failed /me requests.
 */
export async function getSessionFromToken(
  token: string | undefined
): Promise<{ authenticated: true; user: SafeUser } | { authenticated: false }> {
  if (!token || typeof token !== 'string') {
    return { authenticated: false };
  }
  try {
    const secret = process.env.JWT_SECRET ?? 'dev-secret';
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    const sub = typeof decoded.sub === 'string' ? decoded.sub : null;
    if (!sub) return { authenticated: false };
    const user = await getMe(sub);
    return { authenticated: true, user };
  } catch {
    return { authenticated: false };
  }
}

export async function getMe(userId: string): Promise<SafeUser> {
  const rows = await query<SafeUser[]>(
    `SELECT id, email, display_name, role, level, assessment_completed,
            primary_track, cpp_level, web_level, cpp_assessment_completed, web_assessment_completed,
            language_pref, theme_pref, xp, coins, streak, last_active_date,
            is_active, created_at, updated_at
     FROM users WHERE id = ?`,
    [userId]
  );

  if (rows.length === 0) {
    throw { code: 'USER_NOT_FOUND', message: 'User not found' };
  }

  return rows[0];
}

/** First-time only: set the learning path before the placement test. */
export async function setPrimaryTrack(userId: string, track: 'cpp'): Promise<SafeUser> {
  const user = await getMe(userId);
  if (user.primary_track) {
    throw { code: 'TRACK_SET', message: 'Learning path is already selected.' };
  }
  if (user.assessment_completed) {
    throw { code: 'ONBOARDING_DONE', message: 'Placement is already complete.' };
  }
  await query('UPDATE users SET primary_track = ? WHERE id = ?', [track, userId]);
  return getMe(userId);
}

/**
 * Request a password reset. Always resolves without revealing whether the email exists.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const emailNorm = normalizeEmail(email);
  const rows = await query<Pick<User, 'id' | 'email' | 'display_name'>[]>(
    'SELECT id, email, display_name FROM users WHERE LOWER(TRIM(email)) = ? AND (is_active IS NULL OR is_active = true)',
    [emailNorm]
  );
  if (rows.length === 0) return;

  const user = rows[0];
  const rawToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  const tokenId = uuidv4();

  try {
    await query('DELETE FROM password_reset_tokens WHERE user_id = ?', [user.id]);
    await query(
      `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)`,
      [tokenId, user.id, tokenHash, expiresAt]
    );
  } catch (err: unknown) {
    if (isMissingTableError(err)) {
      warnMissingMigrationOnce(
        'password_reset_tokens',
        '[auth] password_reset_tokens table missing — run: npm run migrate:012 (from backend/)'
      );
      return;
    }
    throw err;
  }

  const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
  await sendPasswordResetEmail(user.email, user.display_name, resetUrl);
}

export async function resetPasswordWithToken(rawToken: string, newPassword: string): Promise<void> {
  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    throw { code: 'WEAK_PASSWORD', message: passwordError };
  }

  const tokenHash = hashResetToken(rawToken.trim());
  let rows: { user_id: string; expires_at: Date | string }[];
  try {
    rows = await query<{ user_id: string; expires_at: Date | string }[]>(
      `SELECT user_id, expires_at FROM password_reset_tokens WHERE token_hash = ? LIMIT 1`,
      [tokenHash]
    );
  } catch (err: unknown) {
    if (isMissingTableError(err)) {
      throw { code: 'RESET_UNAVAILABLE', message: 'Password reset is not available. Please contact support.' };
    }
    throw err;
  }

  if (rows.length === 0) {
    throw { code: 'INVALID_TOKEN', message: 'This reset link is invalid or has already been used.' };
  }

  const expiresAt = new Date(rows[0].expires_at);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
    await query('DELETE FROM password_reset_tokens WHERE token_hash = ?', [tokenHash]).catch(() => {});
    throw { code: 'TOKEN_EXPIRED', message: 'This reset link has expired. Please request a new one.' };
  }

  const password_hash = await bcrypt.hash(newPassword, 12);
  const userId = rows[0].user_id;
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, userId]);
  await query('DELETE FROM password_reset_tokens WHERE user_id = ?', [userId]);
}
