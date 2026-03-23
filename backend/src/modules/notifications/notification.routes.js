import { Router } from "express";
import {
  getNotifications,
  markNotificationRead,
} from "./notification.controller.js";

const router = Router();

router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);

export default router;
