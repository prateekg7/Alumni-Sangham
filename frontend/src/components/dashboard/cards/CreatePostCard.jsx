export default function CreatePostCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col">
      <div className="flex items-start gap-3 mb-4 border-b border-gray-100 pb-2">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm">
          <span className="text-sm font-bold text-black">P</span>
        </div>
        <div className="flex-1">
          <p className="text-black text-sm font-bold leading-tight">Prateek Gupta</p>
          <p className="text-gray-400 text-xs font-light mt-0.5 tracking-wide">Recent posts</p>
        </div>
      </div>

      <p className="text-blue-500 text-xs mb-4 font-light hover:underline cursor-pointer truncate">
        https://www.youtube.com.dummy.link.tinyminyurl.......
      </p>

      <div className="bg-gray-200 rounded-xl h-40 mb-4 shadow-inner flex items-center justify-center border border-gray-100">
        <span className="text-gray-300 text-xs font-light italic">Image preview</span>
      </div>

      <div className="flex-1 space-y-2 mb-6">
        <h4 className="text-base font-bold text-black leading-tight">When college life concludes</h4>
        <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-2">
          The journey of a thousand miles begins with a single step, but the final steps are often the most memorable...
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100 space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400/20 transition-all">
          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full text-sm bg-transparent text-black placeholder-gray-400 focus:outline-none"
          />
        </div>

        <button className="w-full py-3.5 bg-yellow-400 text-black text-sm font-bold rounded-xl shadow-md hover:bg-yellow-500 hover:-translate-y-0.5 active:translate-y-0 transition-all">
          Create Post
        </button>
      </div>
    </div>
  );
}
