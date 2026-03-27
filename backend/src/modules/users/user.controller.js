import { asyncHandler } from "../../utils/asyncHandler.js";
import  ApiResponse  from "../../utils/ApiResponse.js";
import * as userService from "./user.service.js";

export const getUsers = asyncHandler(async (req, res) => {
  const data = await userService.getUsers();
  res.status(200).json(ApiResponse({ message: "Users fetched", data }));
});

export const getUserById = asyncHandler(async (req, res) => {
  const data = await userService.getUserById(req.params.id);
  res.status(200).json(ApiResponse({ message: "User fetched", data }));
});

export const updateUserById = asyncHandler(async (req, res) => {
  const data = await userService.updateUserById(req.params.id, req.body);
  res.status(200).json(ApiResponse({ message: "User updated", data }));
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const data = await userService.deleteUserById(req.params.id);
  res.status(200).json(ApiResponse({ message: "User deleted", data }));
});
