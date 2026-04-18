import React from 'react';
import adminPov from '../../Assets/admin-pov.jpg';
import admin from '../../Assets/admin.jpg';
import BorderGlow from './ui/about-border-glow';

export function AboutUs({ sectionId = 'about' }) {
  const idAttr = sectionId != null && sectionId !== '' ? { id: sectionId } : {};
  const cardProps = {
    edgeSensitivity: 18,
    glowColor: '48 88 74',
    backgroundColor: 'rgba(5, 5, 5, 0.82)',
    borderRadius: 28,
    glowRadius: 30,
    glowIntensity: 0.9,
    coneSpread: 24,
    animated: false,
    colors: ['#f3de92', '#f7f1d2', '#7dd3fc'],
    fillOpacity: 0.34,
  };

  return (
    <section
      {...idAttr}
      className="w-full relative isolate overflow-visible pointer-events-auto py-20 md:py-32 px-6 md:px-16 lg:px-24"
    >
      {/* Top Row */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2.5fr_1fr] gap-6 md:gap-12 items-start">
        {/* Left: Title + Tagline + Large Image */}
        <div className="flex flex-col justify-start select-none">
          <h2
            className="text-[80px] md:text-[100px] lg:text-[120px] font-black text-white leading-[0.85] tracking-tighter uppercase"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            ABOUT
          </h2>

          <div className="grid grid-cols-[auto_1fr] gap-4 md:gap-8 mt-1 items-start">
            <h2
              className="text-[80px] md:text-[100px] lg:text-[120px] font-black text-white leading-[0.85] tracking-tighter uppercase"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              IITP
            </h2>

            <div className="flex flex-col gap-4 md:gap-6 pt-3 md:pt-4">
              <p className="text-white/60 text-base md:text-lg lg:text-xl font-normal tracking-wide leading-none font-[Syne]">
                A community built on learning
              </p>

              <div className="w-full overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src={adminPov}
                  alt="IIT Patna Campus - Admin Building View"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[280px] md:h-[400px] object-cover rounded-[2rem] transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Small Image + Who We Are */}
        <div className="md:mt-32 lg:mt-40">
          <div className="overflow-hidden rounded-[1.5rem] shadow-xl">
            <img
              src={admin}
              alt="IIT Patna Campus"
              loading="lazy"
              decoding="async"
              className="w-full h-[160px] md:h-[200px] object-cover rounded-[1.5rem] transform hover:scale-110 transition-transform duration-700"
            />
          </div>
          <BorderGlow {...cardProps} className="mt-4">
            <div className="space-y-3 px-5 py-5 md:px-6 md:py-6">
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight font-[Syne]">Who We Are</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">
                IIT Patna is one of India's leading engineering institutions, known for its strong academic foundation and a steadily growing focus on research and innovation.
              </p>
            </div>
          </BorderGlow>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mt-8 md:mt-10">
        {/* The Community */}
        <BorderGlow {...cardProps}>
          <div className="px-6 py-6 md:px-8 md:py-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight font-[Syne]">The Community</h3>
            <p className="text-white/50 text-sm md:text-base leading-relaxed font-light">
              What truly defines IIT Patna is its people — a close-knit community of students, faculty, and alumni who value curiosity, collaboration, and continuous learning.
            </p>
          </div>
        </BorderGlow>

        {/* Beyond Campus */}
        <BorderGlow {...cardProps}>
          <div className="px-6 py-6 md:px-8 md:py-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight font-[Syne]">Beyond Campus</h3>
            <p className="text-white/50 text-sm md:text-base leading-relaxed font-light">
              With contributions across industry, research, and entrepreneurship, the IIT Patna community continues to make its mark beyond the campus through its growing alumni network.
            </p>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}
