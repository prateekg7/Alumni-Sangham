export default function HeroSection() {
  return (
    <div className="hero-banner relative min-h-[640px] rounded-br-3xl rounded-bl-3xl overflow-hidden flex flex-col justify-end p-10">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 w-full">
        <h1 className="text-6xl font-semibold text-white mb-12 tracking-tight">
          Good Morning, Prateek
        </h1>
        <div className="flex flex-wrap gap-12 text-white/90">
          <div className="flex flex-col">
            <span className="text-xs font-light uppercase tracking-widest opacity-60 mb-1">Directory</span>
            <span className="text-2xl font-bold">+18.2%</span>
          </div>
          <div className="flex flex-col border-l border-white/20 pl-12">
            <span className="text-xs font-light uppercase tracking-widest opacity-60 mb-1">Reply rate</span>
            <span className="text-2xl font-bold">60.6</span>
          </div>
          <div className="flex flex-col border-l border-white/20 pl-12">
            <span className="text-xs font-light uppercase tracking-widest opacity-60 mb-1">Referral wins</span>
            <span className="text-2xl font-bold">426</span>
          </div>
          <div className="flex flex-col border-l border-white/20 pl-12">
            <span className="text-xs font-light uppercase tracking-widest opacity-60 mb-1">Jobs shared</span>
            <span className="text-2xl font-bold">148</span>
          </div>
        </div>
      </div>
    </div>
  );
}
