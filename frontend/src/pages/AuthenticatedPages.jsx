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
import Mail from 'lucide-react/dist/esm/icons/mail.js';
import MapPin from 'lucide-react/dist/esm/icons/map-pin.js';
import MessageSquareText from 'lucide-react/dist/esm/icons/message-square-text.js';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper.js';
import Plus from 'lucide-react/dist/esm/icons/plus.js';
import Search from 'lucide-react/dist/esm/icons/search.js';
import Send from 'lucide-react/dist/esm/icons/send.js';
import Share2 from 'lucide-react/dist/esm/icons/share-2.js';
import { INDIAN_STATES } from '../lib/locations';
import { INDUSTRY_OPTIONS } from '../lib/industries';
import SlidersHorizontal from 'lucide-react/dist/esm/icons/sliders-horizontal.js';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles.js';
import SquarePen from 'lucide-react/dist/esm/icons/square-pen.js';
import UserRound from 'lucide-react/dist/esm/icons/user-round.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import { CompanyAutocomplete } from '../components/ui/CompanyAutocomplete';
import { Button } from '@/components/ui/button';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { cn } from '@/lib/utils';
import { PRE_CURATED_COMPANIES } from '@/lib/companies';
import { DEPARTMENTS } from '@/lib/departments';
import {
  createDiscussionPost,
  createReferralRequest,
  fetchDirectory,
  fetchDiscussionFeed,
  fetchMyProfile,
  fetchPublicProfile,
  fetchReferralBoard,
  patchMyProfile,
  patchUser,
  resolvePublicAssetUrl,
  uploadResume,
} from '@/lib/api';

