import React from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Camera,
  ChevronDown,
  ChevronUp,
  Globe,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  Minus,
  Pencil,
  Plus,
  Save,
  X,
} from 'lucide-react';
import {
  fetchMyProfile,
  fetchPublicProfile,
  patchMyProfile,
  patchUser,
  resolvePublicAssetUrl,
  uploadProfilePhoto,
} from '../lib/api';
import { CompanyAutocomplete } from '../components/ui/CompanyAutocomplete';
import { DepartmentDropdown } from '../components/ui/DepartmentDropdown';
import { StateDropdown } from '../components/ui/StateDropdown';
import { IndustryDropdown } from '../components/ui/IndustryDropdown';
import { DEPARTMENTS } from '../lib/departments';

/* ── colour tokens (profile page only) ── */
const C = {
  pageBg: '#000000',
  card: '#131e22ff',
  cardBorder: 'rgba(255,255,255,0.08)',
  cardSub: 'rgba(255,255,255,0.06)',
  accent: '#c19d67ff',
  accentHover: '#e5a84e',
  text: '#f0f0f0',
  textMuted: 'rgba(255,255,255,0.58)',
  textFaint: 'rgba(255,255,255,0.32)',
  inputBg: 'rgba(255,255,255,0.06)',
  inputBorder: 'rgba(255,255,255,0.12)',
  inputFocus: 'rgba(255,255,255,0.25)',
};

const SECTION_ORDER = ['profile-summary', 'personal-info', 'role-info', 'public-profile', 'journey'];

