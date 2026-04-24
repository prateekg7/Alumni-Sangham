import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard.js';
import Users from 'lucide-react/dist/esm/icons/users.js';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper.js';
import Handshake from 'lucide-react/dist/esm/icons/handshake.js';
import LogOut from 'lucide-react/dist/esm/icons/log-out.js';
import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';
import { fetchPendingReferralCount, resolvePublicAssetUrl } from '@/lib/api';

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

export function SidePanel({ isDesktop, sidebarOpen, onClose, user, onLogout }) {
  const location = useLocation();
  const [hovered, setHovered] = React.useState(false);
  const [pendingReferrals, setPendingReferrals] = React.useState(0);
  const expanded = hovered || (!isDesktop && sidebarOpen);
  const showLabels = expanded || !isDesktop;

  React.useEffect(() => {
    let cancelled = false;
    fetchPendingReferralCount()
      .then((data) => {
        if (!cancelled && typeof data?.count === 'number') {
          setPendingReferrals(data.count);
        }
      })
      .catch(() => { /* ignore */ });
    return () => { cancelled = true; };
  }, [location.pathname]);

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
        <div className={cn("mb-12 flex w-full flex-shrink-0 items-center", expanded ? "px-5 justify-start" : "justify-center")}>
          <Link to="/" onClick={onClose} className={cn("flex items-center", expanded ? "gap-3" : "justify-center")}>
            <Home size={22} color="white" />
            <span
              className={cn(
                'whitespace-nowrap text-xl font-bold tracking-tight text-white transition-all duration-200',
                showLabels ? 'opacity-100' : 'hidden md:block md:w-0 md:opacity-0',
              )}
            >
              Home
            </span>
          </Link>
        </div>

        <nav className={cn("flex w-full flex-1 flex-col gap-8", expanded ? "px-5" : "items-center")}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = item.isActive(location);
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={onClose}
                className={cn("flex items-center group", expanded ? "gap-4" : "justify-center")}
              >
                <div
                  className={cn(
                    'relative flex-shrink-0 transition-colors',
                    active ? 'text-white' : 'text-white/60 group-hover:text-white',
                  )}
                >
                  <Icon size={22} />
                  {item.label === 'Referrals' && pendingReferrals > 0 && !expanded ? (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow">
                      {pendingReferrals > 9 ? '9+' : pendingReferrals}
                    </span>
                  ) : null}
                </div>
                <span
                  className={cn(
                    'whitespace-nowrap text-sm font-medium transition-all duration-200',
                    active ? 'text-white' : 'text-white/60 group-hover:text-white',
                    showLabels ? 'opacity-100' : 'hidden md:block md:w-0 md:opacity-0',
                  )}
                >
                  {item.label}
                  {item.label === 'Referrals' && pendingReferrals > 0 && expanded ? (
                    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {pendingReferrals > 9 ? '9+' : pendingReferrals}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={cn("w-full pb-4 flex flex-col gap-2", expanded ? "px-5" : "items-center")}>
          <Link
            to="/profile/me"
            onClick={onClose}
            className={cn(
              "flex items-center transition",
              expanded ? "gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 hover:bg-white/[0.08]" : "hover:opacity-70"
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white overflow-hidden">
              {user?.profilePhoto ? (
                <img src={resolvePublicAssetUrl(user.profilePhoto)} alt={user?.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling.style.display = 'flex'); }} />
              ) : null}
              <span className={`items-center justify-center h-full w-full ${user?.profilePhoto ? 'hidden' : 'flex'}`}>{user?.initials || 'A'}</span>
            </div>
            <div
              className={cn(
                'min-w-0 transition-all duration-200',
                showLabels ? 'opacity-100' : 'hidden md:block md:pointer-events-none md:w-0 md:opacity-0 overflow-hidden',
              )}
            >
              <div className="truncate text-sm font-medium text-white">{user?.name || 'Profile'}</div>
              <div className="truncate text-xs text-white/50">
                {[user?.role, user?.batchLabel].filter(Boolean).join(' · ') || 'Open profile'}
              </div>
            </div>
          </Link>

          <button
            onClick={() => {
              if (onLogout) onLogout();
              onClose();
            }}
            className={cn(
              "flex items-center transition text-red-500 group",
              expanded ? "gap-3 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-3 py-3 hover:bg-red-500/[0.08] w-full" : "hover:opacity-70"
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 transition-colors group-hover:bg-red-500/20">
              <LogOut size={18} />
            </div>
            <div
              className={cn(
                'min-w-0 transition-all duration-200 text-left',
                showLabels ? 'opacity-100' : 'hidden md:block md:pointer-events-none md:w-0 md:opacity-0 overflow-hidden',
              )}
            >
              <div className="truncate text-sm font-medium">Logout</div>
            </div>
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
