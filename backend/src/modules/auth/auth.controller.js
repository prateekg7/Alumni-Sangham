import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import * as authService from "./auth.service.js";

// ─── register ────────────────────────────────────────────────────────────────

export const registerUser = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);

  res
    .status(201)
    .cookie("refreshToken", data.refreshToken, cookieOptions())
    .json(new ApiResponse(201, { user: data.user, accessToken: data.accessToken }, "Registration successful"));
});

export const sendRegistrationOtp = asyncHandler(async (req, res) => {
  const result = await authService.sendRegistrationOtp(req.body.email);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

// ─── login ───────────────────────────────────────────────────────────────────

export const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  res
    .status(200)
    .cookie("refreshToken", data.refreshToken, cookieOptions())
    .json(new ApiResponse(200, { user: data.user, accessToken: data.accessToken }, "Login successful"));
});

// ─── refresh ─────────────────────────────────────────────────────────────────

export const refreshTokens = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  const { accessToken, newRefreshToken } = await authService.refresh(incomingToken);

  res
    .status(200)
    .cookie("refreshToken", newRefreshToken, cookieOptions())
    .json(new ApiResponse(200, { accessToken }, "Tokens refreshed"));
});

// ─── logout ──────────────────────────────────────────────────────────────────

export const logoutUser = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  if (incomingToken) {
    await authService.logout(incomingToken);
  }

  res
    .status(200)
    .clearCookie("refreshToken", cookieOptions())
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

// ─── me ──────────────────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req, res) => {
  const session = await authService.getSession(req.user.id);
  res.status(200).json(new ApiResponse(200, session, "User fetched"));
});

// ─── forgot password step 1: request OTP ─────────────────────────────────────

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

// ─── forgot password step 2: verify OTP ──────────────────────────────────────

export const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyResetOtp(email, otp);
  res.status(200).json(new ApiResponse(200, { resetToken: result.resetToken }, "OTP verified"));
});

// ─── forgot password step 3: reset password ──────────────────────────────────

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const result = await authService.resetPassword(resetToken, newPassword);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

// ─── email verification (removed — now part of register) ──────────────────────

// ─── resend OTP ──────────────────────────────────────────────────────────────

export const resendOtp = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;
  const result = await authService.resendOtp(email, purpose);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

// ─── helpers ─────────────────────────────────────────────────────────────────

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}