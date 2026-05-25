'use client';

import { useEffect, useState } from 'react';

interface ClientFormattedDateProps {
  iso: string;
  className?: string;
}

/** Formats dates only after mount so server and client never disagree. */
export function ClientFormattedDate({ iso, className }: ClientFormattedDateProps) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    setLabel(
      new Date(iso).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
      })
    );
  }, [iso]);

  return (
    <span className={className} suppressHydrationWarning>
      {label || '\u00a0'}
    </span>
  );
}
