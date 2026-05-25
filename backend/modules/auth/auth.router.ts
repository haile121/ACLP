import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as authService from './auth.service';
import { authenticate } from '../../middleware/authenticate';
import { updateStreak } from '../gamification/gamification.service';

const router = Router();

/**
 * When the SPA and API are on different hosts (e.g. two Railway URLs), browsers treat
 * requests as cross-site. SameSite=Lax cookies are not sent on those fetches, so login/register
 * appear broken. Use COOKIE_SAME_SITE=none on the API (requires HTTPS in production).
 */
function cookieSameSite(): 'lax' | 'none' {
  const raw = process.env.COOKIE_SAME_SITE?.trim().toLowerCase();
  return raw === 'none' ? 'none' : 'lax';
}

const isProd = process.env.NODE_ENV === 'production';
const sameSite = cookieSameSite();
/** SameSite=None must be paired with Secure; Lax uses Secure only in production. */
const cookieSecure = sameSite === 'none' ? true : isProd;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// A non-httpOnly flag cookie so the frontend JS can detect auth state
const FLAG_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: cookieSecure,
  sameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, display_name, displayName, password } = req.body;
    const name = display_name ?? displayName;

    if (!email || !name || !password) {
      res.status(400).json({ error: 'email, display_name, and password are required' });
      return;
    }

    const user = await authService.register(email, name, password);

    // Sign a token for the newly registered user
    const { token } = await authService.login(email, password);

    res.cookie('token', token, COOKIE_OPTIONS);
    res.cookie('logged_in', '1', FLAG_COOKIE_OPTIONS);
    await updateStreak(user.id).catch(() => {}); // daily streak (login day), not XP
    res.status(201).json({ user: { ...user, assessment_completed: false } });
  } catch (err: any) {
    console.error('[register error]', err);
    if (err?.code === 'EMAIL_EXISTS') {
      res.status(409).json({ error: err.message, code: err.code });
    } else {
      res.status(500).json({ error: err?.message ?? 'Internal server error' });
    }
  }
});

// POST /login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const { user, token } = await authService.login(email, password);

    res.cookie('token', token, COOKIE_OPTIONS);
    res.cookie('logged_in', '1', FLAG_COOKIE_OPTIONS);
    await updateStreak(user.id).catch(() => {}); // daily streak (login day), not XP
    res.json({ user });
  } catch (err: any) {
    if (err?.code === 'INVALID_CREDENTIALS') {
      res.status(401).json({ error: err.message, code: err.code });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

const GENERIC_RESET_MESSAGE =
  'If an account exists for that email, we sent password reset instructions.';

// POST /forgot-password
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }
    await authService.requestPasswordReset(email);
    res.json({ message: GENERIC_RESET_MESSAGE });
  } catch (err: unknown) {
    console.error('[auth/forgot-password]', err);
    res.status(500).json({ error: 'Could not process reset request. Please try again later.' });
  }
});

// POST /reset-password
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!token) {
      res.status(400).json({ error: 'Reset token is required.' });
      return;
    }
    await authService.resetPasswordWithToken(token, password);
    res.json({ message: 'Your password has been updated. You can sign in now.' });
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    if (e.code === 'WEAK_PASSWORD' || e.code === 'INVALID_TOKEN' || e.code === 'TOKEN_EXPIRED') {
      res.status(400).json({ error: e.message, code: e.code });
      return;
    }
    if (e.code === 'RESET_UNAVAILABLE') {
      res.status(503).json({ error: e.message, code: e.code });
      return;
    }
    console.error('[auth/reset-password]', err);
    res.status(500).json({ error: 'Could not reset password. Please try again.' });
  }
});

// POST /logout
router.post('/logout', (_req: Request, res: Response): void => {
  // Clear with matching attributes to maximize cross-browser reliability.
  res.clearCookie('token', { httpOnly: true, sameSite, secure: cookieSecure, path: '/' });
  res.clearCookie('logged_in', { sameSite, secure: cookieSecure, path: '/' });
  res.clearCookie('ws_token', { sameSite, secure: cookieSecure, path: '/' });
  res.json({ message: 'Logged out' });
});

// GET /session — always 200; use instead of /me for “is anyone logged in?” checks (avoids 401 in DevTools).
router.get('/session', async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.token as string | undefined;
  const session = await authService.getSessionFromToken(token);
  if (!session.authenticated) {
    res.json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true, user: session.user });
});

// GET /ws-token — returns a readable cookie for WebSocket auth
router.get('/ws-token', authenticate, (req: Request, res: Response): void => {
  // Re-issue the same token as a non-httpOnly cookie so the WS client can read it
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.cookie('ws_token', token, {
    httpOnly: false,
    secure: cookieSecure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ ok: true });
});

// GET /me — streak is updated on POST /login and /register only (not on browsing while logged in).
router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.getMe(req.user!.sub);
    res.json({ user });
  } catch (err: any) {
    if (err?.code === 'USER_NOT_FOUND') {
      res.status(404).json({ error: err.message, code: err.code });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

const primaryTrackSchema = z.object({
  primary_track: z.literal('cpp'),
});

// PATCH /primary-track — legacy hook; new accounts default to C++ on registration.
router.patch('/primary-track', authenticate, async (req: Request, res: Response): Promise<void> => {
  const parsed = primaryTrackSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'primary_track must be cpp' });
    return;
  }
  try {
    const user = await authService.setPrimaryTrack(req.user!.sub, parsed.data.primary_track);
    res.json({ user });
  } catch (err: any) {
    if (err?.code === 'TRACK_SET' || err?.code === 'ONBOARDING_DONE') {
      res.status(409).json({ error: err.message, code: err.code });
      return;
    }
    console.error('[auth/primary-track]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
