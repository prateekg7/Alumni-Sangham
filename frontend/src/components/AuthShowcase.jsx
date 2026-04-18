import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AuthShowcase({
  slides,
  heading,
  description,
  accentColor = '#e8528d',
  fullBleed = false,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(intervalId);
  }, [slides]);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/16 shadow-[0_26px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl ${
        fullBleed ? 'h-full min-h-0' : 'flex h-full flex-col justify-between p-6'
      }`}
    >
      {!fullBleed ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#6b5360]">
            Campus moments
          </p>
          <h2
            className="mt-4 text-3xl font-semibold text-[#24181e]"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {heading}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#5a4550]">
            {description}
          </p>
        </div>
      ) : null}

      <div
        className={`relative overflow-hidden ${
          fullBleed ? 'h-full w-full rounded-[1.75rem]' : 'mt-8 flex-1 rounded-[1.5rem] border border-white/28 bg-white/22'
        }`}
      >
        {slides.map((slide, index) => (
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{
              opacity: index === activeIndex ? 1 : 0,
              scale: index === activeIndex ? 1 : 1.05,
            }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={index === 0 ? 'high' : 'low'}
          />
        ))}
        <div
          className={`absolute inset-0 ${
            fullBleed
              ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(44,26,35,0.12)_48%,rgba(44,26,35,0.34)_100%)]'
              : 'bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(74,48,59,0.18)_100%)]'
          }`}
        />
      </div>

      <div
        className={`flex items-center gap-3 ${
          fullBleed
            ? 'absolute bottom-6 left-6 z-10 rounded-full bg-white/18 px-4 py-3 backdrop-blur-md'
            : 'mt-6'
        }`}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.alt}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-10' : 'w-2'}`}
            style={{ backgroundColor: index === activeIndex ? accentColor : '#d6b8c4' }}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
