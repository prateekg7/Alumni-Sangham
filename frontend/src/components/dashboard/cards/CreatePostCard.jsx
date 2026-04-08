import { useState } from 'react';

export default function CreatePostCard({ user, onCreate }) {
  const [draft, setDraft] = useState('');
  const initials = user?.initials || String(user?.name || 'A').slice(0, 1).toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col">
      <div className="flex items-start gap-3 mb-4 border-b border-gray-100 pb-2">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm">
          <span className="text-sm font-bold text-black">{initials}</span>
        </div>
        <div className="flex-1">
          <p className="text-black text-sm font-bold leading-tight">{user?.name || 'Member'}</p>
          <p className="text-gray-400 text-xs font-light mt-0.5 tracking-wide">Share something with the network</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400/20 transition-all">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={5}
            placeholder="Write a post, ask for help, or share an update..."
            className="w-full resize-none text-sm bg-transparent text-black placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
          <h4 className="text-base font-bold text-black leading-tight">Publishing continues in Blogs</h4>
          <p className="text-sm text-gray-500 font-light leading-relaxed mt-1">
            Use this box to start writing, then continue on the blogs page without losing your draft.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 space-y-4">
        <button
          type="button"
          onClick={() => onCreate?.(draft)}
          className="w-full py-3.5 bg-yellow-400 text-black text-sm font-bold rounded-xl shadow-md hover:bg-yellow-500 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          Create Post
        </button>
      </div>
    </div>
  );
}
