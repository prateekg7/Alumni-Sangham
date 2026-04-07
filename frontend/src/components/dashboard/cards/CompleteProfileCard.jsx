export default function CompleteProfileCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-100 pb-2">Complete Your Profile</h3>

      <div className="flex gap-6 flex-1">
        <div className="flex-shrink-0">
          <div className="w-28 h-36 bg-gray-200 rounded-xl shadow-inner border border-gray-100 flex items-center justify-center">
             <span className="text-gray-300 transform -rotate-45 font-light italic">Avatar</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between py-2">
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Finish the missing details to stay updated and unlock full networking features.
          </p>

          <button className="w-full py-3 bg-yellow-400 text-black font-bold text-xs rounded-xl shadow-md hover:bg-yellow-500 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wider">
            Complete Profile
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <button className="py-3.5 bg-yellow-400 text-black text-[10px] font-black rounded-xl shadow-sm hover:shadow-md transition-all tracking-[0.2em]">
            CONNECT
          </button>
          <button className="py-3.5 bg-gray-100 text-gray-600 text-[10px] font-black rounded-xl hover:bg-gray-200 transition-all tracking-[0.2em]">
            POST OPP
          </button>
        </div>
      </div>
    </div>
  );
}
