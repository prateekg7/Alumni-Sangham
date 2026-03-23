import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/ApiResponse.js";
import * as userService from "./user.service.js";

export const getUsers = asyncHandler(async (req, res) => {
  const data = await userService.getUsers();
  res.status(200).json(apiResponse({ message: "Users fetched", data }));
});

export const getUserById = asyncHandler(async (req, res) => {
  const data = await userService.getUserById(req.params.id);
  res.status(200).json(apiResponse({ message: "User fetched", data }));
});

export const updateUserById = asyncHandler(async (req, res) => {
  const data = await userService.updateUserById(req.params.id, req.body);
  res.status(200).json(apiResponse({ message: "User updated", data }));
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const data = await userService.deleteUserById(req.params.id);
  res.status(200).json(apiResponse({ message: "User deleted", data }));
});
