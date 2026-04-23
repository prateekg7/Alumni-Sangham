import Profile from "./profile.model.js";
import User from "../auth/user.model.js";
import ApiError from "../../utils/ApiError.js";
import { toFullProfile, isValidObjectId } from "../../utils/profile.mapper.js";

async function loadProfileWithUserByKey(profileKey) {
  let profile = null;
  if (isValidObjectId(profileKey)) {
    profile = await Profile.findById(profileKey);
  }
  if (!profile) {
    profile = await Profile.findOne({ displaySlug: profileKey });
  }
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }
  const user = await User.findById(profile.userId).select("-passwordHash -refreshTokens");
  if (!user) {
    throw new ApiError(404, "User not found for profile");
  }
  return { profile, user };
}

export const getMyProfile = async (userId) => {
  const profile = await Profile.findOne({ userId });
  const user = await User.findById(userId).select("-passwordHash -refreshTokens");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }
  return toFullProfile(profile, user, { isOwner: true });
};

export const getPublicProfile = async (profileKey) => {
  const { profile, user } = await loadProfileWithUserByKey(profileKey);
  return toFullProfile(profile, user, { isOwner: false });
};

export const updateMyProfile = async (userId, payload) => {
  const allowed = [
    "fullName",
    "headline",
    "focus",
    "about",
    "photoUrl",
    "linkedinUrl",
    "portfolioUrl",
    "city",
    "state",
    "country",
    "showEmail",
    "showInDirectory",
    "profileComplete",
    "cgpa",
    "targetRoles",
    "preferredLocations",
    "referralGoal",
    "program",
    "supportModes",
    "skills",
    "interests",
    "region",
    "chapter",
    "domain",
    "industry",
    "referralOpen",
    "documents",
    "trackItems",
    "checklist",
    "referralTarget",
    "trackTitle",
    "trackSubtitle",
    "department",
    "currentJobTitle",
    "currentCompany",
    "yearsExperience",
    "resumeLink",
    "externalLinks",
    "batchYear",
  ];

  const update = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      update[key] = payload[key];
    }
  }

  if (update.batchYear !== undefined && update.batchYear !== null) {
    const year = Number(update.batchYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 2008 || year > currentYear + 5) {
      throw new ApiError(400, `Batch year must be between 2008 and ${currentYear + 5}`);
    }
  }

  const profile = await Profile.findOneAndUpdate({ userId }, update, {
    new: true,
    runValidators: true,
  });
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const user = await User.findById(userId).select("-passwordHash -refreshTokens");
  return toFullProfile(profile, user, { isOwner: true });
};

export const addResumeDocument = async (userId, { fileUrl, originalName }) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const existing = [...(profile.documents || [])].filter((d) => d.type !== "Resume");
  const monthYear = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

  existing.unshift({
    type: "Resume",
    title: originalName || "Resume.pdf",
    updatedAt: `Updated ${monthYear}`,
    visibility: "Public to everyone who views this profile",
    summary: "Resume uploaded from your device.",
    tone: "from-[#202636] to-[#12151b]",
    actionLabel: "View resume",
    fileUrl,
  });

  profile.documents = existing;
  await profile.save();

  const user = await User.findById(userId).select("-passwordHash -refreshTokens");
  return toFullProfile(profile, user, { isOwner: true });
};
