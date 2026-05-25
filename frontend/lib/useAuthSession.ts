'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

/** Resolves whether the httpOnly session cookie is valid (not just the logged_in flag). */
export function useAuthSession(): { ready: boolean; authenticated: boolean } {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authApi
      .session()
      .then((res) => {
        if (!cancelled) setAuthenticated(Boolean(res.data.authenticated));
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(false);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, authenticated };
}
