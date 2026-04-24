import ReferralRequest from "./referral.model.js";
import User from "../auth/user.model.js";
import Profile from "../profiles/profile.model.js";
import Notification from "../notifications/notification.model.js";
import ApiError from "../../utils/ApiError.js";
import { sendReferralAcceptedEmail } from "../../utils/email.service.js";

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

export const getReferralBoard = async (userId, role) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const boardMeta = role === "alumni" ? ALUMNI_BOARD : STUDENT_BOARD;
  const requests = [];

  // --- Sent requests (every user can send) ---
  const sentRows = await ReferralRequest.find({ requesterId: userId }).sort({ createdAt: -1 }).limit(50);
  if (sentRows.length) {
    const alumniIds = sentRows.map((row) => row.alumniId);
    const alumniProfiles = await Profile.find({ userId: { $in: alumniIds } }).select("userId displaySlug photoUrl");
    const alumniProfileMap = new Map(
      alumniProfiles.map((p) => [String(p.userId), p])
    );
    for (const r of sentRows) {
      const aProf = alumniProfileMap.get(String(r.alumniId));
      const profileKey = aProf?.displaySlug || (aProf ? String(aProf._id) : null);
      requests.push({
        _id: String(r._id),
        direction: "sent",
        alumniId: String(r.alumniId),
        alumniName: r.alumniName,
        alumniCompany: r.alumniCompany,
        alumniProfileKey: profileKey,
        alumniPhotoUrl: aProf?.photoUrl || null,
        // backward-compat fields for dashboard ReferralsList
        name: r.alumniName,
        target: `${r.targetRole} · ${r.targetCompany}`,
        meta: r.coverNote?.slice(0, 120) || "Referral request",
        photoUrl: aProf?.photoUrl || null,
        profileKey,
        targetRole: r.targetRole,
        targetCompany: r.targetCompany,
        coverNote: r.coverNote,
        resumeUrl: r.resumeUrl,
        status: r.status,
        responseNote: r.responseNote,
        createdAt: r.createdAt,
        respondedAt: r.respondedAt,
      });
    }
  }

  // --- Received requests (only alumni receive) ---
  if (role === "alumni") {
    const receivedRows = await ReferralRequest.find({ alumniId: userId }).sort({ createdAt: -1 }).limit(50);
    if (receivedRows.length) {
      const requesterIds = receivedRows.map((row) => row.requesterId);
      const requesterProfiles = await Profile.find({ userId: { $in: requesterIds } }).select(
        "userId displaySlug photoUrl department headline skills cgpa"
      );
      const profileByRequesterId = new Map(
        requesterProfiles.map((p) => [String(p.userId), p])
      );
      for (const r of receivedRows) {
        const rProfile = profileByRequesterId.get(String(r.requesterId));
        const reqProfileKey = rProfile?.displaySlug || (rProfile ? String(rProfile._id) : null);
        requests.push({
          _id: String(r._id),
          direction: "received",
          requesterId: String(r.requesterId),
          requesterName: r.requesterName,
          requesterDept: r.requesterDept,
          requesterYear: r.requesterYear,
          requesterEmail: r.requesterEmail,
          profileKey: reqProfileKey,
          requesterPhotoUrl: rProfile?.photoUrl || null,
          // backward-compat fields for dashboard ReferralsList
          name: r.requesterName,
          target: `${r.targetRole} · ${r.targetCompany}`,
          meta: r.coverNote?.slice(0, 120) || "Referral request",
          photoUrl: rProfile?.photoUrl || null,
          requesterHeadline: rProfile?.headline || null,
          requesterSkills: rProfile?.skills || [],
          requesterCgpa: rProfile?.cgpa || null,
          targetRole: r.targetRole,
          targetCompany: r.targetCompany,
          coverNote: r.coverNote,
          resumeUrl: r.resumeUrl,
          linkedinUrl: r.linkedinUrl,
          status: r.status,
          responseNote: r.responseNote,
          createdAt: r.createdAt,
          respondedAt: r.respondedAt,
        });
      }
    }
  }

  // Sort all requests by createdAt descending
  requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { ...boardMeta, requests };
};

export const getReferrals = async () => ReferralRequest.find().sort({ createdAt: -1 });

export const getReferralById = async (id) => {
  const referral = await ReferralRequest.findById(id);
  if (!referral) {
    throw new ApiError(404, "Referral request not found");
  }
  return referral;
};

const COOLDOWN_DAYS = 15;