function formatRelativeTime(iso) {
  if (!iso) {
    return 'Recently';
  }
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) {
    return 'Just now';
  }
  if (h < 24) {
    return `${h}h ago`;
  }
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

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
            {post.authorPhotoUrl ? (
              <img
                src={resolvePublicAssetUrl(post.authorPhotoUrl)}
                alt={post.author}
                className="h-6 w-6 rounded-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C63FF]/15 text-[9px] font-bold text-[#6C63FF]">
                {(post.author || '?').split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
              </div>
            )}
            <span className="font-medium text-[#E8E6F0]">{post.community}</span>
            <span>•</span>
            {post.authorProfileKey ? (
              <Link to={`/profile/${post.authorProfileKey}`} className="hover:text-[#E8E6F0] hover:underline transition">{post.author}</Link>
            ) : (
              <span>{post.author}</span>
            )}
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

function fieldByLabel(fields, label) {
  const row = fields?.find((f) => f.label === label);
  if (!row) {
    return '';
  }
  const v = row.value;
  if (v === '—' || v === 'Hidden') {
    return '';
  }
  return String(v);
}

function splitTagString(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqStrings(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

function buildProfileInterestTags(profile) {
  return uniqStrings([
    ...(Array.isArray(profile.interests) ? profile.interests : []),
    ...(Array.isArray(profile.skills) ? profile.skills : []),
    ...(Array.isArray(profile.supportModes) ? profile.supportModes : []),
    ...splitTagString(fieldByLabel(profile.roleFields, 'Target roles')),
    ...splitTagString(fieldByLabel(profile.roleFields, 'Focus areas')),
    profile.domain,
    profile.chapter,
  ]).slice(0, 10);
}

function buildProfileFacts(profile) {
  if (profile.role === 'Student') {
    return [
      { label: 'Program', value: fieldByLabel(profile.roleFields, 'Program') || profile.department || 'Student' },
      { label: 'Class of', value: fieldByLabel(profile.roleFields, 'Graduation year') || '—' },
      { label: 'Cumulative GPA', value: fieldByLabel(profile.roleFields, 'CGPA') || '—' },
      { label: 'Target role', value: splitTagString(fieldByLabel(profile.roleFields, 'Target roles'))[0] || '—' },
    ];
  }

  return [
    { label: 'Company', value: fieldByLabel(profile.roleFields, 'Current company') || '—' },
    { label: 'Role', value: fieldByLabel(profile.roleFields, 'Current role') || '—' },
    { label: 'Experience', value: fieldByLabel(profile.roleFields, 'Experience') || '—' },
    {
      label: 'Open to',
      value:
        (Array.isArray(profile.supportModes) && profile.supportModes[0]) ||
        splitTagString(fieldByLabel(profile.roleFields, 'Mentorship'))[0] ||
        profile.domain ||
        'Networking',
    },
  ];
}

function buildNarrativeMeta(profile) {
  return uniqStrings([
    profile.role,
    profile.baseLabel,
    profile.region,
    profile.chapter,
    profile.domain,
    profile.emailVisible ? 'Visible email' : '',
    'Public resume',
  ]).slice(0, 6);
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
  const fileHref = document.fileUrl ? resolvePublicAssetUrl(document.fileUrl) : '';

  const actionBtn = (
    <Button
      variant="ghost"
      className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-white/76 hover:bg-[#1f232a] hover:text-white"
      disabled={!fileHref}
      asChild={Boolean(fileHref)}
    >
      {fileHref ? (
        <a href={fileHref} target="_blank" rel="noopener noreferrer">
          {isResume ? <Download className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {document.actionLabel}
        </a>
      ) : (
        <span>
          {isResume ? <Download className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {document.actionLabel}
        </span>
      )}
    </Button>
  );

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
        {actionBtn}
      </div>
    </div>
  );
}

function DocumentsPanel({ profile, isOwnProfile, onResumeUploaded }) {
  const fileRef = React.useRef(null);
  const [uploadBusy, setUploadBusy] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');

  const triggerPick = () => {
    setUploadError('');
    fileRef.current?.click();
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    setUploadBusy(true);
    setUploadError('');
    try {
      await uploadResume(file);
      await onResumeUploaded?.();
    } catch (e) {
      setUploadError(e.message || 'Upload failed');
    } finally {
      setUploadBusy(false);
    }
  };

  return (
    <section className="space-y-6" id="documents">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-[1.8rem] font-semibold tracking-tight text-white">Portfolio documents</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/45">
            {isOwnProfile
              ? 'Your resume stays public to everyone who opens this profile. Upload updated files here without changing the profile layout.'
              : `${profile.name.split(' ')[0]}'s resume is publicly visible and can be opened directly from this profile.`}
          </p>
        </div>
        {isOwnProfile ? (
          <>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={onFile}
            />
            <Button
              type="button"
              variant="ghost"
              disabled={uploadBusy}
              onClick={triggerPick}
              className="h-10 rounded-xl border border-[#2a3040] bg-[#171b22] px-4 text-white/78 hover:bg-[#1d2129] hover:text-white disabled:opacity-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              {uploadBusy ? 'Uploading…' : 'Add your resume'}
            </Button>
          </>
        ) : null}
      </div>

      {uploadError ? <div className="text-sm text-rose-300">{uploadError}</div> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {profile.documents.map((document) => {
          const fileHref = document.fileUrl ? resolvePublicAssetUrl(document.fileUrl) : '';
          const isResume = document.type === 'Resume';

          return (
            <div
              key={`${document.title}-${document.updatedAt}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#2a3040]/50 bg-[#161a21] p-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#20242d] text-[#c0c1ff]">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{document.title}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/28">
                    {document.updatedAt || 'On profile'}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/42">{document.visibility}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {fileHref ? (
                  <>
                    <a
                      href={fileHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#20242d] text-white/58 transition hover:text-white"
                      aria-label={`Open ${document.title}`}
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <a
                      href={fileHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#20242d] text-[#c0c1ff] transition hover:text-white"
                      aria-label={`Download ${document.title}`}
                    >
                      {isResume ? <Download className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </a>
                  </>
                ) : (
                  <div className="rounded-xl bg-[#20242d] px-3 py-2 text-xs text-white/40">No file</div>
                )}
              </div>
            </div>
          );
        })}

        {isOwnProfile ? (
          <button
            type="button"
            disabled={uploadBusy}
            onClick={triggerPick}
            className="flex min-h-[156px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#31384a] bg-[#12161d] p-6 text-center transition hover:border-[#44e2cd]/40 hover:bg-[#171b22] disabled:opacity-50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d2230] text-[#44e2cd]">
              <Plus className="h-6 w-6" />
            </div>
            <div className="mt-4 text-sm font-semibold tracking-wide text-white">Drop new files here</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/28">
              PDF, DOCX up to 10MB
            </div>
          </button>
        ) : null}
      </div>
    </section>
  );
}

function ProfileHeroSidebar({ profile, isOwnProfile, onEdit }) {
  const email = fieldByLabel(profile.personalFields, 'Email');
  const linkedinUrl = fieldByLabel(profile.personalFields, 'LinkedIn');
  const portfolioUrl = fieldByLabel(profile.personalFields, 'Portfolio');
  const avatarSrc = profile.photoUrl ? resolvePublicAssetUrl(profile.photoUrl) : '';
  const socialButtons = [
    { href: linkedinUrl, icon: Link2, label: 'Open LinkedIn' },
    { href: portfolioUrl, icon: Globe, label: 'Open portfolio' },
  ].filter((item) => item.href);

  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <div className="group relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#44e2cd] to-[#8083ff] opacity-30 blur transition duration-500 group-hover:opacity-55" />
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[#2d3340] bg-[#171b22] p-1">
            {avatarSrc ? (
              <img src={avatarSrc} alt={profile.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-4xl font-semibold text-[#101419]">
                {profile.initials}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h1 className="font-headline text-4xl font-black tracking-tight text-[#e0e2ea]">{profile.name}</h1>
          <p className="text-base font-medium text-[#c7c4d7]">{profile.headline}</p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
          {email ? (
            <div className="flex items-center gap-2 rounded-full border border-[#2d3340] bg-[#171b22] px-3 py-1.5 text-sm text-[#c7c4d7]">
              <Mail className="h-4 w-4 text-[#44e2cd]" />
              <span>{email}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2 rounded-full border border-[#2d3340] bg-[#171b22] px-3 py-1.5 text-sm text-[#c7c4d7]">
            <MapPin className="h-4 w-4 text-[#c0c1ff]" />
            <span>{profile.location}</span>
          </div>
        </div>

        {socialButtons.length || isOwnProfile ? (
          <div className="mt-5 flex items-center gap-3">
            {socialButtons.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c2025] text-[#c7c4d7] transition hover:text-[#44e2cd]"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              );
            })}

            {isOwnProfile ? (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1c2025] px-4 py-2 text-sm font-medium text-[#e0e2ea] transition hover:text-[#44e2cd]"
              >
                <SquarePen className="h-4 w-4" />
                Edit
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProfileStrengthPanel({ checklist, profileProgress, profileComplete, completeProfile }) {
  const nextItem = checklist.find((item) => !item.done)?.label;

  return (
    <section className="rounded-2xl border border-[#2d3340]/40 bg-[#171b22] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#e0e2ea]">Profile Strength</h3>
        <span className="text-sm font-semibold text-[#44e2cd]">{profileProgress}%</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#101419]">
        <div className="h-full rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#44e2cd]" style={{ width: `${profileProgress}%` }} />
      </div>
      <div className="mt-4 rounded-xl border border-[#2d3340]/40 bg-[#101419] p-3 text-sm leading-6 text-[#c7c4d7]">
        {profileComplete
          ? 'Your profile is complete and visible across the alumni network.'
          : nextItem
            ? `Complete "${nextItem}" next to strengthen visibility for referrals and discovery.`
            : 'Keep your resume and details current so the profile stays high trust.'}
      </div>
      {!profileComplete ? (
        <Button
          type="button"
          onClick={completeProfile}
          className="mt-4 h-10 rounded-xl border-0 bg-[#c0c1ff] px-4 text-sm font-semibold text-[#07006c] hover:bg-[#d4d5ff]"
        >
          Finalize profile
        </Button>
      ) : null}
    </section>
  );
}

function PublicProfilePanel({ profile, viewerRole }) {
  const canRequestReferral =
    viewerRole === 'student' && profile.role === 'Alumni' && Boolean(profile.referralTarget);

  if (canRequestReferral) {
    return <ReferralActionCard profile={profile} />;
  }

  return (
    <section className="rounded-2xl border border-[#2d3340]/40 bg-[#171b22] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#31384a] bg-[#101419] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#c0c1ff]">
        <Eye className="h-3.5 w-3.5" />
        Public profile
      </div>
      <div className="mt-4 text-lg font-semibold text-[#e0e2ea]">
        {profile.role === 'Student' ? 'Review-ready student view' : 'Network-ready alumni view'}
      </div>
      <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">
        {profile.role === 'Student'
          ? 'Only public student information is visible here. Profile completion, internal readiness, and owner-only controls stay hidden from viewers.'
          : 'This view is designed for discovery. Resume, focus, and visible networking context are public; internal owner controls stay private.'}
      </p>
    </section>
  );
}

function ProfileCorePanel({ profile }) {
  const facts = buildProfileFacts(profile);
  const title = profile.role === 'Student' ? 'Academic Core' : 'Professional Snapshot';

  return (
    <section className="space-y-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">{title}</h3>
      <div className="grid grid-cols-2 gap-5">
        {facts.map((fact) => (
          <div key={fact.label} className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b8093]">{fact.label}</p>
            <p className="text-sm font-medium text-[#e0e2ea]">{fact.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProfileNarrativeSection({ profile }) {
  const meta = buildNarrativeMeta(profile);

  return (
    <section className="space-y-6" id="about">
      <div className="inline-flex items-center rounded-full border border-[#44e2cd]/20 bg-[#44e2cd]/10 px-4 py-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#44e2cd]">The Narrative</span>
      </div>
      <div className="max-w-3xl">
        <p className="text-xl font-light leading-relaxed text-[#e0e2ea] md:text-2xl">
          {profile.about}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {meta.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#2d3340] bg-[#171b22] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c7c4d7]"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function ProfileTimelineSection({ profile }) {
  return (
    <section className="space-y-8" id="projects">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[1.8rem] font-semibold tracking-tight text-white">{profile.trackTitle || 'Recent Endeavors'}</h3>
          {profile.trackSubtitle ? <p className="mt-2 text-sm leading-7 text-white/45">{profile.trackSubtitle}</p> : null}
        </div>
        <span className="text-[11px] uppercase tracking-[0.24em] text-white/28">Scroll to explore</span>
      </div>

      <div className="relative space-y-10 pl-8 before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[2px] before:bg-gradient-to-b before:from-[#c0c1ff] before:via-[#44e2cd] before:to-transparent before:content-['']">
        {profile.trackItems.map((item) => (
          <div key={item.title} className="group relative">
            <div
              className="absolute -left-[37px] top-1.5 h-4 w-4 rounded-full ring-4 ring-[#0f0e17]"
              style={{ backgroundColor: item.accent, boxShadow: `0 0 18px ${item.accent}66` }}
            />
            <div className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h4 className="text-xl font-semibold text-[#e0e2ea] transition-colors group-hover:text-[#c0c1ff]">{item.title}</h4>
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/26">{item.note}</span>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[#c7c4d7]">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProfileInterestsSection({ profile }) {
  const tags = buildProfileInterestTags(profile);

  if (!tags.length) {
    return null;
  }

  return (
    <section className="space-y-6" id="interests">
      <h3 className="text-[1.8rem] font-semibold tracking-tight text-white">Core Interests</h3>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => {
          const hoverClass =
            index % 3 === 0
              ? 'hover:border-[#44e2cd] hover:text-[#44e2cd]'
              : index % 3 === 1
                ? 'hover:border-[#c0c1ff] hover:text-[#c0c1ff]'
                : 'hover:border-[#ddb7ff] hover:text-[#ddb7ff]';

          return (
            <div
              key={tag}
              className={cn(
                'rounded-full border border-[#2d3340] bg-[#171b22] px-5 py-2.5 text-sm font-medium text-[#e0e2ea] transition-all',
                hoverClass,
              )}
            >
              {tag}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const profileEditInputClass =
  'mt-1 w-full rounded-xl border border-[#2d3340] bg-[#11151c] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#44e2cd]/50 focus:outline-none focus:ring-1 focus:ring-[#44e2cd]/30';

function ProfileEditorPanel({ profile, sessionUser, open, onClose, onSaved }) {
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [form, setForm] = React.useState(null);
  const isAlumni = profile.role === 'Alumni';

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const loc = profile.location || '';
    const parts = loc.split(',').map((item) => item.trim());
    setForm({
      fullName: profile.name || '',
      phone: fieldByLabel(profile.personalFields, 'Phone'),
      city: parts[0] || '',
      country: parts.slice(1).join(', ') || '',
      linkedinUrl: fieldByLabel(profile.personalFields, 'LinkedIn'),
      portfolioUrl: fieldByLabel(profile.personalFields, 'Portfolio'),
      headline: profile.headline || '',
      about: profile.about || '',
      showEmail: Boolean(profile.emailVisible),
      skills: (Array.isArray(profile.skills) ? profile.skills : []).join(', '),
      interests: (Array.isArray(profile.interests) ? profile.interests : []).join(', '),
      region: profile.region || '',
      chapter: profile.chapter || '',
      domain: profile.domain || '',
      referralOpen: Boolean(profile.referralOpen),
      supportModes: (Array.isArray(profile.supportModes) ? profile.supportModes : []).join(', '),
      department: profile.department || '',
      currentCompany: fieldByLabel(profile.roleFields, 'Current company'),
      currentJobTitle: fieldByLabel(profile.roleFields, 'Current role'),
      yearsExperience: fieldByLabel(profile.roleFields, 'Experience'),
      focus: fieldByLabel(profile.roleFields, 'Focus areas'),
      program: fieldByLabel(profile.roleFields, 'Program'),
      cgpa: fieldByLabel(profile.roleFields, 'CGPA'),
      targetRoles: fieldByLabel(profile.roleFields, 'Target roles'),
      preferredLocations: fieldByLabel(profile.roleFields, 'Preferred locations'),
      referralGoal: fieldByLabel(profile.roleFields, 'Referral goal'),
      expectedGradYear: fieldByLabel(profile.roleFields, 'Graduation year'),
    });
    setSaveError('');
  }, [open, profile]);

  if (!open || !form) {
    return null;
  }

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveProfile = async () => {
    if (!sessionUser?.id) {
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const payload = {
        fullName: form.fullName.trim(),
        city: form.city.trim() || null,
        country: form.country.trim() || null,
        linkedinUrl: form.linkedinUrl.trim() || null,
        portfolioUrl: form.portfolioUrl.trim() || null,
        headline: form.headline.trim() || null,
        about: form.about.trim() || null,
        showEmail: Boolean(form.showEmail),
        skills: splitTagString(form.skills),
        interests: splitTagString(form.interests),
      };

      if (isAlumni) {
        Object.assign(payload, {
          currentCompany: form.currentCompany.trim() || null,
          currentJobTitle: form.currentJobTitle.trim() || null,
          yearsExperience: form.yearsExperience.trim() || null,
          department: form.department.trim() || null,
          focus: form.focus.trim() || null,
          supportModes: splitTagString(form.supportModes),
          domain: form.domain.trim() || null,
          chapter: form.chapter.trim() || null,
          region: form.region.trim() || null,
          referralOpen: Boolean(form.referralOpen),
        });
      } else {
        Object.assign(payload, {
          program: form.program.trim() || null,
          cgpa: form.cgpa.trim() || null,
          targetRoles: form.targetRoles.trim() || null,
          preferredLocations: form.preferredLocations.trim() || null,
          referralGoal: form.referralGoal.trim() || null,
        });
      }

      await patchMyProfile(payload);

      const userPatch = { phone: form.phone.trim() || null };
      if (!isAlumni) {
        const yearValue = String(form.expectedGradYear || '').trim();
        if (yearValue) {
          const yearNumber = Number(yearValue);
          if (!Number.isFinite(yearNumber)) {
            setSaveError('Graduation year must be a valid number');
            setSaving(false);
            return;
          }
          userPatch.expectedGradYear = yearNumber;
        } else {
          userPatch.expectedGradYear = null;
        }
      }

      await patchUser(sessionUser.id, userPatch);
      await onSaved?.();
      onClose?.();
    } catch (error) {
      setSaveError(error.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#2d3340]/50 bg-[#171b22] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/28">Profile edit mode</div>
          <h3 className="mt-3 text-[1.8rem] font-semibold tracking-tight text-white">Shape your public profile</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/45">
            These fields power your public profile, directory presence, and referral context. Resume visibility stays public by design.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={saving}
            onClick={onClose}
            className="h-10 rounded-xl border border-[#2d3340] bg-[#11151c] px-4 text-white/78 hover:bg-[#1b2029] hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={saveProfile}
            className="h-10 rounded-xl border-0 bg-[#c0c1ff] px-4 text-sm font-semibold text-[#07006c] hover:bg-[#d5d6ff] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </Button>
        </div>
      </div>

      {saveError ? <div className="mt-4 text-sm text-rose-300">{saveError}</div> : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
            Full name
            <input className={profileEditInputClass} value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
          </label>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
            Headline
            <input className={profileEditInputClass} value={form.headline} onChange={(e) => updateField('headline', e.target.value)} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
              Phone
              <input className={profileEditInputClass} value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
              City
              <input className={profileEditInputClass} value={form.city} onChange={(e) => updateField('city', e.target.value)} />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
              Country
              <input className={profileEditInputClass} value={form.country} onChange={(e) => updateField('country', e.target.value)} />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
              Show email publicly
              <div className="mt-1 flex h-[42px] items-center rounded-xl border border-[#2d3340] bg-[#11151c] px-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={form.showEmail}
                  onChange={(e) => updateField('showEmail', e.target.checked)}
                  className="mr-3 rounded border-[#2d3340] bg-[#101419] text-[#44e2cd] focus:ring-[#44e2cd]"
                />
                Visible on public profile
              </div>
            </label>
          </div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
            LinkedIn URL
            <input className={profileEditInputClass} value={form.linkedinUrl} onChange={(e) => updateField('linkedinUrl', e.target.value)} />
          </label>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
            Portfolio URL
            <input className={profileEditInputClass} value={form.portfolioUrl} onChange={(e) => updateField('portfolioUrl', e.target.value)} />
          </label>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
            Public statement
            <textarea className={`${profileEditInputClass} min-h-[140px] resize-y`} value={form.about} onChange={(e) => updateField('about', e.target.value)} />
          </label>
        </div>

        <div className="space-y-4">
          {isAlumni ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Department
                  <input className={profileEditInputClass} value={form.department} onChange={(e) => updateField('department', e.target.value)} />
                </label>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Domain
                  <input className={profileEditInputClass} value={form.domain} onChange={(e) => updateField('domain', e.target.value)} />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Current company
                  <CompanyAutocomplete value={form.currentCompany} onChange={(val) => updateField('currentCompany', val)} />
                </label>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Current role
                  <input className={profileEditInputClass} value={form.currentJobTitle} onChange={(e) => updateField('currentJobTitle', e.target.value)} />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Experience
                  <input className={profileEditInputClass} value={form.yearsExperience} onChange={(e) => updateField('yearsExperience', e.target.value)} />
                </label>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Chapter
                  <input className={profileEditInputClass} value={form.chapter} onChange={(e) => updateField('chapter', e.target.value)} />
                </label>
              </div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Region
                <input className={profileEditInputClass} value={form.region} onChange={(e) => updateField('region', e.target.value)} />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Focus areas
                <input className={profileEditInputClass} value={form.focus} onChange={(e) => updateField('focus', e.target.value)} />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Support modes (comma separated)
                <input className={profileEditInputClass} value={form.supportModes} onChange={(e) => updateField('supportModes', e.target.value)} />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Referral availability
                <div className="mt-1 flex h-[42px] items-center rounded-xl border border-[#2d3340] bg-[#11151c] px-3 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={form.referralOpen}
                    onChange={(e) => updateField('referralOpen', e.target.checked)}
                    className="mr-3 rounded border-[#2d3340] bg-[#101419] text-[#44e2cd] focus:ring-[#44e2cd]"
                  />
                  Open to referral requests
                </div>
              </label>
            </>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Program
                  <input className={profileEditInputClass} value={form.program} onChange={(e) => updateField('program', e.target.value)} />
                </label>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Graduation year
                  <input className={profileEditInputClass} value={form.expectedGradYear} onChange={(e) => updateField('expectedGradYear', e.target.value)} inputMode="numeric" />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  CGPA
                  <input className={profileEditInputClass} value={form.cgpa} onChange={(e) => updateField('cgpa', e.target.value)} />
                </label>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Target roles
                  <input className={profileEditInputClass} value={form.targetRoles} onChange={(e) => updateField('targetRoles', e.target.value)} />
                </label>
              </div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Preferred locations
                <input className={profileEditInputClass} value={form.preferredLocations} onChange={(e) => updateField('preferredLocations', e.target.value)} />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Referral goal
                <input className={profileEditInputClass} value={form.referralGoal} onChange={(e) => updateField('referralGoal', e.target.value)} />
              </label>
            </>
          )}

          <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
            Skills (comma separated)
            <input className={profileEditInputClass} value={form.skills} onChange={(e) => updateField('skills', e.target.value)} />
          </label>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
            Core interests (comma separated)
            <input className={profileEditInputClass} value={form.interests} onChange={(e) => updateField('interests', e.target.value)} />
          </label>
        </div>
      </div>
    </section>
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
              alumniUserId: profile.alumniUserId,
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

const profileInputClass =
  'mt-1 w-full rounded-xl border border-[#232730] bg-[#0d0f12] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#4f81ff]/50 focus:outline-none focus:ring-1 focus:ring-[#4f81ff]/40';

function PersonalInformationPanel({ profile, isOwnProfile, sessionUser, onProfileUpdated }) {
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [form, setForm] = React.useState(null);

  const isAlumni = profile.role === 'Alumni';

  const openEdit = () => {
    const loc = profile.location || '';
    const parts = loc.split(',').map((s) => s.trim());
    const base = {
      fullName: profile.name,
      phone: fieldByLabel(profile.personalFields, 'Phone'),
      city: parts[0] || '',
      country: parts.slice(1).join(', ') || '',
      linkedinUrl: fieldByLabel(profile.personalFields, 'LinkedIn'),
      portfolioUrl: fieldByLabel(profile.personalFields, 'Portfolio'),
      headline: profile.headline || '',
      about: profile.about || '',
    };
    if (isAlumni) {
      Object.assign(base, {
        currentCompany: fieldByLabel(profile.roleFields, 'Current company'),
        currentJobTitle: fieldByLabel(profile.roleFields, 'Current role'),
        yearsExperience: fieldByLabel(profile.roleFields, 'Experience'),
        department: profile.department || '',
        focus: fieldByLabel(profile.roleFields, 'Focus areas'),
      });
    } else {
      Object.assign(base, {
        program: fieldByLabel(profile.roleFields, 'Program'),
        cgpa: fieldByLabel(profile.roleFields, 'CGPA'),
        targetRoles: fieldByLabel(profile.roleFields, 'Target roles'),
        preferredLocations: fieldByLabel(profile.roleFields, 'Preferred locations'),
        referralGoal: fieldByLabel(profile.roleFields, 'Referral goal'),
        expectedGradYear: fieldByLabel(profile.roleFields, 'Graduation year'),
      });
    }
    setForm(base);
    setEditing(true);
    setSaveError('');
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(null);
    setSaveError('');
  };

  const updateField = (key, value) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const saveProfile = async () => {
    if (!form || !sessionUser?.id) {
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        fullName: form.fullName.trim(),
        city: form.city.trim() || null,
        country: form.country.trim() || null,
        linkedinUrl: form.linkedinUrl.trim() || null,
        portfolioUrl: form.portfolioUrl.trim() || null,
        headline: form.headline.trim() || null,
        about: form.about.trim() || null,
      };
      if (isAlumni) {
        Object.assign(payload, {
          currentCompany: form.currentCompany.trim() || null,
          currentJobTitle: form.currentJobTitle.trim() || null,
          yearsExperience: form.yearsExperience.trim() || null,
          department: form.department.trim() || null,
          focus: form.focus.trim() || null,
        });
      } else {
        Object.assign(payload, {
          program: form.program.trim() || null,
          cgpa: form.cgpa.trim() || null,
          targetRoles: form.targetRoles.trim() || null,
          preferredLocations: form.preferredLocations.trim() || null,
          referralGoal: form.referralGoal.trim() || null,
        });
      }
      await patchMyProfile(payload);

      const userPatch = { phone: form.phone.trim() || null };
      if (!isAlumni) {
        const y = String(form.expectedGradYear || '').trim();
        if (y) {
          const n = Number(y);
          if (!Number.isFinite(n)) {
            setSaveError('Graduation year must be a valid number');
            setSaving(false);
            return;
          }
          userPatch.expectedGradYear = n;
        } else {
          userPatch.expectedGradYear = null;
        }
      }
      await patchUser(sessionUser.id, userPatch);

      setEditing(false);
      setForm(null);
      await onProfileUpdated?.();
    } catch (e) {
      setSaveError(e.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SurfaceCard
      title="Personal information"
      subtitle={
        isOwnProfile
          ? 'The profile is role-aware: shared identity fields stay common, while the second block changes for alumni and students.'
          : 'This is the public information the profile owner chose to expose for community discovery.'
      }
      action={
        isOwnProfile ? (
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={saving}
                  onClick={cancelEdit}
                  className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-white/78 hover:bg-[#1f232a] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={saving}
                  onClick={saveProfile}
                  className="h-10 rounded-2xl border-0 bg-gradient-to-r from-[#c9beff] to-[#8f7bff] px-4 text-sm font-semibold text-[#140f28] hover:from-[#ddd6ff] hover:to-[#a293ff] disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={openEdit}
                className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-white/78 hover:bg-[#1f232a] hover:text-white"
              >
                Edit profile
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-full bg-[#171a20] px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/42">
            Public view
          </div>
        )
      }
    >
      {saveError ? <div className="mb-4 text-sm text-rose-300">{saveError}</div> : null}

      {editing && form ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
              Full name
              <input
                className={profileInputClass}
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
              Phone
              <input
                className={profileInputClass}
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
              City
              <input className={profileInputClass} value={form.city} onChange={(e) => updateField('city', e.target.value)} />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
              Country
              <input
                className={profileInputClass}
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 md:col-span-2">
              LinkedIn URL
              <input
                className={profileInputClass}
                value={form.linkedinUrl}
                onChange={(e) => updateField('linkedinUrl', e.target.value)}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 md:col-span-2">
              Portfolio URL
              <input
                className={profileInputClass}
                value={form.portfolioUrl}
                onChange={(e) => updateField('portfolioUrl', e.target.value)}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 md:col-span-2">
              Headline
              <input
                className={profileInputClass}
                value={form.headline}
                onChange={(e) => updateField('headline', e.target.value)}
              />
            </label>
          </div>

          {isAlumni ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Department
                <input
                  className={profileInputClass}
                  value={form.department}
                  onChange={(e) => updateField('department', e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Current company
                <input
                  className={profileInputClass}
                  value={form.currentCompany}
                  onChange={(e) => updateField('currentCompany', e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Current role
                <input
                  className={profileInputClass}
                  value={form.currentJobTitle}
                  onChange={(e) => updateField('currentJobTitle', e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Experience
                <input
                  className={profileInputClass}
                  value={form.yearsExperience}
                  onChange={(e) => updateField('yearsExperience', e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 md:col-span-2">
                Focus areas
                <input className={profileInputClass} value={form.focus} onChange={(e) => updateField('focus', e.target.value)} />
              </label>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Program
                <input
                  className={profileInputClass}
                  value={form.program}
                  onChange={(e) => updateField('program', e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Graduation year
                <input
                  className={profileInputClass}
                  value={form.expectedGradYear}
                  onChange={(e) => updateField('expectedGradYear', e.target.value)}
                  inputMode="numeric"
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                CGPA
                <input className={profileInputClass} value={form.cgpa} onChange={(e) => updateField('cgpa', e.target.value)} />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
                Target roles
                <input
                  className={profileInputClass}
                  value={form.targetRoles}
                  onChange={(e) => updateField('targetRoles', e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 md:col-span-2">
                Preferred locations
                <input
                  className={profileInputClass}
                  value={form.preferredLocations}
                  onChange={(e) => updateField('preferredLocations', e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 md:col-span-2">
                Referral goal
                <input
                  className={profileInputClass}
                  value={form.referralGoal}
                  onChange={(e) => updateField('referralGoal', e.target.value)}
                />
              </label>
            </div>
          )}

          <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
            Public statement
            <textarea
              className={`${profileInputClass} min-h-[120px] resize-y`}
              value={form.about}
              onChange={(e) => updateField('about', e.target.value)}
            />
          </label>
        </div>
      ) : (
        <>
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
        </>
      )}
    </SurfaceCard>
  );
}

function ReferralRequestsView({ userRole, requestTarget }) {
  const [board, setBoard] = React.useState({
    title: '',
    description: '',
    checklist: [],
    requests: [],
  });
  const [sendError, setSendError] = React.useState('');
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchReferralBoard();
        if (!cancelled && data) {
          setBoard(data);
        }
      } catch {
        if (!cancelled) {
          setBoard((prev) => ({ ...prev, requests: [] }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userRole]);

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

              {sendError ? <div className="mt-3 text-sm text-red-400">{sendError}</div> : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  type="button"
                  disabled={sending || !requestTarget?.alumniUserId}
                  onClick={async () => {
                    setSendError('');
                    if (!requestTarget?.alumniUserId) {
                      setSendError('Open this alumni from the directory so the request can be routed correctly.');
                      return;
                    }
                    setSending(true);
                    try {
                      await createReferralRequest({
                        alumniUserId: requestTarget.alumniUserId,
                        coverNote: draft,
                        targetRole: requestTarget.openings?.[0] || 'Referral',
                        targetCompany: 'See referral note',
                      });
                      const data = await fetchReferralBoard();
                      if (data) {
                        setBoard(data);
                      }
                    } catch (e) {
                      setSendError(e?.message || 'Could not send request');
                    } finally {
                      setSending(false);
                    }
                  }}
                  className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#c9beff] to-[#8f7bff] px-5 text-sm font-semibold text-[#140f28] hover:from-[#ddd6ff] hover:to-[#a293ff] disabled:opacity-60"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {sending ? 'Sending…' : 'Send request'}
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
                  {request.profileKey ? (
                    <Button asChild variant="ghost" className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-sm text-white/76 hover:bg-[#1f232a] hover:text-white">
                      <Link to={`/profile/${request.profileKey}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View profile
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" className="h-10 rounded-2xl border border-[#171a20] bg-[#171a20] px-4 text-sm text-white/76 hover:bg-[#1f232a] hover:text-white">
                      <Eye className="mr-2 h-4 w-4" />
                      View resume
                    </Button>
                  )}
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

function DirectoryCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span className="directory-filter-checkbox">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span />
      </span>
      <span className="text-sm text-white/62 transition group-hover:text-white">{label}</span>
    </label>
  );
}

function FilterSection({ title, expanded, onToggle, searchValue, onSearchChange, children }) {
  return (
    <div className="mb-5">
      <button
        onClick={onToggle}
        className="mb-4 flex w-full cursor-pointer items-center justify-between text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-70"
      >
        {title}
        <SlidersHorizontal
          className="w-4 h-4 transition-transform"
          style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        />
      </button>
      {expanded ? (
        <div>
          {onSearchChange && (
            <div className="directory-filter-search-wrap">
              <Search className="h-3.5 w-3.5" />
              <input
                type="text"
                className="directory-filter-search"
                placeholder={`Search ${title.toLowerCase()}…`}
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          <div className="directory-filter-options space-y-3">{children}</div>
        </div>
      ) : null}
    </div>
  );
}

/* ── Referral Request Popup Modal ── */
function ReferralRequestModal({ profile: targetProfile, onClose }) {
  const [driveLink, setDriveLink] = React.useState('');
  const suggestedNote = targetProfile
    ? `Hi ${targetProfile.name}, I am interested in ${targetProfile.title || targetProfile.role || 'a role'} at ${targetProfile.company || 'your company'}. I would really value your consideration for a referral.`
    : "";

  const [note, setNote] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');

  // Close on Escape
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while modal open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSend = async () => {
    if (!note.trim()) { setError('Please write a short referral note.'); return; }
    setSending(true);
    setError('');
    try {
      await createReferralRequest({
        alumniUserId: targetProfile?.alumniUserId || targetProfile?.id,
        coverNote: note,
        resumeUrl: driveLink || null,
        targetRole: targetProfile?.title || targetProfile?.headline || 'Referral',
        targetCompany: targetProfile?.company || 'See referral note',
      });
      setSent(true);
    } catch (e) {
      setError(e?.message || 'Could not send request. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const initials = targetProfile
    ? (targetProfile.initials || (targetProfile.name || '?').split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase())
    : '?';

  return (
    /* Backdrop with blur */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[18px] bg-[#111318] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/50 transition hover:bg-white/16 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f5eee8] text-lg font-black text-black">
              {initials}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                Referral Request
              </div>
              <div className="mt-1 text-xl font-bold text-white">{targetProfile?.name || 'Alumni'}</div>
              <div className="text-sm text-white/48">
                {targetProfile?.title || targetProfile?.headline || targetProfile?.role || 'Alumni Sangham'}
                {targetProfile?.company ? ` · ${targetProfile.company}` : ''}
              </div>
            </div>
          </div>

          {sent ? (
            <div className="mt-8 rounded-[12px] border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
              <div className="text-2xl">🎉</div>
              <div className="mt-2 text-lg font-bold text-emerald-300">Request sent!</div>
              <p className="mt-1 text-sm text-white/55">
                Your referral request has been submitted. Keep your profile updated and resume accessible.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-[8px] bg-[#f5eee8] px-5 py-2 text-sm font-bold text-black transition hover:bg-white"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {/* Drive link */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Resume / Portfolio Drive Link
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-[10px] border border-white/5 bg-[#000000] px-3 py-0.5 focus-within:border-white/25">
                  <Link2 className="h-4 w-4 shrink-0 text-white/35" />
                  <input
                    type="url"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="https://drive.google.com/file/your-resume"
                    className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/25"
                  />
                </div>
              </div>

              {/* Referral note */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Your Message
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={5}
                  placeholder={suggestedNote}
                  className="mt-2 w-full resize-none rounded-[10px] border border-white/5 bg-[#000000] px-4 py-3 text-sm leading-5 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
                />
              </div>



              {error ? (
                <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  disabled={sending}
                  onClick={handleSend}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#f5eee8] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {sending ? 'Sending…' : 'Send Request'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center rounded-[10px] border border-white/12 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/8 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const BATCH_OPTIONS = [];
const endYearForBatch = new Date().getFullYear() - 1;
for (let y = endYearForBatch; y >= 2012; y--) {
  BATCH_OPTIONS.push(String(y));
}



export function DirectoryPage() {
  const [profiles, setProfiles] = React.useState([]);

  // Filter states
  const [selectedBatches, setSelectedBatches] = React.useState([]);
  const [selectedDepts, setSelectedDepts] = React.useState([]);
  const [selectedLocations, setSelectedLocations] = React.useState([]);
  const [selectedIndustries, setSelectedIndustries] = React.useState([]);
  const [selectedCompanies, setSelectedCompanies] = React.useState([]);

  // Filter expand states
  const [batchExpanded, setBatchExpanded] = React.useState(true);
  const [deptExpanded, setDeptExpanded] = React.useState(true);
  const [locationExpanded, setLocationExpanded] = React.useState(true);
  const [industryExpanded, setIndustryExpanded] = React.useState(false);
  const [companyExpanded, setCompanyExpanded] = React.useState(false);

  // Filter search states
  const [batchSearch, setBatchSearch] = React.useState('');
  const [deptSearch, setDeptSearch] = React.useState('');
  const [locationSearch, setLocationSearch] = React.useState('');
  const [industrySearch, setIndustrySearch] = React.useState('');
  const [companySearch, setCompanySearch] = React.useState('');

  const [query, setQuery] = React.useState('');

  // Referral modal state
  const [referralTarget, setReferralTarget] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchDirectory();
        if (!cancelled && Array.isArray(data)) {
          setProfiles(data);
        }
      } catch {
        if (!cancelled) {
          setProfiles([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter options with in-filter search
  const filteredBatchOptions = React.useMemo(() => {
    const q = batchSearch.trim().toLowerCase();
    return q ? BATCH_OPTIONS.filter((b) => b.includes(q)) : BATCH_OPTIONS;
  }, [batchSearch]);

  const filteredDeptOptions = React.useMemo(() => {
    const q = deptSearch.trim().toLowerCase();
    return q ? DEPARTMENTS.filter((d) => d.label.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)) : DEPARTMENTS;
  }, [deptSearch]);

  const filteredLocationOptions = React.useMemo(() => {
    const q = locationSearch.trim().toLowerCase();
    return q ? INDIAN_STATES.filter((s) => s.toLowerCase().includes(q)) : INDIAN_STATES;
  }, [locationSearch]);

  const filteredIndustryOptions = React.useMemo(() => {
    const q = industrySearch.trim().toLowerCase();
    return q ? INDUSTRY_OPTIONS.filter((ind) => ind.toLowerCase().includes(q)) : INDUSTRY_OPTIONS;
  }, [industrySearch]);

  const filteredCompanyOptions = React.useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    return q ? PRE_CURATED_COMPANIES.filter((c) => c.toLowerCase().includes(q)) : PRE_CURATED_COMPANIES;
  }, [companySearch]);

  const toggle = (setter) => (val) =>
    setter((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  const filteredProfiles = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return profiles.filter((profile) => {
      const batchVal = String(profile.batch || profile.graduationYear || profile.expectedGradYear || '');
      const batchMatch = selectedBatches.length === 0 || selectedBatches.includes(batchVal);
      const deptMatch = selectedDepts.length === 0 || selectedDepts.includes(profile.department);
      const locationMatch =
        selectedLocations.length === 0 ||
        selectedLocations.some((loc) =>
          [profile.region, profile.location].some((v) => v && v.includes(loc))
        );
      const industryMatch = selectedIndustries.length === 0 || selectedIndustries.includes(profile.domain);
      const companyMatch = selectedCompanies.length === 0 || selectedCompanies.includes(profile.company);

      if (!batchMatch || !deptMatch || !locationMatch || !industryMatch || !companyMatch) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        profile.name, profile.title, profile.company, profile.headline,
        profile.focus, profile.location, profile.region, profile.domain, profile.department,
        ...(profile.skills || []),
      ].join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [profiles, query, selectedBatches, selectedDepts, selectedLocations, selectedIndustries, selectedCompanies]);

  const bannerImages = [
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2F90fee62f21334017817a2fb353db1600?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2F992c6773c4d54befa7d222bd5775df9e?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2F919e2c060da64d24b2e834f3d493641c?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2F5c24b608c09948edaf9b3d02517c661d?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2F71a4d8b569814403a2971f7533150ed2?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2F9701f4a0a7fc4c46b9ad9ed71d510bc4?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2F569ccf8eb19a467c8b84e94263a1a39a?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2Fbc5ce3d7051048d496c29ece1f246c29?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2Fee1a420dc93d41359a7c1265609dcf11?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2Ff5936d6a86bb4bcd85b3201b8346da12%2F81571c1a5cc54506b5d3545b58fc2935?format=webp&width=800&height=1200',
  ];

  const getBanner = (index) => bannerImages[index % bannerImages.length];
  const directoryHeroBanner =
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80';
  const activeFilterCount =
    selectedBatches.length + selectedDepts.length + selectedLocations.length + selectedIndustries.length + selectedCompanies.length;
  const searchPlaceholders = [
    'Search alumni by company, state, role, department or industry',
    'Find product alumni in Bengaluru',
    'Search machine learning, Stripe, London',
    'Look for referral-open alumni',
    'Find mentors by domain or chapter',
  ];

  const clearAll = () => {
    setSelectedBatches([]);
    setSelectedDepts([]);
    setSelectedLocations([]);
    setSelectedIndustries([]);
    setSelectedCompanies([]);
    setBatchSearch('');
    setDeptSearch('');
    setLocationSearch('');
    setIndustrySearch('');
    setCompanySearch('');
  };

  return (
    <div className="min-h-screen bg-black pb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Referral modal */}
      {referralTarget && (
        <ReferralRequestModal
          profile={referralTarget}
          onClose={() => setReferralTarget(null)}
        />
      )}

      <div className="relative min-h-[360px] overflow-hidden rounded-[8px]">
        <img src={directoryHeroBanner} alt="Alumni networking" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-3xl rounded-[8px] bg-black p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Directory</div>
            <h1 className="mt-4 text-4xl font-black leading-none tracking-normal text-white md:text-6xl">
              Find alumni by work, place, and willingness to help.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              Search the IIT Patna alumni network, filter by batch, department, location, industry, and company.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/72">
              <span className="rounded-full border border-white/10 px-3 py-1">{profiles.length} alumni</span>
              <span className="rounded-full border border-white/10 px-3 py-1">{INDUSTRY_OPTIONS.length} industries</span>
              <span className="rounded-full border border-white/10 px-3 py-1">{filteredProfiles.length} matches</span>
            </div>
          </div>
        </div>
      </div>

      <div className="my-8 px-1 md:px-2">
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          onChange={(event) => setQuery(event.target.value)}
          onSubmit={(event) => event.preventDefault()}
          className="max-w-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/38 transition hover:text-white"
          >
            Clear search
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-8 pb-16 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 p-2 font-mono max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-hide">
            <div className="mb-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/35">Filters</div>
              <div className="mt-2 text-sm text-white/56">
                {activeFilterCount ? `${activeFilterCount} active` : 'No active filters'}
              </div>
            </div>

            {/* Batch */}
            <FilterSection
              title="Batch"
              expanded={batchExpanded}
              onToggle={() => setBatchExpanded(!batchExpanded)}
              searchValue={batchSearch}
              onSearchChange={setBatchSearch}
            >
              {filteredBatchOptions.map((b) => (
                <DirectoryCheckbox
                  key={b}
                  label={b}
                  checked={selectedBatches.includes(b)}
                  onChange={() => toggle(setSelectedBatches)(b)}
                />
              ))}
              {filteredBatchOptions.length === 0 && (
                <p className="text-xs text-white/30 italic">No batches match "{batchSearch}"</p>
              )}
            </FilterSection>
            <div className="my-4 border-t border-white/10" />

            {/* Department */}
            <FilterSection
              title="Department"
              expanded={deptExpanded}
              onToggle={() => setDeptExpanded(!deptExpanded)}
              searchValue={deptSearch}
              onSearchChange={setDeptSearch}
            >
              {filteredDeptOptions.map((d) => (
                <DirectoryCheckbox
                  key={d.value}
                  label={d.label}
                  checked={selectedDepts.includes(d.value)}
                  onChange={() => toggle(setSelectedDepts)(d.value)}
                />
              ))}
              {filteredDeptOptions.length === 0 && (
                <p className="text-xs text-white/30 italic">No departments match "{deptSearch}"</p>
              )}
            </FilterSection>
            <div className="my-4 border-t border-white/10" />

            {/* Location (Indian States) */}
            <FilterSection
              title="Location"
              expanded={locationExpanded}
              onToggle={() => setLocationExpanded(!locationExpanded)}
              searchValue={locationSearch}
              onSearchChange={setLocationSearch}
            >
              {filteredLocationOptions.map((state) => (
                <DirectoryCheckbox
                  key={state}
                  label={state}
                  checked={selectedLocations.includes(state)}
                  onChange={() => toggle(setSelectedLocations)(state)}
                />
              ))}
              {filteredLocationOptions.length === 0 && (
                <p className="text-xs text-white/30 italic">No states match "{locationSearch}"</p>
              )}
            </FilterSection>
            <div className="my-4 border-t border-white/10" />

            {/* Industry */}
            <FilterSection
              title="Industry"
              expanded={industryExpanded}
              onToggle={() => setIndustryExpanded(!industryExpanded)}
              searchValue={industrySearch}
              onSearchChange={setIndustrySearch}
            >
              {filteredIndustryOptions.map((ind) => (
                <DirectoryCheckbox
                  key={ind}
                  label={ind}
                  checked={selectedIndustries.includes(ind)}
                  onChange={() => toggle(setSelectedIndustries)(ind)}
                />
              ))}
              {filteredIndustryOptions.length === 0 && (
                <p className="text-xs text-white/30 italic">No industries match "{industrySearch}"</p>
              )}
            </FilterSection>
            <div className="my-4 border-t border-white/10" />

            {/* Company */}
            <FilterSection
              title="Company"
              expanded={companyExpanded}
              onToggle={() => setCompanyExpanded(!companyExpanded)}
              searchValue={companySearch}
              onSearchChange={setCompanySearch}
            >
              {filteredCompanyOptions.map((c) => (
                <DirectoryCheckbox
                  key={c}
                  label={c}
                  checked={selectedCompanies.includes(c)}
                  onChange={() => toggle(setSelectedCompanies)(c)}
                />
              ))}
              {filteredCompanyOptions.length === 0 && (
                <p className="text-xs text-white/30 italic">No companies match "{companySearch}"</p>
              )}
            </FilterSection>

            {activeFilterCount > 0 && (
              <>
                <div className="my-6 border-t border-white/10" />
                <button
                  onClick={clearAll}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f5eee8] transition hover:text-white"
                >
                  Clear all filters
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProfiles.map((profile, index) => {
              const avatarSrc = profile.avatarUrl
                ? resolvePublicAssetUrl(profile.avatarUrl)
                : '';
              const bannerSrc = profile.profileImage || getBanner(index);
              const initials = profile.initials || (profile.name || '?').split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase();

              return (
                <div
                  key={profile.id}
                  className="group flex min-h-[400px] flex-col overflow-hidden rounded-[8px] border border-white/10 bg-[#181818] transition hover:border-white/24 hover:bg-[#1e1e1e]"
                >
                  {/* Banner */}
                  <div className="relative h-28 overflow-hidden bg-[#222]">
                    <img
                      src={bannerSrc}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
                  </div>

                  {/* Centered profile photo */}
                  <div className="flex flex-col items-center px-5 pb-2 -mt-10 relative z-10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#181818] bg-[#f5eee8] text-xl font-black text-black shadow-lg overflow-hidden">
                      {avatarSrc ? (
                        <>
                          <img src={avatarSrc} alt={profile.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }} />
                          <span className="items-center justify-center h-full w-full hidden">{initials}</span>
                        </>
                      ) : (
                        <span className="flex items-center justify-center h-full w-full">{initials}</span>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col items-center px-5 pt-2 pb-5 text-center">
                    <Link to={`/profile/${profile.id}`} className="text-base font-bold text-white transition group-hover:text-[#f5eee8] hover:underline cursor-pointer">{profile.name}</Link>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      {profile.role || 'Alumni'}
                    </p>

                    <div className="mt-3 w-full space-y-1.5 text-sm text-white/55 text-left">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{profile.location || profile.region || '—'}</span>
                      </p>
                      <p className="font-medium text-white/78 truncate">{profile.title || profile.headline || '—'}</p>
                      {profile.company ? <p className="text-white/45 truncate">{profile.company}</p> : null}
                    </div>

                    <div className="mt-auto w-full">
                      {profile.focus ? (
                        <div className="w-full border-t border-white/10 pt-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/28 text-left">Helps With</p>
                          <p className="mt-1.5 line-clamp-2 text-xs italic leading-5 text-white/50 text-left">"{profile.focus}"</p>
                        </div>
                      ) : (
                        <div className="w-full border-t border-white/10 pt-3 opacity-0 pointer-events-none select-none">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-left">Helps With</p>
                          <p className="mt-1.5 line-clamp-2 text-xs italic leading-5 text-left">-</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="w-full pt-4">
                        <button
                          type="button"
                          onClick={() => setReferralTarget(profile)}
                          className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#f5eee8] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white"
                        >
                          <Handshake className="h-4 w-4" />
                          Request Referral
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="rounded-[8px] border border-white/10 bg-[#181818] py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/45">
                <Search className="h-7 w-7" />
              </div>
              <p className="text-xl font-bold text-white">No alumni found matching your filters.</p>
              <p className="mt-2 text-sm text-white/42">Try adjusting your search or removing filters.</p>
              <button
                onClick={() => { setQuery(''); clearAll(); }}
                className="mt-6 rounded-[8px] bg-[#f5eee8] px-5 py-2 text-sm font-bold text-black transition hover:bg-white"
              >
                Reset filters
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function BlogPage() {
  const { user } = useOutletContext();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'jobs' ? 'jobs' : 'posts';
  const draftText = typeof location.state?.draftText === 'string' ? location.state.draftText.trim() : '';
  const [composerText, setComposerText] = React.useState(draftText);
  const [feedPosts, setFeedPosts] = React.useState(communityPosts);
  const [postError, setPostError] = React.useState('');
  const [posting, setPosting] = React.useState(false);

  React.useEffect(() => {
    setComposerText(draftText);
  }, [draftText]);

  React.useEffect(() => {
    if (activeTab !== 'posts') {
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await fetchDiscussionFeed();
        if (cancelled || !Array.isArray(data)) {
          return;
        }

        const mapped = data.map((p) => ({
          id: p._id,
          community: p.community || 'r/alumni-network',
          author: p.authorName,
          authorMeta: p.authorMeta || '',
          authorPhotoUrl: p.authorPhotoUrl || null,
          authorProfileKey: p.authorProfileKey || null,
          time: formatRelativeTime(p.createdAt),
          title: p.title,
          body: p.body,
          upvotes: p.upvotes ?? 0,
          comments: p.commentsCount ?? 0,
          tag: p.tag || 'Update',
        }));

        setFeedPosts(mapped.length ? mapped : communityPosts);
      } catch {
        if (!cancelled) {
          setFeedPosts(communityPosts);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

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
          {user?.role !== 'student' ? (
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
                    <div className="flex flex-col items-end gap-2">
                      {postError ? <div className="text-xs text-red-400">{postError}</div> : null}
                      <Button
                        type="button"
                        disabled={posting}
                        onClick={async () => {
                          setPostError('');
                          const text = composerText.trim();
                          if (!text) {
                            return;
                          }
                          setPosting(true);
                          try {
                            const firstLine = text.split('\n').find((line) => line.trim()) || 'Post';
                            await createDiscussionPost({
                              title: firstLine.slice(0, 200),
                              body: text,
                              community: 'r/alumni-network',
                              tag: 'Update',
                            });
                            setComposerText('');
                            const data = await fetchDiscussionFeed();
                            if (Array.isArray(data)) {
                              const mapped = data.map((p) => ({
                                id: p._id,
                                community: p.community || 'r/alumni-network',
                                author: p.authorName,
                                authorMeta: p.authorMeta || '',
                                authorPhotoUrl: p.authorPhotoUrl || null,
                                authorProfileKey: p.authorProfileKey || null,
                                time: formatRelativeTime(p.createdAt),
                                title: p.title,
                                body: p.body,
                                upvotes: p.upvotes ?? 0,
                                comments: p.commentsCount ?? 0,
                                tag: p.tag || 'Update',
                              }));
                              setFeedPosts(mapped.length ? mapped : communityPosts);
                            }
                          } catch (e) {
                            setPostError(e?.message || 'Could not publish');
                          } finally {
                            setPosting(false);
                          }
                        }}
                        className="auth-btn-primary h-10 px-4 disabled:opacity-60"
                      >
                        {posting ? 'Posting…' : 'Post'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : (
            <div className="rounded-md border border-[#2A2940] bg-[#0F0E17] p-4 text-sm text-[#9694A8]">
              Posting is currently restricted to Alumni users. Students may read and follow ongoing discussions.
            </div>
          )}

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
            {feedPosts.map((post) => (
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
    profileProgress,
    completeProfile,
    refreshSession,
  } = useOutletContext();

  const referralsTab = searchParams.get('tab') === 'referrals';
  const viewerRole = user.role.toLowerCase();
  const isOwnProfile = !params.profileId || params.profileId === 'me';
  const [baseProfile, setBaseProfile] = React.useState(null);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [editorOpen, setEditorOpen] = React.useState(false);

  const reloadProfile = React.useCallback(async () => {
    try {
      const data = await fetchMyProfile();
      setBaseProfile(data || null);
    } catch {
      /* keep existing profile */
    }
    try {
      await refreshSession?.();
    } catch {
      /* ignore */
    }
  }, [refreshSession]);

  React.useEffect(() => {
    setEditorOpen(false);
  }, [isOwnProfile, params.profileId]);

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.title = baseProfile ? `Alumni Profile | ${baseProfile.name}` : 'Alumni Profile';
  }, [baseProfile]);

  React.useEffect(() => {
    if (referralsTab) {
      setProfileLoading(false);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      setProfileLoading(true);
      try {
        const data = isOwnProfile ? await fetchMyProfile() : await fetchPublicProfile(params.profileId);
        if (!cancelled) {
          setBaseProfile(data || null);
        }
      } catch {
        if (!cancelled) {
          setBaseProfile(null);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOwnProfile, params.profileId, referralsTab]);

  if (referralsTab) {
    return (
      <ReferralRequestsView
        userRole={viewerRole}
        requestTarget={location.state?.requestTarget || null}
      />
    );
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-white/50">
        Loading profile…
      </div>
    );
  }

  if (!baseProfile) {
    return (
      <StubPanel
        eyebrow="Profile"
        title="Profile not found"
        description="This profile is not available. Use the directory to open a public alumni profile."
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

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[11px] uppercase tracking-[0.28em] text-white/28">Profile</div>
        {isOwnProfile ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setEditorOpen((current) => !current)}
            className="h-10 rounded-xl border border-[#2d3340] bg-[#171b22] px-4 text-white/78 hover:bg-[#1d2129] hover:text-white md:hidden"
          >
            <SquarePen className="mr-2 h-4 w-4" />
            {editorOpen ? 'Close editor' : 'Edit profile'}
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start">
          <ProfileHeroSidebar
            profile={baseProfile}
            isOwnProfile={isOwnProfile}
            onEdit={() => setEditorOpen(true)}
          />

          {isOwnProfile ? (
            <ProfileStrengthPanel
              checklist={checklist}
              profileProgress={profileProgress}
              profileComplete={profileComplete}
              completeProfile={completeProfile}
            />
          ) : (
            <PublicProfilePanel profile={baseProfile} viewerRole={viewerRole} />
          )}

          <ProfileCorePanel profile={baseProfile} />
        </aside>

        <div className="space-y-16">
          {isOwnProfile ? (
            <ProfileEditorPanel
              profile={baseProfile}
              sessionUser={user}
              open={editorOpen}
              onClose={() => setEditorOpen(false)}
              onSaved={reloadProfile}
            />
          ) : null}

          <ProfileNarrativeSection profile={baseProfile} />
          <ProfileTimelineSection profile={baseProfile} />
          <ProfileInterestsSection profile={baseProfile} />
          <DocumentsPanel profile={baseProfile} isOwnProfile={isOwnProfile} onResumeUploaded={reloadProfile} />
        </div>
      </div>

      {isOwnProfile ? (
        <button
          type="button"
          onClick={() => setEditorOpen((current) => !current)}
          className="fixed bottom-8 right-8 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#07006c] shadow-[0_18px_40px_rgba(0,0,0,0.4)] transition hover:scale-105 md:flex"
          aria-label={editorOpen ? 'Close profile editor' : 'Open profile editor'}
        >
          <SquarePen className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}
