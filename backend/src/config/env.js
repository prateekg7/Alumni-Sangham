import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
});

/**
 * Production: comma-separated allowed browser origins (required for credentialed cross-site requests).
 * Development: any http(s)://localhost or 127.0.0.1 with any port is allowed automatically in app.js.
 */
const corsOriginRaw = process.env.CORS_ORIGIN || "";
export const corsAllowedOrigins = corsOriginRaw
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGO_URI,
  corsOrigin: process.env.CORS_ORIGIN || "",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};