import { UserPlus, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const REFERRALS = [
  {
    id: 1,
    name: 'Alex Thompson',
    role: 'Software Engineer',
    status: 'pending',
    avatar: 'AT',
  },
  {
    id: 2,
    name: 'Jordan Smith',
    role: 'Product Manager',
    status: 'accepted',
    avatar: 'JS',
  },
  {
    id: 3,
    name: 'Casey Williams',
    role: 'Design Lead',
    status: 'pending',
    avatar: 'CW',
  },
  {
    id: 4,
    name: 'Morgan Davis',
    role: 'Data Scientist',
    status: 'declined',
    avatar: 'MD',
  },
];

export default function ReferralsList() {
  const [referrals] = useState(REFERRALS);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'declined':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col max-h-[460px]">
      <div className="flex items-center gap-2 mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-50">
        <h3 className="text-lg font-bold text-black flex-1">Your Referrals</h3>
        <UserPlus className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {referrals.map((referral) => (
          <div key={referral.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100 group">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-xs font-black text-black">{referral.avatar}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-black truncate leading-none mb-1">{referral.name}</p>
                <p className="text-[11px] text-gray-500 font-light truncate">{referral.role}</p>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border whitespace-nowrap flex-shrink-0 ml-3 shadow-sm ${getStatusStyles(referral.status)}`}>
              {getStatusLabel(referral.status)}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-3.5 text-xs font-bold text-yellow-600 border-2 border-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
        Refer Someone
      </button>
    </div>
  );
}
