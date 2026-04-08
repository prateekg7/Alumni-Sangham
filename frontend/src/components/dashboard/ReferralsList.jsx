import { UserPlus } from 'lucide-react';

function statusStyles(status) {
  if (/accepted/i.test(status)) {
    return 'bg-green-100 text-green-700 border-green-200';
  }
  if (/declined/i.test(status)) {
    return 'bg-red-50 text-red-600 border-red-100';
  }
  return 'bg-yellow-100 text-yellow-700 border-yellow-200';
}

export default function ReferralsList({ requests = [], onOpenReferrals }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col max-h-[460px]">
      <div className="flex items-center gap-2 mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-50">
        <h3 className="text-lg font-bold text-black flex-1">Your Referrals</h3>
        <UserPlus className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {requests.length ? (
          requests.map((referral) => (
            <div key={`${referral.name}-${referral.target}`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100 group">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-xs font-black text-black">
                    {String(referral.name || '?')
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0] || '')
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-black truncate leading-none mb-1">{referral.name}</p>
                  <p className="text-[11px] text-gray-500 font-light truncate">{referral.target}</p>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border whitespace-nowrap flex-shrink-0 ml-3 shadow-sm ${statusStyles(referral.status)}`}>
                {referral.status}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
            No referral activity yet.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenReferrals}
        className="w-full mt-6 py-3.5 text-xs font-bold text-yellow-600 border-2 border-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
      >
        Open Referral Requests
      </button>
    </div>
  );
}
