import React, { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Inbox,
  MapPin,
  Send,
  XCircle,
} from 'lucide-react';
import { fetchReferralBoard } from '../lib/api';

const referralHeroBanner =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=80';

function statusTone(status) {
  const s = (status || '').toLowerCase();
  if (s === 'pending') return 'bg-amber-500/12 text-amber-200 border-amber-500/20';
  if (s === 'accepted') return 'bg-emerald-500/12 text-emerald-200 border-emerald-500/20';
  if (s === 'rejected') return 'bg-rose-500/12 text-rose-200 border-rose-500/20';
  return 'bg-cyan-500/12 text-cyan-200 border-cyan-500/20';
}

function HeroBanner({ receivedCount, sentCount }) {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[8px]">
      <img src={referralHeroBanner} alt="Referral requests" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
        <div className="max-w-3xl rounded-[8px] bg-black p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Referral Requests</div>
          <h1 className="mt-4 text-4xl font-black leading-none tracking-normal text-white md:text-6xl">
            Manage referrals — sent, received, and everything in between.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
            Review incoming referral requests from students, track outgoing asks, and take action — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/72">
            <span className="rounded-full border border-white/10 px-3 py-1">{receivedCount} received</span>
            <span className="rounded-full border border-white/10 px-3 py-1">{sentCount} sent</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceivedCard({ request }) {
  const initials = (request.studentName || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Link
      to={`/profile/${request.studentId || request.student}`}
      className="group flex min-h-[340px] flex-col overflow-hidden rounded-[8px] border border-white/10 bg-[#181818] transition hover:border-white/24 hover:bg-[#202020]"
    >
      <div className="relative h-28 overflow-hidden bg-[#222]">
        <div className="h-full w-full bg-gradient-to-br from-[#0c323d] to-[#1a1a2e]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
      </div>

      <div className="relative -mt-8 flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#181818] bg-[#f5eee8] text-sm font-black text-black">
            {initials}
          </div>
          <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusTone(request.status)}`}>
            {request.status || 'Pending'}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white transition group-hover:text-[#f5eee8]">
          {request.studentName || 'Student'}
        </h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/34">
          {request.role || 'Student'}
        </p>

        <div className="mt-4 space-y-2 text-sm text-white/58">
          {request.company && (
            <p className="font-medium text-white/78">{request.company}</p>
          )}
          {request.message && (
            <p className="line-clamp-3 italic text-white/50">"{request.message}"</p>
          )}
          {request.createdAt && (
            <p className="flex items-center gap-2 text-xs text-white/34">
              <Clock3 className="h-3.5 w-3.5" />
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-5">
          <div className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-emerald-500/15 px-4 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/25">
            <CheckCircle2 className="h-4 w-4" />
            Accept
          </div>
          <div className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-rose-500/15 px-4 py-2.5 text-sm font-bold text-rose-300 transition hover:bg-rose-500/25">
            <XCircle className="h-4 w-4" />
            Reject
          </div>
        </div>
      </div>
    </Link>
  );
}

function SentCard({ request }) {
  const initials = (request.alumniName || request.targetName || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Link
      to={`/profile/${request.alumniId || request.targetId || '#'}`}
      className="group flex min-h-[300px] flex-col overflow-hidden rounded-[8px] border border-white/10 bg-[#181818] transition hover:border-white/24 hover:bg-[#202020]"
    >
      <div className="relative h-28 overflow-hidden bg-[#222]">
        <div className="h-full w-full bg-gradient-to-br from-[#1a1a2e] to-[#0c323d]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
      </div>

      <div className="relative -mt-8 flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#181818] bg-[#f5eee8] text-sm font-black text-black">
            {initials}
          </div>
          <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusTone(request.status)}`}>
            {request.status || 'Pending'}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white transition group-hover:text-[#f5eee8]">
          {request.alumniName || request.targetName || 'Alumni'}
        </h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/34">
          {request.company || 'Alumni'}
        </p>

        <div className="mt-4 space-y-2 text-sm text-white/58">
          {request.message && (
            <p className="line-clamp-3 italic text-white/50">"{request.message}"</p>
          )}
          {request.createdAt && (
            <p className="flex items-center gap-2 text-xs text-white/34">
              <Clock3 className="h-3.5 w-3.5" />
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between rounded-[8px] bg-[#f5eee8] px-4 py-2.5 text-sm font-bold text-black">
            View Profile
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ReferralRequestsPage() {
  const { user } = useOutletContext();
  const role = String(user?.role || 'Student').toLowerCase() === 'alumni' ? 'alumni' : 'student';

  const [board, setBoard] = useState({ title: '', description: '', requests: [] });
  const [activeTab, setActiveTab] = useState(role === 'alumni' ? 'received' : 'sent');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchReferralBoard();
        if (!cancelled && data) setBoard(data);
      } catch {
        // keep defaults
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const receivedRequests = useMemo(() =>
    (board.requests || []).filter((r) => r.type === 'received' || r.direction === 'received'),
    [board.requests]
  );

  const sentRequests = useMemo(() =>
    (board.requests || []).filter((r) => r.type === 'sent' || r.direction === 'sent'),
    [board.requests]
  );

  const displayRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="min-h-screen bg-black pb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
      <HeroBanner receivedCount={receivedRequests.length} sentCount={sentRequests.length} />

      {/* Tab Switcher */}
      <div className="my-8 flex gap-3 px-1 md:px-2">
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] transition ${
            activeTab === 'received'
              ? 'border-white/20 bg-white text-black'
              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Inbox className="h-4 w-4" />
          Received ({receivedRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sent')}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] transition ${
            activeTab === 'sent'
              ? 'border-white/20 bg-white text-black'
              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Send className="h-4 w-4" />
          Sent ({sentRequests.length})
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {displayRequests.map((request, index) =>
          activeTab === 'received' ? (
            <ReceivedCard key={request.id || index} request={request} />
          ) : (
            <SentCard key={request.id || index} request={request} />
          )
        )}
      </div>

      {displayRequests.length === 0 && (
        <div className="rounded-[8px] border border-white/10 bg-[#181818] py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/45">
            {activeTab === 'received' ? <Inbox className="h-7 w-7" /> : <Send className="h-7 w-7" />}
          </div>
          <p className="text-xl font-bold text-white">
            {activeTab === 'received'
              ? 'No referral requests received yet.'
              : 'You haven\'t sent any referral requests yet.'}
          </p>
          <p className="mt-2 text-sm text-white/42">
            {activeTab === 'received'
              ? 'When students send you a referral request, it will appear here.'
              : 'Browse the alumni directory to find someone and send a request.'}
          </p>
          <Link
            to="/directory"
            className="mt-6 inline-block rounded-[8px] bg-[#f5eee8] px-5 py-2 text-sm font-bold text-black transition hover:bg-white"
          >
            Browse Directory
          </Link>
        </div>
      )}
    </div>
  );
}
