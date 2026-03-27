import { Router } from "express";
import {
  createProfile,
  deleteProfileById,
  getProfileById,
  getProfiles,
  updateProfileById,
} from "./profile.controller.js";

const router = Router();

router.get("/", getProfiles);
router.get("/:id", getProfileById);
router.post("/", createProfile);
router.patch("/:id", updateProfileById);
router.delete("/:id", deleteProfileById);

export default router;
