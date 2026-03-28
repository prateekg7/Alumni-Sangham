import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CirclePlus from 'lucide-react/dist/esm/icons/circle-plus.js';
import Handshake from 'lucide-react/dist/esm/icons/handshake.js';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard.js';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper.js';
import Settings from 'lucide-react/dist/esm/icons/settings.js';
import SquarePen from 'lucide-react/dist/esm/icons/square-pen.js';
import Trophy from 'lucide-react/dist/esm/icons/trophy.js';
import Users from 'lucide-react/dist/esm/icons/users.js';
import { motion } from 'framer-motion';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';

const baseLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px] stroke-[1.5]" /> },
  { label: 'Networking', href: '/directory', icon: <Users className="h-[18px] w-[18px] stroke-[1.5]" /> },
  { label: 'Posts & Jobs', href: '/blog', icon: <Newspaper className="h-[18px] w-[18px] stroke-[1.5]" /> },
  { label: 'Hall of Fame', href: '/', hash: 'hall-of-fame', icon: <Trophy className="h-[18px] w-[18px] stroke-[1.5]" /> },
];

const roleLinks = {
  alumni: [
    { label: 'Create Post', action: 'compose', icon: <CirclePlus className="h-[18px] w-[18px] stroke-[1.5]" /> },
    { label: 'Referral Requests', href: '/profile/me?tab=referrals', icon: <Handshake className="h-[18px] w-[18px] stroke-[1.5]" /> },
  ],
  student: [
    { label: 'Write Article', action: 'compose', icon: <SquarePen className="h-[18px] w-[18px] stroke-[1.5]" /> },
    { label: 'My Requests', href: '/profile/me?tab=referrals', icon: <Handshake className="h-[18px] w-[18px] stroke-[1.5]" /> },
  ],
};

function Logo() {
  return (
    <Link to="/dashboard" className="relative z-20 flex items-center space-x-3 py-1 text-sm font-normal text-[#E8E6F0]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#2A2940] bg-[#0F0E17] text-xs font-semibold text-[#6C63FF]">
        AC
      </div>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre font-medium text-[#E8E6F0]">
        Alumni Sangham
      </motion.span>
    </Link>
  );
}

function LogoIcon() {
  return (
    <Link to="/dashboard" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-[#E8E6F0]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#2A2940] bg-[#0F0E17] text-xs font-semibold text-[#6C63FF]">
        AC
      </div>
    </Link>
  );
}

export function SidePanel({ isDesktop, sidebarOpen, onClose, onCompose, user, onLogout }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roleKey = user.role.toLowerCase() === 'student' ? 'student' : 'alumni';
  const [hovered, setHovered] = useState(false);
  const panelExpanded = isDesktop ? hovered : sidebarOpen;

  const isActive = (href) => {
    if (href === '/directory') {
      return location.pathname === '/directory';
    }

    if (href.includes('?tab=referrals')) {
      return location.pathname === '/profile/me' && searchParams.get('tab') === 'referrals';
    }

    return location.pathname === href;
  };

  return (
    <Sidebar
      mobileOpen={sidebarOpen}
      expanded={panelExpanded}
      onMouseEnter={isDesktop ? () => setHovered(true) : undefined}
      onMouseLeave={isDesktop ? () => setHovered(false) : undefined}
    >
      <SidebarBody className="justify-between gap-8">
        <div className="flex flex-1 flex-col overflow-hidden">
          {panelExpanded ? <Logo /> : <LogoIcon />}

          <div className="mt-6 rounded-lg border border-[#2A2940] bg-[#0F0E17] p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5D5B71]">Workspace</div>
            <motion.div
              animate={{ opacity: panelExpanded ? 1 : 0, height: panelExpanded ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 text-sm font-semibold text-[#E8E6F0]">IIT Patna alumni network</div>
              <div className="mt-1 text-sm text-[#9694A8]">Profiles, referrals, posts, jobs, and community discovery.</div>
            </motion.div>
          </div>

          <div className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
            {baseLinks.map((item) => (
              <SidebarLink
                key={item.label}
                link={item}
                active={isActive(item.href)}
                compact={!panelExpanded}
                onClick={onClose}
              />
            ))}

            <div className="mx-3 my-3 h-px bg-[#2A2940]" />

            {roleLinks[roleKey].map((item) => (
              <SidebarLink
                key={item.label}
                link={item}
                active={false}
                compact={!panelExpanded}
                onClick={
                  item.action === 'compose'
                    ? () => {
                        onCompose();
                        onClose();
                      }
                    : onClose
                }
              />
            ))}
          </div>
        </div>

        <div>
          <SidebarLink
            link={{
              label: user.name,
              href: '/profile/me',
              icon: (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6C63FF]/15 text-[10px] font-semibold text-[#6C63FF]">
                  {user.initials}
                </div>
              ),
            }}
            active={location.pathname === '/profile/me' && searchParams.get('tab') !== 'referrals'}
            compact={!panelExpanded}
            className="bg-[#0F0E17]"
            onClick={onClose}
          />

          <motion.div
            animate={{ opacity: panelExpanded ? 1 : 0, height: panelExpanded ? 'auto' : 0 }}
            className="mx-3 mt-3 overflow-hidden rounded-lg border border-[#2A2940] bg-[#0F0E17]"
          >
            <div className="p-3">
              <div className="text-sm font-semibold text-[#E8E6F0]">{user.name}</div>
              <div className="mt-1 text-xs text-[#9694A8]">
                {user.role} · {user.batchLabel}
              </div>
              <div className="mt-2 truncate text-xs text-[#5D5B71]">{user.email}</div>
            </div>
          </motion.div>

          <Link
            to="/profile/me"
            className="mx-3 mt-3 inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm text-[#9694A8] transition hover:bg-[#242336] hover:text-[#E8E6F0]"
            onClick={onClose}
          >
            <Settings className="h-[18px] w-[18px] stroke-[1.5]" />
            <motion.span
              animate={{ opacity: panelExpanded ? 1 : 0, width: panelExpanded ? 'auto' : 0, marginLeft: panelExpanded ? 0 : -4 }}
              className="overflow-hidden whitespace-nowrap"
            >
              Settings
            </motion.span>
          </Link>

          {onLogout ? (
            <button
              type="button"
              className="mx-3 mt-1 w-[calc(100%-1.5rem)] rounded-md px-4 py-3 text-left text-sm text-[#9694A8] transition hover:bg-[#242336] hover:text-[#E8E6F0]"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <motion.span
                animate={{ opacity: panelExpanded ? 1 : 0 }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                Log out
              </motion.span>
            </button>
          ) : null}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
