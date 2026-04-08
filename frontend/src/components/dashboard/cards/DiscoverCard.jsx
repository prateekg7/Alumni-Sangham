import { MessageCircle, ThumbsUp, ArrowUpRight } from 'lucide-react';

export default function DiscoverCard({ posts = [], onOpenFeed }) {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-6 shadow-xl border border-gray-100">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2">
        <h3 className="text-lg font-bold text-black">Discover</h3>
        <button
          type="button"
          onClick={onOpenFeed}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition hover:text-black"
        >
          Open feed
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-6">
        {posts.length ? (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-sm font-bold text-black">{post.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black leading-tight">{post.author}</p>
                  <p className="text-xs text-gray-500 font-light mt-0.5">{post.time}</p>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-bold text-black mb-1.5 leading-snug">{post.title}</h4>
                <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-gray-500">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post.comments}</span>
                </div>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-400">{post.tag}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
            No community posts yet. Open blogs to start the first discussion.
          </div>
        )}
      </div>
    </div>
  );
}
