import React from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import ArrowDownRight from 'lucide-react/dist/esm/icons/arrow-down-right.js';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import BadgeDollarSign from 'lucide-react/dist/esm/icons/badge-dollar-sign.js';
import Clock3 from 'lucide-react/dist/esm/icons/clock-3.js';
import MoveRight from 'lucide-react/dist/esm/icons/move-right.js';
import SearchCheck from 'lucide-react/dist/esm/icons/search-check.js';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.js';
import SlidersHorizontal from 'lucide-react/dist/esm/icons/sliders-horizontal.js';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles.js';
import SquarePen from 'lucide-react/dist/esm/icons/square-pen.js';
import UsersRound from 'lucide-react/dist/esm/icons/users-round.js';
import Wallet from 'lucide-react/dist/esm/icons/wallet.js';
import greetingLine from '@/assets/greeting-line.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const spotlightCards = [
  {
    name: 'Alumni Directory',
    tag: 'Verified profiles',
    metric: '1,248',
    sublabel: 'reachable mentors this week',
    delta: '+12.8%',
    deltaTone: 'up',
    icon: UsersRound,
    iconClass: 'from-[#7d74ff] to-[#4d82ff]',
    chartPath: 'M0,74 C18,58 32,56 52,68 C71,80 86,92 102,84 C122,74 136,50 154,46 C174,42 191,54 208,38 C226,22 244,12 266,18',
    chartGlow: '#8f7cff',
    chip: 'Directory',
    to: '/directory',
  },
  {
    name: 'Referral Requests',
    tag: 'Career momentum',
    metric: '86',
    sublabel: 'open asks waiting for alumni support',
    delta: '+5.6%',
    deltaTone: 'up',
    icon: BadgeDollarSign,
    iconClass: 'from-[#f4ba5d] to-[#e67834]',
    chartPath: 'M0,72 C22,84 36,88 58,78 C78,68 92,46 110,42 C130,38 150,50 170,46 C188,42 210,26 228,22 C244,18 254,24 266,10',
    chartGlow: '#f8b65e',
    chip: 'Referrals',
    to: '/profile/me?tab=referrals',
  },
  {
    name: 'Hall of Fame',
    tag: 'Featured legends',
    metric: '32',
    sublabel: 'alumni stories drawing the most attention',
    delta: '-1.9%',
    deltaTone: 'down',
    icon: Sparkles,
    iconClass: 'from-[#a24dff] to-[#6258ff]',
    chartPath: 'M0,24 C22,22 46,34 64,50 C82,66 102,72 122,62 C142,52 158,32 176,34 C198,36 216,62 238,68 C250,72 258,70 266,74',
    chartGlow: '#a16aff',
    chip: 'Spotlight',
    to: '/',
    hash: 'hall-of-fame',
  },
];

const statTiles = [
  { label: 'Directory Growth', value: '+18.4%', meta: 'past 30 days', chip: '30d' },
  { label: 'Jobs Shared', value: '412', meta: 'curated opportunities', chip: 'Live' },
  { label: 'Reply Rate', value: '60.6%', meta: 'avg. alumni response', chip: '7d' },
  { label: 'Referral Wins', value: '148', meta: 'students placed', chip: 'Q1' },
];

const postSuggestions = [
  'Share a placement lesson your juniors should know before interview season.',
  'Post a referral opening and tell the network who would be a strong fit.',
  'Write a quick alumni update from your city chapter or recent meetup.',
  'Ask the community for help on internships, research roles, or hiring leads.',
];

