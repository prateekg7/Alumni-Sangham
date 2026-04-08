import { TrendingUp, Share2, Bookmark } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function LatestNewsCard({ items = [], onOpenAll }) {
  const [savedIds, setSavedIds] = useState([]);

  const news = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        saved: savedIds.includes(item.id),
      })),
    [items, savedIds],
  );

  const toggleSave = (id) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col shadow-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
        <h3 className="text-lg font-bold text-black">Latest News</h3>
        <TrendingUp className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="space-y-6 flex-1">
        {news.length ? (
          news.map((item) => (
            <div key={item.id} className="group bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-yellow-400 transition-all">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400 text-black rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {item.trending ? <TrendingUp className="w-3 h-3" /> : null}
                  {item.category}
                </span>
              </div>

              <h4 className="text-sm font-bold text-black mb-3 leading-snug group-hover:text-yellow-600 transition-colors line-clamp-2">
                {item.title}
              </h4>

              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4 font-light">
                <div>
                  <span className="font-bold text-black">{item.source}</span>
                  <span className="mx-2 opacity-30">•</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-[11px] font-medium text-gray-400">{item.reads} reads</span>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button type="button" className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                    <Share2 className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSave(item.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      item.saved
                        ? 'bg-yellow-400 text-black shadow-sm'
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${item.saved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
            No live updates yet.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenAll}
        className="mt-8 w-full py-3 text-xs font-bold text-yellow-600 border-2 border-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        View All News
      </button>
    </div>
  );
}
