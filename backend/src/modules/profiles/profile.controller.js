import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import * as profileService from "./profile.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const data = await profileService.getMyProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, data, "Profile fetched"));
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const data = await profileService.updateMyProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, data, "Profile updated"));
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  const data = await profileService.getPublicProfile(req.params.profileKey);
  res.status(200).json(new ApiResponse(200, data, "Profile fetched"));
});

export const uploadMyResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Select a PDF or Word file to upload");
  }
  const fileUrl = `/uploads/resumes/${req.file.filename}`;
  const data = await profileService.addResumeDocument(req.user.id, {
    fileUrl,
    originalName: req.file.originalname,
  });
  res.status(200).json(new ApiResponse(200, data, "Resume uploaded"));
});

export const uploadMyPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Select a JPEG, PNG, or WebP image to upload");
  }
  const photoUrl = `/uploads/photos/${req.file.filename}`;
  const data = await profileService.updateMyProfile(req.user.id, { photoUrl });
  res.status(200).json(new ApiResponse(200, data, "Profile photo updated"));
});
