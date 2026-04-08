import { ChevronRight } from 'lucide-react';
import ReferralsList from './ReferralsList';

export default function RightPanel({
  user,
  profile,
  stats,
  referrals = [],
  isCollapsed,
  onToggle,
  onOpenDirectory,
  onOpenReferrals,
}) {
  const initials = profile?.initials || user?.initials || String(user?.name || 'A').slice(0, 1).toUpperCase();
  const displayName = profile?.name || user?.name || 'Member';

  return (
    <div className={`flex flex-col gap-8 w-full relative ${isCollapsed ? 'hidden' : 'block'}`}>
      <div className="relative flex flex-col items-center text-center p-6 pt-10 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-4 right-4 text-white opacity-50 hover:opacity-100 transition-opacity bg-white/10 p-1.5 rounded-full hover:bg-white/20 z-10"
          title="Collapse Panel"
        >
          <ChevronRight size={18} />
        </button>
        <div className="relative">
          <div className="w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-[#101010]">
            <span className="text-[#101010] font-black text-5xl">{initials}</span>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-widest leading-none border border-black/10">
            {user?.role || 'Member'}
          </div>
        </div>
        <h3 className="mt-6 font-bold text-white text-xl tracking-tight leading-none">{displayName}</h3>
        <p className="mt-2 text-sm text-white/60">{profile?.headline || user?.email || 'Alumni Sangham'}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 h-[220px]">
        <button
          type="button"
          onClick={onOpenDirectory}
          className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg border border-gray-100 hover:scale-[1.02] transition-transform"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full mb-3 shadow-inner" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-[1.1] mb-2">Alumni<br/>Directory</p>
          <p className="text-black font-black text-xl mb-2">{stats.directoryCount}</p>
          <p className="text-[9px] text-gray-500 font-light leading-tight">reachable mentors this week</p>
        </button>

        <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg border border-gray-100 hover:scale-[1.02] transition-transform">
          <div className="w-8 h-8 bg-gray-200 rounded-full mb-3 shadow-inner" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-[1.1] mb-2">Hall of<br/>Fame</p>
          <p className="text-black font-black text-xl mb-2">{stats.hallOfFameCount}</p>
          <p className="text-[9px] text-gray-500 font-light leading-tight">stories driving the most attention</p>
        </div>

        <button
          type="button"
          onClick={onOpenReferrals}
          className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg border border-gray-100 hover:scale-[1.02] transition-transform"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full mb-3 shadow-inner" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-[1.1] mb-2">Referral<br/>Requests</p>
          <p className="text-black font-black text-xl mb-2">{stats.referralCount}</p>
          <p className="text-[9px] text-gray-500 font-light leading-tight">open asks waiting for alumni support</p>
        </button>
      </div>

      <ReferralsList requests={referrals} onOpenReferrals={onOpenReferrals} />
    </div>
  );
}
