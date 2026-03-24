import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import * as authService from "./auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json(ApiResponse({ message: "User registered", data }));
});

export const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json(ApiResponse({ message: "Login successful", data }));
});
