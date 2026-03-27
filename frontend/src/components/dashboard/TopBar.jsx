import React from 'react';
import { Link } from 'react-router-dom';
import Bell from 'lucide-react/dist/esm/icons/bell.js';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import Search from 'lucide-react/dist/esm/icons/search.js';
import Settings from 'lucide-react/dist/esm/icons/settings.js';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles.js';
import { Button } from '@/components/ui/button';

export function TopBar({ user, onSidebarToggle }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[#060a16]/88 backdrop-blur-2xl">
      <div className="flex h-full items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <button
            type="button"
            aria-label="Open sidebar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08] md:hidden"
            onClick={onSidebarToggle}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8f7dff] via-[#7259ff] to-[#4c7dff] shadow-[0_10px_30px_rgba(109,92,255,0.35)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-sm font-semibold tracking-[0.22em] text-white/60 uppercase">Alumni Sangham</div>
              <div className="truncate text-xs text-white/40">Midnight dashboard workspace</div>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center px-4 lg:flex">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <Search className="h-4 w-4 text-white/45" />
            <input
              type="text"
              placeholder="Search dashboard, alumni, articles..."
              className="w-full border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#937fff] to-[#4f7fff] text-xs font-semibold text-white">
              {user.initials}
            </div>
            <div className="hidden text-left xl:block">
              <div className="text-sm font-semibold text-white">{user.name}</div>
              <div className="text-xs text-white/45">
                {user.role} · {user.batchLabel}
              </div>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-white/45 xl:block" />
          </div>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#a28bff] shadow-[0_0_12px_rgba(162,139,255,0.8)]" />
          </button>

          <button
            type="button"
            className="hidden h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white md:inline-flex"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </button>

          <Button className="h-10 rounded-2xl border-0 bg-gradient-to-r from-[#c2b5ff] to-[#8d79ff] px-5 text-sm font-semibold text-[#120f25] shadow-[0_14px_34px_rgba(129,103,255,0.35)] hover:from-[#d4caff] hover:to-[#9f8cff]">
            Deposit
          </Button>
        </div>
      </div>
    </header>
  );
}
