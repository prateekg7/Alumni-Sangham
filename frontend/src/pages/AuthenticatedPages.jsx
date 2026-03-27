import React from 'react';
import { Link, useLocation, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down.js';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up.js';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark.js';
import BriefcaseBusiness from 'lucide-react/dist/esm/icons/briefcase-business.js';
import Building2 from 'lucide-react/dist/esm/icons/building-2.js';
import Download from 'lucide-react/dist/esm/icons/download.js';
import Eye from 'lucide-react/dist/esm/icons/eye.js';
import FileText from 'lucide-react/dist/esm/icons/file-text.js';
import Flame from 'lucide-react/dist/esm/icons/flame.js';
import Globe from 'lucide-react/dist/esm/icons/globe.js';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap.js';
import Handshake from 'lucide-react/dist/esm/icons/handshake.js';
import LayoutGrid from 'lucide-react/dist/esm/icons/layout-grid.js';
import Link2 from 'lucide-react/dist/esm/icons/link-2.js';
import MapPin from 'lucide-react/dist/esm/icons/map-pin.js';
import MessageSquareText from 'lucide-react/dist/esm/icons/message-square-text.js';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper.js';
import Plus from 'lucide-react/dist/esm/icons/plus.js';
import Search from 'lucide-react/dist/esm/icons/search.js';
import Send from 'lucide-react/dist/esm/icons/send.js';
import Share2 from 'lucide-react/dist/esm/icons/share-2.js';
import SlidersHorizontal from 'lucide-react/dist/esm/icons/sliders-horizontal.js';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles.js';
import UserRound from 'lucide-react/dist/esm/icons/user-round.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getDirectoryProfiles,
  getProfileById,
  getReferralBoard,
  getSelfProfile,
} from '@/lib/profile-data';

const communityPosts = [
  {
    id: 'post-1',
    community: 'r/product-careers',
    author: 'Sana Ahmed',
    authorMeta: 'Alumni · Atlassian',
    time: '2h ago',
    title: 'PM internship openings for July 2026. IITP students with strong product writing can reach out.',
    body:
      'We are screening for early-career product candidates. Keep your profile complete, keep the resume public, and include one short paragraph on why you fit the role.',
    upvotes: 128,
    comments: 24,
    tag: 'Referral drop',
  },
  {
    id: 'post-2',
    community: 'r/backend-systems',
    author: 'Arjun Mehta',
    authorMeta: 'Alumni · Stripe',
    time: '5h ago',
    title: 'System design interview prep: the three failure modes I see most often in final-year resumes.',
    body:
      'Students usually over-index on tooling and under-explain tradeoffs. The best profiles show ownership, concrete scale, and clear decisions. I wrote a short breakdown in the comments.',
    upvotes: 203,
    comments: 39,
    tag: 'Advice',
  },
  {
    id: 'post-3',
    community: 'r/chapter-bengaluru',
    author: 'Ryan Crawford',
    authorMeta: 'Alumni · Atlassian',
    time: '8h ago',
    title: 'Bengaluru alumni meetup next Saturday. We will keep one round reserved for student referral reviews.',
    body:
      'If you are planning to attend, make sure your public profile is up to date. We will do quick resume reviews and direct job lead matching for students targeting product, design, and backend roles.',
    upvotes: 87,
    comments: 18,
    tag: 'Meetup',
  },
  {
    id: 'post-4',
    community: 'r/data-track',
    author: 'Rohan Iyer',
    authorMeta: 'Alumni · Northstar AI',
    time: '1d ago',
    title: 'Sharing a shortlist of analytics and experimentation roles that are worth applying to this week.',
    body:
      'I filtered for teams where strong problem-solving and clean project narratives matter more than flashy buzzwords. Comment if you want me to break down how I would tailor a resume for these.',
    upvotes: 164,
    comments: 31,
    tag: 'Jobs',
  },
];

const jobStories = [
  {
    title: 'Product Analyst · Finverse',
    meta: 'Shared by Sana Ahmed · Bengaluru · 2 days ago',
    description: 'Entry-level product analytics role with SQL, experimentation, and stakeholder communication.',
    type: 'Job',
  },
  {
    title: 'Guide: How to write outreach that alumni actually respond to',
    meta: 'Editorial · 6 min read',
    description: 'A compact playbook for making referral asks precise, respectful, and useful.',
    type: 'Article',
  },
  {
    title: 'Backend Engineer Intern · OrbitPay',
    meta: 'Shared by Meera Joshi · Amsterdam / Remote · 1 day ago',
    description: 'Platform-heavy internship focused on mobile backend APIs, observability, and testing discipline.',
    type: 'Job',
  },
];

const networkRules = [
  'Keep your resume public if you want referrals.',
  'Use real role context, not generic asks.',
  'Prefer concise posts with clear intent.',
  'Do not post personal contact details for others.',
];

