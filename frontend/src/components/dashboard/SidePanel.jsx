import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard.js';
import Users from 'lucide-react/dist/esm/icons/users.js';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper.js';
import Handshake from 'lucide-react/dist/esm/icons/handshake.js';
import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navLinks = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    isActive: (location) => location.pathname === '/dashboard',
  },
  {
    label: 'Directory',
    href: '/directory',
    icon: Users,
    isActive: (location) => location.pathname === '/directory',
  },
  {
    label: 'Blogs',
    href: '/blog?tab=posts',
    icon: Newspaper,
    isActive: (location) => location.pathname === '/blog',
  },
  {
    label: 'Referrals',
    href: '/referrals',
    icon: Handshake,
    isActive: (location) => location.pathname === '/referrals',
  },
];

export function SidePanel({ isDesktop, sidebarOpen, onClose, user }) {
  const location = useLocation();
  const [hovered, setHovered] = React.useState(false);
  const expanded = hovered || (!isDesktop && sidebarOpen);
  const showLabels = expanded || !isDesktop;

  return (
    <Sidebar
      mobileOpen={sidebarOpen}
      expanded={expanded}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border-r-0 bg-[#000000]"
    >
      <div
        className={cn(
          'flex h-full flex-col items-center overflow-hidden bg-[#000000] py-6 transition-all duration-300 ease-in-out',
          expanded ? 'px-5' : 'px-0',
        )}
      >
        <div className="mb-12 flex w-full items-center px-5 flex-shrink-0">
          <Link to="/dashboard" onClick={onClose} className="flex items-center">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-white/10">
              <span className="text-2xl font-black text-white">A</span>
            </div>
            <span
              className={cn(
                'ml-3 whitespace-nowrap text-xl font-bold tracking-tight text-white transition-all duration-200',
                showLabels ? 'opacity-100' : 'opacity-0',
              )}
            >
              Alumni
            </span>
          </Link>
        </div>

        <nav className="flex w-full flex-1 flex-col gap-8 px-5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = item.isActive(location);
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={onClose}
                className="flex items-center gap-4 group"
              >
                <div
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    active ? 'text-white' : 'text-white/60 group-hover:text-white',
                  )}
                >
                  <Icon size={22} />
                </div>
                <span
                  className={cn(
                    'whitespace-nowrap text-sm font-medium transition-all duration-200',
                    active ? 'text-white' : 'text-white/60 group-hover:text-white',
                    showLabels ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="w-full px-5 pb-4">
          <Link
            to="/profile/me"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 transition hover:bg-white/[0.08]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
              {user?.initials || 'A'}
            </div>
            <div
              className={cn(
                'min-w-0 transition-all duration-200',
                showLabels ? 'opacity-100' : 'pointer-events-none w-0 overflow-hidden opacity-0',
              )}
            >
              <div className="truncate text-sm font-medium text-white">{user?.name || 'Profile'}</div>
              <div className="truncate text-xs text-white/50">
                {[user?.role, user?.batchLabel].filter(Boolean).join(' · ') || 'Open profile'}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Sidebar>
  );
}
