import { Link } from 'react-router-dom';
import { ArrowUpRight, UserPlus } from 'lucide-react';

function statusStyles(status) {
  if (/accepted/i.test(status)) {
    return 'text-emerald-300';
  }
  if (/declined/i.test(status)) {
    return 'text-red-300';
  }
  return 'text-white/70';
}

export default function ReferralsList({ requests = [], onOpenReferrals }) {
  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-3xl font-bold tracking-tight text-white">Referral Requests</h3>
        <UserPlus className="h-6 w-6 text-white/30" />
      </div>

      <div className="border-t border-white/10" />

      <div className="mt-6 overflow-y-auto">
        {requests.length ? (
          requests.map((referral) => (
            <div
              key={`${referral.name}-${referral.target}`}
              className="group grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 py-4"
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                {String(referral.name || '?')
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0] || '')
                  .join('')
                  .toUpperCase()}
              </div>

              {/* Name + meta */}
              <div className="min-w-0">
                {referral.profileKey ? (
                  <Link
                    to={`/profile/${referral.profileKey}`}
                    className="truncate text-sm font-semibold text-white transition hover:text-white/80"
                  >
                    {referral.name}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenReferrals}
                    className="truncate text-left text-sm font-semibold text-white transition hover:text-white/80"
                  >
                    {referral.name}
                  </button>
                )}
                <p className="mt-0.5 truncate text-xs text-white/45">{referral.target || referral.meta}</p>
              </div>

              {/* Status */}
              <div className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] ${statusStyles(referral.status)}`}>
                {referral.status}
              </div>
            </div>
          ))
        ) : (
          <div className="py-2 text-[17px] text-white/40">
            No referral activity yet.
          </div>
        )}
      </div>
    </div>
  );
}
