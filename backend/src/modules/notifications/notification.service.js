import Notification from "./notification.model.js";

export const getNotifications = async () =>
  Notification.find().sort({ createdAt: -1 });

export const markRead = async (id) => {
  const data = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true, runValidators: true }
  );
  if (!data) {
    const err = new Error("Notification not found");
    err.statusCode = 404;
    throw err;
  }
  return data;
};
