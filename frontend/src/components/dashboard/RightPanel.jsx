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
    <aside className="flex h-full w-full flex-col gap-8">

      {/* Profile Section */}
      <div className="flex flex-col">
        <div className="relative h-48 overflow-hidden rounded-2xl">
          <img 
            src={banner} 
            alt="" 
            className="h-full w-full object-cover" 
          />
        </div>
        <div className="relative px-2">
          {/* Avatar — light cream background, dark initials, overlapping banner */}
          <div className="absolute -top-12 left-6 flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-black bg-[#fef4e8] text-2xl font-black text-black">
            {initials}.
          </div>
          
          <div className="mt-16">
            <h3 className="text-3xl font-bold tracking-tight text-white">{displayName} .</h3>
            <p className="mt-2 text-sm text-white/60">{headline} · sd</p>
            
            <div className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              {user?.role || 'STUDENT'}
            </div>
          </div>
        </div>
      </div>

      {/* Referral Requests Section */}
      <div className="mt-4 flex flex-1 flex-col px-2">
        <ReferralsList requests={referrals} onOpenReferrals={onOpenReferrals} />
        
        {/* Open all button — light cream background */}
        <div className="mt-8">
          <button
            type="button"
            onClick={onOpenReferrals}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fef4e8] px-6 py-3 text-[13px] font-bold uppercase tracking-widest text-black transition hover:bg-[#fef4e8]/90"
          >
            OPEN ALL
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>
      </div>

    </aside>
  );
}
