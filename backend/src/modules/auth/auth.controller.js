import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import * as authService from "./auth.service.js";

// ─── register ────────────────────────────────────────────────────────────────

export const registerUser = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);

  res
    .status(201)
    .cookie("refreshToken", data.refreshToken, cookieOptions())
    .json(new ApiResponse(201, { user: data.user, accessToken: data.accessToken }, "User registered"));
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
  await authService.logout(incomingToken);

  res
    .status(200)
    .clearCookie("refreshToken", cookieOptions())
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

// ─── me ──────────────────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json(new ApiResponse(200, user, "User fetched"));
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