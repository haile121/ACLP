'use client';

import { useEffect, useState, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { Navbar } from './Navbar';
import { NavbarShell } from './NavbarShell';
import { Sidebar } from './Sidebar';
import { ClientOnly } from '@/components/ClientOnly';
import { cn } from '@/lib/cn';
import { authApi } from '@/lib/api';
import { useGamificationRefresh } from '@/lib/gamificationRefresh';
import { requestNotificationRefresh } from '@/lib/notificationUnread';
import { useAuthSession } from '@/lib/useAuthSession';
import { useNotificationUnreadCount } from '@/lib/useNotificationUnreadCount';
import { NotificationAlerts } from '@/components/notifications/NotificationAlerts';
import type { User } from '@/types';

interface LayoutWrapperProps {
  children: ReactNode;
  variant: 'auth' | 'admin';
}

/** Full-width routes: no sidebar (e.g. diagnostic assessment after sign-up). */
function isFullBleedAuthRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === '/assessment' || pathname.startsWith('/assessment/');
}

export function ClientLayoutWrapper({ children, variant }: LayoutWrapperProps) {
  const pathname = usePathname();
  const fullBleed = isFullBleedAuthRoute(pathname);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { ready: sessionReady, authenticated: sessionAuthenticated } = useAuthSession();

  const notificationsEnabled = variant === 'auth' && sessionReady && sessionAuthenticated;
  const unreadNotifications = useNotificationUnreadCount(notificationsEnabled);

  const loadMe = useCallback(async () => {
    if (!Cookies.get('logged_in')) {
      setUser(null);
      return;
    }
    try {
      const res = await authApi.me();
      setUser(res.data.user);
      requestNotificationRefresh();
    } catch {
      Cookies.remove('logged_in');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useGamificationRefresh(loadMe);

  const mainClassName = cn(
    'pt-16 min-h-screen transition-all duration-300 ease-in-out will-change-[margin]',
    fullBleed ? 'w-full max-w-none lg:ml-0' : isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
  );

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-[#06060c] font-sans selection:bg-accent/30 selection:text-accent"
      suppressHydrationWarning
    >
      <ClientOnly
        fallback={
          <>
            <NavbarShell />
            <main className={mainClassName} suppressHydrationWarning />
          </>
        }
      >
        <>
          {notificationsEnabled && <NotificationAlerts enabled />}
          <Navbar
            variant={variant}
            unreadCount={notificationsEnabled ? unreadNotifications : 0}
            userName={user?.display_name}
            userInitial={user?.display_name?.trim()?.[0]?.toUpperCase()}
          />
          {!fullBleed && (
            <Sidebar
              variant={variant}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              showAdminLink={variant === 'auth' && user?.role === 'admin'}
            />
          )}
          <main suppressHydrationWarning className={mainClassName}>
            {children}
          </main>
        </>
      </ClientOnly>
    </div>
  );
}
