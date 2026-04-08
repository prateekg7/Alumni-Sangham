import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import OTP from "./otp.model.js";
import Profile from "../profiles/profile.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";
import { validateLogin, validateRegister } from "./auth.validation.js";
import { env } from "../../config/env.js";
import ApiError from "../../utils/ApiError.js";
import { toSessionUser } from "../../utils/profile.mapper.js";
import { sendOtpEmail } from "../../utils/email.service.js";

const BCRYPT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 2;
const OTP_COOLDOWN_SECONDS = 60;

function batchLabelFromYear(year) {
  if (year === undefined || year === null || year === "") return null;
  const n = Number(year);
  if (!Number.isFinite(n)) return null;
  return `Batch '${String(n).slice(-2)}`;
}
const MAX_SESSIONS = 5;

// ─── OTP helpers ─────────────────────────────────────────────────────────────

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

async function createAndSendOtp(email, purpose) {
  const normalizedEmail = email.toLowerCase().trim();

  // Cooldown check — prevent resend within 60 seconds
  const recent = await OTP.findOne({
    email: normalizedEmail,
    purpose,
  }).sort({ createdAt: -1 });

  if (recent) {
    const elapsed = (Date.now() - recent.createdAt.getTime()) / 1000;
    if (elapsed < OTP_COOLDOWN_SECONDS) {
      const wait = Math.ceil(OTP_COOLDOWN_SECONDS - elapsed);
      throw new ApiError(429, `Please wait ${wait} seconds before requesting a new OTP`);
    }
  }

  // Delete any existing OTPs for this email+purpose
  await OTP.deleteMany({ email: normalizedEmail, purpose });

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await OTP.create({
    email: normalizedEmail,
    otpHash,
    purpose,
    attempts: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  // Send email (fail gracefully with clear message if SMTP not configured)
  if (!env.smtpUser || env.smtpUser === "your-email@gmail.com") {
    console.warn("⚠️  SMTP not configured — OTP for", normalizedEmail, "is:", otp);
    return; // In dev, log OTP to console instead of sending email
  }

  try {
    await sendOtpEmail(normalizedEmail, otp, purpose);
  } catch (err) {
    console.error("Failed to send OTP email:", err.message);
    throw new ApiError(500, "Could not send OTP email. Please try again later.");
  }
}

async function verifyOtp(email, otp, purpose) {
  const normalizedEmail = email.toLowerCase().trim();

  const record = await OTP.findOne({
    email: normalizedEmail,
    purpose,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!record) {
    throw new ApiError(400, "OTP expired or not found. Please request a new one.");
  }

  // Check attempt limit
  if (record.attempts >= record.maxAttempts) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(429, "Too many wrong attempts. Please request a new OTP.");
  }

  const isMatch = await bcrypt.compare(otp, record.otpHash);
  if (!isMatch) {
    record.attempts += 1;
    await record.save();

    const remaining = record.maxAttempts - record.attempts;
    if (remaining <= 0) {
      await OTP.deleteOne({ _id: record._id });
      throw new ApiError(429, "Too many wrong attempts. Please request a new OTP.");
    }
    throw new ApiError(400, `Invalid OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`);
  }

  // OTP verified — delete it so it can't be reused
  await OTP.deleteOne({ _id: record._id });
}

// ─── token helpers ───────────────────────────────────────────────────────────

/** Hash a refresh token before storing it */
const hashToken = (token) => bcrypt.hash(token, 10);

/** Compare a raw token against an array of stored hashes. Returns the matched index or -1. */
const findTokenIndex = async (rawToken, storedHashes) => {
  for (let i = 0; i < storedHashes.length; i++) {
    if (await bcrypt.compare(rawToken, storedHashes[i])) return i;
  }
  return -1;
};

// ─── register ────────────────────────────────────────────────────────────────

/**
 * Creates a User doc (auth) + Profile doc (display) atomically.
 * After registration, an OTP is sent for email verification.
 * User gets logged in immediately but isVerified stays false until OTP is confirmed.
 */
export const register = async (payload) => {
  validateRegister(payload); // throws ApiError on failure

  const existing = await User.findOne({ email: payload.email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const passwordHash = await bcrypt.hash(payload.password, BCRYPT_ROUNDS);

  const expectedGradYear =
    payload.expectedGradYear !== undefined && payload.expectedGradYear !== ""
      ? Number(payload.expectedGradYear)
      : null;
  const gradYear =
    payload.gradYear !== undefined && payload.gradYear !== "" ? Number(payload.gradYear) : null;

  const batchLabel =
    batchLabelFromYear(payload.role === "student" ? expectedGradYear : gradYear) ?? null;

  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    batchLabel,
    email: payload.email.toLowerCase(),
    passwordHash,
    role: payload.role,
    phone: payload.phone || null,
    department: payload.department || "General",
    expectedGradYear: Number.isFinite(expectedGradYear) ? expectedGradYear : null,
    gradYear: Number.isFinite(gradYear) ? gradYear : null,
    currentCompany: payload.currentCompany || null,
  });

  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const dept = payload.department || "General";

  try {
    await Profile.create({
      userId: user._id,
      role: payload.role,
      fullName,
      department: dept,
      program: payload.role === "student" ? dept : null,
      currentCompany: payload.currentCompany ?? null,
      currentJobTitle: payload.currentJobTitle ?? null,
      headline:
        payload.role === "alumni" && payload.currentCompany
          ? `Alumni · ${payload.currentCompany}`
          : payload.role === "student"
            ? `Student · ${dept}`
            : null,
      about:
        payload.role === "alumni"
          ? `${fullName} is an alumni member of the network.`
          : `${fullName} is a student member of the network.`,
      rollNumber: payload.rollNumber ?? null,
      enrollmentNumber: payload.enrollmentNumber ?? null,
      currentYear: payload.currentYear ?? null,
      batchYear: payload.batchYear ?? gradYear ?? expectedGradYear ?? null,
      industry: payload.industry ?? null,
      showInDirectory: payload.role === "alumni",
    });
  } catch (profileErr) {
    console.error(" Profile creation failed:", profileErr.message, profileErr.errors);
    await User.findByIdAndDelete(user._id); // rollback
    throw new ApiError(500, "Registration failed while creating profile. Please try again.");
  }

  // Send email verification OTP (non-blocking — don't fail registration if email fails)
  try {
    await createAndSendOtp(user.email, "email_verify");
  } catch (otpErr) {
    console.warn("Could not send verification OTP during registration:", otpErr.message);
  }

  return { user };
};

// ─── login ───────────────────────────────────────────────────────────────────

export const login = async (payload) => {
  validateLogin(payload); // throws ApiError on failure

  const user = await User.findOne({ email: payload.email.toLowerCase() })
    .select("+passwordHash +refreshTokens");

  if (!user?.passwordHash) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "Your account has been deactivated. Contact support.");
  if (!user.isVerified) throw new ApiError(403, "Please verify your email before logging in", [{ field: "UNVERIFIED" }]);

  const isMatch = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (payload.expectedRole && payload.expectedRole !== user.role) {
    throw new ApiError(403, `This account is registered as ${user.role}. Use the ${user.role} login tab.`);
  }

  user.lastLoginAt = new Date();

  const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });
  const refreshToken = generateRefreshToken(user._id);

  if (user.refreshTokens.length >= MAX_SESSIONS) user.refreshTokens.shift();
  user.refreshTokens.push(await hashToken(refreshToken));
  await user.save();

  return { user, accessToken, refreshToken };
};

