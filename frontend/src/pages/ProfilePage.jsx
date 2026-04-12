import React from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import {
  Download,
  Eye,
  Globe,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Save,
  Upload,
  X,
} from 'lucide-react';
import {
  fetchMyProfile,
  fetchPublicProfile,
  patchMyProfile,
  patchUser,
  resolvePublicAssetUrl,
  uploadResume,
} from '../lib/api';

const SECTION_ORDER = ['profile-summary', 'personal-info', 'role-info', 'public-profile', 'documents', 'journey'];

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
  };
}

function InfoCard({ id, title, eyebrow, action, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-[8px] border border-white/10 bg-[#101116] p-6 md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
              {eyebrow}
            </div>
          ) : null}
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ReadOnlyField({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-white/86">{value || '—'}</div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', fullWidth = false, textarea = false, inputMode }) {
  const baseClass =
    'mt-2 w-full rounded-[6px] border border-white/10 bg-[#17181f] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/40';
  return (
    <label className={fullWidth ? 'md:col-span-2' : ''}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">{label}</div>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          className={`${baseClass} min-h-[140px] resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={baseClass}
          inputMode={inputMode}
        />
      )}
    </label>
  );
}

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
  const [uploadingResume, setUploadingResume] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const [form, setForm] = React.useState(null);

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
      { id: 'documents', label: 'Resume & documents' },
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

  const resumeDocument = profile?.documents?.find((document) => document.type === 'Resume') || null;
  const resumeUrl = resumeDocument?.fileUrl ? resolvePublicAssetUrl(resumeDocument.fileUrl) : '';
  const avatarUrl = profile?.photoUrl ? resolvePublicAssetUrl(profile.photoUrl) : '';
  const isAlumniProfile = profile?.role === 'Alumni';
  const canRequestReferral =
    !isOwnProfile &&
    viewerRole === 'student' &&
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

  const saveProfile = async () => {
    if (!form || !user?.id) {
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
    } catch (err) {
      setSaveError(err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    setUploadingResume(true);
    setSaveError('');
    try {
      await uploadResume(file);
      await loadProfile();
    } catch (err) {
      setSaveError(err.message || 'Could not upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[8px] border border-white/10 bg-[#101116] text-sm text-white/55">
        Loading profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[8px] border border-white/10 bg-[#101116] p-8 text-white">
        <div className="text-lg font-semibold">Profile not found</div>
        <p className="mt-2 text-sm text-white/55">{error || 'This profile is not available right now.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <div className="mx-auto flex w-full max-w-[1380px] gap-6 px-4 py-6 md:px-6 md:py-8">
        <aside className="hidden w-72 shrink-0 lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:flex-col">
          <div className="overflow-hidden rounded-[8px] border border-white/10 bg-[#101116]">
            <div className="h-1.5 w-full bg-white" />
            <div className="p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
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
                      className={`flex w-full items-center gap-3 rounded-[6px] border-l-2 px-3 py-2.5 text-left transition ${
                        active
                          ? 'border-white bg-white/5 text-white'
                          : 'border-transparent text-white/45 hover:bg-white/5 hover:text-white/78'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-white' : 'bg-white/20'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-white/10 bg-[#101116] p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
              Profile actions
            </div>
            <div className="mt-4 space-y-3">
              {isOwnProfile ? (
                <Link
                  to="/referrals"
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
                >
                  <MessageSquare className="h-4 w-4" />
                  Open referrals
                </Link>
              ) : canRequestReferral ? (
                <Link
                  to="/referrals"
                  state={requestTargetState}
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
                >
                  <MessageSquare className="h-4 w-4" />
                  Ask request
                </Link>
              ) : resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
                >
                  <Eye className="h-4 w-4" />
                  View resume
                </a>
              ) : null}

              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-white/12 bg-[#17181f] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82 transition hover:bg-[#1d1f27]"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingResume ? 'Uploading…' : 'Upload resume'}
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <section
            id="profile-summary"
            className="scroll-mt-6 rounded-[8px] border border-white/10 bg-[#101116] p-6 md:p-8"
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-white/12 bg-[#17181f]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-white">{profile.initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                      {profile.name}
                    </h1>
                    <span className="rounded-full border border-white/12 bg-[#17181f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/58">
                      {profile.role}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white/56 md:text-base">{profile.headline}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/56">
                    {fieldByLabel(profile.personalFields, 'Email') ? (
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#17181f] px-3 py-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{fieldByLabel(profile.personalFields, 'Email')}</span>
                      </div>
                    ) : null}
                    {profile.location ? (
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#17181f] px-3 py-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{profile.location}</span>
                      </div>
                    ) : null}
                    {profile.roleSummary ? (
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#17181f] px-3 py-1.5">
                        <span>{profile.roleSummary}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-[6px] border border-white/12 bg-[#17181f] px-4 py-2.5 text-sm font-medium text-white/86 transition hover:bg-[#1d1f27]"
                  >
                    <Download className="h-4 w-4" />
                    Resume
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
                        className="inline-flex items-center gap-2 rounded-[6px] border border-white/12 bg-[#17181f] px-4 py-2.5 text-sm font-medium text-white/78 transition hover:bg-[#1d1f27] disabled:opacity-60"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={saveProfile}
                        className="inline-flex items-center gap-2 rounded-[6px] bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-60"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving…' : 'Save changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-2 rounded-[6px] bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit profile
                    </button>
                  )
                ) : null}
              </div>
            </div>
            {saveError ? <div className="mt-4 text-sm text-red-300">{saveError}</div> : null}
          </section>

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
                <InputField label="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => updateForm('linkedinUrl', e.target.value)} fullWidth />
                <InputField label="Portfolio URL" value={form.portfolioUrl} onChange={(e) => updateForm('portfolioUrl', e.target.value)} fullWidth />
                <label className="md:col-span-2">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                    Show email publicly
                  </div>
                  <div className="mt-2 flex items-center gap-3 rounded-[6px] border border-white/10 bg-[#17181f] px-3 py-3 text-sm text-white/82">
                    <input
                      type="checkbox"
                      checked={form.showEmail}
                      onChange={(e) => updateForm('showEmail', e.target.checked)}
                      className="h-4 w-4 rounded border-white/15 bg-black/50"
                    />
                    Visible on public profile
                  </div>
                </label>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <ReadOnlyField label="Full name" value={profile.name} />
                <ReadOnlyField label="Phone" value={fieldByLabel(profile.personalFields, 'Phone')} />
                <ReadOnlyField label="Email" value={fieldByLabel(profile.personalFields, 'Email')} />
                <ReadOnlyField label="Location" value={profile.location} />
                <ReadOnlyField label="LinkedIn" value={fieldByLabel(profile.personalFields, 'LinkedIn')} fullWidth />
                <ReadOnlyField label="Portfolio" value={fieldByLabel(profile.personalFields, 'Portfolio')} fullWidth />
              </div>
            )}
          </InfoCard>

          <InfoCard
            id="role-info"
            title={isAlumniProfile ? 'Professional snapshot' : 'Academic snapshot'}
            eyebrow={isAlumniProfile ? 'Alumni fields' : 'Student fields'}
          >
            {editing && isOwnProfile && form ? (
              <div className="grid gap-4 md:grid-cols-2">
                {isAlumniProfile ? (
                  <>
                    <InputField label="Department" value={form.department} onChange={(e) => updateForm('department', e.target.value)} />
                    <InputField label="Domain" value={form.domain} onChange={(e) => updateForm('domain', e.target.value)} />
                    <InputField label="Current company" value={form.currentCompany} onChange={(e) => updateForm('currentCompany', e.target.value)} />
                    <InputField label="Current role" value={form.currentJobTitle} onChange={(e) => updateForm('currentJobTitle', e.target.value)} />
                    <InputField label="Experience" value={form.yearsExperience} onChange={(e) => updateForm('yearsExperience', e.target.value)} />
                    <InputField label="Chapter" value={form.chapter} onChange={(e) => updateForm('chapter', e.target.value)} />
                    <InputField label="Region" value={form.region} onChange={(e) => updateForm('region', e.target.value)} />
                    <InputField label="Support modes" value={form.supportModes} onChange={(e) => updateForm('supportModes', e.target.value)} />
                    <InputField label="Focus areas" value={form.focus} onChange={(e) => updateForm('focus', e.target.value)} fullWidth />
                    <label className="md:col-span-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                        Referral availability
                      </div>
                      <div className="mt-2 flex items-center gap-3 rounded-[6px] border border-white/10 bg-[#17181f] px-3 py-3 text-sm text-white/82">
                        <input
                          type="checkbox"
                          checked={form.referralOpen}
                          onChange={(e) => updateForm('referralOpen', e.target.checked)}
                          className="h-4 w-4 rounded border-white/15 bg-black/50"
                        />
                        Open to referral requests
                      </div>
                    </label>
                  </>
                ) : (
                  <>
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
                <p className="max-w-4xl text-sm leading-7 text-white/74">{profile.about}</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {[...(profile.skills || []), ...(profile.interests || [])].slice(0, 10).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-[#17181f] px-3 py-1.5 text-xs font-medium text-white/66"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}
          </InfoCard>

          <InfoCard
            id="documents"
            title="Resume & documents"
            eyebrow="Visible to profile viewers"
            action={isOwnProfile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-[#17181f] px-4 py-2.5 text-sm font-medium text-white/82 transition hover:bg-[#1d1f27]"
              >
                <Upload className="h-4 w-4" />
                {uploadingResume ? 'Uploading…' : 'Add your resume'}
              </button>
            ) : null}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {(profile.documents || []).map((document) => {
                const fileUrl = document.fileUrl ? resolvePublicAssetUrl(document.fileUrl) : '';
                return (
                  <div
                    key={`${document.type}-${document.title}`}
                    className="rounded-[8px] border border-white/10 bg-[#17181f] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/38">
                          {document.type}
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">{document.title}</div>
                      </div>
                      {document.type === 'Resume' ? (
                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black">
                          Public
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/58">{document.summary}</p>
                    <div className="mt-3 text-xs uppercase tracking-[0.18em] text-white/32">
                      {document.updatedAt || document.visibility}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-[#101116] px-3 py-2 text-sm text-white/82 transition hover:bg-[#1a1c23]"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-[#101116] px-3 py-2 text-sm text-white/38">
                          <Eye className="h-4 w-4" />
                          Unavailable
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </InfoCard>

          <InfoCard
            id="journey"
            title={profile.trackTitle || (isAlumniProfile ? 'Network journey' : 'Academic journey')}
            eyebrow="Recent movement"
          >
            <p className="mb-6 max-w-3xl text-sm leading-7 text-white/58">{profile.trackSubtitle}</p>
            <div className="space-y-4">
              {(profile.trackItems || []).map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#17181f] p-5 pl-6"
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ backgroundColor: item.accent || '#ffffff' }}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-white">{item.title}</div>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">{item.meta}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-[#101116] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                      {item.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleResumeUpload}
      />

      <div className="px-4 pb-10 lg:hidden">
        <div className="mx-auto max-w-[1380px] rounded-[8px] border border-white/10 bg-[#101116] p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
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
                  className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition ${
                    active
                      ? 'border-white bg-white text-black'
                      : 'border-white/10 bg-[#17181f] text-white/62'
                  }`}
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
