import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import { SidePanel } from '@/components/dashboard/SidePanel';
import { ComposeDialog } from '@/components/dashboard/ComposeDialog';
import { PageLoader } from '@/components/PageLoader';
import {
  clearSession,
  fetchSession,
  getAccessToken,
  logoutRequest,
  patchMyProfile,
  setAccessToken,
} from '@/lib/api';

function mapSessionToUser(session) {
  if (!session) {
    return null;
  }
  const roleLower = String(session.role || 'alumni').toLowerCase();
  return {
    id: session.id,
    name: session.name,
    email: session.email,
    role: roleLower === 'student' ? 'Student' : 'Alumni',
    batchLabel: session.batchLabel || '',
    initials: session.initials || '?',
    profileComplete: Boolean(session.profileComplete),
    profileProgress: typeof session.profileProgress === 'number' ? session.profileProgress : 0,
    isVerified: Boolean(session.isVerified),
  };
}

export function AuthenticatedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(min-width: 768px)').matches;
  });
  const [composerOpen, setComposerOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);

  const user = sessionUser;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!getAccessToken()) {
          if (!cancelled) {
            setSessionUser(null);
          }
          return;
        }
        const session = await fetchSession();
        if (!cancelled) {
          setSessionUser(mapSessionToUser(session));
        }
      } catch {
        clearSession();
        if (!cancelled) {
          setSessionUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }
    if (!user) {
      navigate('/login/student', { replace: true, state: { from: location.pathname } });
    }
  }, [authReady, user, navigate, location.pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia('(min-width: 768px)');
    const sync = (event) => {
      const matches = event?.matches ?? media.matches;
      setIsDesktop(matches);
      if (!matches) {
        setSidebarOpen(false);
      }
    };

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const completeProfile = useCallback(async () => {
    try {
      await patchMyProfile({ profileComplete: true });
      setSessionUser((prev) =>
        prev
          ? {
              ...prev,
              profileComplete: true,
              profileProgress: 100,
            }
          : prev,
      );
    } catch {
      setSessionUser((prev) =>
        prev
          ? {
              ...prev,
              profileComplete: true,
              profileProgress: 100,
            }
          : prev,
      );
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      clearSession();
      setAccessToken(null);
    }
    window.location.href = '/';
  }, []);

  if (!authReady || !user) {
    return <PageLoader />;
  }

  const profileComplete = user.profileComplete;
  const profileProgress = user.profileProgress;
  const isWideCanvasPage = location.pathname === '/dashboard' || location.pathname === '/directory';

  return (
    <div className="auth-shell min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#000000]" />
      </div>

      {!sidebarOpen ? (
        <button
          type="button"
          aria-label="Open sidebar"
          className="fixed left-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#2A2940] bg-[#1A1925] text-[#9694A8] transition hover:bg-[#242336] hover:text-[#E8E6F0] md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      ) : null}

      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <SidePanel
        isDesktop={isDesktop}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCompose={() => setComposerOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <main
        className={`relative z-10 min-h-screen transition-[margin] duration-300 ${
          isWideCanvasPage
            ? 'ml-0 p-0 md:ml-20'
            : 'ml-0 p-4 pb-20 pt-20 md:ml-20 md:p-6 md:pb-6 md:pt-6'
        }`}
      >
        {!user.isVerified && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-red-200">
              <span className="font-semibold text-white">Action Required:</span> Please verify your email address. Some features may be restricted.
            </div>
            <button
              type="button"
              onClick={() => navigate(`/verify-email?email=${encodeURIComponent(user.email)}`)}
              className="text-sm whitespace-nowrap bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-md transition-colors"
            >
              Verify Email
            </button>
          </div>
        )}
        <Outlet
          context={{
            user,
            profileComplete,
            profileProgress,
            completeProfile,
            openSidebar: () => setSidebarOpen(true),
            refreshSession: async () => {
              try {
                const session = await fetchSession();
                setSessionUser(mapSessionToUser(session));
              } catch {
                /* ignore */
              }
            },
          }}
        />
      </main>

      <ComposeDialog
        open={composerOpen}
        onOpenChange={setComposerOpen}
        role={user.role.toLowerCase()}
      />
    </div>
  );
}
