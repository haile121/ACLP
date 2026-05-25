'use client';

import { cn } from '@/lib/cn';

type BadgeIconProps = {
  emoji?: string | null;
  iconUrl?: string | null;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClass = {
  sm: 'h-10 w-10 text-lg',
  md: 'h-12 w-12 text-2xl',
  lg: 'h-14 w-14 text-3xl',
};

/** Renders emoji tile, remote/local image, or default medal. */
export function BadgeIcon({ emoji, iconUrl, label, size = 'md', className }: BadgeIconProps) {
  const base = cn(
    'shrink-0 flex items-center justify-center rounded-xl border border-gray-200/80 dark:border-white/10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/15 dark:to-orange-500/10 shadow-inner',
    sizeClass[size],
    className
  );

  if (emoji?.trim()) {
    return (
      <span className={base} role="img" aria-label={label}>
        {emoji.trim()}
      </span>
    );
  }
  const url = iconUrl?.trim();
  if (url) {
    return <img src={url} alt={label} className={cn(base, 'object-contain p-1 bg-white dark:bg-gray-900')} />;
  }
  return (
    <span className={base} role="img" aria-label={label}>
      🏅
    </span>
  );
}
