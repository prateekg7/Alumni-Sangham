import { Router } from "express";
import { getDirectoryEntries } from "./directory.controller.js";

const router = Router();

router.get("/", getDirectoryEntries);

export default router;
