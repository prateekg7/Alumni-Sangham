import { Search, ChevronDown } from 'lucide-react';

export default function TopNav() {
  return (
    <nav className="bg-[#000000] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex-1 flex justify-center max-w-2xl px-4">
        <div className="relative w-full max-w-lg group">
          <input
            type="text"
            placeholder="Search Activities........."
            className="w-full bg-transparent border-b border-white/20 text-white placeholder-white/40 pb-2 focus:outline-none focus:border-white/60 transition-all text-sm font-light pr-10"
          />
          <Search className="absolute right-2 top-0 w-5 h-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 px-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-white text-[#0c323d] rounded-full flex items-center justify-center font-bold text-sm">
            P
          </div>
          <span className="text-white text-sm font-medium tracking-wide">Prateek Gupta</span>
          <ChevronDown className="w-4 h-4 text-white/60" />
        </div>
      </div>
    </nav>
  );
}
