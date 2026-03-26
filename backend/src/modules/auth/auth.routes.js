import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getMe,
} from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { validateLogin, validateRegister } from "./auth.validation.js";
import { authGuard } from "../../middlewares/auth.middleware.js";

const router = Router();

// POST /api/auth/register/student  — register a student
// POST /api/auth/register/alumni   — register an alumni
router.post("/register/:role", (req, res, next) => {
  req.body.role = req.params.role;      // inject URL role into body
  next();
}, validateBody(validateRegister), registerUser);

// POST /api/auth/login  — login with email + password (role is read from DB)
router.post("/login", validateBody(validateLogin), loginUser);
router.post("/refresh", refreshTokens);
router.post("/logout", logoutUser);
router.get("/me", authGuard, getMe);

export default router;