import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (payload) => {
  try {
    if (!payload) {
      throw new Error("Payload is required to generate token");
    }

    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn || "7d",
    });
  } catch (error) {
    throw new Error("Error generating JWT token: " + error.message);
  }
};