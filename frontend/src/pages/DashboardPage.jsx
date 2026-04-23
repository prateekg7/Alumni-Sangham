import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowUpRight, MessageCircle, Send, Sparkles, ThumbsUp, Users } from 'lucide-react';
import HeroSection from '../components/dashboard/HeroSection';
import RightPanel from '../components/dashboard/RightPanel';
import {
  fetchDirectory,
  fetchDiscussionFeed,
  fetchHallOfFame,
  fetchMyProfile,
  fetchReferralBoard,
} from '../lib/api';

function formatRelativeTime(iso) {
  if (!iso) return 'Just now';
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function initialsFromName(name) {
  return String(name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
}

function DashboardContent({
  user,
  discoverPosts,
  newsItems,
  directoryCount,
  onOpenFeed,
  onOpenDirectory,
  onCreatePost,
}) {
  const [draft, setDraft] = useState('');
  const featuredPost = discoverPosts[0];

  return (
    <section className="flex h-full flex-col space-y-4">

      {/* ── Card 1: Network Pulse — warm beige/cream ── */}
      <div className="db-card db-card--beige p-6 md:p-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a5c3a]/60">
          Network pulse
        </div>
        <h2 className="mt-4 text-2xl font-bold leading-snug tracking-tight text-[#2c1a0e] md:text-3xl">
          Better connections, now closer.
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[#2c1a0e]/50">
          Browse alumni, follow referral movement, and continue conversations from one live dashboard.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {/* Count — left */}
          <div>
            <span className="text-3xl font-black text-[#2c1a0e]">{directoryCount}</span>
            <span className="ml-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2c1a0e]/55">Alumni</span>
          </div>
          {/* Buttons — right */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenDirectory}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2c1a0e] px-4 py-2.5 text-sm font-semibold text-[#f0e2cc] transition hover:bg-[#3d2510]"
            >
              <Users className="h-4 w-4" />
              Open directory
            </button>
            <button
              type="button"
              onClick={onOpenFeed}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2c1a0e] px-4 py-2.5 text-sm font-semibold text-[#f0e2cc] transition hover:bg-[#3d2510]"
            >
              <MessageCircle className="h-4 w-4" />
              Read posts
            </button>
          </div>
        </div>
      </div>

      {/* ── Card 2: Directory — brown ── */}
      <div className="db-card db-card--brown p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Directory
            </div>
            <h3 className="mt-4 text-xl font-bold leading-snug text-white md:text-2xl">
              Discover your network
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
              Search alumni by batch, department, company, or location. Find the right people to connect with.
            </p>
          </div>
          <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Users className="h-6 w-6 text-white/70" />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div>
            <span className="text-2xl font-bold text-white">{directoryCount}</span>
            <span className="ml-2 text-xs text-white/45">profiles</span>
          </div>
          <button
            type="button"
            onClick={onOpenDirectory}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/22"
          >
            Browse directory
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Card 3: Blogs — beige ── */}
      <div className="db-card db-card--beige p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a5c3a]/60">
              Blogs
            </div>
            <h3 className="mt-4 text-xl font-bold leading-snug text-[#2c1a0e] md:text-2xl">
              {featuredPost?.title || 'Share insights & stories'}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#2c1a0e]/55">
              {featuredPost?.excerpt || 'Ask for guidance, share an opening, or start a campus thread.'}
            </p>
          </div>
          <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2c1a0e]/10">
            <MessageCircle className="h-6 w-6 text-[#2c1a0e]/60" />
          </div>
        </div>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="Ask for guidance, share an opening, or start a campus thread..."
          className="mt-5 w-full resize-none rounded-xl border border-[#2c1a0e]/12 bg-[#2c1a0e]/8 px-4 py-3 text-sm text-[#2c1a0e] outline-none placeholder:text-[#2c1a0e]/35 focus:border-[#2c1a0e]/25 transition"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onCreatePost(draft)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2c1a0e] px-5 py-2.5 text-sm font-semibold text-[#f0e2cc] transition hover:bg-[#3d2510]"
          >
            Continue in Blogs
            <Send className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onOpenFeed}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2c1a0e]/10 px-5 py-2.5 text-sm font-semibold text-[#2c1a0e]/70 transition hover:bg-[#2c1a0e]/18"
          >
            View all posts
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Card 4: Referrals — brown ── */}
      <div className="db-card db-card--brown flex flex-1 flex-col p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Referrals
            </div>
            <h3 className="mt-4 text-xl font-bold leading-snug text-white md:text-2xl">
              Get referred by alumni
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
              Connect with alumni at top companies and request referrals. Keep your profile complete to maximize your chances.
            </p>
          </div>
          <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/12">
            <ThumbsUp className="h-6 w-6 text-white/70" />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={onOpenDirectory}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/22"
          >
            Find alumni to connect
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </section>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [directory, setDirectory] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [hallOfFame, setHallOfFame] = useState([]);
  const [referralBoard, setReferralBoard] = useState({ title: '', description: '', requests: [] });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const results = await Promise.allSettled([
        fetchDirectory(),
        fetchDiscussionFeed(),
        fetchHallOfFame(),
        fetchReferralBoard(),
        fetchMyProfile(),
      ]);

      if (cancelled) return;

      const [directoryResult, discussionsResult, hofResult, referralResult, profileResult] = results;

      setDirectory(directoryResult.status === 'fulfilled' && Array.isArray(directoryResult.value) ? directoryResult.value : []);
      setDiscussions(discussionsResult.status === 'fulfilled' && Array.isArray(discussionsResult.value) ? discussionsResult.value : []);
      setHallOfFame(hofResult.status === 'fulfilled' && Array.isArray(hofResult.value) ? hofResult.value : []);
      setReferralBoard(
        referralResult.status === 'fulfilled' && referralResult.value
          ? referralResult.value
          : { title: '', description: '', requests: [] },
      );
      setProfile(profileResult.status === 'fulfilled' ? profileResult.value : null);
    })();

    return () => { cancelled = true; };
  }, []);


  const discoverPosts = useMemo(
    () =>
      discussions.slice(0, 2).map((post) => ({
        id: post._id,
        author: post.authorName,
        avatar: initialsFromName(post.authorName),
        title: post.title,
        excerpt: post.body,
        upvotes: post.upvotes ?? 0,
        comments: post.commentsCount ?? 0,
        time: formatRelativeTime(post.createdAt),
        tag: post.tag || 'Update',
      })),
    [discussions],
  );

  const newsItems = useMemo(
    () =>
      hallOfFame.slice(0, 3).map((entry) => ({
        id: entry._id,
        title: `${entry.name} · ${entry.currentRole}`,
        source: entry.department,
        category: String(entry.category || 'highlight').replace(/_/g, ' '),
        timestamp: formatRelativeTime(entry.createdAt),
        reads: Math.max(100, (entry.displayOrder || 1) * 47),
        trending: true,
      })),
    [hallOfFame],
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="-m-4 md:-m-6">
        <HeroSection user={user} />
      </div>

      <div className="mx-auto mt-6 flex max-w-[1600px] flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* Left column – original cards organized into sections */}
        <div className="min-w-0 flex-1">
          <DashboardContent
            user={user}
            discoverPosts={discoverPosts}
            newsItems={newsItems}
            directoryCount={directory.length}
            onOpenFeed={() => navigate('/blog?tab=posts')}
            onOpenDirectory={() => navigate('/directory')}
            onCreatePost={(draft) => navigate('/blog?tab=posts', { state: { draftText: draft } })}
          />
        </div>

        {/* Right column – referral requests, top-aligned with first card */}
        <div className="w-full flex-shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-24px)] lg:w-[340px] xl:w-[380px]">
          <RightPanel
            user={user}
            profile={profile}
            referrals={referralBoard.requests.slice(0, 5)}
            onOpenDirectory={() => navigate('/directory')}
            onOpenReferrals={() => navigate('/referrals')}
          />
        </div>
      </div>
    </div>
  );
}
