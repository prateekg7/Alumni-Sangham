import { ArrowUpRight } from 'lucide-react';
import ReferralsList from './ReferralsList';

export default function RightPanel({
  user,
  profile,
  referrals = [],
  onOpenReferrals,
}) {
  const initials = profile?.initials || user?.initials || String(user?.name || 'A').slice(0, 1).toUpperCase();
  const displayName = profile?.name || user?.name || 'Member';
  const headline = profile?.headline || user?.email || 'Alumni Sangham';
  const banner = '/profile_banner_v2.jpg';

  return (
    <aside className="flex h-full w-full flex-col gap-4">

      {/* Profile card — beige */}
      <div className="db-card db-card--beige overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={banner} 
            alt="" 
            className="h-full w-full object-cover object-bottom transition-transform duration-500" 
          />
          
          {/* Very subtle fade only at the bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#ede0ce] to-transparent" />
        </div>
        <div className="-mt-10 px-5 pb-5">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#ede0ce] bg-[#2c1a0e] text-xl font-black text-[#f0e2cc]">
            {initials}
          </div>
          <h3 className="mt-3 text-xl font-black leading-none text-[#2c1a0e]">{displayName}</h3>
          <p className="mt-1.5 text-sm leading-6 text-[#2c1a0e]/55">{headline}</p>
          <div className="mt-3 inline-flex rounded-full bg-[#2c1a0e]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2c1a0e]/55">
            {user?.role || 'Member'}
          </div>
        </div>
      </div>

      {/* Referral requests — navy, now fills remaining height */}
      <div className="db-card db-card--navy flex flex-1 flex-col overflow-hidden p-5 pb-4">
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <ReferralsList requests={referrals} onOpenReferrals={onOpenReferrals} />
        </div>
        
        {/* Open all button — now at the bottom as requested */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onOpenReferrals}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/18"
          >
            Open all activity
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}
