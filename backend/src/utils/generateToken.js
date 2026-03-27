import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Short-lived access token (carries user identity + role).
 */
export const generateAccessToken = (payload) => {
  if (!payload) throw new Error("Payload is required to generate access token");

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn || "15m",
  });
};

/**
 * Long-lived refresh token (carries only user id).
 */
export const generateRefreshToken = (userId) => {
  if (!userId) throw new Error("userId is required to generate refresh token");

  return jwt.sign({ id: userId }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn || "7d",
  });
};