import React from 'react';
import {
  ArrowUpRight,
  Atom,
  Award,
  BriefcaseBusiness,
  Cpu,
  Rocket,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const honorees = [
  {
    name: 'Sana Ahmed',
    role: 'Product strategy lead',
    batch: 'Batch of 2019',
    highlight: 'Mentors early-career product students and keeps job-search advice practical.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
    icon: Sparkles,
  },
  {
    name: 'Arjun Mehta',
    role: 'Distributed systems engineer',
    batch: 'Batch of 2018',
    highlight: 'Known for high-signal referral reviews and backend interview walkthroughs.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    icon: Cpu,
  },
  {
    name: 'Meera Joshi',
    role: 'Applied AI researcher',
    batch: 'Batch of 2020',
    highlight: 'Bridges research depth with approachable guidance for students exploring ML.',
    image:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80',
    icon: Atom,
  },
  {
    name: 'Priya Kapoor',
    role: 'Founder, LoopStack',
    batch: 'Batch of 2016',
    highlight: 'Builds startup pathways and shares transparent stories from the operator side.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80',
    icon: Rocket,
  },
  {
    name: 'Ryan Crawford',
    role: 'Cloud infrastructure architect',
    batch: 'Batch of 2017',
    highlight: 'Helps students translate strong projects into credible systems narratives.',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    icon: ShieldCheck,
  },
  {
    name: 'Rohan Iyer',
    role: 'Growth and analytics lead',
    batch: 'Batch of 2021',
    highlight: 'Turns scattered outreach into sharper, more measurable networking playbooks.',
    image:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=1200&q=80',
    icon: BriefcaseBusiness,
  },
  {
    name: 'Kavya Nair',
    role: 'Design systems specialist',
    batch: 'Batch of 2020',
    highlight: 'Brings clarity to portfolios, product craft, and visual storytelling.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    icon: WandSparkles,
  },
];

export function LandingHallOfFame({ sectionId = 'hall-of-fame' }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const idAttr = sectionId != null && sectionId !== '' ? { id: sectionId } : {};

  return (
    <section
      {...idAttr}
      className="pointer-events-auto relative overflow-hidden bg-[#06090b] px-6 py-24 md:px-12 lg:px-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(8,64,82,0.18),_transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
            Hall of fame
          </div>
          <h2
            className="mt-6 text-4xl font-semibold leading-tight text-white md:text-5xl"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Seven alumni stories that make the network feel aspirational and reachable at once.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
            On larger screens these cards expand on hover, keeping the section playful while still
            feeling easy to scan.
          </p>
        </div>

        <div className="mt-14 flex h-[470px] gap-3 overflow-x-auto pb-3 lg:overflow-visible">
          {honorees.map((member, index) => {
            const active = index === activeIndex;
            const Icon = member.icon;

            return (
              <button
                key={member.name}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onTouchStart={() => setActiveIndex(index)}
                className={cn(
                  'group relative flex-shrink-0 overflow-hidden rounded-[32px] border border-white/10 text-left transition-all duration-500 focus:outline-none',
                  active ? 'w-[min(82vw,360px)] lg:flex-[5.5]' : 'w-[92px] lg:flex-[0.9]',
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.05, 0.61, 0.41, 0.95)' }}
                aria-label={`${member.name}, ${member.role}`}
              >
                <div className="absolute inset-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/5" />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,64,82,0.14),rgba(0,0,0,0))]" />

                <div className="relative flex h-full flex-col justify-between p-5 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/12 backdrop-blur-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    {active ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0c323d]">
                        Featured
                        <Award className="h-3.5 w-3.5" />
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">
                      {member.batch}
                    </div>
                    <div
                      className={cn(
                        'mt-3 text-xl font-semibold leading-tight text-white transition-all duration-300',
                        active ? 'max-w-[260px]' : 'max-w-[1px] opacity-0 lg:max-w-[1px]',
                      )}
                      style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                      {member.name}
                    </div>
                    <div
                      className={cn(
                        'mt-2 text-sm leading-6 text-white/72 transition-all duration-300',
                        active ? 'max-w-[260px] opacity-100' : 'max-h-0 opacity-0',
                      )}
                    >
                      <div className="font-medium text-white/88">{member.role}</div>
                      <p className="mt-2">{member.highlight}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82">
                        Community impact
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    {!active ? (
                      <div className="mt-4 -rotate-90 origin-bottom-left translate-y-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-white/72 lg:block">
                        {member.name}
                      </div>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
