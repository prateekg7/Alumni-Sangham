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
    <div className="relative min-h-[440px] overflow-hidden flex flex-col justify-end items-start p-8 md:p-12">
      {/* Background image */}
      <img
        src="/hero_graduation.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Gradual black fade to blend into the dashboard background — darkened further for a dramatic look */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 via-50% to-black" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Greeting */}
        <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl mb-6">
          {greeting}, <span className="font-extrabold">{firstName}</span>
        </h1>

      </div>
    </div>
  );
}
