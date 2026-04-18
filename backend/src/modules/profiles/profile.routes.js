import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  uploadMyResume,
  uploadMyPhoto,
} from "./profile.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { resumeUpload, profilePhotoUpload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/public/:profileKey", getPublicProfile);
router.get("/me", authGuard, getMyProfile);
router.patch("/me", authGuard, updateMyProfile);
router.post("/me/resume", authGuard, resumeUpload.single("resume"), uploadMyResume);
router.post("/me/photo", authGuard, profilePhotoUpload.single("photo"), uploadMyPhoto);

export default router;
