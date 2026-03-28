import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import * as referralService from "./referral.service.js";
import User from "../auth/user.model.js";

export const getReferralBoard = asyncHandler(async (req, res) => {
  const data = await referralService.getReferralBoard(req.user.id, req.user.role);
  res.status(200).json(new ApiResponse(200, data, "Referral board fetched"));
});

export const getReferrals = asyncHandler(async (req, res) => {
  const data = await referralService.getReferrals();
  res.status(200).json(new ApiResponse(200, data, "Referrals fetched"));
});

export const getReferralById = asyncHandler(async (req, res) => {
  const data = await referralService.getReferralById(req.params.id);
  const uid = String(req.user.id);
  const isAdmin = req.user.role === "admin";
  const isParty =
    String(data.requesterId) === uid || String(data.alumniId) === uid;
  if (!isAdmin && !isParty) {
    throw new ApiError(403, "Forbidden");
  }
  res.status(200).json(new ApiResponse(200, data, "Referral fetched"));
});

export const createReferral = asyncHandler(async (req, res) => {
  const studentUser = await User.findById(req.user.id);
  if (!studentUser) {
    throw new ApiError(404, "User not found");
  }
  const data = await referralService.createStudentReferral(studentUser, req.body);
  res.status(201).json(new ApiResponse(201, data, "Referral request created"));
});

export const updateReferralById = asyncHandler(async (req, res) => {
  const data = await referralService.updateReferralById(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role,
  );
  res.status(200).json(new ApiResponse(200, data, "Referral updated"));
});
