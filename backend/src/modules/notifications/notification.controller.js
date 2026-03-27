import { asyncHandler } from "../../utils/asyncHandler.js";
import  ApiResponse  from "../../utils/ApiResponse.js";
import * as notificationService from "./notification.service.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const data = await notificationService.getNotifications();
  res.status(200).json(ApiResponse({ message: "Notifications fetched", data }));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const data = await notificationService.markRead(req.params.id);
  res.status(200).json(ApiResponse({ message: "Notification updated", data }));
});