// ─── refresh ─────────────────────────────────────────────────────────────────

export const refresh = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new ApiError(401, "No refresh token provided");

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, env.jwtRefreshSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshTokens");
  if (!user) throw new ApiError(401, "User not found");

  const matchIndex = await findTokenIndex(incomingRefreshToken, user.refreshTokens);

  if (matchIndex === -1) {
    user.refreshTokens = [];
    await user.save();
    throw new ApiError(401, "Refresh token reuse detected. Please log in again.");
  }

  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshTokens.splice(matchIndex, 1, await hashToken(newRefreshToken));
  await user.save();

  const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });
  return { accessToken, newRefreshToken };
};

// ─── logout ──────────────────────────────────────────────────────────────────

export const logout = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) return;

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, env.jwtRefreshSecret);
  } catch {
    return;
  }

  const user = await User.findById(decoded.id).select("+refreshTokens");
  if (!user) return;

  const matchIndex = await findTokenIndex(incomingRefreshToken, user.refreshTokens);
  if (matchIndex !== -1) {
    user.refreshTokens.splice(matchIndex, 1);
    await user.save();
  }
};

// ─── me ──────────────────────────────────────────────────────────────────────

export const getSession = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash -refreshTokens");
  if (!user) throw new ApiError(404, "User not found");
  const profile = await Profile.findOne({ userId: user._id });
  return toSessionUser(user, profile);
};

