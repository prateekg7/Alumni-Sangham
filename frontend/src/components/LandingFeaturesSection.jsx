import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ui/scroll-stack';

const featureCards = [
  {
    name: 'Alumni Directory',
    description:
      'Discover and connect with alumni across batches, companies, and cities — filter by domain, referral availability, and more to find the right people, fast.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
    overlay:
      'linear-gradient(135deg, rgba(8,64,82,0.92) 0%, rgba(12,50,61,0.65) 48%, rgba(16,16,16,0.35) 100%)',
  },
  {
    name: 'Referral Requests',
    description:
      'Students can send structured referral requests to alumni with context and intent, while alumni get a calm, organized view of who needs help and why.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    overlay:
      'linear-gradient(135deg, rgba(12,50,61,0.94) 0%, rgba(5,21,28,0.68) 45%, rgba(16,16,16,0.32) 100%)',
  },
  {
    name: 'Blogs & Jobs',
    description:
      'A unified feed where alumni share career stories, job openings, and practical guidance — keeping the network alive and valuable between direct interactions.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    overlay:
      'linear-gradient(135deg, rgba(16,16,16,0.88) 0%, rgba(8,64,82,0.7) 50%, rgba(12,50,61,0.3) 100%)',
  },
  {
    name: 'Dashboard & Insights',
    description:
      'A personalized hub that surfaces network activity, referral progress, community discussions, and recognition — turning scattered alumni energy into actionable signal.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    overlay:
      'linear-gradient(135deg, rgba(8,64,82,0.88) 0%, rgba(16,16,16,0.52) 46%, rgba(12,50,61,0.65) 100%)',
  },
];

export function LandingFeaturesSection({ sectionId = 'features' }) {
  const navigate = useNavigate();
  const idAttr = sectionId != null && sectionId !== '' ? { id: sectionId } : {};

  return (
    <section
      {...idAttr}
      className="pointer-events-auto relative overflow-hidden px-6 pb-16 pt-14 md:px-12 md:pb-20 md:pt-16 lg:px-20"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <h2
            className="text-[80px] md:text-[100px] lg:text-[120px] font-black text-white leading-[0.85] tracking-tighter uppercase"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Platform Features
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
            Empowering alumni and students with the tools to discover, connect, and grow — one meaningful interaction at a time.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-7xl md:mt-10">
        <ScrollStack
          itemDistance={120}
          itemScale={0.03}
          itemStackDistance={30}
          stackPosition="16%"
          scaleEndPosition="10%"
          baseScale={0.86}
          useWindowScroll
        >
          {featureCards.map((feature) => (
            <ScrollStackItem key={feature.name}>
              <div className="absolute inset-0">
                <img
                  src={feature.image}
                  alt={feature.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: feature.overlay }}
                />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white md:p-12">
                <div className="max-w-2xl">
                  <h3
                    className="text-3xl font-semibold leading-tight md:text-5xl"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {feature.name}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 md:text-base">
                    {feature.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0c323d] transition-colors hover:bg-white/90"
                  >
                    Built into the platform
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