/* ── Platform icon detection ── */
const PLATFORM_ICONS = {
  youtube: {
    color: '#FF0000', label: 'YouTube',
    path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
  },
  instagram: {
    color: '#E4405F', label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  github: {
    color: '#ffffff', label: 'GitHub',
    path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
  twitter: {
    color: '#1DA1F2', label: 'Twitter/X',
    path: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
  },
  x: {
    color: '#1DA1F2', label: 'Twitter/X',
    path: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
  },
  facebook: {
    color: '#1877F2', label: 'Facebook',
    path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z',
  },
  behance: {
    color: '#1769FF', label: 'Behance',
    path: 'M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z',
  },
  dribbble: {
    color: '#EA4C89', label: 'Dribbble',
    path: 'M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-6.953.666-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z',
  },
  medium: {
    color: '#ffffff', label: 'Medium',
    path: 'M0 0v24h24v-24h-24zm19.938 5.686l-1.279 1.227c-.11.085-.165.222-.142.357v8.96c-.023.135.032.272.142.357l1.25 1.227v.27h-6.291v-.27l1.295-1.256c.127-.127.127-.164.127-.357v-7.243l-3.602 9.146h-.487l-4.192-9.146v6.131c-.035.256.053.513.237.697l1.718 2.084v.27h-4.874v-.27l1.718-2.084c.181-.185.264-.444.222-.697v-7.089c.026-.202-.053-.401-.215-.545l-1.527-1.838v-.27h4.741l3.663 8.033 3.22-8.033h4.516v.27z',
  },
  linkedin: {
    color: '#0A66C2', label: 'LinkedIn',
    path: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z',
  },
};

function detectPlatform(url) {
  if (!url) return null;
  const lower = url.toLowerCase();
  for (const [key, meta] of Object.entries(PLATFORM_ICONS)) {
    if (lower.includes(key)) return meta;
  }
  return null;
}

/* ── Toast system ── */
function Toast({ message, type, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="animate-slide-up pointer-events-auto flex items-center gap-3 rounded-lg px-5 py-3 shadow-xl backdrop-blur-md"
      style={{
        background: type === 'success' ? C.accent : '#ef4444',
        color: type === 'success' ? C.text : '#fff',
      }}
    >
      <span className="text-sm font-semibold">{message}</span>
      <button type="button" onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = React.useState([]);
  const nextId = React.useRef(0);
  const push = React.useCallback((message, type = 'success') => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);
  const remove = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, push, remove };
}

/* ── URL validation ── */
function isValidUrl(str) {
  if (!str) return true;
  try {
    const url = new URL(str);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isGoogleDriveUrl(str) {
  if (!str) return true;
  return str.toLowerCase().includes('drive.google.com') || str.toLowerCase().includes('docs.google.com');
}

/* ── helpers ── */
function fieldByLabel(fields, label) {
  const item = fields?.find((field) => field.label === label);
  if (!item) {
    return '';
  }
  if (item.value === '—' || item.value === 'Hidden') {
    return '';
  }
  return String(item.value || '');
}

function splitCommaString(value) {
  if (!value) {
    return [];
  }
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLocation(location) {
  if (!location) {
    return { city: '', state: '', country: '' };
  }
  const parts = String(location)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length === 1) {
    return { city: parts[0], state: '', country: '' };
  } else if (parts.length === 2) {
    return { city: parts[0], state: '', country: parts[1] };
  } else {
    return {
      city: parts[0],
      state: parts[1],
      country: parts.slice(2).join(', '),
    };
  }
}

function buildFormFromProfile(profile) {
  const { city, state, country } = profile.city !== undefined || profile.state !== undefined || profile.country !== undefined
    ? { city: profile.city || '', state: profile.state || '', country: profile.country || '' }
    : splitLocation(profile.location);

  return {
    fullName: profile.name || '',
    phone: fieldByLabel(profile.personalFields, 'Phone'),
    city,
    state,
    country,
    linkedinUrl: fieldByLabel(profile.personalFields, 'LinkedIn'),
    portfolioUrl: fieldByLabel(profile.personalFields, 'Portfolio'),
    headline: profile.headline || '',
    about: profile.about || '',
    showEmail: Boolean(profile.emailVisible),
    skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
    interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : '',
    currentCompany: fieldByLabel(profile.roleFields, 'Current company'),
    currentJobTitle: fieldByLabel(profile.roleFields, 'Current role'),
    yearsExperience: fieldByLabel(profile.roleFields, 'Experience'),
    department: profile.department || '',
    batch: profile.batchYear || '',
    focus: fieldByLabel(profile.roleFields, 'Focus areas'),
    domain: profile.domain || '',
    chapter: profile.chapter || '',
    region: profile.region || '',
    supportModes: Array.isArray(profile.supportModes) ? profile.supportModes.join(', ') : '',
    referralOpen: Boolean(profile.referralOpen),
    program: fieldByLabel(profile.roleFields, 'Program'),
    expectedGradYear: fieldByLabel(profile.roleFields, 'Graduation year'),
    cgpa: fieldByLabel(profile.roleFields, 'CGPA'),
    targetRoles: fieldByLabel(profile.roleFields, 'Target roles'),
    preferredLocations: fieldByLabel(profile.roleFields, 'Preferred locations'),
    referralGoal: fieldByLabel(profile.roleFields, 'Referral goal'),
    resumeLink: profile.resumeLink || '',
    externalLinks: Array.isArray(profile.externalLinks) ? profile.externalLinks.map((l) => ({ ...l })) : [],
  };
}

/* ── Link Arrow button ── */
function LinkArrow({ url }) {
  if (!url || url === '—') return null;
  return (
    <a
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors"
      style={{ background: C.accent, color: '#1a1a1a' }}
      title="Open link"
    >
      <ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  );
}

/* ── Platform icon badge ── */
function PlatformBadge({ url }) {
  const platform = detectPlatform(url);
  if (!platform) return null;
  return (
    <span
      className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
      style={{ background: platform.color }}
      title={platform.label}
    >
      {platform.icon}
    </span>
  );
}

/* ── Photo upload preview modal ── */
function PhotoPreviewModal({ file, onConfirm, onCancel, uploading }) {
  const previewUrl = React.useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  React.useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-xl p-6 shadow-2xl backdrop-blur-xl border" style={{ background: C.card, borderColor: C.cardBorder }}>
        <h3 className="text-lg font-semibold" style={{ color: C.text }}>Preview photo</h3>
        <div className="mt-4 flex justify-center">
          <img src={previewUrl} alt="Preview" className="h-40 w-40 rounded-xl object-cover border-2" style={{ borderColor: C.cardBorder }} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="rounded-lg px-4 py-2 text-sm font-medium transition"
            style={{ background: C.cardSub, color: C.text }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={uploading}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition"
            style={{ background: C.accent, color: '#1a1a1a' }}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Shared UI components ── */
function InfoCard({ id, title, eyebrow, action, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-[8px] border p-6 md:p-8 backdrop-blur-xl"
      style={{ background: C.card, borderColor: C.cardBorder }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>
              {eyebrow}
            </div>
          ) : null}
          <h2 className="mt-2 text-xl font-semibold tracking-tight" style={{ color: C.text }}>{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ReadOnlyField({ label, value, fullWidth = false, linkUrl }) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>{label}</div>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium leading-6" style={{ color: C.text }}>
        {linkUrl ? <PlatformBadge url={linkUrl} /> : null}
        <span style={{ color: value && value !== '—' ? C.text : C.textMuted }}>{value || '—'}</span>
        {linkUrl ? <LinkArrow url={linkUrl} /> : null}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', fullWidth = false, textarea = false, inputMode, placeholder, error }) {
  const baseClass =
    `mt-2 w-full rounded-[6px] border px-3 py-2.5 text-sm outline-none transition`;
  const style = {
    background: C.inputBg,
    borderColor: error ? '#ef4444' : C.inputBorder,
    color: C.text,
  };
  return (
    <label className={fullWidth ? 'md:col-span-2' : ''}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>{label}</div>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          className={`${baseClass} min-h-[140px] resize-y`}
          style={style}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={baseClass}
          inputMode={inputMode}
          style={style}
          placeholder={placeholder}
        />
      )}
      {error ? <div className="mt-1 text-xs text-red-500">{error}</div> : null}
    </label>
  );
}

/* ── Main component ── */
export function ProfilePage() {
  const params = useParams();
  const { user, refreshSession } = useOutletContext();
  const isOwnProfile = !params.profileId || params.profileId === 'me';
  const viewerRole = String(user?.role || 'alumni').toLowerCase();
  const [activeSection, setActiveSection] = React.useState('profile-summary');
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [form, setForm] = React.useState(null);

  /* photo upload */
  const photoInputRef = React.useRef(null);
  const [pendingPhoto, setPendingPhoto] = React.useState(null);
  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);

  /* toasts */
  const { toasts, push: pushToast, remove: removeToast } = useToasts();

  const loadProfile = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = isOwnProfile ? await fetchMyProfile() : await fetchPublicProfile(params.profileId);
      setProfile(data || null);
    } catch (err) {
      setProfile(null);
      setError(err.message || 'Could not load profile');
    } finally {
      setLoading(false);
    }
  }, [isOwnProfile, params.profileId]);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  React.useEffect(() => {
    if (!profile || !isOwnProfile) {
      setEditing(false);
      setForm(null);
      return;
    }
    setForm(buildFormFromProfile(profile));
  }, [profile, isOwnProfile]);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = profile ? `Alumni Profile | ${profile.name}` : 'Alumni Profile';
    }
  }, [profile]);

  const sections = React.useMemo(() => {
    const roleSectionTitle = profile?.role === 'Alumni' ? 'Professional snapshot' : 'Academic snapshot';
    return [
      { id: 'profile-summary', label: 'Profile summary' },
      { id: 'personal-info', label: 'Personal information' },
      { id: 'role-info', label: roleSectionTitle },
      { id: 'public-profile', label: 'Public statement' },
      { id: 'journey', label: profile?.role === 'Alumni' ? 'Network journey' : 'Academic journey' },
    ];
  }, [profile]);

  React.useEffect(() => {
    const handleScroll = () => {
      let current = SECTION_ORDER[0];
      for (const id of SECTION_ORDER) {
        const element = document.getElementById(id);
        if (!element) {
          continue;
        }
        const rect = element.getBoundingClientRect();
        if (rect.top <= 140) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const avatarUrl = profile?.photoUrl ? resolvePublicAssetUrl(profile.photoUrl) : '';
  const isAlumniProfile = profile?.role === 'Alumni';
  const canRequestReferral =
    !isOwnProfile &&
    isAlumniProfile &&
    Boolean(profile?.referralTarget?.openings?.length) &&
    Boolean(profile?.alumniUserId);

  const requestTargetState = canRequestReferral
    ? {
      requestTarget: {
        id: profile.id,
        alumniUserId: profile.alumniUserId,
        name: profile.name,
        headline: profile.headline,
        openings: profile.referralTarget.openings,
      },
    }
    : undefined;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...(current || {}), [key]: value }));
  };

  /* ── external links helpers ── */
  const addExternalLink = () => {
    setForm((prev) => ({
      ...prev,
      externalLinks: [...(prev?.externalLinks || []), { name: '', url: '' }],
    }));
  };

  const removeExternalLink = (index) => {
    setForm((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, i) => i !== index),
    }));
  };

  const updateExternalLink = (index, key, value) => {
    setForm((prev) => {
      const links = [...prev.externalLinks];
      links[index] = { ...links[index], [key]: value };
      return { ...prev, externalLinks: links };
    });
  };

  const moveExternalLink = (index, direction) => {
    setForm((prev) => {
      const links = [...prev.externalLinks];
      const target = index + direction;
      if (target < 0 || target >= links.length) return prev;
      [links[index], links[target]] = [links[target], links[index]];
      return { ...prev, externalLinks: links };
    });
  };

  /* ── URL validation state ── */
  const formErrors = React.useMemo(() => {
    if (!form) return {};
    const e = {};
    if (form.linkedinUrl && !isValidUrl(form.linkedinUrl)) e.linkedinUrl = 'Enter a valid URL (https://...)';
    if (form.portfolioUrl && !isValidUrl(form.portfolioUrl)) e.portfolioUrl = 'Enter a valid URL (https://...)';
    if (form.resumeLink && !isValidUrl(form.resumeLink)) e.resumeLink = 'Enter a valid URL (https://...)';
    if (form.resumeLink && isValidUrl(form.resumeLink) && !isGoogleDriveUrl(form.resumeLink)) {
      e.resumeLink = 'Please use a Google Drive link (drive.google.com)';
    }
    (form.externalLinks || []).forEach((link, i) => {
      if (link.url && !isValidUrl(link.url)) e[`extLink_${i}`] = 'Enter a valid URL';
    });
    return e;
  }, [form]);

  const hasValidationErrors = Object.keys(formErrors).length > 0;

  /* ── save profile ── */
  const saveProfile = async () => {
    if (!form || !user?.id) {
      return;
    }
    if (hasValidationErrors) {
      pushToast('Please fix the validation errors before saving', 'error');
      return;
    }

    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        fullName: form.fullName.trim(),
        city: form.city.trim() || null,
        state: form.state?.trim() || null,
        country: form.country.trim() || null,
        linkedinUrl: form.linkedinUrl.trim() || null,
        portfolioUrl: form.portfolioUrl.trim() || null,
        headline: form.headline.trim() || null,
        about: form.about.trim() || null,
        showEmail: Boolean(form.showEmail),
        skills: splitCommaString(form.skills),
        interests: splitCommaString(form.interests),
        resumeLink: form.resumeLink.trim() || null,
        externalLinks: (form.externalLinks || [])
          .filter((l) => l.name.trim() && l.url.trim())
          .map((l) => ({ name: l.name.trim(), url: l.url.trim() })),
      };

      if (isAlumniProfile) {
        Object.assign(payload, {
          currentCompany: form.currentCompany.trim() || null,
          currentJobTitle: form.currentJobTitle.trim() || null,
          yearsExperience: form.yearsExperience.trim() || null,
          department: form.department.trim() || null,
          batchYear: form.batch ? Number(form.batch) : null,
          focus: form.focus.trim() || null,
          domain: form.domain.trim() || null,
          chapter: form.chapter.trim() || null,
          region: form.region.trim() || null,
          supportModes: splitCommaString(form.supportModes),
          referralOpen: Boolean(form.referralOpen),
        });
      } else {
        Object.assign(payload, {
          department: form.department?.trim() || null,
          batchYear: form.batch ? Number(form.batch) : null,
          program: form.program.trim() || null,
          cgpa: form.cgpa.trim() || null,
          targetRoles: form.targetRoles.trim() || null,
          preferredLocations: form.preferredLocations.trim() || null,
          referralGoal: form.referralGoal.trim() || null,
        });
      }

      await patchMyProfile(payload);

      const userPatch = {
        phone: form.phone.trim() || null,
      };

      if (!isAlumniProfile) {
        const yearValue = String(form.expectedGradYear || '').trim();
        if (yearValue) {
          const yearNumber = Number(yearValue);
          if (!Number.isFinite(yearNumber)) {
            throw new Error('Graduation year must be a valid number');
          }
          userPatch.expectedGradYear = yearNumber;
        } else {
          userPatch.expectedGradYear = null;
        }
      }

      await patchUser(user.id, userPatch);
      await refreshSession?.();
      await loadProfile();
      setEditing(false);
      pushToast('Profile updated successfully!');
    } catch (err) {
      setSaveError(err.message || 'Could not save profile');
      pushToast(err.message || 'Could not save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── photo upload ── */
  const handlePhotoSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPendingPhoto(file);
  };

  const confirmPhotoUpload = async () => {
    if (!pendingPhoto) return;
    setUploadingPhoto(true);
    try {
      await uploadProfilePhoto(pendingPhoto);
      await loadProfile();
      pushToast('Profile photo updated!');
    } catch (err) {
      pushToast(err.message || 'Could not upload photo', 'error');
    } finally {
      setUploadingPhoto(false);
      setPendingPhoto(null);
    }
  };

  /* ── render ── */
  if (loading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center rounded-[8px] border text-sm backdrop-blur-xl"
        style={{ background: C.card, borderColor: C.cardBorder, color: C.textMuted }}
      >
        Loading profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[8px] border p-8 backdrop-blur-xl" style={{ background: C.card, borderColor: C.cardBorder }}>
        <div className="text-lg font-semibold" style={{ color: C.text }}>Profile not found</div>
        <p className="mt-2 text-sm" style={{ color: C.textMuted }}>{error || 'This profile is not available right now.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.pageBg, color: C.text }}>
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Photo preview modal (Suggestion 1) */}
      <PhotoPreviewModal
        file={pendingPhoto}
        onConfirm={confirmPhotoUpload}
        onCancel={() => setPendingPhoto(null)}
        uploading={uploadingPhoto}
      />

      {/* Slide-up animation for toasts */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>

      <div className="mx-auto flex w-full max-w-[1380px] gap-6 px-4 py-6 md:px-6 md:py-8">
        {/* ── Sidebar ── */}
        <aside className="hidden w-72 shrink-0 lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:flex-col">
          <div className="overflow-hidden rounded-[8px] border backdrop-blur-xl" style={{ background: C.card, borderColor: C.cardBorder }}>
            <div className="h-1.5 w-full" style={{ background: C.accent }} />
            <div className="p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: C.textFaint }}>
                Account settings
              </div>
              <nav className="mt-6 space-y-3">
                {sections.map((item) => {
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="flex w-full items-center gap-3 rounded-[6px] border-l-2 px-3 py-2.5 text-left transition"
                      style={{
                        borderColor: active ? C.accent : 'transparent',
                        background: active ? `${C.accent}18` : 'transparent',
                        color: active ? C.text : C.textMuted,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: active ? C.accent : C.textFaint }}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border p-5 backdrop-blur-xl" style={{ background: C.card, borderColor: C.cardBorder }}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>
              Profile actions
            </div>
            <div className="mt-4 space-y-3">
              {isOwnProfile ? (
                <Link
                  to="/referrals"
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition"
                  style={{ background: C.accent, color: '#1a1a1a' }}
                >
                  <MessageSquare className="h-4 w-4" />
                  Open referrals
                </Link>
              ) : canRequestReferral ? (
                <Link
                  to="/referrals"
                  state={requestTargetState}
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition"
                  style={{ background: C.accent, color: '#1a1a1a' }}
                >
                  <MessageSquare className="h-4 w-4" />
                  Ask request
                </Link>
              ) : null}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Profile Summary Card */}
          <section
            id="profile-summary"
            className="scroll-mt-6 rounded-[8px] border p-6 md:p-8 backdrop-blur-xl"
            style={{ background: C.card, borderColor: C.cardBorder }}
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-5">
                {/* Avatar with photo upload overlay (Change 2) */}
                <div className="relative">
                  <div
                    className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border"
                    style={{ background: C.cardSub, borderColor: C.cardBorder }}
                  >
                    {avatarUrl ? (
                      <>
                        <img src={avatarUrl} alt={profile.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }} />
                        <span className="items-center justify-center h-full w-full hidden text-2xl font-semibold" style={{ color: C.text }}>{profile.initials}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-semibold" style={{ color: C.text }}>{profile.initials}</span>
                    )}
                  </div>
                  {isOwnProfile ? (
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-md transition hover:scale-110"
                      style={{ background: C.accent, borderColor: C.pageBg, color: '#1a1a1a', zIndex: 10 }}
                      title="Upload profile photo"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                  {isOwnProfile && editing && avatarUrl ? (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await patchMyProfile({ photoUrl: null });
                          await loadProfile();
                          pushToast('Profile photo removed!');
                        } catch (err) {
                          pushToast(err.message || 'Could not remove photo', 'error');
                        }
                      }}
                      className="absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition hover:scale-110 z-20"
                      style={{ background: '#ef4444', color: '#ffffff', border: `2px solid ${C.pageBg}` }}
                      title="Remove profile photo"
                    >
                      <Minus className="h-4 w-4 stroke-[3]" />
                    </button>
                  ) : null}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: C.text }}>
                      {profile.name}
                    </h1>
                    <span
                      className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ background: C.cardSub, borderColor: C.cardBorder, color: C.textMuted }}
                    >
                      {profile.role}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium md:text-base" style={{ color: C.textMuted }}>{profile.headline}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs" style={{ color: C.textMuted }}>
                    {fieldByLabel(profile.personalFields, 'Email') ? (
                      <div className="flex items-center gap-2 rounded-full border px-3 py-1.5" style={{ background: C.cardSub, borderColor: C.cardBorder }}>
                        <Mail className="h-3.5 w-3.5" />
                        <span>{fieldByLabel(profile.personalFields, 'Email')}</span>
                      </div>
                    ) : null}
                    {profile.location ? (
                      <div className="flex items-center gap-2 rounded-full border px-3 py-1.5" style={{ background: C.cardSub, borderColor: C.cardBorder }}>
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{profile.location}</span>
                      </div>
                    ) : null}
                    {profile.roleSummary ? (
                      <div className="flex items-center gap-2 rounded-full border px-3 py-1.5" style={{ background: C.cardSub, borderColor: C.cardBorder }}>
                        <span>{profile.roleSummary}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Action buttons (Change 3: Resume link button) */}
              <div className="flex flex-wrap gap-3">
                {/* Resume ↗ button — opens Google Drive link */}
                {profile.resumeLink ? (
                  <a
                    href={profile.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-[6px] border px-4 py-2.5 text-sm font-medium transition hover:opacity-80"
                    style={{ background: C.cardSub, borderColor: C.cardBorder, color: C.text }}
                  >
                    Resume
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}

                {isOwnProfile ? (
                  editing ? (
                    <>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => {
                          setEditing(false);
                          setSaveError('');
                          setForm(buildFormFromProfile(profile));
                        }}
                        className="inline-flex items-center gap-2 rounded-[6px] border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60"
                        style={{ background: C.cardSub, borderColor: C.cardBorder, color: C.text }}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={saving || hasValidationErrors}
                        onClick={saveProfile}
                        className="inline-flex items-center gap-2 rounded-[6px] px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60"
                        style={{ background: C.accent, color: '#1a1a1a' }}
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving…' : 'Save changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-2 rounded-[6px] px-4 py-2.5 text-sm font-semibold transition"
                      style={{ background: C.accent, color: '#1a1a1a' }}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit profile
                    </button>
                  )
                ) : null}
              </div>
            </div>
            {saveError ? <div className="mt-4 text-sm text-red-500">{saveError}</div> : null}
          </section>

          {/* ── Personal Information (Change 4: external links + Change 5: arrows) ── */}
          <InfoCard
            id="personal-info"
            title="Personal information"
            eyebrow="Shared details"
          >
            {editing && isOwnProfile && form ? (
              <div className="grid gap-4 md:grid-cols-2">
                <InputField label="Full name" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} />
                <InputField label="Phone" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
                <InputField label="Headline" value={form.headline} onChange={(e) => updateForm('headline', e.target.value)} fullWidth />
                <InputField label="City" value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
                <StateDropdown label="State" value={form.state} onChange={(val) => updateForm('state', val)} />
                <InputField label="Country" value={form.country} onChange={(e) => updateForm('country', e.target.value)} />
                <InputField label="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => updateForm('linkedinUrl', e.target.value)} fullWidth error={formErrors.linkedinUrl} />
                <InputField label="Portfolio URL" value={form.portfolioUrl} onChange={(e) => updateForm('portfolioUrl', e.target.value)} fullWidth error={formErrors.portfolioUrl} />
                <InputField
                  label="Resume Link (Google Drive)"
                  value={form.resumeLink}
                  onChange={(e) => updateForm('resumeLink', e.target.value)}
                  fullWidth
                  placeholder="https://drive.google.com/..."
                  error={formErrors.resumeLink}
                />
                <label className="md:col-span-2">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>
                    Show email publicly
                  </div>
                  <div
                    className="mt-2 flex items-center gap-3 rounded-[6px] border px-3 py-3 text-sm"
                    style={{ background: C.inputBg, borderColor: C.inputBorder, color: C.text }}
                  >
                    <input
                      type="checkbox"
                      checked={form.showEmail}
                      onChange={(e) => updateForm('showEmail', e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    Visible on public profile
                  </div>
                </label>

                {/* ── Dynamic External Links (Change 4) ── */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>
                      Other Links
                    </div>
                    {(form.externalLinks || []).length < 10 ? (
                      <button
                        type="button"
                        onClick={addExternalLink}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
                        style={{ background: C.accent, color: '#1a1a1a' }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add link
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3 space-y-3">
                    {(form.externalLinks || []).map((link, index) => (
                      <div key={index} className="flex items-start gap-2">
                        {/* Reorder (Suggestion 3) */}
                        <div className="flex flex-col gap-0.5 pt-6">
                          <button
                            type="button"
                            onClick={() => moveExternalLink(index, -1)}
                            disabled={index === 0}
                            className="rounded p-0.5 transition disabled:opacity-20"
                            style={{ color: C.textMuted }}
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExternalLink(index, 1)}
                            disabled={index === form.externalLinks.length - 1}
                            className="rounded p-0.5 transition disabled:opacity-20"
                            style={{ color: C.textMuted }}
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid flex-1 gap-2 md:grid-cols-2">
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>Link Name</div>
                            <input
                              type="text"
                              value={link.name}
                              onChange={(e) => updateExternalLink(index, 'name', e.target.value)}
                              placeholder="e.g. YouTube, Instagram"
                              className="mt-2 w-full rounded-[6px] border px-3 py-2.5 text-sm outline-none transition"
                              style={{ background: C.inputBg, borderColor: C.inputBorder, color: C.text }}
                            />
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>URL</div>
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => updateExternalLink(index, 'url', e.target.value)}
                              placeholder="https://..."
                              className="mt-2 w-full rounded-[6px] border px-3 py-2.5 text-sm outline-none transition"
                              style={{
                                background: C.inputBg,
                                borderColor: formErrors[`extLink_${index}`] ? '#ef4444' : C.inputBorder,
                                color: C.text,
                              }}
                            />
                            {formErrors[`extLink_${index}`] ? (
                              <div className="mt-1 text-xs text-red-500">{formErrors[`extLink_${index}`]}</div>
                            ) : null}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExternalLink(index)}
                          className="mt-6 rounded-full p-1.5 transition hover:opacity-70"
                          style={{ color: '#ef4444' }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <ReadOnlyField label="Full name" value={profile.name} />
                <ReadOnlyField label="Phone" value={fieldByLabel(profile.personalFields, 'Phone')} />
                <ReadOnlyField label="Email" value={fieldByLabel(profile.personalFields, 'Email')} />
                <ReadOnlyField label="Location" value={profile.location} />
                <ReadOnlyField
                  label="LinkedIn"
                  value={fieldByLabel(profile.personalFields, 'LinkedIn')}
                  fullWidth
                  linkUrl={fieldByLabel(profile.personalFields, 'LinkedIn')}
                />
                <ReadOnlyField
                  label="Portfolio"
                  value={fieldByLabel(profile.personalFields, 'Portfolio')}
                  fullWidth
                  linkUrl={fieldByLabel(profile.personalFields, 'Portfolio')}
                />
                {/* External links display (Change 4 read mode + Change 5 arrows + Suggestion 4 icons) */}
                {(profile.externalLinks || []).length > 0 ? (
                  <div className="md:col-span-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: C.textFaint }}>
                      Other Links
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {profile.externalLinks.map((link, i) => (
                        <ReadOnlyField key={i} label={link.name} value={link.url} linkUrl={link.url} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </InfoCard>

          {/* ── Role Info ── */}
          <InfoCard
            id="role-info"
            title={isAlumniProfile ? 'Professional snapshot' : 'Academic snapshot'}
            eyebrow={isAlumniProfile ? 'Alumni fields' : 'Student fields'}
          >
            {editing && isOwnProfile && form ? (
              <div className="grid gap-4 md:grid-cols-2">
                {isAlumniProfile ? (
                  <>
                    <DepartmentDropdown label="Department" value={form.department} onChange={(val) => updateForm('department', val)} theme="dark" />
                    <IndustryDropdown label="Domain" value={form.domain} onChange={(val) => updateForm('domain', val)} theme="dark" />
                    <InputField label="Batch" value={form.batch} onChange={(e) => updateForm('batch', e.target.value)} inputMode="numeric" />
                    <CompanyAutocomplete value={form.currentCompany} onChange={(val) => updateForm('currentCompany', val)} />
                    <InputField label="Current role" value={form.currentJobTitle} onChange={(e) => updateForm('currentJobTitle', e.target.value)} />
                    <InputField label="Experience" value={form.yearsExperience} onChange={(e) => updateForm('yearsExperience', e.target.value)} />
                    <InputField label="Chapter" value={form.chapter} onChange={(e) => updateForm('chapter', e.target.value)} />
                    <InputField label="Region" value={form.region} onChange={(e) => updateForm('region', e.target.value)} />
                    <InputField label="Support modes" value={form.supportModes} onChange={(e) => updateForm('supportModes', e.target.value)} />
                    <InputField label="Focus areas" value={form.focus} onChange={(e) => updateForm('focus', e.target.value)} fullWidth />
                    <label className="md:col-span-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>
                        Referral availability
                      </div>
                      <div
                        className="mt-2 flex items-center gap-3 rounded-[6px] border px-3 py-3 text-sm"
                        style={{ background: C.inputBg, borderColor: C.inputBorder, color: C.text }}
                      >
                        <input
                          type="checkbox"
                          checked={form.referralOpen}
                          onChange={(e) => updateForm('referralOpen', e.target.checked)}
                          className="h-4 w-4 rounded"
                        />
                        Open to referral requests
                      </div>
                    </label>
                  </>
                ) : (
                  <>
                    <DepartmentDropdown label="Department" value={form.department} onChange={(val) => updateForm('department', val)} theme="dark" />
                    <InputField label="Program" value={form.program} onChange={(e) => updateForm('program', e.target.value)} />
                    <InputField label="Batch" value={form.batch} onChange={(e) => updateForm('batch', e.target.value)} inputMode="numeric" />
                    <InputField label="Graduation year" value={form.expectedGradYear} onChange={(e) => updateForm('expectedGradYear', e.target.value)} inputMode="numeric" />
                    <InputField label="CGPA" value={form.cgpa} onChange={(e) => updateForm('cgpa', e.target.value)} />
                    <InputField label="Target roles" value={form.targetRoles} onChange={(e) => updateForm('targetRoles', e.target.value)} />
                    <InputField label="Preferred locations" value={form.preferredLocations} onChange={(e) => updateForm('preferredLocations', e.target.value)} fullWidth />
                    <InputField label="Referral goal" value={form.referralGoal} onChange={(e) => updateForm('referralGoal', e.target.value)} fullWidth />
                  </>
                )}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {profile.roleFields.map((field) => (
                  <ReadOnlyField key={field.label} label={field.label} value={field.value} />
                ))}
                {isAlumniProfile ? (
                  <>
                    <ReadOnlyField label="Region" value={profile.region} />
                    <ReadOnlyField label="Chapter" value={profile.chapter} />
                  </>
                ) : null}
              </div>
            )}
          </InfoCard>

          {/* ── Public Statement ── */}
          <InfoCard
            id="public-profile"
            title="Public statement"
            eyebrow="What others see"
          >
            {editing && isOwnProfile && form ? (
              <div className="grid gap-4">
                <InputField
                  label="Public statement"
                  value={form.about}
                  onChange={(e) => updateForm('about', e.target.value)}
                  textarea
                  fullWidth
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Skills" value={form.skills} onChange={(e) => updateForm('skills', e.target.value)} />
                  <InputField label="Interests" value={form.interests} onChange={(e) => updateForm('interests', e.target.value)} />
                </div>
              </div>
            ) : (
              <>
                <p className="max-w-4xl text-sm leading-7" style={{ color: C.textMuted }}>{profile.about}</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {[...(profile.skills || []), ...(profile.interests || [])].slice(0, 10).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium"
                      style={{ background: C.cardSub, borderColor: C.cardBorder, color: C.textMuted }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}
          </InfoCard>

          {/* ── Journey ── */}
          <InfoCard
            id="journey"
            title={profile.trackTitle || (isAlumniProfile ? 'Network journey' : 'Academic journey')}
            eyebrow="Recent movement"
          >
            <p className="mb-6 max-w-3xl text-sm leading-7" style={{ color: C.textMuted }}>{profile.trackSubtitle}</p>
            <div className="space-y-4">
              {(profile.trackItems || []).map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="relative overflow-hidden rounded-[8px] border p-5 pl-6"
                  style={{ background: C.cardSub, borderColor: C.cardBorder }}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ backgroundColor: item.accent || C.accent }}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold" style={{ color: C.text }}>{item.title}</div>
                      <p className="mt-2 max-w-3xl text-sm leading-6" style={{ color: C.textMuted }}>{item.meta}</p>
                    </div>
                    <span
                      className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ background: C.card, borderColor: C.cardBorder, color: C.textMuted }}
                    >
                      {item.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>

      {/* Hidden file input for photo upload */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {/* ── Mobile navigation ── */}
      <div className="px-4 pb-10 lg:hidden">
        <div className="mx-auto max-w-[1380px] rounded-[8px] border p-4 backdrop-blur-xl" style={{ background: C.card, borderColor: C.cardBorder }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: C.textFaint }}>
            Account settings
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {sections.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition"
                  style={{
                    background: active ? C.accent : C.cardSub,
                    borderColor: active ? C.accent : C.cardBorder,
                    color: active ? C.text : C.textMuted,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
