import { Router } from "express";
import { createHallOfFameEntry, getHallOfFame } from "./hof.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", getHallOfFame);
router.post("/", authGuard, roleGuard("admin"), createHallOfFameEntry);

export default router;
