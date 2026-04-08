function greetingForHour(hour) {
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

export default function HeroSection({ user, stats = [] }) {
  const firstName = String(user?.name || 'there').trim().split(/\s+/)[0];
  const greeting = greetingForHour(new Date().getHours());

  return (
    <div className="hero-banner relative min-h-[640px] rounded-br-3xl rounded-bl-3xl overflow-hidden flex flex-col justify-end p-10">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 w-full">
        <h1 className="text-6xl font-semibold text-white mb-12 tracking-tight">
          {greeting}, {firstName}
        </h1>
        <div className="flex flex-wrap gap-12 text-white/90">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={index === 0 ? 'flex flex-col' : 'flex flex-col border-l border-white/20 pl-12'}
            >
              <span className="text-xs font-light uppercase tracking-widest opacity-60 mb-1">{item.label}</span>
              <span className="text-2xl font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
