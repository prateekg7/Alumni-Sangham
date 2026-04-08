import mongoose from "mongoose";

export function initialsFromName(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function displayLocation(profile) {
  const city = profile.city?.trim();
  const country = profile.country?.trim();
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return "—";
}

function roleTitleCase(role) {
  if (role === "student") return "Student";
  return "Alumni";
}

function splitList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildInterests(profile, role, skills, supportModes) {
  const explicit =
    Array.isArray(profile.interests) && profile.interests.length
      ? profile.interests
      : [];

  const fallback =
    role === "student"
      ? [
          ...splitList(profile.targetRoles),
          ...skills,
          profile.program || profile.department,
        ]
      : [
          profile.domain || profile.industry,
          ...supportModes,
          ...skills,
        ];

  return Array.from(new Set([...explicit, ...fallback].map((item) => String(item || "").trim()).filter(Boolean))).slice(0, 10);
}

/** Alumni directory row — matches frontend directory card shape */
export function toDirectoryCard(profile, user) {
  const id = profile.displaySlug || String(profile._id);
  const name = profile.fullName;
  const title = profile.currentJobTitle || "Alumni";
  const company = profile.currentCompany || "—";
  const supportModes =
    Array.isArray(profile.supportModes) && profile.supportModes.length
      ? profile.supportModes
      : ["Mentorship"];
  const skills =
    Array.isArray(profile.skills) && profile.skills.length ? profile.skills : ["Networking"];

  return {
    id,
    alumniUserId: user ? String(user._id) : null,
    name,
    role: "Alumni",
    title,
    company,
    headline: profile.headline || `${title} · ${company}`,
    focus:
      profile.focus ||
      (profile.about ? String(profile.about).slice(0, 160) : `Active in ${profile.department || "the network"}.`),
    location: displayLocation(profile),
    region: profile.region || "Other",
    chapter: profile.chapter || "Global",
    domain: profile.domain || profile.industry || "General",
    years: profile.yearsExperience || "—",
    supportModes,
    skills,
    referralOpen: Boolean(profile.referralOpen),
    batchLabel: user?.batchLabel || "Alumni",
    initials: initialsFromName(name),
    avatarTone: profile.avatarTone || "from-[#8f7cff] to-[#4d82ff]",
  };
}

function defaultDocumentsForCard(entry) {
  const stem = entry.name.replace(/\s+/g, "_");
  return [
    {
      type: "Resume",
      title: `${stem}_Resume.pdf`,
      updatedAt: "On profile",
      visibility: "Public to everyone who views this profile",
      summary: `${entry.domain} highlights and experience.`,
      tone: "from-[#202636] to-[#12151b]",
      actionLabel: "View resume",
      fileUrl: null,
    },
  ];
}

function defaultTrackItems(entry) {
  return [
    {
      title: entry.supportModes[0] || "Mentorship",
      meta: `${entry.name.split(" ")[0]} is active in the alumni network.`,
      note: entry.chapter,
      accent: "#8f7cff",
    },
    {
      title: "Skill depth",
      meta: `Relevant for ${entry.skills.slice(0, 3).join(", ")}.`,
      note: entry.years,
      accent: "#5da4ff",
    },
  ];
}

function referralTargetFromCard(entry) {
  if (!entry.referralOpen) return null;
  const first = entry.name.split(" ")[0];
  return {
    title: `Request a referral from ${first}`,
    description: `${first} is open to reviewing strong ${String(entry.domain).toLowerCase()} candidates with a public resume.`,
    openings: entry.skills.slice(0, 3),
    note: "Keep the request concise and attach context through your public profile.",
  };
}

/** Full profile page payload — matches frontend ProfilePage expectations */
export function toFullProfile(profile, user, { isOwner = false, profileCompleteOverride } = {}) {
  const role = profile.role;
  const roleLabel = roleTitleCase(role);
  const id = isOwner ? "me" : profile.displaySlug || String(profile._id);
  const name = profile.fullName;
  const location = displayLocation(profile);
  const batchLabel = user?.batchLabel || "";

  const emailVisible = isOwner || profile.showEmail;
  const email = emailVisible ? user?.email || "—" : "Hidden";
  const supportModes =
    Array.isArray(profile.supportModes) && profile.supportModes.length
      ? profile.supportModes
      : role === "alumni"
        ? ["Mentorship"]
        : [];
  const skills =
    Array.isArray(profile.skills) && profile.skills.length
      ? profile.skills
      : role === "student"
        ? ["Projects", "Problem Solving"]
        : ["Networking"];
  const interests = buildInterests(profile, role, skills, supportModes);

  const personalFields = [
    { label: "Full name", value: name },
    { label: "Email", value: email },
    { label: "Phone", value: isOwner ? user?.phone || "—" : "—" },
    { label: "Location", value: location },
    {
      label: "LinkedIn",
      value: profile.linkedinUrl || "—",
    },
    {
      label: "Portfolio",
      value: profile.portfolioUrl || "—",
    },
  ];

  let roleFields;
  if (role === "student") {
    roleFields = [
      { label: "Program", value: profile.program || profile.department || "—" },
      {
        label: "Graduation year",
        value: user?.expectedGradYear ? String(user.expectedGradYear) : "—",
      },
      { label: "CGPA", value: profile.cgpa || "—" },
      { label: "Target roles", value: profile.targetRoles || "—" },
      { label: "Preferred locations", value: profile.preferredLocations || "—" },
      { label: "Referral goal", value: profile.referralGoal || "—" },
    ];
  } else {
    roleFields = [
      { label: "Current company", value: profile.currentCompany || "—" },
      { label: "Current role", value: profile.currentJobTitle || "—" },
      { label: "Experience", value: profile.yearsExperience || "—" },
      {
        label: "Focus areas",
        value: profile.focus || skills.join(", ") || "—",
      },
      { label: "Mentorship", value: supportModes.join(", ") || "—" },
      {
        label: "Referral support",
        value: profile.referralOpen
          ? `Open for ${(profile.domain || "domain").toLowerCase()}-aligned referrals`
          : "Mentorship-focused profile at the moment",
      },
    ];
  }

  const entry = toDirectoryCard(profile, user);
  const documents =
    Array.isArray(profile.documents) && profile.documents.length
      ? profile.documents.map((d) => ({
          type: d.type,
          title: d.title,
          updatedAt: d.updatedAt || "",
          visibility: d.visibility || "",
          summary: d.summary || "",
          tone: d.tone || "from-[#202636] to-[#12151b]",
          actionLabel: d.actionLabel || "Open",
          fileUrl: d.fileUrl || null,
        }))
      : defaultDocumentsForCard(entry);

  const trackItems =
    Array.isArray(profile.trackItems) && profile.trackItems.length
      ? profile.trackItems
      : defaultTrackItems(entry);

  let checklist = Array.isArray(profile.checklist) ? profile.checklist.map((c) => ({ ...c })) : [];
  const complete =
    typeof profileCompleteOverride === "boolean" ? profileCompleteOverride : profile.profileComplete;
  if (complete && checklist.length) {
    checklist = checklist.map((item) => ({ ...item, done: true }));
  }

  const referralTarget =
    profile.referralTarget != null
      ? profile.referralTarget
      : role === "alumni"
        ? referralTargetFromCard(entry)
        : null;

  return {
    id,
    alumniUserId: role === "alumni" && user ? String(user._id) : null,
    name,
    initials: initialsFromName(name),
    role: roleLabel,
    headline:
      profile.headline ||
      (role === "student"
        ? `${profile.program || "Student"} · ${batchLabel || "Campus"}`
        : `${profile.currentJobTitle || "Alumni"} · ${profile.currentCompany || ""}`.trim()),
    roleSummary:
      role === "student"
        ? `Student · ${batchLabel || ""} · ${profile.department || ""}`.replace(/\s+·\s*$/, "")
        : `Alumni · ${batchLabel || ""} · ${profile.department || "IIT Patna"}`.replace(/\s+·\s*$/, ""),
    location,
    memberCode: profile.memberCode || (role === "student" ? "STD-MEMBER" : "ALM-MEMBER"),
    memberSince: profile.memberSinceLabel || "Member",
    baseLabel: profile.baseLabel || (role === "student" ? "Campus" : "Chapter"),
    photoUrl: profile.photoUrl || null,
    about:
      profile.about ||
      `${name} is part of the alumni network. Complete your profile to tell the community more.`,
    department: profile.department || "",
    chapter: profile.chapter || "",
    region: profile.region || "",
    domain: profile.domain || profile.industry || "",
    skills,
    supportModes,
    interests,
    referralOpen: Boolean(profile.referralOpen),
    emailVisible,
    personalFields,
    roleFields,
    documents,
    trackTitle: profile.trackTitle || (role === "student" ? "Academic & projects" : "Network activity"),
    trackSubtitle:
      profile.trackSubtitle ||
      (role === "student" ? "What you are building" : "How this alumni helps the community"),
    trackItems,
    checklist,
    referralTarget,
  };
}

export function toSessionUser(user, profile) {
  const name =
    (profile?.fullName && String(profile.fullName).trim()) ||
    `${user.firstName} ${user.lastName}`.trim() ||
    "Member";
  const batchLabel =
    user.batchLabel ||
    (user.role === "student" && user.expectedGradYear
      ? `Batch '${String(user.expectedGradYear).slice(-2)}`
      : user.role === "alumni" && user.gradYear
        ? `Batch '${String(user.gradYear).slice(-2)}`
        : "");

  const checklist = profile?.checklist || [];
  const done = checklist.filter((c) => c.done).length;
  const profileProgress =
    profile?.profileComplete === true
      ? 100
      : checklist.length
        ? Math.round((done / checklist.length) * 100)
        : profile?.role === "student"
          ? 72
          : 81;

  return {
    id: String(user._id),
    name,
    email: user.email,
    role: user.role,
    batchLabel,
    initials: initialsFromName(name),
    profileComplete: Boolean(profile?.profileComplete),
    profileProgress,
    isVerified: Boolean(user.isVerified),
  };
}

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
