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
  const banner =
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80';

  return (
    <aside className="flex w-full flex-col gap-8 bg-black text-white">
      <div>
        <div className="relative h-40 overflow-hidden rounded-[8px]">
          <img src={banner} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        </div>
        <div className="-mt-10 px-5">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-[#f5eee8] text-2xl font-black text-black">
            {initials}
          </div>
          <h3 className="mt-4 text-2xl font-black leading-none tracking-normal">{displayName}</h3>
          <p className="mt-2 text-sm leading-6 text-white/58">{headline}</p>
          <div className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/48">
            {user?.role || 'Member'}
          </div>
        </div>
      </div>

      <ReferralsList requests={referrals} onOpenReferrals={onOpenReferrals} />
    </aside>
  );
}
