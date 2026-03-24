import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

const statsData = [
  { value: 15000, label: "Alumni Worldwide" },
  { value: 50, label: "Global Chapters" },
  { value: 120, label: "Startups Founded" },
  { value: 500, label: "Active Mentors" }
];

function AnimatedCounter({ value, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <div ref={ref} className="bg-white/5 dark:bg-black/60 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center transform hover:-translate-y-2 transition-transform duration-300 pointer-events-auto">
      <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-400 mb-2">
        {displayValue}+
      </h3>
      <p className="text-xs md:text-sm font-bold text-blue-100/70 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <div className="relative z-30 w-full px-4 md:px-8 -mt-16 md:-mt-24 mb-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, idx) => (
          <AnimatedCounter key={idx} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  );
}
