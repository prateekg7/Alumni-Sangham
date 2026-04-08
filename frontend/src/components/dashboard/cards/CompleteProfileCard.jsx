export default function CompleteProfileCard({
  user,
  profileProgress = 0,
  profileComplete = false,
  onOpenProfile,
  onOpenDirectory,
}) {
  const initials = user?.initials || String(user?.name || 'A').slice(0, 1).toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-100 pb-2">
        {profileComplete ? 'Profile Ready' : 'Complete Your Profile'}
      </h3>

      <div className="flex gap-6 flex-1">
        <div className="flex-shrink-0">
          <div className="w-28 h-36 bg-gray-200 rounded-xl shadow-inner border border-gray-100 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-black text-black">
              {initials}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              {profileComplete
                ? 'Your profile is visible across the network. Keep your resume and details current for better discovery.'
                : 'Finish the missing details to stay updated and unlock full networking features.'}
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${profileProgress}%` }} />
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {profileProgress}% complete
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenProfile}
            className="w-full py-3 bg-yellow-400 text-black font-bold text-xs rounded-xl shadow-md hover:bg-yellow-500 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wider"
          >
            {profileComplete ? 'View Profile' : 'Complete Profile'}
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onOpenDirectory}
            className="py-3.5 bg-yellow-400 text-black text-[10px] font-black rounded-xl shadow-sm hover:shadow-md transition-all tracking-[0.2em]"
          >
            DIRECTORY
          </button>
          <button
            type="button"
            onClick={onOpenProfile}
            className="py-3.5 bg-gray-100 text-gray-600 text-[10px] font-black rounded-xl hover:bg-gray-200 transition-all tracking-[0.2em]"
          >
            PROFILE
          </button>
        </div>
      </div>
    </div>
  );
}
