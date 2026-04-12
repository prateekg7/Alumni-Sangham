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
  if (!iso) {
    return 'Just now';
  }

  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) {
    return 'Just now';
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
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

const bentoImages = [
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
];

function BentoCard({ children, className = '', delay = '0s', image, imageAlt = '' }) {
  return (
    <div
      className={`dashboard-bento-card min-h-[210px] ${className}`}
      style={{ '--glow-delay': delay }}
    >
      {image ? (
        <>
          <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/18" />
        </>
      ) : null}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function DashboardBentoGrid({
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
  const topStory = newsItems[0];

  return (
    <section className="rounded-[18px] bg-[#050505] p-4 md:p-5">
      <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 lg:grid-cols-6">
        <BentoCard className="lg:col-span-4 lg:row-span-2" delay="0s">
          <div className="flex h-full flex-col justify-between p-6 text-[#063f33] md:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5eee8]">
                <Sparkles className="h-3.5 w-3.5" />
                Network pulse
              </div>
              <h2 className="mt-6 max-w-2xl text-4xl font-black leading-none tracking-normal md:text-6xl">
                Better connections, now closer.
              </h2>
              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#063f33]/72">
                Browse alumni, follow referral movement, and continue conversations from one live dashboard.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] bg-black px-4 py-3 text-[#f5eee8]">
                <div className="text-3xl font-black">{directoryCount}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/54">Alumni</div>
              </div>
              <button
                type="button"
                onClick={onOpenDirectory}
                className="rounded-[8px] bg-[#014536] px-4 py-3 text-left text-[#f5eee8] transition hover:bg-[#063f33]"
              >
                <Users className="h-5 w-5" />
                <div className="mt-3 text-sm font-bold">Open directory</div>
              </button>
              <button
                type="button"
                onClick={onOpenFeed}
                className="rounded-[8px] bg-[#d70713] px-4 py-3 text-left text-[#f5eee8] transition hover:bg-[#bf0710]"
              >
                <MessageCircle className="h-5 w-5" />
                <div className="mt-3 text-sm font-bold">Read posts</div>
              </button>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-2" delay="2s" image={bentoImages[0]} imageAlt="Alumni networking">
          <div className="flex h-full items-end p-5">
            <div className="rounded-[8px] bg-black px-4 py-3 text-[#f5eee8]">
              <div className="text-xs uppercase tracking-[0.18em] text-white/48">Community</div>
              <div className="mt-1 text-xl font-black">People moving together</div>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-2" delay="4s">
          <div className="flex h-full flex-col justify-between p-6 text-[#d70713]">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em]">Latest signal</div>
              <h3 className="mt-5 text-3xl font-black leading-none tracking-normal">
                {topStory?.title || 'Fresh alumni updates are loading'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenDirectory}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-[8px] bg-[#d70713] px-4 py-2 text-sm font-bold text-[#f5eee8]"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-2" delay="6s">
          <div className="flex h-full flex-col justify-between p-6 text-black">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-black/50">Start a post</div>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={4}
                placeholder="Ask for guidance, share an opening, or start a campus thread..."
                className="mt-5 w-full resize-none rounded-[8px] border border-black/10 bg-white/65 px-4 py-3 text-sm text-black outline-none placeholder:text-black/38 focus:border-black/30"
              />
            </div>
            <button
              type="button"
              onClick={() => onCreatePost(draft)}
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-[8px] bg-black px-4 py-2 text-sm font-bold text-[#f5eee8]"
            >
              Continue in Blogs
              <Send className="h-4 w-4" />
            </button>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-2" delay="8s" image={bentoImages[1]} imageAlt="Career discussion">
          <div className="flex h-full items-start justify-end p-5">
            <div className="rounded-[8px] bg-[#f5eee8] px-4 py-3 text-[#014536]">
              <div className="text-xs uppercase tracking-[0.18em] text-[#014536]/54">Mentorship</div>
              <div className="mt-1 text-xl font-black">Talk to people who did it</div>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-6" delay="10s" image={bentoImages[2]} imageAlt="Alumni workshop">
          <div className="flex h-full items-end p-6">
            <div className="max-w-xl rounded-[8px] bg-[#f5eee8] p-5 text-black">
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-black/45">
                <ThumbsUp className="h-4 w-4" />
                Community post
              </div>
              <h3 className="mt-3 text-2xl font-black tracking-normal">
                {featuredPost?.title || `${user?.name || 'Member'}, your feed is warming up.`}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/60">
                {featuredPost?.excerpt || 'New conversations from alumni and students will appear here as the network grows.'}
              </p>
            </div>
          </div>
        </BentoCard>
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

      if (cancelled) {
        return;
      }

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

    return () => {
      cancelled = true;
    };
  }, []);

  const heroStats = useMemo(() => {
    const acceptedReferrals = referralBoard.requests.filter((item) => /accepted/i.test(item.status)).length;
    const responseRate = referralBoard.requests.length
      ? Math.round((acceptedReferrals / referralBoard.requests.length) * 100)
      : 0;
    const jobPosts = discussions.filter((post) => /job/i.test(post.tag || '') || /job/i.test(post.community || '')).length;

    return [
      { label: 'Directory', value: directory.length || 0 },
      { label: 'Reply rate', value: `${responseRate}%` },
      { label: 'Referral wins', value: acceptedReferrals },
      { label: 'Jobs shared', value: jobPosts },
    ];
  }, [directory.length, discussions, referralBoard.requests]);

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
    <div className="space-y-8 bg-black">
      <div className="-m-4 mb-6 md:-m-6 md:mb-6">
        <HeroSection user={user} stats={heroStats} />
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <DashboardBentoGrid
            user={user}
            discoverPosts={discoverPosts}
            newsItems={newsItems}
            directoryCount={directory.length}
            onOpenFeed={() => navigate('/blog?tab=posts')}
            onOpenDirectory={() => navigate('/directory')}
            onCreatePost={(draft) => navigate('/blog?tab=posts', { state: { draftText: draft } })}
          />
        </div>

        <div className="w-full flex-shrink-0 lg:w-[340px] xl:w-[380px]">
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