// ─── forgot password ────────────────────────────────────────────────────────

/**
 * Step 1: User submits their email. We check if the account exists and send an OTP.
 */
export const forgotPassword = async (email) => {
  if (!email?.trim()) throw new ApiError(400, "Email is required");
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(404, "Not registered. Please register first.");
  }

  await createAndSendOtp(normalizedEmail, "password_reset");
  return { message: "An OTP has been sent to your email address." };
};

/**
 * Step 2: User submits email + OTP for verification.
 * Returns a short-lived reset token so the user can set a new password.
 */
export const verifyResetOtp = async (email, otp) => {
  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!otp?.trim()) throw new ApiError(400, "OTP is required");

  await verifyOtp(email, otp.trim(), "password_reset");

  // Issue a short-lived reset token (5 minutes)
  const resetToken = jwt.sign(
    { email: email.toLowerCase().trim(), purpose: "password_reset" },
    env.jwtSecret,
    { expiresIn: "5m" }
  );

  return { resetToken };
};

/**
 * Step 3: User submits resetToken + newPassword to actually change the password.
 */
export const resetPassword = async (resetToken, newPassword) => {
  if (!resetToken) throw new ApiError(400, "Reset token is required");
  if (!newPassword?.trim()) throw new ApiError(400, "New password is required");

  // Validate password strength
  const { validatePasswordStrength } = await import("./auth.validation.js");
  const passwordErrors = validatePasswordStrength(newPassword);
  if (passwordErrors.length) {
    throw new ApiError(400, "Password does not meet requirements", passwordErrors);
  }

  let decoded;
  try {
    decoded = jwt.verify(resetToken, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Reset token is invalid or expired. Please start over.");
  }

  if (decoded.purpose !== "password_reset") {
    throw new ApiError(401, "Invalid reset token");
  }

  const user = await User.findOne({ email: decoded.email }).select("+passwordHash +refreshTokens");
  if (!user) throw new ApiError(404, "User not found");

  user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  // Invalidate all sessions — force re-login everywhere
  user.refreshTokens = [];
  await user.save();

  return { message: "Password has been reset successfully. You can now log in." };
};

// ─── email verification ─────────────────────────────────────────────────────

/**
 * Verify email after registration using OTP.
 */
export const verifyEmailOtp = async (email, otp) => {
  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!otp?.trim()) throw new ApiError(400, "OTP is required");

  await verifyOtp(email, otp.trim(), "email_verify");

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+refreshTokens");
  if (!user) throw new ApiError(404, "User not found");

  user.isVerified = true;
  user.verificationStatus = "auto_verified";

  const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });
  const refreshToken = generateRefreshToken(user._id);

  if (user.refreshTokens.length >= MAX_SESSIONS) user.refreshTokens.shift();
  user.refreshTokens.push(await hashToken(refreshToken));

  await user.save();

  return { message: "Email verified successfully.", accessToken, refreshToken, user };
};

/**
 * Resend OTP for either email_verify or password_reset.
 */
export const resendOtp = async (email, purpose) => {
  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!["email_verify", "password_reset"].includes(purpose)) {
    throw new ApiError(400, "Invalid purpose");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    // Don't reveal email existence
    return { message: "If that email is registered, an OTP has been sent." };
  }

  if (purpose === "email_verify" && user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  await createAndSendOtp(normalizedEmail, purpose);
  return { message: "OTP has been sent." };
};