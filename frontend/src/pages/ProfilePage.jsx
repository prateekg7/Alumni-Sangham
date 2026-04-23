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
import { DEPARTMENTS } from '../lib/departments';

/* ── colour tokens (profile page only) ── */
const C = {
  pageBg: '#000000',
  card: '#36454F',
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
  youtube: { icon: '▶', color: '#FF0000', label: 'YouTube' },
  instagram: { icon: '📷', color: '#E4405F', label: 'Instagram' },
  github: { icon: '⚙', color: '#333', label: 'GitHub' },
  twitter: { icon: '𝕏', color: '#000', label: 'Twitter/X' },
  x: { icon: '𝕏', color: '#000', label: 'Twitter/X' },
  facebook: { icon: 'f', color: '#1877F2', label: 'Facebook' },
  behance: { icon: 'Bē', color: '#1769FF', label: 'Behance' },
  dribbble: { icon: '◉', color: '#EA4C89', label: 'Dribbble' },
  medium: { icon: 'M', color: '#000', label: 'Medium' },
  linkedin: { icon: 'in', color: '#0A66C2', label: 'LinkedIn' },
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
    return { city: '', country: '' };
  }
  const parts = String(location)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return {
    city: parts[0] || '',
    country: parts.slice(1).join(', ') || '',
  };
}

function buildFormFromProfile(profile) {
  const { city, country } = splitLocation(profile.location);
  return {
    fullName: profile.name || '',
    phone: fieldByLabel(profile.personalFields, 'Phone'),
    city,
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
                    <InputField label="Domain" value={form.domain} onChange={(e) => updateForm('domain', e.target.value)} />
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
