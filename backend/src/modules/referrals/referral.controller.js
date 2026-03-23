import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/ApiResponse.js";
import * as referralService from "./referral.service.js";

export const getReferrals = asyncHandler(async (req, res) => {
  const data = await referralService.getReferrals();
  res.status(200).json(apiResponse({ message: "Referrals fetched", data }));
});
export const getReferralById = asyncHandler(async (req, res) => {
  const data = await referralService.getReferralById(req.params.id);
  res.status(200).json(apiResponse({ message: "Referral fetched", data }));
});
export const createReferral = asyncHandler(async (req, res) => {
  const data = await referralService.createReferral(req.body);
  res.status(201).json(apiResponse({ message: "Referral created", data }));
});
export const updateReferralById = asyncHandler(async (req, res) => {
  const data = await referralService.updateReferralById(req.params.id, req.body);
  res.status(200).json(apiResponse({ message: "Referral updated", data }));
});
