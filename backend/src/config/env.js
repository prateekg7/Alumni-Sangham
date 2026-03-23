import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGO_URI || "",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-env",
};
