import { Router, Request, Response } from 'express';

import { z } from 'zod';

import { authenticate } from '../../middleware/authenticate';

import { requireAdminDb } from '../../middleware/requireAdminDb';

import { isMissingTableError } from '../../db/mysqlErrors';

import {

  createTrackCompletionVideo,

  deleteTrackCompletionVideoById,

  listTrackCompletionVideos,

  updateTrackCompletionVideoById,

  type TrackKey,

} from './track-completion-videos.service';



const router = Router();



const trackEnum = z.literal('cpp');

const idParam = z.string().uuid();



const upsertBody = z.object({

  youtube_url: z.string().min(1),

  title: z.string().min(1),

  description: z.string().nullable().optional(),

  thumbnail_url: z.string().nullable().optional(),

  sort_order: z.number().int().optional(),

});



const createBody = upsertBody.extend({

  track: trackEnum,

});



router.get('/', async (_req: Request, res: Response): Promise<void> => {

  try {

    const videos = await listTrackCompletionVideos();

    res.json({ videos });

  } catch {

    res.status(500).json({ error: 'Internal server error' });

  }

});



router.post(

  '/',

  authenticate,

  requireAdminDb,

  async (req: Request, res: Response): Promise<void> => {

    const body = createBody.safeParse(req.body);

    if (!body.success) {

      res.status(400).json({ error: 'Invalid body', details: body.error.flatten() });

      return;

    }

    try {

      const video = await createTrackCompletionVideo(body.data.track as TrackKey, {

        youtube_url: body.data.youtube_url,

        title: body.data.title,

        description: body.data.description ?? null,

        thumbnail_url: body.data.thumbnail_url ?? null,

        sort_order: body.data.sort_order ?? null,

      });

      res.status(201).json({ video });

    } catch (err: unknown) {

      const e = err as { code?: string; message?: string };

      if (e.code === 'INVALID_YOUTUBE_URL') {

        res.status(400).json({ error: e.message ?? 'Invalid YouTube URL', code: e.code });

        return;

      }

      if (e.code === 'SCHEMA_MULTIPLE_RESOURCES') {

        res.status(503).json({ error: e.message ?? 'Schema outdated', code: e.code });

        return;

      }

      if (e.code === 'TABLE_MISSING' || isMissingTableError(err)) {

        res.status(503).json({

          error: 'Database table missing. From backend folder run: npm run migrate:006',

          code: 'TABLE_MISSING',

        });

        return;

      }

      console.error('[track-completion-videos POST]', err);

      res.status(500).json({ error: 'Internal server error' });

    }

  }

);



router.put(

  '/:id',

  authenticate,

  requireAdminDb,

  async (req: Request, res: Response): Promise<void> => {

    const parsedId = idParam.safeParse(req.params.id);

    if (!parsedId.success) {

      res.status(400).json({ error: 'Invalid resource id', code: 'INVALID_ID' });

      return;

    }

    const body = upsertBody.safeParse(req.body);

    if (!body.success) {

      res.status(400).json({ error: 'Invalid body', details: body.error.flatten() });

      return;

    }

    try {

      const video = await updateTrackCompletionVideoById(parsedId.data, {

        youtube_url: body.data.youtube_url,

        title: body.data.title,

        description: body.data.description ?? null,

        thumbnail_url: body.data.thumbnail_url ?? null,

        sort_order: body.data.sort_order ?? null,

      });

      res.json({ video });

    } catch (err: unknown) {

      const e = err as { code?: string; message?: string };

      if (e.code === 'INVALID_YOUTUBE_URL') {

        res.status(400).json({ error: e.message ?? 'Invalid YouTube URL', code: e.code });

        return;

      }

      if (e.code === 'NOT_FOUND') {

        res.status(404).json({ error: e.message ?? 'Not found', code: e.code });

        return;

      }

      if (e.code === 'SCHEMA_MULTIPLE_RESOURCES') {

        res.status(503).json({ error: e.message ?? 'Schema outdated', code: e.code });

        return;

      }

      if (e.code === 'TABLE_MISSING' || isMissingTableError(err)) {

        res.status(503).json({

          error: 'Database table missing. From backend folder run: npm run migrate:006',

          code: 'TABLE_MISSING',

        });

        return;

      }

      console.error('[track-completion-videos PUT]', err);

      res.status(500).json({ error: 'Internal server error' });

    }

  }

);



router.delete(

  '/:id',

  authenticate,

  requireAdminDb,

  async (req: Request, res: Response): Promise<void> => {

    const parsedId = idParam.safeParse(req.params.id);

    if (!parsedId.success) {

      res.status(400).json({ error: 'Invalid resource id', code: 'INVALID_ID' });

      return;

    }

    try {

      const removed = await deleteTrackCompletionVideoById(parsedId.data);

      res.json({ removed });

    } catch (err: unknown) {

      if (isMissingTableError(err)) {

        res.status(503).json({

          error: 'Database table missing. From backend folder run: npm run migrate:006',

          code: 'TABLE_MISSING',

        });

        return;

      }

      res.status(500).json({ error: 'Internal server error' });

    }

  }

);



export default router;

