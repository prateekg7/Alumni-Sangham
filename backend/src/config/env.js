import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGO_URI,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};