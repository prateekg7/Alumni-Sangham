import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import * as notificationService from "./notification.service.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const data = await notificationService.listForUser(req.user.id);
  res.status(200).json(new ApiResponse(200, data, "Notifications fetched"));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const data = await notificationService.markReadForUser(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Notification updated"));
});
