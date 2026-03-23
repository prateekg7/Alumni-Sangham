import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/ApiResponse.js";
import * as profileService from "./profile.service.js";

export const getProfiles = asyncHandler(async (req, res) => {
  const data = await profileService.getProfiles();
  res.status(200).json(apiResponse({ message: "Profiles fetched", data }));
});

export const getProfileById = asyncHandler(async (req, res) => {
  const data = await profileService.getProfileById(req.params.id);
  res.status(200).json(apiResponse({ message: "Profile fetched", data }));
});

export const createProfile = asyncHandler(async (req, res) => {
  const data = await profileService.createProfile(req.body);
  res.status(201).json(apiResponse({ message: "Profile created", data }));
});

export const updateProfileById = asyncHandler(async (req, res) => {
  const data = await profileService.updateProfileById(req.params.id, req.body);
  res.status(200).json(apiResponse({ message: "Profile updated", data }));
});

export const deleteProfileById = asyncHandler(async (req, res) => {
  const data = await profileService.deleteProfileById(req.params.id);
  res.status(200).json(apiResponse({ message: "Profile deleted", data }));
});