function Panel({ className, children }) {
  return (
    <section
      className={cn(
        'rounded-[30px] border border-[#22262e] bg-[#111317] shadow-[0_30px_80px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

function ChartLine({ path, color }) {
  return (
    <svg viewBox="0 0 266 90" className="h-24 w-full">
      <defs>
        <linearGradient id={`line-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </linearGradient>
        <filter id={`glow-${color.replace('#', '')}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d="M0 58 H266" stroke="rgba(255,255,255,0.12)" strokeDasharray="4 6" />
      <path
        d={path}
        fill="none"
        stroke={`url(#line-${color.replace('#', '')})`}
        strokeWidth="3"
        strokeLinecap="round"
        filter={`url(#glow-${color.replace('#', '')})`}
      />
      <circle cx="262" cy="18" r="3.5" fill={color} />
    </svg>
  );
}

function SpotlightCard({ card }) {
  const Icon = card.icon;
  const positive = card.deltaTone === 'up';
  const linkTo = card.hash ? { pathname: card.to, hash: card.hash } : card.to;
  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg', card.iconClass)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">{card.tag}</div>
            <div className="mt-1 text-xl font-semibold text-white">{card.name}</div>
          </div>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2b3038] bg-[#21242b] text-white/70 transition group-hover:bg-[#2a2e37] group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-[42px] font-semibold leading-none tracking-tight text-white">{card.metric}</div>
          <div className="mt-2 text-sm text-white/45">{card.sublabel}</div>
        </div>
        <div
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm',
            positive ? 'bg-[#113724] text-emerald-300' : 'bg-[#3a171f] text-rose-300',
          )}
        >
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {card.delta}
        </div>
      </div>

      <div className="mt-6 rounded-[24px] bg-[#0f1116] px-3 py-2">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/25">
          <span>Signal</span>
          <span>{card.chip}</span>
        </div>
        <ChartLine path={card.chartPath} color={card.chartGlow} />
      </div>
    </>
  );

  return (
    <Link
      to={linkTo}
      className="group block rounded-[28px] border border-[#252a33] bg-[#17191f] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.32)] transition hover:-translate-y-1 hover:border-[#313641] hover:bg-[#1a1d24]"
    >
      {inner}
    </Link>
  );
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

export function DashboardPage() {
  const { user, profileComplete, profileProgress, completeProfile } = useOutletContext();
  const greeting = getGreeting();
  const [suggestionIndex, setSuggestionIndex] = React.useState(0);
  const [postDraft, setPostDraft] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSuggestionIndex((current) => (current + 1) % postSuggestions.length);
    }, 2400);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleDraftRedirect = (event) => {
    event.preventDefault();
    navigate('/blog?tab=posts', {
      state: {
        draftText: postDraft.trim(),
      },
    });
  };

  return (
    <div className="space-y-6">
      <section className="-mx-4 border-y border-black bg-black px-4 py-7 md:-mx-6 md:px-6 md:py-8">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-center">
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1a1d23] bg-[#1a1d23] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/48">
              <Clock3 className="h-3.5 w-3.5" />
              Welcome back
            </div>
            <div className="mt-5 max-w-4xl">
              <div className="relative inline-block">
                <img
                  src={greetingLine}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[2%] top-[52%] z-0 w-[28rem] -translate-y-1/2 select-none opacity-95 sm:left-[4%] sm:top-[58%] sm:w-[36rem] md:left-[8%] md:top-[64%] md:w-[48rem] lg:left-[10%] lg:top-[66%] lg:w-[54rem]"
                />
                <h1 className="relative z-10 pr-4 text-4xl font-semibold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {greeting}, {user.name.split(' ')[0]}
                </h1>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/55 md:text-base">
                {profileComplete
                  ? 'Your profile is complete and ready to surface across referrals, alumni discovery, and community storytelling.'
                  : `Your profile is ${profileProgress}% complete. Finish the missing details so mentors, referral requests, and directory matches land with more trust.`}
              </p>
            </div>
          </div>

          <div className="rounded-[22px] border border-[#14161a] bg-[#14161a] p-4 xl:justify-self-end">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/30">Profile status</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {profileComplete ? 'Profile complete' : 'Complete your profile'}
                </div>
              </div>
              <div className="rounded-full border border-[#20242b] bg-[#20242b] px-3 py-1 text-sm font-medium text-white/70">
                {profileProgress}%
              </div>
            </div>

            <div className="mt-5 h-2 rounded-full bg-[#232730]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#cabfff] via-[#8d7bff] to-[#4d82ff]"
                style={{ width: `${profileProgress}%` }}
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-white/45">
              {profileComplete
                ? 'Everything important is filled out and live.'
                : 'Add the missing essentials so your profile lands with more trust.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {profileComplete ? (
                <Button asChild className="h-10 rounded-2xl border-0 bg-gradient-to-r from-[#c8bcff] to-[#8e7bff] px-4 text-sm font-semibold text-[#140f28] hover:from-[#d7d0ff] hover:to-[#a394ff]">
                  <Link to="/profile/me">View profile</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-10 rounded-2xl border-0 bg-gradient-to-r from-[#c8bcff] to-[#8e7bff] px-4 text-sm font-semibold text-[#140f28] hover:from-[#d7d0ff] hover:to-[#a394ff]"
                >
                  <Link to="/profile/me" onClick={completeProfile}>
                    Complete profile
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#22262e] bg-[#111317] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/30">Community prompt</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[2.2rem]" style={{ fontFamily: 'Syne, sans-serif' }}>
              Make a post
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/48">
              Start something high-signal for the network. This opens the posts feed so you can publish from there.
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            className="h-11 rounded-2xl border border-[#2b3038] bg-[#1b1e24] px-5 text-sm text-white/75 hover:bg-[#262a32] hover:text-white"
          >
            <Link to="/blog?tab=posts">
              Open posts
              <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <form onSubmit={handleDraftRedirect} className="mt-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-[30px] bg-[radial-gradient(circle_at_20%_50%,rgba(117,92,255,0.28),transparent_42%),radial-gradient(circle_at_80%_50%,rgba(77,130,255,0.18),transparent_40%)] blur-xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-[#575cff] bg-[#0d0f13] p-[1px] shadow-[0_0_0_1px_rgba(87,92,255,0.28),0_0_34px_rgba(87,92,255,0.18)]">
              <div className="rounded-[27px] bg-[#111317] px-4 py-4 md:px-5 md:py-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1e2230] text-[#bfb7ff]">
                    <SquarePen className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/28">What do you want to say?</div>
                    <div className="relative mt-3">
                      {!postDraft ? (
                        <p
                          key={postSuggestions[suggestionIndex]}
                          className="pointer-events-none absolute left-0 top-0 pr-3 text-base leading-7 text-white/38"
                        >
                          {postSuggestions[suggestionIndex]}
                        </p>
                      ) : null}
                      <textarea
                        value={postDraft}
                        onChange={(event) => setPostDraft(event.target.value)}
                        rows={3}
                        className="min-h-[92px] w-full resize-none border-0 bg-transparent p-0 text-base leading-7 text-white placeholder:text-transparent focus:outline-none focus:ring-0"
                        placeholder={postSuggestions[suggestionIndex]}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-[#252a33] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-white/42">
                    Type here, then send to continue in the posts tab.
                  </div>
                  <Button
                    type="submit"
                    className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#c8bcff] to-[#8e7bff] px-5 text-sm font-semibold text-[#140f28] hover:from-[#d7d0ff] hover:to-[#a394ff]"
                  >
                    Send to posts
                    <MoveRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#343b46] bg-[#1a1d23] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#c8beff]">
            <Clock3 className="h-3.5 w-3.5" />
            Recommended signals for this week
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'Syne, sans-serif' }}>
            Network Command Center
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
            A curated view of alumni activity, referrals, and community momentum designed with the
            same dramatic cadence as the reference, but grounded in your platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['24H', 'Mentorship', 'Referral Flow', 'Descending'].map((label) => (
            <button
              key={label}
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#2b3038] bg-[#1a1d23] px-4 py-2 text-sm text-white/65 transition hover:bg-[#232730] hover:text-white"
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2b3038] bg-[#1a1d23] text-white/70 transition hover:bg-[#232730] hover:text-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">Live dashboard cards</div>
              <div className="text-2xl font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                Top Community Signals
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2b3038] bg-[#1a1d23] px-3 py-2 text-sm text-white/55">
              <SearchCheck className="h-4 w-4" />
              3 highlighted modules
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {spotlightCards.map((card) => (
              <SpotlightCard key={card.name} card={card} />
            ))}
          </div>
        </Panel>

        <Panel className="bg-[#12141a] p-6">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2b3038] bg-[#1a1d23] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/50">
                <ShieldCheck className="h-3.5 w-3.5" />
                Featured
              </div>
              <div className="rounded-full bg-[#b9acff] px-3 py-1 text-xs font-semibold text-[#181330]">New</div>
            </div>

            <div className="mt-10">
              <div className="text-sm uppercase tracking-[0.28em] text-white/35">Career Orbit Panel</div>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                Move faster with the alumni network at your side
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/55">
                Surface mentors, unlock referrals, and publish updates from a single control center built
                for students and alumni alike.
              </p>
            </div>

            <div className="mt-auto space-y-3 pt-10">
              <Button className="h-12 w-full rounded-2xl border-0 bg-gradient-to-r from-[#c9bdff] to-[#8f7aff] text-base font-semibold text-[#160f2d] hover:from-[#d8d0ff] hover:to-[#a392ff]">
                Connect with Alumni
              </Button>
              <Button
                variant="ghost"
                className="h-12 w-full rounded-2xl border border-[#2b3038] bg-[#1b1e24] text-base text-white/80 hover:bg-[#262a32] hover:text-white"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Post an Opportunity
              </Button>
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="overflow-hidden">
        <div className="grid gap-6 border-b border-[#252a33] px-6 py-6 md:grid-cols-[minmax(0,1.25fr)_360px] md:px-8">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/30">Your active circles</div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="text-4xl font-semibold text-white md:text-5xl" style={{ fontFamily: 'Syne, sans-serif' }}>
                Referral Velocity
              </h2>
              <div className="rounded-2xl bg-[#ff6e6e] p-3">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <div className="text-6xl font-semibold leading-none tracking-tight text-white md:text-7xl">31.3986</div>
              <div className="pb-2 text-white/45">
                Average response window, hours
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="rounded-2xl border-0 bg-gradient-to-r from-[#c7bbff] to-[#8f79ff] px-6 text-[#160f2d] hover:from-[#d8d0ff] hover:to-[#a18fff]">
                Upgrade
              </Button>
              <Button
                variant="ghost"
                className="rounded-2xl border border-[#2b3038] bg-[#1b1e24] px-6 text-white/80 hover:bg-[#262a32] hover:text-white"
              >
                View Profile
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#252a33] bg-[#17191f] p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-white/28">Mentorship Window</div>
                <div className="mt-2 text-2xl font-semibold text-white">Investment Period</div>
              </div>
              <div className="rounded-full bg-[#20242b] px-3 py-1 text-sm text-white/65">6 Month</div>
            </div>

            <div className="mt-10 space-y-6">
              <div className="relative h-1 rounded-full bg-[#232730]">
                <div className="absolute left-[14%] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-[#b8a9ff] bg-[#20193c] shadow-[0_0_20px_rgba(190,177,255,0.8)]" />
                <div className="absolute left-[14%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#6f5cff] to-[#bbaeff]" style={{ width: '58%' }} />
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/28">
                <span>Momentum</span>
                <span>General</span>
                <span>Risk</span>
                <span>Reward</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-4 md:px-8">
          {statTiles.map((tile) => (
            <div key={tile.label} className="rounded-[26px] border border-[#252a33] bg-[#17191f] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-white/45">{tile.label}</div>
                <div className="rounded-full bg-[#20242b] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  {tile.chip}
                </div>
              </div>
              <div className="mt-6 text-4xl font-semibold tracking-tight text-white">{tile.value}</div>
              <div className="mt-2 text-sm text-white/35">{tile.meta}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
