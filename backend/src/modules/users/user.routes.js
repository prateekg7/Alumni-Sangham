import { Router } from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "./user.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(authGuard);
router.get("/", roleGuard("admin"), getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;
