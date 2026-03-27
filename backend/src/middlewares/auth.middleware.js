import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token =
    authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
