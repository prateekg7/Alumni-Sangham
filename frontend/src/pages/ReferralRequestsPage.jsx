import React from 'react';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageSquareText,
  Send,
  Sparkles,
  UserRoundSearch,
} from 'lucide-react';

const studentRequests = [
  {
    name: 'Sana Ahmed',
    context: 'Product analyst roles · Atlassian',
    status: 'Awaiting reply',
    note: 'Shared product writing samples and kept the ask focused on entry-level openings.',
    updated: 'Updated 2 days ago',
  },
  {
    name: 'Arjun Mehta',
    context: 'Backend engineer intern · Stripe',
    status: 'In review',
    note: 'Resume is public and the note calls out distributed systems projects with measurable impact.',
    updated: 'Updated yesterday',
  },
  {
    name: 'Priya Kapoor',
    context: 'Startup product roles · LoopStack',
    status: 'Follow-up due',
    note: 'Waiting to send one short follow-up after the initial outreach window closes.',
    updated: 'Updated 5 hours ago',
  },
];

const alumniRequests = [
  {
    name: 'Aanya Singh',
    context: 'Final-year CSE student · backend roles',
    status: 'Needs response',
    note: 'Strong systems projects, resume is visible, and the ask is specific enough to evaluate quickly.',
    updated: 'Received today',
  },
  {
    name: 'Rahul Verma',
    context: 'Third-year student · product internships',
    status: 'Resume reviewed',
    note: 'Well-framed note with clear motivation. Could use one more concrete product artifact link.',
    updated: 'Received yesterday',
  },
  {
    name: 'Nikita Rao',
    context: 'Data and analytics roles',
    status: 'Ready to reply',
    note: 'Profile is complete and the request already includes target role context and project relevance.',
    updated: 'Received 3 days ago',
  },
];

function statusTone(status) {
  if (/reply|response/i.test(status)) {
    return 'bg-amber-500/12 text-amber-200 border-amber-500/20';
  }
  if (/review/i.test(status)) {
    return 'bg-cyan-500/12 text-cyan-200 border-cyan-500/20';
  }
  if (/follow-up/i.test(status)) {
    return 'bg-rose-500/12 text-rose-200 border-rose-500/20';
  }
  return 'bg-emerald-500/12 text-emerald-200 border-emerald-500/20';
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#13161b] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/36">
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
        {value}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/45">{hint}</p>
    </div>
  );
}

function RequestCard({ request, role }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-[#121418] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xl font-semibold text-white">{request.name}</div>
          <div className="mt-2 text-sm text-white/46">{request.context}</div>
        </div>
        <div className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusTone(request.status)}`}>
          {request.status}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-white/58">{request.note}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/34">
          <Clock3 className="h-3.5 w-3.5" />
          {request.updated}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/76 transition hover:bg-white/10 hover:text-white"
        >
          {role === 'student' ? 'View sent note' : 'Open review stub'}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export function ReferralRequestsPage() {
  const location = useLocation();
  const { user } = useOutletContext();
  const role = String(user?.role || 'Student').toLowerCase() === 'alumni' ? 'alumni' : 'student';
  const requests = role === 'student' ? studentRequests : alumniRequests;
  const requestTarget = location.state?.requestTarget || null;
  const pendingCount = requests.filter((item) => /reply|review|follow-up/i.test(item.status)).length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[#111317] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/48">
              Referral requests
            </div>
            <h1
              className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              {role === 'student' ? 'Requests you have sent' : 'Requests you have received'}
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/52 md:text-base">
              This is a frontend-only skeleton view for the referral queue. It is intentionally not
              connected to backend data yet, but it already shows the shape of the experience for
              both students and alumni.
            </p>
          </div>

          <div className="rounded-[24px] border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
            <div className="font-semibold text-white">Frontend preview</div>
            <div className="mt-1 text-cyan-100/75">Static for now, ready to wire later.</div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label={role === 'student' ? 'Sent' : 'Received'}
            value={requests.length}
            hint={role === 'student' ? 'All outgoing referral asks in one place.' : 'A single queue for incoming referral review.'}
          />
          <StatCard
            label="Needs attention"
            value={pendingCount}
            hint={role === 'student' ? 'Requests worth following up on next.' : 'Requests that likely need a response soon.'}
          />
          <StatCard
            label="Page status"
            value="Mock"
            hint="Layout, hierarchy, and role-based content are in place before backend wiring."
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_340px]">
        <section className="space-y-4">
          {requests.map((request) => (
            <RequestCard key={`${request.name}-${request.context}`} request={request} role={role} />
          ))}
        </section>

        <aside className="space-y-4">
          <section className="rounded-[28px] border border-white/10 bg-[#121418] p-5">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
              <Sparkles className="h-4 w-4" />
              What this stub covers
            </div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-white/58">
              <div className="rounded-[20px] bg-white/[0.03] px-4 py-3">
                Role-aware layout so alumni and students do not see the same queue copy.
              </div>
              <div className="rounded-[20px] bg-white/[0.03] px-4 py-3">
                Clean request cards with status chips, context, and action placeholders.
              </div>
              <div className="rounded-[20px] bg-white/[0.03] px-4 py-3">
                A safe place to wire filters, notes, and backend actions later without redesigning the page.
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#121418] p-5">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
              <Inbox className="h-4 w-4" />
              Next actions
            </div>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3 rounded-[20px] bg-white/[0.03] p-4 text-sm text-white/60">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                Finalize backend payload shape for sent and received referral items.
              </div>
              <div className="flex items-start gap-3 rounded-[20px] bg-white/[0.03] p-4 text-sm text-white/60">
                <MessageSquareText className="mt-0.5 h-4 w-4 text-cyan-300" />
                Add filters, search, and fuller note previews once the API is ready.
              </div>
              <div className="flex items-start gap-3 rounded-[20px] bg-white/[0.03] p-4 text-sm text-white/60">
                <Send className="mt-0.5 h-4 w-4 text-amber-300" />
                Connect button states only after request mutations are available.
              </div>
            </div>
          </section>

          {role === 'student' && requestTarget ? (
            <section className="rounded-[28px] border border-white/10 bg-[#121418] p-5">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
                <UserRoundSearch className="h-4 w-4" />
                Selected alumni
              </div>
              <div className="mt-5 text-xl font-semibold text-white">{requestTarget.name}</div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                When this page is wired to the backend, referral drafts sent from alumni profiles
                can land here with the target role and note already prefilled.
              </p>
            </section>
          ) : null}

          <section className="rounded-[28px] border border-white/10 bg-[#121418] p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
              Explore
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/directory"
                className="inline-flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/78 transition hover:bg-white/[0.06]"
              >
                Browse directory
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/profile/me"
                className="inline-flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/78 transition hover:bg-white/[0.06]"
              >
                Return to profile
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
