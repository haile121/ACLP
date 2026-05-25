'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  trackCompletionVideosApi,
  type TrackCompletionVideo,
} from '@/lib/api';
import { parseYoutubeVideoId, youtubeDefaultThumbnail } from '@/lib/youtube';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useDialog } from '@/components/ui/DialogProvider';
import { cn } from '@/lib/cn';
import { Plus } from 'lucide-react';

type Track = 'cpp';

const emptyForm = {
  youtube_url: '',
  title: '',
  description: '',
  thumbnail_url: '',
  sort_order: '' as string,
};

function TrackForm({
  track,
  label,
  accent,
  initial,
  onSaved,
  onRemoved,
}: {
  track: Track;
  label: string;
  accent: 'blue' | 'teal';
  initial: TrackCompletionVideo | undefined;
  onSaved: (v: TrackCompletionVideo) => void;
  onRemoved: () => void;
}) {
  const { show } = useDialog();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        youtube_url: initial.youtube_url,
        title: initial.title,
        description: initial.description ?? '',
        thumbnail_url: initial.thumbnail_url ?? '',
        sort_order: String(initial.sort_order ?? 0),
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  const previewThumb = useMemo(() => {
    const custom = form.thumbnail_url.trim();
    if (custom) return custom;
    const id = parseYoutubeVideoId(form.youtube_url);
    return id ? youtubeDefaultThumbnail(id) : null;
  }, [form.youtube_url, form.thumbnail_url]);

  const parsedSortOrder = (): number | undefined => {
    const t = form.sort_order.trim();
    if (!t) return undefined;
    const n = Number(t);
    return Number.isFinite(n) ? Math.trunc(n) : undefined;
  };

  async function save() {
    setSaving(true);
    try {
      const sort_order = parsedSortOrder();
      const payload = {
        youtube_url: form.youtube_url,
        title: form.title,
        description: form.description.trim() || null,
        thumbnail_url: form.thumbnail_url.trim() || null,
        ...(sort_order !== undefined ? { sort_order } : {}),
      };

      const r = initial?.id
        ? await trackCompletionVideosApi.update(initial.id, payload)
        : await trackCompletionVideosApi.create({ track, ...payload });

      onSaved(r.data.video);
      show({
        variant: 'success',
        title: 'Saved',
        message: initial?.id ? `${label} resource updated.` : `${label} resource added.`,
      });
    } catch (err: unknown) {
      const ax = err as {
        response?: { status?: number; data?: { error?: string; code?: string } };
      };
      const code = ax.response?.data?.code;
      const serverMsg = ax.response?.data?.error;
      const status = ax.response?.status;
      let message =
        code === 'INVALID_YOUTUBE_URL'
          ? 'Enter a valid YouTube link (watch, youtu.be, embed, or shorts).'
          : code === 'SCHEMA_MULTIPLE_RESOURCES'
            ? 'Only one resource can be saved right now. Remove the existing one first, or contact support to enable multiple resources.'
            : code === 'TABLE_MISSING'
              ? 'Resources are not available yet. Please try again later or contact support.'
              : status === 403
                ? 'Your session does not have admin access. Sign out and sign in again after being granted admin.'
                : serverMsg && status && status >= 400
                  ? serverMsg
                  : 'Try again or check that you are signed in as admin.';
      show({
        variant: 'error',
        title: 'Could not save',
        message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function clear() {
    if (!initial?.id) {
      onRemoved();
      return;
    }
    show({
      variant: 'confirm',
      title: 'Remove this resource?',
      message: `Learners will no longer see this extra video for ${label}.`,
      primaryAction: {
        label: 'Remove',
        onClick: async () => {
          try {
            await trackCompletionVideosApi.delete(initial.id);
            onRemoved();
            show({ variant: 'success', title: 'Removed', message: 'Resource deleted.' });
          } catch {
            show({ variant: 'error', title: 'Error', message: 'Could not remove. Try again.' });
          }
        },
      },
    });
  }

  return (
    <div
      className={cn(
        'rounded-2xl border p-6 bg-white dark:bg-gray-900/40',
        accent === 'blue'
          ? 'border-blue-200/90 dark:border-blue-900/50'
          : 'border-teal-200/90 dark:border-teal-900/50'
      )}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {initial?.id ? 'Edit resource' : 'New resource'} · {label}
      </h2>
      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">YouTube URL</label>
          <input
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            value={form.youtube_url}
            onChange={(e) => setForm((f) => ({ ...f, youtube_url: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
          <input
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Shown above the video"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
          <textarea
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm min-h-[88px]"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Optional — supports line breaks"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Custom thumbnail URL <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            value={form.thumbnail_url}
            onChange={(e) => setForm((f) => ({ ...f, thumbnail_url: e.target.value }))}
            placeholder="Leave empty to use YouTube default"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Order <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            className="w-full max-w-[200px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
            placeholder="0, 1, 2…"
          />
        </div>
      </div>

      {previewThumb ? (
        <div className="mt-6">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Thumbnail preview</p>
          <div className="rounded-xl overflow-hidden max-w-md border border-gray-200 dark:border-gray-700 aspect-video bg-gray-100 dark:bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewThumb} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Enter a valid YouTube URL to preview the default thumbnail.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={() => void save()} loading={saving}>
          Save
        </Button>
        <Button variant="outline" onClick={() => void clear()}>
          {initial?.id ? 'Remove' : 'Discard'}
        </Button>
      </div>
    </div>
  );
}

export default function AdminTrackResourcesPage() {
  const [cppVideos, setCppVideos] = useState<TrackCompletionVideo[]>([]);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    trackCompletionVideosApi
      .list()
      .then((r) => {
        const cpp = r.data.videos.filter((v) => v.track === 'cpp');
        cpp.sort((a, b) => (a.sort_order !== b.sort_order ? a.sort_order - b.sort_order : a.id.localeCompare(b.id)));
        setCppVideos(cpp);
      })
      .catch(() => setCppVideos([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function replaceVideo(v: TrackCompletionVideo) {
    setCppVideos((prev) => {
      const others = prev.filter((x) => x.id !== v.id);
      const next = [...others, v];
      next.sort((a, b) =>
        a.sort_order !== b.sort_order ? a.sort_order - b.sort_order : a.id.localeCompare(b.id)
      );
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Optional track resources</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-2xl leading-relaxed">
        Optional YouTube videos shown after learners finish the readings. They do not affect progress or certificates.
        Lower order numbers appear first on the lessons page.
      </p>

      <div className="mb-6">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() =>
            setDraftIds((d) => [...d, typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `d-${Date.now()}`])
          }
        >
          <Plus size={18} aria-hidden />
          Add resource
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-1 max-w-xl">
        {cppVideos.map((v) => (
          <TrackForm
            key={v.id}
            track="cpp"
            label="C++ curriculum"
            accent="blue"
            initial={v}
            onSaved={replaceVideo}
            onRemoved={() => setCppVideos((prev) => prev.filter((x) => x.id !== v.id))}
          />
        ))}
        {draftIds.map((tempId) => (
          <TrackForm
            key={tempId}
            track="cpp"
            label="C++ curriculum"
            accent="blue"
            initial={undefined}
            onSaved={(video) => {
              setDraftIds((d) => d.filter((x) => x !== tempId));
              replaceVideo(video);
            }}
            onRemoved={() => setDraftIds((d) => d.filter((x) => x !== tempId))}
          />
        ))}
      </div>
    </div>
  );
}