export const createReferralRequest = async (requesterUser, body) => {
  const { alumniUserId, coverNote, targetCompany, targetRole, resumeUrl } = body ?? {};
  if (!alumniUserId || !coverNote?.trim()) {
    throw new ApiError(400, "alumniUserId and coverNote are required");
  }

  const alumniUser = await User.findById(alumniUserId);
  if (!alumniUser || alumniUser.role !== "alumni") {
    throw new ApiError(400, "Invalid alumni user");
  }

  // --- Block duplicate pending requests (within 15-day window) ---
  const pendingCutoff = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
  const existingPending = await ReferralRequest.findOne({
    requesterId: requesterUser._id,
    alumniId: alumniUser._id,
    status: "pending",
    createdAt: { $gte: pendingCutoff },
  });
  if (existingPending) {
    const retryDate = new Date(existingPending.createdAt.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((retryDate - Date.now()) / (24 * 60 * 60 * 1000));
    throw new ApiError(
      429,
      `You already have a pending request to this alumni. ${daysLeft > 0 ? `You can send another in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} if it remains unanswered.` : "Please wait for a response."}`
    );
  }

  // --- 15-day cooldown after decline ---
  const cooldownCutoff = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
  const recentDecline = await ReferralRequest.findOne({
    requesterId: requesterUser._id,
    alumniId: alumniUser._id,
    status: "declined",
    respondedAt: { $gte: cooldownCutoff },
  });
  if (recentDecline) {
    const retryDate = new Date(recentDecline.respondedAt.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((retryDate - Date.now()) / (24 * 60 * 60 * 1000));
    throw new ApiError(
      429,
      `Your previous request to this alumni was declined. You can send another request in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.`
    );
  }

  // --- 15-day cooldown for ignored/pending requests older than 15 days ---
  // If there was an old pending request that expired (>15 days), allow resending.
  // But block if there's a pending request within the last 15 days already (handled above).

  const alumniProfile = await Profile.findOne({ userId: alumniUser._id });
  const requesterProfile = await Profile.findOne({ userId: requesterUser._id });

  const requesterYear =
    requesterUser.expectedGradYear ?? requesterUser.gradYear ?? requesterProfile?.currentYear ?? new Date().getFullYear();

  const referral = await ReferralRequest.create({
    requesterId: requesterUser._id,
    requesterName: `${requesterUser.firstName} ${requesterUser.lastName}`.trim(),
    requesterDept: requesterProfile?.department || requesterUser.department || "—",
    requesterYear,
    requesterEmail: requesterUser.email,
    alumniId: alumniUser._id,
    alumniName: `${alumniUser.firstName} ${alumniUser.lastName}`.trim(),
    alumniCompany: alumniProfile?.currentCompany || alumniUser.currentCompany || "—",
    targetCompany: targetCompany?.trim() || alumniProfile?.currentCompany || "Open opportunity",
    targetRole: targetRole?.trim() || "Referral",
    resumeUrl: resumeUrl?.trim() || null,
    coverNote: coverNote.trim(),
    linkedinUrl: requesterProfile?.linkedinUrl || null,
    status: "pending",
  });

  try {
    await Notification.create({
      userId: alumniUser._id,
      type: "referral_request",
      text: `${referral.requesterName} sent a referral request (${referral.targetRole} · ${referral.targetCompany}).`,
      link: "/referrals",
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

  const allowedStatuses = isAdmin ? ["pending", "accepted", "declined"] : ["accepted", "declined"];
  const nextStatus = payload?.status;
  if (!allowedStatuses.includes(nextStatus)) {
    throw new ApiError(400, `status must be one of: ${allowedStatuses.join(", ")}`);
  }

  const update = {
    status: nextStatus,
    respondedAt: nextStatus === "pending" ? null : new Date(),
  };

  // Store optional response note (only on accept — alumni may include referral code)
  if (nextStatus === "accepted" && typeof payload?.responseNote === "string" && payload.responseNote.trim()) {
    update.responseNote = payload.responseNote.trim();
  }

  const prevStatus = existing.status;
  const referral = await ReferralRequest.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (nextStatus !== prevStatus && referral) {
    // --- In-app notification ---
    const statusNote =
      nextStatus === "accepted"
        ? "accepted"
        : nextStatus === "declined"
          ? "declined"
          : `set status to ${nextStatus}`;
    try {
      await Notification.create({
        userId: referral.requesterId,
        type: "referral_response",
        text: `${referral.alumniName} ${statusNote} your referral request (${referral.targetRole}).`,
        link: "/referrals",
        isRead: false,
      });
    } catch (err) {
      console.error("Failed to create referral response notification:", err?.message);
    }

    // --- Send email ONLY on acceptance ---
    if (nextStatus === "accepted" && referral.requesterEmail) {
      try {
        await sendReferralAcceptedEmail(
          referral.requesterEmail,
          referral.requesterName,
          referral.alumniName,
          referral.alumniCompany,
          referral.targetRole,
          referral.responseNote || null,
        );
      } catch (err) {
        console.error("Failed to send referral acceptance email:", err?.message);
      }
    }
  }

  return referral;
};

export const getPendingReferralCount = async (userId, role) => {
  const filter = { status: "pending" };
  if (role === "alumni") {
    filter.alumniId = userId;
  } else {
    filter.requesterId = userId;
  }
  return ReferralRequest.countDocuments(filter);
};