const trendingTopics = ['Referrals', 'Backend', 'Product', 'Bengaluru', 'Internships'];

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.18em] text-[#5D5B71]">{eyebrow}</div>
        <h1 className="mt-3 auth-page-title">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#9694A8]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function SectionCard({ title, subtitle, action, className = '', children }) {
  return (
    <section className={cn('auth-card', className)}>
      {(title || subtitle || action) ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? <h2 className="text-base font-semibold text-[#E8E6F0]">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm leading-6 text-[#9694A8]">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={title || subtitle || action ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}

function Pill({ children, tone = 'default', className = '' }) {
  const toneClass =
    tone === 'primary'
      ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
      : tone === 'accent'
        ? 'bg-[#D946EF]/10 text-[#D946EF]'
        : tone === 'success'
          ? 'bg-[#34D399]/10 text-[#34D399]'
          : 'bg-[#0F0E17] text-[#9694A8]';

  return <span className={cn('auth-pill', toneClass, className)}>{children}</span>;
}

function RedditPostCard({ post }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#2A2940] bg-[#1A1925]">
      <div className="flex">
        <div className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-[#2A2940] bg-[#171621] px-2 py-4">
          <button type="button" className="text-[#9694A8] transition hover:text-[#E8E6F0]">
            <ArrowUp className="h-[18px] w-[18px] stroke-[1.5]" />
          </button>
          <span className="text-sm font-medium text-[#E8E6F0]">{post.upvotes}</span>
          <button type="button" className="text-[#9694A8] transition hover:text-[#E8E6F0]">
            <ArrowDown className="h-[18px] w-[18px] stroke-[1.5]" />
          </button>
        </div>

        <div className="min-w-0 flex-1 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5D5B71]">
            <span className="font-medium text-[#E8E6F0]">{post.community}</span>
            <span>•</span>
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.authorMeta}</span>
            <span>•</span>
            <span>{post.time}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill tone="accent">{post.tag}</Pill>
          </div>

          <h2 className="mt-3 text-lg font-semibold text-[#E8E6F0]">{post.title}</h2>
          <p className="mt-3 text-sm leading-6 text-[#9694A8]">{post.body}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#9694A8]">
            <button type="button" className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-[#242336] hover:text-[#E8E6F0]">
              <MessageSquareText className="h-[18px] w-[18px] stroke-[1.5]" />
              {post.comments} Comments
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-[#242336] hover:text-[#E8E6F0]">
              <Share2 className="h-[18px] w-[18px] stroke-[1.5]" />
              Share
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-[#242336] hover:text-[#E8E6F0]">
              <Bookmark className="h-[18px] w-[18px] stroke-[1.5]" />
              Save
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function StubPanel({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-[30px] border border-[#171a20] bg-[#111317] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-8">
      <div className="text-xs uppercase tracking-[0.24em] text-white/30">{eyebrow}</div>
      <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl" style={{ fontFamily: 'Syne, sans-serif' }}>
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function SurfaceCard({ title, subtitle, action, className, children }) {
  return (
    <section className={cn('rounded-[28px] border border-[#171a20] bg-[#14161a] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]', className)}>
      {(title || subtitle || action) ? (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {title ? <div className="text-[1.45rem] font-semibold tracking-tight text-white">{title}</div> : null}
            {subtitle ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={title || subtitle || action ? 'mt-5' : ''}>{children}</div>
    </section>
  );
}

function FieldList({ heading, icon: Icon, fields }) {
  return (
    <div className="rounded-[24px] bg-[#101216] p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/28">
        <Icon className="h-4 w-4" />
        {heading}
      </div>
      <div className="mt-5 space-y-4">
        {fields.map((field) => (
          <div key={field.label} className="grid gap-1 border-b border-[#171a20] pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
            <div className="text-sm text-white/36">{field.label}</div>
            <div className="text-sm leading-6 text-white/82">{field.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentTile({ document }) {
  const isResume = document.type === 'Resume';

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#171a20] bg-[#101216]">
      <div className={cn('h-28 bg-gradient-to-br p-4', document.tone)}>
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/82">
            {document.type}
          </div>
          {isResume ? (
            <div className="rounded-full bg-[#d8d0ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#17112d]">
              Public
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="text-lg font-semibold text-white">{document.title}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/28">{document.updatedAt}</div>
        </div>
        <p className="text-sm leading-relaxed text-white/46">{document.summary}</p>
        <div className="rounded-2xl bg-[#171a20] px-3 py-2 text-xs text-white/48">{document.visibility}</div>
        <Button variant="ghost" className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-white/76 hover:bg-[#1f232a] hover:text-white">
          {isResume ? <Download className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {document.actionLabel}
        </Button>
      </div>
    </div>
  );
}

function DocumentsPanel({ profile, isOwnProfile }) {
  return (
    <SurfaceCard
      title="Documents"
      subtitle="Your resume is explicitly public so anyone viewing this profile can open it directly."
      action={
        isOwnProfile ? (
          <Button variant="ghost" className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-white/78 hover:bg-[#1f232a] hover:text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add your resume
          </Button>
        ) : (
          <div className="rounded-full bg-[#171a20] px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/40">
            Public documents
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {profile.documents.map((document) => (
          <DocumentTile key={document.title} document={document} />
        ))}

        {isOwnProfile ? (
          <button
            type="button"
            className="flex min-h-[250px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#232730] bg-[#101216] p-6 text-center transition hover:border-[#343a46] hover:bg-[#15181e]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#171a20] text-white/72">
              <Plus className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xl font-semibold text-white">Add your resume</div>
            <div className="mt-2 max-w-xs text-sm leading-relaxed text-white/42">
              Uploading a resume keeps it visible to anyone who opens your public profile.
            </div>
          </button>
        ) : null}
      </div>
    </SurfaceCard>
  );
}

function IdentityCard({ profile }) {
  const roleGradient =
    profile.role === 'Alumni'
      ? 'from-[#10161f] via-[#192333] to-[#24182f]'
      : 'from-[#10161f] via-[#152331] to-[#182437]';

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#171a20] bg-[#14161a] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className={cn('relative flex min-h-[440px] flex-col overflow-hidden bg-gradient-to-br p-6', roleGradient)}>
        <div className="absolute inset-x-0 top-[42%] h-32 bg-[linear-gradient(90deg,rgba(89,93,255,0.2),rgba(86,153,255,0.12),rgba(0,0,0,0))]" />
        <div className="absolute left-1/2 top-20 flex h-32 w-32 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#101216] shadow-[0_18px_40px_rgba(0,0,0,0.36)]">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#9f8cff] to-[#4f81ff] text-2xl font-semibold text-white">
            {profile.initials}
          </div>
        </div>

        <div className="relative z-10 mt-[11.5rem] text-center">
          <div className="text-3xl font-semibold tracking-tight text-white">{profile.name}</div>
          <div className="mt-2 text-lg text-white/55">{profile.headline}</div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm text-white/70">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </div>
        </div>

        <div className="relative z-10 mt-auto space-y-3 pt-10 text-sm text-white/55">
          <div className="flex items-center justify-between gap-3">
            <span>{profile.memberCode}</span>
            <span>{profile.memberSince}</span>
          </div>
          <div>{profile.roleSummary}</div>
          <div>{profile.baseLabel}</div>
        </div>
      </div>
    </section>
  );
}

function TrackPanel({ profile }) {
  return (
    <SurfaceCard title={profile.trackTitle} subtitle={profile.trackSubtitle}>
      <div className="space-y-3">
        {profile.trackItems.map((item) => (
          <div key={item.title} className="relative overflow-hidden rounded-[22px] bg-[#101216] p-4 pl-5">
            <span className="absolute inset-y-4 left-0 w-[3px] rounded-r-full" style={{ backgroundColor: item.accent }} />
            <div className="text-lg font-semibold text-white">{item.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/55">{item.meta}</div>
            <div className="mt-3 inline-flex rounded-full bg-[#171a20] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/44">
              {item.note}
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

function ChecklistRow({ item }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] bg-[#101216] px-4 py-3">
      <div
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
          item.done ? 'bg-[#1c3e2a] text-[#8fe0aa]' : 'bg-[#171a20] text-white/32',
        )}
      >
        {item.done ? '✓' : ''}
      </div>
      <div className={cn('text-sm leading-6', item.done ? 'text-white/78' : 'text-white/42')}>{item.label}</div>
    </div>
  );
}

function ReferralActionCard({ profile }) {
  return (
    <div className="mb-4 rounded-[22px] bg-[#101216] p-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#1e2230] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#cbbfff]">
        <Handshake className="h-3.5 w-3.5" />
        Referral eligible
      </div>
      <div className="mt-4 text-xl font-semibold text-white">{profile.referralTarget.title}</div>
      <p className="mt-2 text-sm leading-relaxed text-white/45">{profile.referralTarget.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {profile.referralTarget.openings.map((opening) => (
          <div key={opening} className="rounded-full bg-[#171a20] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/50">
            {opening}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-[#171a20] px-4 py-3 text-sm leading-relaxed text-white/46">
        {profile.referralTarget.note}
      </div>
      <Button asChild className="mt-4 h-11 rounded-2xl border-0 bg-gradient-to-r from-[#c9beff] to-[#8f7bff] px-5 text-sm font-semibold text-[#140f28] hover:from-[#ddd6ff] hover:to-[#a293ff]">
        <Link
          to="/profile/me?tab=referrals"
          state={{
            requestTarget: {
              id: profile.id,
              name: profile.name,
              headline: profile.headline,
              openings: profile.referralTarget.openings,
            },
          }}
        >
          <Send className="mr-2 h-4 w-4" />
          Send referral request
        </Link>
      </Button>
    </div>
  );
}

function CompletionPanel({ checklist, isOwnProfile, viewerRole, profile, completeProfile, profileComplete }) {
  const completedCount = checklist.filter((item) => item.done).length;
  const studentViewingAlumni =
    viewerRole === 'student' &&
    profile.role === 'Alumni' &&
    !isOwnProfile &&
    Boolean(profile.referralTarget);

  return (
    <SurfaceCard
      title={`Profile completion ${completedCount}/${checklist.length}`}
      subtitle={
        isOwnProfile
          ? 'Shared basics stay common while role-specific completion depends on whether the account is alumni or student.'
          : 'The public profile only exposes the pieces intentionally marked visible to viewers.'
      }
    >
      {studentViewingAlumni ? <ReferralActionCard profile={profile} /> : null}

      <div className="space-y-3">
        {checklist.map((item) => (
          <ChecklistRow key={item.label} item={item} />
        ))}
      </div>

      {isOwnProfile && !profileComplete ? (
        <Button
          onClick={completeProfile}
          className="mt-5 h-11 rounded-2xl border-0 bg-gradient-to-r from-[#c9beff] to-[#8f7bff] px-5 text-sm font-semibold text-[#140f28] hover:from-[#ddd6ff] hover:to-[#a293ff]"
        >
          Finalize profile
        </Button>
      ) : null}
    </SurfaceCard>
  );
}

function PersonalInformationPanel({ profile, isOwnProfile }) {
  return (
    <SurfaceCard
      title="Personal information"
      subtitle={
        isOwnProfile
          ? 'The profile is role-aware: shared identity fields stay common, while the second block changes for alumni and students.'
          : 'This is the public information the profile owner chose to expose for community discovery.'
      }
      action={
        <div className="rounded-full bg-[#171a20] px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/42">
          {isOwnProfile ? 'Editable profile' : 'Public view'}
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <FieldList heading="Shared basics" icon={UserRound} fields={profile.personalFields} />
        <FieldList
          heading={profile.role === 'Alumni' ? 'Alumni-specific details' : 'Student-specific details'}
          icon={profile.role === 'Alumni' ? Building2 : GraduationCap}
          fields={profile.roleFields}
        />
      </div>

      <div className="mt-4 rounded-[24px] bg-[#101216] p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/28">
          <Sparkles className="h-4 w-4" />
          Public statement
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">{profile.about}</p>
      </div>
    </SurfaceCard>
  );
}

function ReferralRequestsView({ userRole, requestTarget }) {
  const board = getReferralBoard(userRole);
  const [draft, setDraft] = React.useState(() => {
    if (!requestTarget) {
      return '';
    }

    const opening = requestTarget.openings?.[0] || 'the role';
    return `Hi ${requestTarget.name}, I am interested in ${opening}. My resume is public on my profile, and I would really value your consideration for a referral.`;
  });

  if (userRole === 'student') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/30">Referrals</div>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl" style={{ fontFamily: 'Syne, sans-serif' }}>
              {board.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50 md:text-base">
              {board.description}
            </p>
          </div>
          <Button asChild variant="ghost" className="h-11 rounded-2xl border border-[#171a20] bg-[#171a20] px-5 text-sm text-white/78 hover:bg-[#1f232a] hover:text-white">
            <Link to="/directory">Browse alumni</Link>
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_320px]">
          <SurfaceCard
            title={requestTarget ? `Request ${requestTarget.name}` : 'Start a new request'}
            subtitle="Your public resume automatically travels with the request, so the alumni can review it directly from your profile."
          >
            <div className="rounded-[24px] bg-[#101216] p-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/28">Target alumnus</div>
                  <div className="mt-3 text-2xl font-semibold text-white">
                    {requestTarget ? requestTarget.name : 'Choose from the directory'}
                  </div>
                  <div className="mt-2 text-sm text-white/46">
                    {requestTarget
                      ? requestTarget.headline
                      : 'Open any alumni profile from the directory to prefill a referral request here.'}
                  </div>
                  {requestTarget ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {requestTarget.openings.map((opening) => (
                        <div key={opening} className="rounded-full bg-[#171a20] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/50">
                          {opening}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-[22px] bg-[#171a20] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/30">Attached automatically</div>
                  <div className="mt-3 text-lg font-semibold text-white">Public resume</div>
                  <div className="mt-2 text-sm leading-relaxed text-white/46">
                    Anyone reviewing your request can open the resume from your profile documents panel.
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/28">Referral note</div>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={6}
                  className="mt-3 w-full resize-none rounded-[22px] border border-[#171a20] bg-[#171a20] px-4 py-4 text-sm leading-7 text-white outline-none transition focus:border-[#2a3040]"
                  placeholder="Write a short, specific note explaining why you fit the role and why you are reaching out to this alumnus."
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#c9beff] to-[#8f7bff] px-5 text-sm font-semibold text-[#140f28] hover:from-[#ddd6ff] hover:to-[#a293ff]">
                  <Send className="mr-2 h-4 w-4" />
                  Send request
                </Button>
                <Button variant="ghost" className="h-11 rounded-2xl border border-[#171a20] bg-[#171a20] px-5 text-sm text-white/78 hover:bg-[#1f232a] hover:text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Preview public resume
                </Button>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard title="Before you send" subtitle="A strong referral request is short, specific, and backed by a visible resume.">
            <div className="space-y-3">
              {board.checklist.map((item) => (
                <div key={item} className="rounded-[20px] bg-[#101216] px-4 py-3 text-sm leading-6 text-white/62">
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard title="Active requests" subtitle="Track outgoing asks and keep follow-ups tight.">
          <div className="grid gap-4 lg:grid-cols-3">
            {board.requests.map((request) => (
              <div key={request.name + request.target} className="rounded-[22px] bg-[#101216] p-4">
                <div className="inline-flex rounded-full bg-[#1e2230] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#cbbfff]">
                  {request.status}
                </div>
                <div className="mt-4 text-xl font-semibold text-white">{request.name}</div>
                <div className="mt-2 text-sm text-white/50">{request.target}</div>
                <div className="mt-4 text-sm leading-relaxed text-white/42">{request.meta}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-white/30">Referrals</div>
        <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl" style={{ fontFamily: 'Syne, sans-serif' }}>
          {board.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50 md:text-base">
          {board.description}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_320px]">
        <SurfaceCard title="Incoming requests" subtitle="Each request assumes the student resume is already public and visible on their profile.">
          <div className="space-y-4">
            {board.requests.map((request) => (
              <div key={request.name + request.target} className="rounded-[22px] bg-[#101216] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-semibold text-white">{request.name}</div>
                    <div className="mt-1 text-sm text-white/48">{request.target}</div>
                  </div>
                  <div className="rounded-full bg-[#1e2230] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#cbbfff]">
                    {request.status}
                  </div>
                </div>
                <div className="mt-4 text-sm leading-relaxed text-white/44">{request.meta}</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="ghost" className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-sm text-white/76 hover:bg-[#1f232a] hover:text-white">
                    <Eye className="mr-2 h-4 w-4" />
                    View resume
                  </Button>
                  <Button variant="ghost" className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-sm text-white/76 hover:bg-[#1f232a] hover:text-white">
                    Ask for more context
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Review checklist" subtitle="The alumni side focuses on relevance, clarity, and whether the student profile is already mature enough to forward.">
          <div className="space-y-3">
            {board.checklist.map((item) => (
              <div key={item} className="rounded-[20px] bg-[#101216] px-4 py-3 text-sm leading-6 text-white/62">
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

export function DirectoryPage() {
  const { user } = useOutletContext();
  const profiles = React.useMemo(() => getDirectoryProfiles(), []);
  const viewerIsStudent = user.role.toLowerCase() === 'student';
  const [query, setQuery] = React.useState('');
  const [selectedRegions, setSelectedRegions] = React.useState([]);
  const [selectedDomains, setSelectedDomains] = React.useState([]);
  const [selectedSupportModes, setSelectedSupportModes] = React.useState([]);
  const [selectedSkills, setSelectedSkills] = React.useState([]);
  const [referralOnly, setReferralOnly] = React.useState(false);

  const toggleSelection = React.useCallback((setter, value) => {
    setter((current) => (current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]));
  }, []);

  const regionOptions = React.useMemo(() => {
    const counts = new Map();
    profiles.forEach((profile) => {
      counts.set(profile.region, (counts.get(profile.region) || 0) + 1);
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [profiles]);

  const domainOptions = React.useMemo(() => {
    const counts = new Map();
    profiles.forEach((profile) => {
      counts.set(profile.domain, (counts.get(profile.domain) || 0) + 1);
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [profiles]);

  const supportModeOptions = React.useMemo(() => {
    const counts = new Map();
    profiles.forEach((profile) => {
      profile.supportModes.forEach((mode) => {
        counts.set(mode, (counts.get(mode) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [profiles]);

  const skillOptions = React.useMemo(() => {
    const counts = new Map();
    profiles.forEach((profile) => {
      profile.skills.forEach((skill) => {
        counts.set(skill, (counts.get(skill) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count;
        }

        return left.label.localeCompare(right.label);
      })
      .slice(0, 12);
  }, [profiles]);

  const filteredProfiles = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...profiles]
      .filter((profile) => {
        if (selectedRegions.length && !selectedRegions.includes(profile.region)) {
          return false;
        }

        if (selectedDomains.length && !selectedDomains.includes(profile.domain)) {
          return false;
        }

        if (selectedSupportModes.length && !selectedSupportModes.some((mode) => profile.supportModes.includes(mode))) {
          return false;
        }

        if (selectedSkills.length && !selectedSkills.some((skill) => profile.skills.includes(skill))) {
          return false;
        }

        if (referralOnly && !profile.referralOpen) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const haystack = [
          profile.name,
          profile.title,
          profile.company,
          profile.headline,
          profile.focus,
          profile.location,
          profile.region,
          profile.chapter,
          profile.domain,
          profile.years,
          ...profile.supportModes,
          ...profile.skills,
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .sort((left, right) => {
        if (viewerIsStudent && left.referralOpen !== right.referralOpen) {
          return Number(right.referralOpen) - Number(left.referralOpen);
        }

        return left.name.localeCompare(right.name);
      });
  }, [
    profiles,
    query,
    referralOnly,
    selectedDomains,
    selectedRegions,
    selectedSkills,
    selectedSupportModes,
    viewerIsStudent,
  ]);

  const chapterPreview = React.useMemo(() => {
    const counts = new Map();
    filteredProfiles.forEach((profile) => {
      counts.set(profile.chapter, (counts.get(profile.chapter) || 0) + 1);
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count;
        }

        return left.label.localeCompare(right.label);
      })
      .slice(0, 4);
  }, [filteredProfiles]);

  const activeFilters = [
    ...selectedRegions.map((value) => ({ type: 'region', label: value })),
    ...selectedDomains.map((value) => ({ type: 'domain', label: value })),
    ...selectedSupportModes.map((value) => ({ type: 'support', label: value })),
    ...selectedSkills.map((value) => ({ type: 'skill', label: value })),
    ...(referralOnly ? [{ type: 'referral', label: 'Referral open' }] : []),
  ];

  const clearAllFilters = React.useCallback(() => {
    setQuery('');
    setSelectedRegions([]);
    setSelectedDomains([]);
    setSelectedSupportModes([]);
    setSelectedSkills([]);
    setReferralOnly(false);
  }, []);

  const removeActiveFilter = React.useCallback(
    (filter) => {
      if (filter.type === 'region') {
        setSelectedRegions((current) => current.filter((item) => item !== filter.label));
        return;
      }

      if (filter.type === 'domain') {
        setSelectedDomains((current) => current.filter((item) => item !== filter.label));
        return;
      }

      if (filter.type === 'support') {
        setSelectedSupportModes((current) => current.filter((item) => item !== filter.label));
        return;
      }

      if (filter.type === 'skill') {
        setSelectedSkills((current) => current.filter((item) => item !== filter.label));
        return;
      }

      if (filter.type === 'referral') {
        setReferralOnly(false);
      }
    },
    [],
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[34px] bg-[#0c0d10] px-6 py-7 shadow-[0_36px_100px_rgba(0,0,0,0.38)] md:px-8 md:py-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#14161b] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
              <Globe className="h-3.5 w-3.5" />
              Networking
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'Syne, sans-serif' }}>
              Networking directory
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/52 md:text-base">
              A filter-first alumni directory built for fast discovery. Students and alumni can search by region, domain, support style, and skills, then open any profile to inspect their public resume and networking context.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/28" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search alumni, companies, cities, chapters, or skills..."
                className="h-14 w-full rounded-[24px] border border-[#121418] bg-[#121418] pl-12 pr-14 text-sm text-white outline-none transition placeholder:text-white/24 focus:bg-[#161920]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#1a1d24] text-white/42 transition hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="rounded-full bg-[#14161b] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/42">
                {profiles.length} alumni listed
              </div>
              <div className="rounded-full bg-[#14161b] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/42">
                Public resume on every profile
              </div>
              <div className="rounded-full bg-[#14161b] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/42">
                {viewerIsStudent ? 'Students can request referrals' : 'Alumni can scout peers and chapters'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <section className="rounded-[30px] bg-[#0f1013] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
            <div className="flex items-center gap-2 text-sm font-medium text-white/58">
              <SlidersHorizontal className="h-4 w-4" />
              Filter alumni
            </div>
            <p className="mt-2 text-sm leading-6 text-white/42">
              Narrow the list by geography, practice area, support style, and skill signals.
            </p>

            <div className="mt-5 rounded-[22px] bg-[#121418] p-4">
              <button
                type="button"
                onClick={() => setReferralOnly((current) => !current)}
                className={cn(
                  'flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition',
                  referralOnly ? 'bg-[#1f2230] text-[#cec3ff]' : 'bg-[#171a20] text-white/62 hover:bg-[#1b1f27]',
                )}
              >
                <span>
                  <span className="block text-sm font-semibold">Referral friendly</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-current/70">Show alumni open to referral asks</span>
                </span>
                <Handshake className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/28">Location</div>
                <div className="mt-3 space-y-2">
                  {regionOptions.map((region) => {
                    const checked = selectedRegions.includes(region.label);

                    return (
                      <button
                        key={region.label}
                        type="button"
                        onClick={() => toggleSelection(setSelectedRegions, region.label)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition',
                          checked ? 'bg-[#171d2a] text-white' : 'bg-[#121418] text-white/62 hover:bg-[#171a20]',
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded-[5px] border',
                              checked ? 'border-[#8f7cff] bg-[#8f7cff]' : 'border-[#2a2e37] bg-transparent',
                            )}
                          >
                            {checked ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                          </span>
                          <span className="text-sm">{region.label}</span>
                        </span>
                        <span className="text-xs uppercase tracking-[0.18em] text-white/28">{region.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/28">Domain</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {domainOptions.map((domain) => {
                    const active = selectedDomains.includes(domain.label);

                    return (
                      <button
                        key={domain.label}
                        type="button"
                        onClick={() => toggleSelection(setSelectedDomains, domain.label)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm transition',
                          active ? 'bg-[#20253a] text-[#d4ccff]' : 'bg-[#121418] text-white/58 hover:bg-[#171a20] hover:text-white/82',
                        )}
                      >
                        {domain.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/28">Open to</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {supportModeOptions.map((mode) => {
                    const active = selectedSupportModes.includes(mode.label);

                    return (
                      <button
                        key={mode.label}
                        type="button"
                        onClick={() => toggleSelection(setSelectedSupportModes, mode.label)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm transition',
                          active ? 'bg-[#1b2837] text-[#bfe0ff]' : 'bg-[#121418] text-white/58 hover:bg-[#171a20] hover:text-white/82',
                        )}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/28">Skills</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skillOptions.map((skill) => {
                    const active = selectedSkills.includes(skill.label);

                    return (
                      <button
                        key={skill.label}
                        type="button"
                        onClick={() => toggleSelection(setSelectedSkills, skill.label)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm transition',
                          active ? 'bg-[#22202d] text-[#e4d8ff]' : 'bg-[#121418] text-white/58 hover:bg-[#171a20] hover:text-white/82',
                        )}
                      >
                        {skill.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] bg-[#0f1013] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/28">Discovery notes</div>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] bg-[#121418] p-4">
                <div className="text-sm font-semibold text-white">Alumni only</div>
                <p className="mt-2 text-sm leading-6 text-white/42">
                  This surface is intentionally alumni-only. Students and alumni both search here, but every result routes into a public alumni profile.
                </p>
              </div>
              <div className="rounded-[22px] bg-[#121418] p-4">
                <div className="text-sm font-semibold text-white">Public resume visibility</div>
                <p className="mt-2 text-sm leading-6 text-white/42">
                  Resume access is consistent across the network, so profile viewers can inspect the document before reaching out.
                </p>
              </div>
              <div className="rounded-[22px] bg-[#121418] p-4">
                <div className="text-sm font-semibold text-white">{viewerIsStudent ? 'Referral workflow' : 'Networking workflow'}</div>
                <p className="mt-2 text-sm leading-6 text-white/42">
                  {viewerIsStudent
                    ? 'When an alumni is open to referrals, the profile view exposes the referral request path directly.'
                    : 'Open any alumni profile to inspect role history, chapter context, and shared documents before connecting.'}
                </p>
              </div>
            </div>
          </section>
        </aside>

        <div className="space-y-5">
          <section className="rounded-[30px] bg-[#0f1013] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/28">Results</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {filteredProfiles.length} alumni match{filteredProfiles.length === 1 ? '' : 'es'}
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/46">
                  Search results prioritize quick signal reading: who the alumnus is, where they are, what they help with, and whether they are currently referral friendly.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {chapterPreview.map((chapter) => (
                  <div key={chapter.label} className="rounded-[20px] bg-[#121418] px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/26">Chapter</div>
                    <div className="mt-2 text-sm font-semibold text-white">{chapter.label}</div>
                    <div className="mt-1 text-xs text-white/38">{chapter.count} alumni</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {activeFilters.length ? (
                activeFilters.map((filter) => (
                  <button
                    key={`${filter.type}-${filter.label}`}
                    type="button"
                    onClick={() => removeActiveFilter(filter)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#141922] px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/58 transition hover:text-white"
                  >
                    {filter.label}
                    <X className="h-3.5 w-3.5" />
                  </button>
                ))
              ) : (
                <div className="rounded-full bg-[#121418] px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/34">
                  No filters applied
                </div>
              )}

              {(activeFilters.length || query) ? (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="h-9 rounded-full border-0 bg-[#171a20] px-4 text-xs uppercase tracking-[0.18em] text-white/72 hover:bg-[#1d2129] hover:text-white"
                >
                  Reset all
                </Button>
              ) : null}
            </div>
          </section>

          <div className="grid gap-4">
            {filteredProfiles.length ? (
              filteredProfiles.map((profile) => (
                <Link
                  key={profile.id}
                  to={`/profile/${profile.id}`}
                  className="group block rounded-[30px] bg-[#0f1013] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.24)] transition hover:bg-[#12151b]"
                >
                  <article className="relative overflow-hidden rounded-[24px] bg-[#111317] p-5">
                    <div className="absolute inset-y-6 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#8f7cff] via-[#5f88ff] to-[#89d8ff]" />

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex gap-4 pl-2">
                        <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br text-base font-semibold text-white', profile.avatarTone)}>
                          {profile.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-2xl font-semibold tracking-tight text-white">{profile.name}</h2>
                            <span className="rounded-full bg-[#171a20] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/40">
                              {profile.batchLabel}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-white/56">{profile.title} at {profile.company}</div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#171a20] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/42">
                              <MapPin className="h-3.5 w-3.5" />
                              {profile.location}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#171a20] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/42">
                              <BriefcaseBusiness className="h-3.5 w-3.5" />
                              {profile.domain}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#171a20] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/42">
                              <Link2 className="h-3.5 w-3.5" />
                              Public resume
                            </div>
                            {profile.referralOpen ? (
                              <div className="inline-flex items-center gap-2 rounded-full bg-[#1d2230] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#cfc3ff]">
                                <Handshake className="h-3.5 w-3.5" />
                                Referral open
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#171a20] px-4 py-2 text-sm text-white/76 transition group-hover:text-white">
                        View profile
                        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
                      <div className="rounded-[22px] bg-[#0d0f13] p-4">
                        <div className="text-xs uppercase tracking-[0.22em] text-white/26">What they help with</div>
                        <p className="mt-3 text-sm leading-7 text-white/58">{profile.focus}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {profile.supportModes.map((mode) => (
                            <span key={mode} className="rounded-full bg-[#171a20] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/42">
                              {mode}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[22px] bg-[#0d0f13] p-4">
                        <div className="grid gap-3 text-sm text-white/58">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-white/32">Chapter</span>
                            <span className="font-medium text-white/78">{profile.chapter}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-white/32">Region</span>
                            <span className="font-medium text-white/78">{profile.region}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-white/32">Experience</span>
                            <span className="font-medium text-white/78">{profile.years}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 pl-2">
                      {profile.skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-[#171a20] px-3 py-1 text-xs text-white/46">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <section className="rounded-[30px] bg-[#0f1013] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14161b] text-white/52">
                  <Search className="h-7 w-7" />
                </div>
                <div className="mt-5 text-2xl font-semibold text-white">No alumni match this filter set</div>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/46">
                  Try widening the search terms, removing one or two chips, or switching off the referral-only filter to bring more alumni back into the list.
                </p>
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="mt-5 h-11 rounded-2xl border-0 bg-[#171a20] px-5 text-sm text-white/78 hover:bg-[#1f232a] hover:text-white"
                >
                  Reset filters
                </Button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'jobs' ? 'jobs' : 'posts';
  const draftText = typeof location.state?.draftText === 'string' ? location.state.draftText.trim() : '';
  const [composerText, setComposerText] = React.useState(draftText);

  React.useEffect(() => {
    setComposerText(draftText);
  }, [draftText]);

  if (activeTab === 'jobs') {
    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow="Blog & Jobs"
          title="Jobs and articles"
          description="Curated roles and useful writing from the alumni network. Flat, scannable, and easy to move through."
          action={
            <div className="flex flex-wrap gap-2">
              <Link to="/blog?tab=posts" className="auth-btn-secondary inline-flex h-10 items-center px-4">
                Posts
              </Link>
              <Link to="/blog?tab=jobs" className="auth-btn-primary inline-flex h-10 items-center px-4">
                Jobs & Articles
              </Link>
            </div>
          }
        />

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {jobStories.map((item) => (
            <SectionCard
              key={item.title}
              title={item.title}
              subtitle={item.meta}
              action={<Pill tone={item.type === 'Job' ? 'primary' : 'accent'}>{item.type}</Pill>}
            >
              <p className="text-sm leading-6 text-[#9694A8]">{item.description}</p>
              <Button variant="ghost" className="auth-btn-secondary mt-4 h-10 px-4">
                Open
              </Button>
            </SectionCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Posts"
        title="Community feed"
        description="A Reddit-style post feed for alumni updates, job drops, referral notes, and community conversations."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/blog?tab=posts" className="auth-btn-primary inline-flex h-10 items-center px-4">
              Posts
            </Link>
            <Link to="/blog?tab=jobs" className="auth-btn-secondary inline-flex h-10 items-center px-4">
              Jobs & Articles
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard title="Create post" subtitle="Write here or arrive from the dashboard composer. Publishing happens from this feed surface.">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6C63FF]/15 text-sm font-semibold text-[#6C63FF]">
                AC
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={composerText}
                  onChange={(event) => setComposerText(event.target.value)}
                  rows={4}
                  className="auth-input min-h-[112px] resize-none"
                  placeholder="Create a post for the alumni network..."
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Pill>
                      <LayoutGrid className="h-3.5 w-3.5" />
                      Text
                    </Pill>
                    <Pill>
                      <FileText className="h-3.5 w-3.5" />
                      Resume-aware
                    </Pill>
                  </div>
                  <Button className="auth-btn-primary h-10 px-4">Post</Button>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Sort"
            subtitle="Reddit-style feed controls with compact ordering."
            action={<SlidersHorizontal className="h-[18px] w-[18px] text-[#9694A8]" />}
          >
            <div className="flex flex-wrap gap-2">
              <Pill tone="primary">Best</Pill>
              <Pill>New</Pill>
              <Pill>Top</Pill>
              <Pill>Hot</Pill>
            </div>
          </SectionCard>

          <div className="space-y-4">
            {communityPosts.map((post) => (
              <RedditPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard title="Network rules" subtitle="Simple, practical posting expectations.">
            <div className="space-y-3">
              {networkRules.map((rule, index) => (
                <div key={rule} className="flex gap-3 rounded-md border border-[#2A2940] bg-[#0F0E17] p-3">
                  <div className="text-sm font-medium text-[#E8E6F0]">{index + 1}</div>
                  <div className="text-sm leading-6 text-[#9694A8]">{rule}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Trending topics" subtitle="What the network is actively talking about this week.">
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic) => (
                <Pill key={topic} tone="accent">
                  <Flame className="h-3.5 w-3.5" />
                  {topic}
                </Pill>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Why this feed works" subtitle="The posts surface borrows Reddit’s scanning model because it is efficient for dense communities.">
            <div className="space-y-3 text-sm leading-6 text-[#9694A8]">
              <p>Vote rails make priority obvious.</p>
              <p>Compact metadata helps you decide whether to open, save, or comment.</p>
              <p>The right rail keeps rules and trending topics visible without blocking the feed.</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const {
    user,
    profileComplete,
    completeProfile,
  } = useOutletContext();

  const referralsTab = searchParams.get('tab') === 'referrals';
  const viewerRole = user.role.toLowerCase();
  const isOwnProfile = !params.profileId || params.profileId === 'me';
  const baseProfile = isOwnProfile ? getSelfProfile(user) : getProfileById(params.profileId);

  if (!baseProfile) {
    return (
      <StubPanel
        eyebrow="Profile"
        title="Profile not found"
        description="This demo route does not have a profile wired to it yet. Use the directory to jump into the available alumni fixtures."
      >
        <Button asChild className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#c9beff] to-[#8f7bff] px-5 text-sm font-semibold text-[#140f28] hover:from-[#ddd6ff] hover:to-[#a293ff]">
          <Link to="/directory">Go to directory</Link>
        </Button>
      </StubPanel>
    );
  }

  const checklist = isOwnProfile && profileComplete
    ? baseProfile.checklist.map((item) => ({ ...item, done: true }))
    : baseProfile.checklist;

  if (referralsTab) {
    return (
      <ReferralRequestsView
        userRole={viewerRole}
        requestTarget={location.state?.requestTarget || null}
      />
    );
  }

  const canRequestReferral =
    viewerRole === 'student' && baseProfile.role === 'Alumni' && !isOwnProfile && Boolean(baseProfile.referralTarget);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white/30">Profile</div>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl" style={{ fontFamily: 'Syne, sans-serif' }}>
            {isOwnProfile ? 'My Profile' : baseProfile.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50 md:text-base">
            {isOwnProfile
              ? 'The profile is split into shared identity, public resume visibility, and role-specific sections so the same surface works for both alumni and students.'
              : 'This public profile exposes shared basics, a visible resume, and role-specific context to help the community discover and trust the person quickly.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-full bg-[#171a20] px-4 py-2 text-sm text-white/72">{baseProfile.role}</div>
          <div className="rounded-full bg-[#171a20] px-4 py-2 text-sm text-white/52">{baseProfile.roleSummary}</div>
          <div className="rounded-full bg-[#171a20] px-4 py-2 text-sm text-white/52">Resume visible to viewers</div>
          {canRequestReferral ? (
            <Button asChild className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#c9beff] to-[#8f7bff] px-5 text-sm font-semibold text-[#140f28] hover:from-[#ddd6ff] hover:to-[#a293ff]">
              <Link
                to="/profile/me?tab=referrals"
                state={{
                  requestTarget: {
                    id: baseProfile.id,
                    name: baseProfile.name,
                    headline: baseProfile.headline,
                    openings: baseProfile.referralTarget.openings,
                  },
                }}
              >
                <Handshake className="mr-2 h-4 w-4" />
                Request referral
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <PersonalInformationPanel profile={baseProfile} isOwnProfile={isOwnProfile} />
        <DocumentsPanel profile={baseProfile} isOwnProfile={isOwnProfile} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)_320px]">
        <IdentityCard profile={baseProfile} />
        <TrackPanel profile={baseProfile} />
        <CompletionPanel
          checklist={checklist}
          isOwnProfile={isOwnProfile}
          viewerRole={viewerRole}
          profile={baseProfile}
          completeProfile={completeProfile}
          profileComplete={profileComplete}
        />
      </div>
    </div>
  );
}
