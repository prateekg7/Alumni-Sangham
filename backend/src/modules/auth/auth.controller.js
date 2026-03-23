import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/ApiResponse.js";
import * as authService from "./auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json(apiResponse({ message: "User registered", data }));
});

export const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json(apiResponse({ message: "Login successful", data }));
});
