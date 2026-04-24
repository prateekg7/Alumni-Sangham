import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Inbox,
  Linkedin,
  Mail,
  Send,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { fetchReferralBoard, updateReferralStatus, resolvePublicAssetUrl } from '../lib/api';

const referralHeroBanner =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=80';

/* ── Helpers ── */

function statusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'accepted') return 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20';
  if (s === 'declined') return 'bg-rose-500/12 text-rose-300 border-rose-500/20';
  return 'bg-amber-500/12 text-amber-200 border-amber-500/20';
}

function statusLabel(status) {
  const s = (status || '').toLowerCase();
  if (s === 'accepted') return 'Accepted';
  if (s === 'declined') return 'Declined';
  return 'Under Review';
}

function initials(name) {
  return (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase();
}

function relativeDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Hero Banner ── */

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
            Review incoming referral requests, track outgoing asks, and take action — all in one place.
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

/* ── Review Detail Modal (alumni reviewing a received request) ── */

function ReviewModal({ request, onClose, onStatusUpdate }) {
  const [action, setAction] = useState(null); // null | 'accept' | 'decline'
  const [responseNote, setResponseNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSubmit = async (status) => {
    setSubmitting(true);
    setError('');
    try {
      await updateReferralStatus(request._id, {
        status,
        responseNote: status === 'accepted' ? responseNote.trim() || undefined : undefined,
      });
      onStatusUpdate(request._id, status, status === 'accepted' ? responseNote.trim() : null);
      onClose();
    } catch (e) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = request.status === 'pending';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[18px] bg-[#111318] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/50 transition hover:bg-white/16 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f5eee8] text-lg font-black text-black overflow-hidden">
              {request.requesterPhotoUrl ? (
                <img src={resolvePublicAssetUrl(request.requesterPhotoUrl)} alt={request.requesterName} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling.style.display = 'flex'); }} />
              ) : null}
              <span className={`items-center justify-center h-full w-full ${request.requesterPhotoUrl ? 'hidden' : 'flex'}`}>{initials(request.requesterName)}</span>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                Referral Request Review
              </div>
              <div className="mt-1 text-xl font-bold text-white">{request.requesterName}</div>
              <div className="text-sm text-white/48">
                {request.requesterDept} · Batch {request.requesterYear}
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-5">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusColor(request.status)}`}>
              {request.status === 'accepted' && <CheckCircle2 className="h-3 w-3" />}
              {request.status === 'declined' && <XCircle className="h-3 w-3" />}
              {request.status === 'pending' && <Clock3 className="h-3 w-3" />}
              {statusLabel(request.status)}
            </span>
          </div>

          {/* Requester profile summary */}
          <div className="mt-6 rounded-[12px] border border-white/5 bg-[#0a0b0e] p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Profile Summary</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {request.requesterHeadline && (
                <div className="sm:col-span-2">
                  <div className="text-xs text-white/35">Headline</div>
                  <div className="mt-0.5 text-sm text-white/70">{request.requesterHeadline}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-white/35">Department</div>
                <div className="mt-0.5 text-sm text-white/70">{request.requesterDept}</div>
              </div>
              <div>
                <div className="text-xs text-white/35">Batch</div>
                <div className="mt-0.5 text-sm text-white/70">{request.requesterYear}</div>
              </div>
              {request.requesterCgpa && (
                <div>
                  <div className="text-xs text-white/35">CGPA</div>
                  <div className="mt-0.5 text-sm text-white/70">{request.requesterCgpa}</div>
                </div>
              )}
              {request.requesterEmail && (
                <div className="sm:col-span-2">
                  <div className="text-xs text-white/35">Email</div>
                  <a
                    href={`mailto:${request.requesterEmail}`}
                    className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-[#6C63FF] hover:text-[#8f87ff] transition"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {request.requesterEmail}
                  </a>
                </div>
              )}
            </div>
            {request.requesterSkills?.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-white/35 mb-1.5">Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {request.requesterSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/6 px-2.5 py-0.5 text-[11px] text-white/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Target info */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[12px] border border-white/5 bg-[#0a0b0e] p-4">
              <div className="text-xs text-white/35">Target Role</div>
              <div className="mt-1 text-sm font-medium text-white/80">{request.targetRole}</div>
            </div>
            <div className="rounded-[12px] border border-white/5 bg-[#0a0b0e] p-4">
              <div className="text-xs text-white/35">Target Company</div>
              <div className="mt-1 text-sm font-medium text-white/80">{request.targetCompany}</div>
            </div>
          </div>

          {/* Cover note */}
          <div className="mt-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Cover Note</div>
            <div className="rounded-[12px] border border-white/5 bg-[#0a0b0e] p-4">
              <p className="text-sm leading-6 text-white/60 whitespace-pre-wrap">{request.coverNote}</p>
            </div>
          </div>

          {/* Action links */}
          <div className="mt-5 flex flex-wrap gap-3">
            {request.profileKey && (
              <Link
                to={`/profile/${request.profileKey}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <User className="h-4 w-4" />
                View Full Profile
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
            {request.resumeUrl && (
              <a
                href={request.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <FileText className="h-4 w-4" />
                Open Resume
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {request.linkedinUrl && (
              <a
                href={request.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Date info */}
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3 w-3" />
              Sent {relativeDate(request.createdAt)}
            </span>
            {request.respondedAt && (
              <span className="flex items-center gap-1.5">
                {request.status === 'accepted' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                Responded {relativeDate(request.respondedAt)}
              </span>
            )}
          </div>

          {/* Alumni response note (if already responded) */}
          {request.responseNote && (
            <div className="mt-5 rounded-[12px] border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/60 mb-2">Your Response Note</div>
              <p className="text-sm leading-6 text-white/60 whitespace-pre-wrap">{request.responseNote}</p>
            </div>
          )}

          {/* Action buttons (only if pending) */}
          {isPending && (
            <div className="mt-6 border-t border-white/8 pt-6">
              {action === null && (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setAction('accept')}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-emerald-500/15 px-5 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/25"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction('decline')}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-rose-500/15 px-5 py-2.5 text-sm font-bold text-rose-300 transition hover:bg-rose-500/25"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline
                  </button>
                </div>
              )}

              {action === 'accept' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Optional Note (can include referral code)
                    </label>
                    <textarea
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                      rows={3}
                      placeholder="e.g. Applied for you — referral code: REF-12345. Check your email."
                      className="w-full resize-none rounded-[10px] border border-white/5 bg-[#000] px-4 py-3 text-sm leading-5 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
                    />
                  </div>
                  {error && <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSubmit('accepted')}
                      className="inline-flex items-center gap-2 rounded-[10px] bg-[#f5eee8] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {submitting ? 'Accepting…' : 'Confirm Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAction(null); setError(''); }}
                      className="inline-flex items-center rounded-[10px] border border-white/12 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/8 hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {action === 'decline' && (
                <div className="space-y-4">
                  <p className="text-sm text-white/50">
                    Are you sure you want to decline this request? The requester will not be able to send you another request for 15 days.
                  </p>
                  {error && <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSubmit('declined')}
                      className="inline-flex items-center gap-2 rounded-[10px] bg-rose-500/15 px-5 py-2.5 text-sm font-bold text-rose-300 transition hover:bg-rose-500/25 disabled:opacity-60"
                    >
                      <XCircle className="h-4 w-4" />
                      {submitting ? 'Declining…' : 'Confirm Decline'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAction(null); setError(''); }}
                      className="inline-flex items-center rounded-[10px] border border-white/12 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/8 hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sent Detail Modal (requester viewing their sent request) ── */

function SentDetailModal({ request, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[18px] bg-[#111318] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/50 transition hover:bg-white/16 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f5eee8] text-lg font-black text-black overflow-hidden">
              {request.alumniPhotoUrl ? (
                <img src={resolvePublicAssetUrl(request.alumniPhotoUrl)} alt={request.alumniName} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling.style.display = 'flex'); }} />
              ) : null}
              <span className={`items-center justify-center h-full w-full ${request.alumniPhotoUrl ? 'hidden' : 'flex'}`}>{initials(request.alumniName)}</span>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                Sent Request
              </div>
              <div className="mt-1 text-xl font-bold text-white">{request.alumniName}</div>
              <div className="text-sm text-white/48">{request.alumniCompany}</div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-5">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusColor(request.status)}`}>
              {request.status === 'accepted' && <CheckCircle2 className="h-3 w-3" />}
              {request.status === 'declined' && <XCircle className="h-3 w-3" />}
              {request.status === 'pending' && <Clock3 className="h-3 w-3" />}
              {statusLabel(request.status)}
            </span>
          </div>

          {/* Target info */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[12px] border border-white/5 bg-[#0a0b0e] p-4">
              <div className="text-xs text-white/35">Target Role</div>
              <div className="mt-1 text-sm font-medium text-white/80">{request.targetRole}</div>
            </div>
            <div className="rounded-[12px] border border-white/5 bg-[#0a0b0e] p-4">
              <div className="text-xs text-white/35">Target Company</div>
              <div className="mt-1 text-sm font-medium text-white/80">{request.targetCompany}</div>
            </div>
          </div>

          {/* Your cover note */}
          <div className="mt-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Your Note</div>
            <div className="rounded-[12px] border border-white/5 bg-[#0a0b0e] p-4">
              <p className="text-sm leading-6 text-white/60 whitespace-pre-wrap">{request.coverNote}</p>
            </div>
          </div>

          {/* Resume link */}
          {request.resumeUrl && (
            <a
              href={request.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <FileText className="h-4 w-4" />
              Resume Attached
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {/* Accepted — show response note */}
          {request.status === 'accepted' && request.responseNote && (
            <div className="mt-5 rounded-[12px] border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/60 mb-2">
                Note from {request.alumniName?.split(/\s+/)[0]}
              </div>
              <p className="text-sm leading-6 text-white/70 whitespace-pre-wrap">{request.responseNote}</p>
            </div>
          )}

          {/* Declined — cooldown notice */}
          {request.status === 'declined' && (
            <div className="mt-5 rounded-[12px] border border-rose-500/20 bg-rose-500/5 p-4">
              <p className="text-sm text-rose-300/70">
                This request was declined{request.respondedAt ? ` on ${new Date(request.respondedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}.
                You can send another request to this alumni after 15 days.
              </p>
            </div>
          )}

          {/* Date info */}
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3 w-3" />
              Sent {relativeDate(request.createdAt)}
            </span>
            {request.respondedAt && (
              <span className="flex items-center gap-1.5">
                {request.status === 'accepted' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                Responded {relativeDate(request.respondedAt)}
              </span>
            )}
          </div>

          {/* View alumni profile */}
          {request.alumniProfileKey && (
            <Link
              to={`/profile/${request.alumniProfileKey}`}
              target="_blank"
              className="mt-5 inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <User className="h-4 w-4" />
              View Alumni Profile
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Received Card ── */

function ReceivedCard({ request, onReview }) {
  return (
    <div className="group flex min-h-[320px] flex-col overflow-hidden rounded-[8px] border border-white/10 bg-[#181818] transition hover:border-white/24 hover:bg-[#1e1e1e]">
      <div className="relative h-24 overflow-hidden bg-[#222]">
        <div className="h-full w-full bg-gradient-to-br from-[#0c323d] to-[#1a1a2e]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
      </div>

      <div className="flex flex-col items-center px-5 pb-2 -mt-8 relative z-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#181818] bg-[#f5eee8] text-sm font-black text-black shadow-lg overflow-hidden">
          {request.requesterPhotoUrl ? (
            <img src={resolvePublicAssetUrl(request.requesterPhotoUrl)} alt={request.requesterName} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling.style.display = 'flex'); }} />
          ) : null}
          <span className={`items-center justify-center h-full w-full ${request.requesterPhotoUrl ? 'hidden' : 'flex'}`}>{initials(request.requesterName)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pt-2 pb-5 text-center">
        <h3 className="text-base font-bold text-white">{request.requesterName}</h3>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
          {request.requesterDept} · {request.requesterYear}
        </p>

        <div className="mt-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusColor(request.status)}`}>
            {statusLabel(request.status)}
          </span>
        </div>

        <div className="mt-3 w-full text-left space-y-1 text-sm text-white/55">
          <p className="font-medium text-white/78 truncate">{request.targetRole}</p>
          <p className="text-white/45 truncate">{request.targetCompany}</p>
          <p className="line-clamp-2 text-xs italic text-white/40">"{request.coverNote?.slice(0, 100)}{request.coverNote?.length > 100 ? '…' : ''}"</p>
        </div>

        <div className="mt-1 text-xs text-white/25 flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          {relativeDate(request.createdAt)}
        </div>

        <div className="mt-auto w-full pt-4">
          <button
            type="button"
            onClick={() => onReview(request)}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#f5eee8] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white"
          >
            {request.status === 'pending' ? 'Review Request' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sent Card ── */

function SentCard({ request, onView }) {
  return (
    <div
      className="group flex min-h-[300px] flex-col overflow-hidden rounded-[8px] border border-white/10 bg-[#181818] transition hover:border-white/24 hover:bg-[#1e1e1e] cursor-pointer"
      onClick={() => onView(request)}
    >
      <div className="relative h-24 overflow-hidden bg-[#222]">
        <div className="h-full w-full bg-gradient-to-br from-[#1a1a2e] to-[#0c323d]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
      </div>

      <div className="flex flex-col items-center px-5 pb-2 -mt-8 relative z-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#181818] bg-[#f5eee8] text-sm font-black text-black shadow-lg overflow-hidden">
          {request.alumniPhotoUrl ? (
            <img src={resolvePublicAssetUrl(request.alumniPhotoUrl)} alt={request.alumniName} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling.style.display = 'flex'); }} />
          ) : null}
          <span className={`items-center justify-center h-full w-full ${request.alumniPhotoUrl ? 'hidden' : 'flex'}`}>{initials(request.alumniName)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pt-2 pb-5 text-center">
        <h3 className="text-base font-bold text-white">{request.alumniName}</h3>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
          {request.alumniCompany}
        </p>

        <div className="mt-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusColor(request.status)}`}>
            {statusLabel(request.status)}
          </span>
        </div>

        <div className="mt-3 w-full text-left space-y-1 text-sm text-white/55">
          <p className="font-medium text-white/78 truncate">{request.targetRole}</p>
          <p className="text-white/45 truncate">{request.targetCompany}</p>
        </div>

        <div className="mt-1 text-xs text-white/25 flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          {relativeDate(request.createdAt)}
        </div>

        <div className="mt-auto w-full pt-4">
          <div className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#f5eee8] px-4 py-2.5 text-sm font-bold text-black transition group-hover:bg-white">
            View Details
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */

export function ReferralRequestsPage() {
  const { user } = useOutletContext();
  const role = String(user?.role || 'Student').toLowerCase() === 'alumni' ? 'alumni' : 'student';

  const [board, setBoard] = useState({ title: '', description: '', requests: [] });
  const [activeTab, setActiveTab] = useState(role === 'alumni' ? 'received' : 'sent');
  const [reviewTarget, setReviewTarget] = useState(null);
  const [sentDetailTarget, setSentDetailTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBoard = useCallback(async () => {
    try {
      const data = await fetchReferralBoard();
      if (data) setBoard(data);
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const receivedRequests = useMemo(() =>
    (board.requests || []).filter((r) => r.direction === 'received'),
    [board.requests]
  );

  const sentRequests = useMemo(() =>
    (board.requests || []).filter((r) => r.direction === 'sent'),
    [board.requests]
  );

  const handleStatusUpdate = useCallback((referralId, newStatus, note) => {
    setBoard((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r._id === referralId
          ? { ...r, status: newStatus, responseNote: note, respondedAt: new Date().toISOString() }
          : r
      ),
    }));
  }, []);

  const displayRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="min-h-screen bg-black pb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Review modal */}
      {reviewTarget && (
        <ReviewModal
          request={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Sent detail modal */}
      {sentDetailTarget && (
        <SentDetailModal
          request={sentDetailTarget}
          onClose={() => setSentDetailTarget(null)}
        />
      )}

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
      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          <p className="mt-4 text-sm text-white/40">Loading referrals…</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {displayRequests.map((request) =>
              activeTab === 'received' ? (
                <ReceivedCard
                  key={request._id}
                  request={request}
                  onReview={setReviewTarget}
                />
              ) : (
                <SentCard
                  key={request._id}
                  request={request}
                  onView={setSentDetailTarget}
                />
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
                  : "You haven't sent any referral requests yet."}
              </p>
              <p className="mt-2 text-sm text-white/42">
                {activeTab === 'received'
                  ? 'When someone sends you a referral request, it will appear here.'
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
        </>
      )}
    </div>
  );
}
