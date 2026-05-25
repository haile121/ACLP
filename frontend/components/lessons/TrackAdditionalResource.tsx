'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import type { TrackCompletionVideo } from '@/lib/api';
import { cn } from '@/lib/cn';

function SingleOptionalVideo({ video }: { video: TrackCompletionVideo }) {
  const [playing, setPlaying] = useState(false);

  if (!video.embed_url) return null;

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 mt-4 overflow-hidden',
        'border-blue-200/90 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-950/25 dark:to-gray-900/40'
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
        Optional — additional resource
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Extra material if you want to go deeper. You can skip this anytime.
      </p>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{video.title}</h3>
      {video.description ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed whitespace-pre-wrap">
          {video.description}
        </p>
      ) : null}

      <div className="mt-4 rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 ring-1 ring-black/5 dark:ring-white/10">
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="relative block w-full aspect-video group text-left"
            aria-label="Play optional additional resource video"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.preview_thumbnail_url} alt="" className="w-full h-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/45 transition-colors">
              <span
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full shadow-lg',
                  'bg-blue-600 text-white'
                )}
              >
                <Play className="h-8 w-8 ml-1" fill="currentColor" aria-hidden />
              </span>
            </span>
          </button>
        ) : (
          <iframe
            title={video.title}
            src={`${video.embed_url}?rel=0`}
            className="w-full aspect-video border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

/** Optional YouTube resources for a track (admin-configured); learners may ignore them. */
export function TrackAdditionalResource({
  unlocked,
  videos,
}: {
  unlocked: boolean;
  videos: TrackCompletionVideo[];
}) {
  if (!unlocked || videos.length === 0) return null;

  return (
    <div className="space-y-0">
      {videos.map((video) => (
        <SingleOptionalVideo key={video.id} video={video} />
      ))}
    </div>
  );
}
