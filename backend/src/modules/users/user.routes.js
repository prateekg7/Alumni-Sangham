import { Router } from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "./user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;
