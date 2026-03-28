import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import Profile from "../profiles/profile.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";
import { validateLogin, validateRegister } from "./auth.validation.js";
import { env } from "../../config/env.js";
import ApiError from "../../utils/ApiError.js";

const BCRYPT_ROUNDS = 12;
const MAX_SESSIONS = 5;

// ─── helpers ─────────────────────────────────────────────────────────────────

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
 * Role comes from the body — set by the frontend based on the active tab.
 */
export const register = async (payload) => {
  validateRegister(payload); // throws ApiError on failure

  const existing = await User.findOne({ email: payload.email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const passwordHash = await bcrypt.hash(payload.password, BCRYPT_ROUNDS);

  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email.toLowerCase(),
    passwordHash,
    role: payload.role,
    phone: payload.phone || null,
    department: payload.department || null,
    expectedGradYear: payload.expectedGradYear || null,
    gradYear: payload.gradYear || null,
    currentCompany: payload.currentCompany || null,
  });

  try {
    await Profile.create({
      userId: user._id,
      role: payload.role,
      fullName: `${payload.firstName} ${payload.lastName}`,
      department: payload.department || null,
      // Student fields
      rollNumber: payload.rollNumber ?? null,
      enrollmentNumber: payload.enrollmentNumber ?? null,
      currentYear: payload.currentYear ?? null,
      // Alumni fields
      batchYear: payload.batchYear ?? null,
      currentJobTitle: payload.currentJobTitle ?? null,
      currentCompany: payload.currentCompany ?? null,
      industry: payload.industry ?? null,
    });
  } catch (profileErr) {
    console.error(" Profile creation failed:", profileErr.message, profileErr.errors);
    await User.findByIdAndDelete(user._id); // rollback
    throw new ApiError(500, "Registration failed while creating profile. Please try again.");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push(await hashToken(refreshToken));
  await user.save();

  return { user, accessToken, refreshToken };
};

// ─── login ───────────────────────────────────────────────────────────────────

/**
 * Single login endpoint — no role in URL.
 * Role is read from DB and embedded in the JWT.
 */
export const login = async (payload) => {
  validateLogin(payload); // throws ApiError on failure

  // Explicitly select passwordHash + refreshTokens since toJSON strips them
  const user = await User.findOne({ email: payload.email.toLowerCase() })
    .select("+passwordHash +refreshTokens");

  if (!user?.passwordHash) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "Your account has been deactivated. Contact support.");

  const isMatch = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  user.lastLoginAt = new Date();

  const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });
  const refreshToken = generateRefreshToken(user._id);

  // Cap sessions at MAX_SESSIONS — evict oldest if over limit
  if (user.refreshTokens.length >= MAX_SESSIONS) user.refreshTokens.shift();
  user.refreshTokens.push(await hashToken(refreshToken));
  await user.save();

  return { user, accessToken, refreshToken };
};

// ─── refresh ─────────────────────────────────────────────────────────────────

/**
 * Verify the incoming refresh token cookie, rotate it, and issue a new access token.
 * Token reuse (same token sent twice) wipes all sessions — signals possible theft.
 */
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
    // Reuse detected — nuke all sessions as a security measure
    user.refreshTokens = [];
    await user.save();
    throw new ApiError(401, "Refresh token reuse detected. Please log in again.");
  }

  // Rotate: replace matched hash with new token's hash
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshTokens.splice(matchIndex, 1, await hashToken(newRefreshToken));
  await user.save();

  const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });
  return { accessToken, newRefreshToken };
};

// ─── logout ──────────────────────────────────────────────────────────────────

/** Remove only this device's refresh token. Silently succeeds if already logged out. */
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

/** Return the authenticated user. req.user.id is set by authGuard from the JWT. */
export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};