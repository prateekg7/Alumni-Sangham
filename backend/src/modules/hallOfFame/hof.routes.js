import { Router } from "express";
import { createHallOfFameEntry, getHallOfFame } from "./hof.controller.js";

const router = Router();

router.get("/", getHallOfFame);
router.post("/", createHallOfFameEntry);

export default router;
