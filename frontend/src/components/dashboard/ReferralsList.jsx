import { Link } from 'react-router-dom';
import { ArrowUpRight, UserPlus } from 'lucide-react';

function statusStyles(status) {
  if (/accepted/i.test(status)) {
    return 'text-emerald-300';
  }
  if (/declined/i.test(status)) {
    return 'text-red-300';
  }
  return 'text-[#f5eee8]';
}

export default function ReferralsList({ requests = [], onOpenReferrals }) {
  return (
    <div className="flex max-h-[520px] flex-col">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="flex-1 text-xl font-black tracking-normal text-white">Referral Requests</h3>
        <UserPlus className="h-5 w-5 text-white/45" />
      </div>

      <div className="overflow-y-auto pr-1">
        {requests.length ? (
          requests.map((referral) => (
            <div
              key={`${referral.name}-${referral.target}`}
              className="group grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-t border-white/10 py-4 last:border-b"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5eee8] text-xs font-black text-black">
                {String(referral.name || '?')
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0] || '')
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                {referral.profileKey ? (
                  <Link
                    to={`/profile/${referral.profileKey}`}
                    className="truncate text-sm font-bold text-white transition hover:text-[#f5eee8]"
                  >
                    {referral.name}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenReferrals}
                    className="truncate text-left text-sm font-bold text-white transition hover:text-[#f5eee8]"
                  >
                    {referral.name}
                  </button>
                )}
                <p className="mt-1 truncate text-xs text-white/45">{referral.target || referral.meta}</p>
              </div>
              <div className={`whitespace-nowrap text-[10px] font-black uppercase tracking-[0.16em] ${statusStyles(referral.status)}`}>
                {referral.status}
              </div>
            </div>
          ))
        ) : (
          <div className="border-t border-white/10 py-5 text-sm text-white/45">
            No referral activity yet.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenReferrals}
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-[8px] bg-[#f5eee8] px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
      >
        Open all
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}
