import { Router } from "express";
import {
  createRecord,
  deleteRecord,
  listRecords,
  verifyRoll,
} from "./college.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/verify/:rollNumber", verifyRoll);
router.get("/", authGuard, roleGuard("admin"), listRecords);
router.post("/", authGuard, roleGuard("admin"), createRecord);
router.delete("/:id", authGuard, roleGuard("admin"), deleteRecord);

export default router;
