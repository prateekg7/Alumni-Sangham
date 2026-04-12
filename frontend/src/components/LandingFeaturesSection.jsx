import React from 'react';
import {
  ArrowUpRight,
  Compass,
  Handshake,
  Newspaper,
  Users,
} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ui/scroll-stack';

const featureCards = [
  {
    eyebrow: 'Directory',
    title: 'See the network with enough context to make a warm ask.',
    description:
      'Filter alumni by domain, company, city, and referral openness so discovery feels intentional instead of random.',
    highlights: ['Profile-first discovery', 'Useful filters', 'Fast shortlisting'],
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
    overlay:
      'linear-gradient(135deg, rgba(8,64,82,0.92) 0%, rgba(12,50,61,0.65) 48%, rgba(16,16,16,0.35) 100%)',
    icon: Users,
  },
  {
    eyebrow: 'Referral requests',
    title: 'Move from interest to outreach without losing the human part.',
    description:
      'Students can frame a cleaner request, while alumni get a calmer view of who needs help and why.',
    highlights: ['Targeted asks', 'Role context', 'Clear next steps'],
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    overlay:
      'linear-gradient(135deg, rgba(12,50,61,0.94) 0%, rgba(5,21,28,0.68) 45%, rgba(16,16,16,0.32) 100%)',
    icon: Handshake,
  },
  {
    eyebrow: 'Stories & jobs',
    title: 'Keep advice, openings, and alumni notes in the same conversation surface.',
    description:
      'The blog feed mixes job drops, short essays, and practical guidance so the network stays alive between asks.',
    highlights: ['Job drops', 'Career writing', 'Community updates'],
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    overlay:
      'linear-gradient(135deg, rgba(16,16,16,0.88) 0%, rgba(8,64,82,0.7) 50%, rgba(12,50,61,0.3) 100%)',
    icon: Newspaper,
  },
  {
    eyebrow: 'Signal layer',
    title: 'Turn scattered alumni energy into a platform people can actually return to.',
    description:
      'Progress, discovery, and recognition live together so the platform feels less like a form and more like a living network.',
    highlights: ['Shared visibility', 'Recognition moments', 'Fewer dead ends'],
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    overlay:
      'linear-gradient(135deg, rgba(8,64,82,0.88) 0%, rgba(16,16,16,0.52) 46%, rgba(12,50,61,0.65) 100%)',
    icon: Compass,
  },
];

export function LandingFeaturesSection({ sectionId = 'features' }) {
  const idAttr = sectionId != null && sectionId !== '' ? { id: sectionId } : {};

  return (
    <section
      {...idAttr}
      className="pointer-events-auto relative overflow-hidden bg-[#050708] px-6 py-24 md:px-12 lg:px-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/0 via-[#041117]/40 to-[#050708]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
            Platform features
          </div>
          <h2
            className="mt-6 text-4xl font-semibold leading-tight text-white md:text-5xl"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            A calmer way to discover people, ask for help, and keep the network moving.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
            The stack below brings the most important surfaces into focus one by one so the platform
            feels deliberate, not cluttered.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-7xl">
        <ScrollStack
          itemDistance={120}
          itemScale={0.03}
          itemStackDistance={30}
          stackPosition="16%"
          scaleEndPosition="10%"
          baseScale={0.86}
          useWindowScroll
        >
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <ScrollStackItem key={feature.title}>
                <div className="absolute inset-0">
                  <img
                    src={feature.image}
                    alt={feature.eyebrow}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: feature.overlay }}
                  />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white md:p-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                      {feature.eyebrow}
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <h3
                      className="text-3xl font-semibold leading-tight md:text-5xl"
                      style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 md:text-base">
                      {feature.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {feature.highlights.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/15 bg-black/18 px-3 py-1.5 text-xs font-medium text-white/78 backdrop-blur-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0c323d]">
                      Built into the platform
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}
