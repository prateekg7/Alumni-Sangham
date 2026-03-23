import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (payload, expiresIn = "7d") =>
  jwt.sign(payload, env.jwtSecret, { expiresIn });
