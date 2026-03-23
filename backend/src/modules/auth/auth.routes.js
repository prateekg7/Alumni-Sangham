import { Router } from "express";
import { loginUser, registerUser } from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { validateLogin, validateRegister } from "./auth.validation.js";

const router = Router();

router.post("/register", validateBody(validateRegister), registerUser);
router.post("/login", validateBody(validateLogin), loginUser);

export default router;
