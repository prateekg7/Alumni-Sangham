import ReferralRequest from "./referral.model.js";
import User from "../auth/user.model.js";
import Profile from "../profiles/profile.model.js";
import Notification from "../notifications/notification.model.js";
import ApiError from "../../utils/ApiError.js";

const STUDENT_BOARD = {
  title: "My referral requests",
  description:
    "Track outgoing asks, keep your public resume ready, and personalize each request before sending it to an alumnus.",
  checklist: [
    "Public resume is up to date",
    "Target role and company are clearly mentioned",
    "Why this alumnus is relevant is explained",
    "Projects or experience match the ask",
  ],
};

const ALUMNI_BOARD = {
  title: "Incoming referral requests",
  description:
    "Review student asks, open their public resume directly from the profile, and decide whether to mentor, shortlist, or request more context.",
  checklist: [
    "Resume is visible on student profile",
    "Target role is specific",
    "Student note explains fit",
    "Next step is clear: refer, mentor, or decline",
  ],
};

const statusLabel = (status) => {
  if (status === "pending") return "Under review";
  if (status === "accepted") return "Accepted";
  if (status === "declined") return "Declined";
  return status;
};

export const getReferralBoard = async (userId, role) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (role === "student") {
    const rows = await ReferralRequest.find({ requesterId: userId }).sort({ createdAt: -1 }).limit(50);
    const requests = rows.map((r) => ({
      name: r.alumniName,
      target: `${r.targetRole} · ${r.targetCompany}`,
      status: statusLabel(r.status),
      meta: r.coverNote?.slice(0, 120) || "Referral request",
    }));
    return { ...STUDENT_BOARD, requests };
  }

  if (role === "alumni") {
    const rows = await ReferralRequest.find({ alumniId: userId }).sort({ createdAt: -1 }).limit(50);
    const requesterIds = rows.map((row) => row.requesterId);
    const requesterProfiles = await Profile.find({ userId: { $in: requesterIds } }).select("userId displaySlug");
    const profileKeyByRequesterId = new Map(
      requesterProfiles.map((profile) => [
        String(profile.userId),
        profile.displaySlug || String(profile.userId),
      ])
    );
    const requests = rows.map((r) => ({
      profileKey: profileKeyByRequesterId.get(String(r.requesterId)) || String(r.requesterId),
      name: r.requesterName,
      target: `${r.targetRole} · ${r.targetCompany}`,
      status: statusLabel(r.status),
      meta: r.coverNote?.slice(0, 120) || "Referral request",
    }));
    return { ...ALUMNI_BOARD, requests };
  }

  return { title: "Referrals", description: "", checklist: [], requests: [] };
};

export const getReferrals = async () => ReferralRequest.find().sort({ createdAt: -1 });

export const getReferralById = async (id) => {
  const referral = await ReferralRequest.findById(id);
  if (!referral) {
    throw new ApiError(404, "Referral request not found");
  }
  return referral;
};

export const createStudentReferral = async (studentUser, body) => {
  if (studentUser.role !== "student") {
    throw new ApiError(403, "Only students can create referral requests");
  }

  const { alumniUserId, coverNote, targetCompany, targetRole } = body ?? {};
  if (!alumniUserId || !coverNote?.trim()) {
    throw new ApiError(400, "alumniUserId and coverNote are required");
  }

  const alumniUser = await User.findById(alumniUserId);
  if (!alumniUser || alumniUser.role !== "alumni") {
    throw new ApiError(400, "Invalid alumni user");
  }

  const alumniProfile = await Profile.findOne({ userId: alumniUser._id });
  const studentProfile = await Profile.findOne({ userId: studentUser._id });

  const requesterYear =
    studentUser.expectedGradYear ?? studentProfile?.currentYear ?? new Date().getFullYear();

  const referral = await ReferralRequest.create({
    requesterId: studentUser._id,
    requesterName: `${studentUser.firstName} ${studentUser.lastName}`.trim(),
    requesterDept: studentProfile?.department || studentUser.department || "—",
    requesterYear,
    alumniId: alumniUser._id,
    alumniName: `${alumniUser.firstName} ${alumniUser.lastName}`.trim(),
    alumniCompany: alumniProfile?.currentCompany || alumniUser.currentCompany || "—",
    targetCompany: targetCompany?.trim() || alumniProfile?.currentCompany || "Open opportunity",
    targetRole: targetRole?.trim() || "Referral",
    resumeUrl: null,
    coverNote: coverNote.trim(),
    linkedinUrl: studentProfile?.linkedinUrl || null,
    status: "pending",
  });

  try {
    await Notification.create({
      userId: alumniUser._id,
      type: "referral_request",
      text: `${referral.requesterName} sent a referral request (${referral.targetRole} · ${referral.targetCompany}).`,
      link: "/profile/me?tab=referrals",
      isRead: false,
    });
  } catch (err) {
    console.error("Failed to create referral notification:", err?.message);
  }

  return referral;
};

export const updateReferralById = async (id, payload, actorUserId, actorRole) => {
  const existing = await ReferralRequest.findById(id);
  if (!existing) {
    throw new ApiError(404, "Referral request not found");
  }

  const isAdmin = actorRole === "admin";
  const isAlumni = String(existing.alumniId) === String(actorUserId);
  if (!isAdmin && !isAlumni) {
    throw new ApiError(403, "Only the receiving alumni or an admin can update this referral");
  }

  const prevStatus = existing.status;
  const referral = await ReferralRequest.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.status && payload.status !== prevStatus && referral) {
    const statusNote =
      payload.status === "accepted"
        ? "accepted"
        : payload.status === "declined"
          ? "declined"
          : `set status to ${payload.status}`;
    try {
      await Notification.create({
        userId: referral.requesterId,
        type: "referral_response",
        text: `${referral.alumniName} ${statusNote} your referral request (${referral.targetRole}).`,
        link: "/profile/me?tab=referrals",
        isRead: false,
      });
    } catch (err) {
      console.error("Failed to create referral response notification:", err?.message);
    }
  }

  return referral;
};
