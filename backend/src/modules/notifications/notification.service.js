import Notification from "./notification.model.js";
import ApiError from "../../utils/ApiError.js";

export const listForUser = async (userId) =>
  Notification.find({ userId }).sort({ createdAt: -1 }).limit(100);

export const markReadForUser = async (userId, notificationId) => {
  const data = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true, runValidators: true },
  );
  if (!data) {
    throw new ApiError(404, "Notification not found");
  }
  return data;
};

export const createNotification = async (payload) => Notification.create(payload);
