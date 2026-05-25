import { Router, Request, Response } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { getProfile, getBadges } from './gamification.service';

const router = Router();

router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const profile = await getProfile(req.user!.sub);
    return res.json({ profile });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === 'USER_NOT_FOUND') return res.status(404).json({ error: 'User not found' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/badges', authenticate, async (req: Request, res: Response) => {
  try {
    const { badges, new_badges } = await getBadges(req.user!.sub);
    return res.json({ badges, new_badges });
  } catch (err: unknown) {
    console.error('[gamification/badges]', err);
    return res.status(500).json({ error: 'Failed to load badges' });
  }
});

export default router;
