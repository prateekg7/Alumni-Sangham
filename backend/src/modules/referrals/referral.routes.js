import { Router } from "express";
import {
  createReferral,
  getReferralBoard,
  getReferralById,
  getReferrals,
  updateReferralById,
  getPendingReferralCount,
} from "./referral.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/board", authGuard, getReferralBoard);
router.get("/pending-count", authGuard, getPendingReferralCount);
router.post("/", authGuard, createReferral);
router.get("/", authGuard, roleGuard("admin"), getReferrals);
router.get("/:id", authGuard, getReferralById);
router.patch("/:id", authGuard, updateReferralById);

export default router;
