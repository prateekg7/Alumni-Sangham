import { Router } from "express";
import {
  createReferral,
  getReferralById,
  getReferrals,
  updateReferralById,
} from "./referral.controller.js";

const router = Router();

router.get("/", getReferrals);
router.get("/:id", getReferralById);
router.post("/", createReferral);
router.patch("/:id", updateReferralById);

export default router;
