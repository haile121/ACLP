'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  /** Shown on server and before mount (avoids hydration mismatch). */
  fallback?: ReactNode;
}

/**
 * Renders children only after mount so this subtree is not hydrated from SSR.
 * Prevents hydration mismatches when extensions inject attributes (e.g. bis_skin_checked)
 * into the DOM before React hydrates.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
