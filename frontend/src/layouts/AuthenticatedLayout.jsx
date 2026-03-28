import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import { SidePanel } from '@/components/dashboard/SidePanel';
import { ComposeDialog } from '@/components/dashboard/ComposeDialog';

const DEMO_USERS = {
  alumni: {
    name: 'Ryan Crawford',
    role: 'Alumni',
    batchLabel: "Batch '19",
    email: 'ryan.crawford@alumni.iitp.ac.in',
    initials: 'RC',
  },
  student: {
    name: 'Aarav Sinha',
    role: 'Student',
    batchLabel: "Batch '27",
    email: 'aarav.sinha@iitp.ac.in',
    initials: 'AS',
  },
};

export function AuthenticatedLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(min-width: 768px)').matches;
  });
  const [composerOpen, setComposerOpen] = useState(false);
  const [role] = useState(() => {
    if (typeof window === 'undefined') {
      return 'alumni';
    }

    const storedRole = window.localStorage.getItem('alumni-sangham-demo-role');
    return storedRole === 'student' ? 'student' : 'alumni';
  });
  const [profileComplete, setProfileComplete] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(`alumni-sangham-profile-complete:${role}`) === 'true';
  });

  const profileProgress = profileComplete ? 100 : role === 'student' ? 72 : 81;
  const user = {
    ...DEMO_USERS[role],
    profileComplete,
    profileProgress,
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      `alumni-sangham-profile-complete:${role}`,
      profileComplete ? 'true' : 'false',
    );
  }, [profileComplete, role]);

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

  return (
    <div className="auth-shell min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#0F0E17]" />
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
      />

      <main className="relative z-10 ml-0 min-h-screen p-4 pb-20 pt-20 transition-[margin] duration-300 md:ml-20 md:p-6 md:pb-6 md:pt-6">
        <Outlet
          context={{
            user,
            profileComplete,
            profileProgress,
            completeProfile: () => setProfileComplete(true),
            openSidebar: () => setSidebarOpen(true),
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
