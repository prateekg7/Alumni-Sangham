import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import HeroSection from '../components/dashboard/HeroSection';
import DiscoverCard from '../components/dashboard/cards/DiscoverCard';
import LatestNewsCard from '../components/dashboard/cards/LatestNewsCard';
import CreatePostCard from '../components/dashboard/cards/CreatePostCard';
import CompleteProfileCard from '../components/dashboard/cards/CompleteProfileCard';
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

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, profileProgress, profileComplete } = useOutletContext();
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
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

  const rightPanelStats = useMemo(
    () => ({
      directoryCount: directory.length || 0,
      hallOfFameCount: hallOfFame.length || 0,
      referralCount: referralBoard.requests.length || 0,
    }),
    [directory.length, hallOfFame.length, referralBoard.requests.length],
  );

  return (
    <div className="space-y-6">
      <div className="-m-4 mb-6 md:-m-6 md:mb-6">
        <HeroSection user={user} stats={heroStats} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto">
        <div className="flex-1 min-w-0 transition-all duration-300 flex flex-col">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 bg-[#101010]">
            <DiscoverCard posts={discoverPosts} onOpenFeed={() => navigate('/blog?tab=posts')} />
            <LatestNewsCard items={newsItems} onOpenAll={() => navigate('/directory')} />
            <CreatePostCard
              user={user}
              onCreate={(draft) => navigate('/blog?tab=posts', { state: { draftText: draft } })}
            />
            <CompleteProfileCard
              user={user}
              profileProgress={profileProgress}
              profileComplete={profileComplete}
              onOpenProfile={() => navigate('/profile/me')}
              onOpenDirectory={() => navigate('/directory')}
            />
          </div>
        </div>

        <div className={`transition-all duration-300 flex-shrink-0 ${rightPanelCollapsed ? 'w-0 overflow-hidden' : 'w-full lg:w-[320px] xl:w-[380px]'}`}>
          <RightPanel
            user={user}
            profile={profile}
            stats={rightPanelStats}
            referrals={referralBoard.requests.slice(0, 5)}
            isCollapsed={rightPanelCollapsed}
            onToggle={() => setRightPanelCollapsed((current) => !current)}
            onOpenDirectory={() => navigate('/directory')}
            onOpenReferrals={() => navigate('/profile/me?tab=referrals')}
          />
        </div>

        {rightPanelCollapsed ? (
          <button
            type="button"
            onClick={() => setRightPanelCollapsed(false)}
            className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black p-2 rounded-l hover:bg-yellow-500 transition-colors z-50 shadow-lg"
            title="Expand right panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
