import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import * as userService from "./user.service.js";

function ensureSelfOrAdmin(req, targetUserId) {
  if (String(req.user.id) !== String(targetUserId) && req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden");
  }
}

export const getUsers = asyncHandler(async (req, res) => {
  const data = await userService.getUsers();
  res.status(200).json(new ApiResponse(200, data, "Users fetched"));
});

export const getUserById = asyncHandler(async (req, res) => {
  ensureSelfOrAdmin(req, req.params.id);
  const data = await userService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "User fetched"));
});

export const updateUserById = asyncHandler(async (req, res) => {
  ensureSelfOrAdmin(req, req.params.id);
  const allowPrivileged = req.user.role === "admin";
  const data = await userService.updateUserById(req.params.id, req.body, allowPrivileged);
  res.status(200).json(new ApiResponse(200, data, "User updated"));
});

export const deleteUserById = asyncHandler(async (req, res) => {
  ensureSelfOrAdmin(req, req.params.id);
  const data = await userService.deleteUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "User deleted"));
});
