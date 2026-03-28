import { Router } from "express";
import { getNotifications, markNotificationRead } from "./notification.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authGuard);
router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);

export default router;
