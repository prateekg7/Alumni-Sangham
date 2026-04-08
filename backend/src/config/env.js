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

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
}

function firstNumber(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

const smtpService = firstDefined(
  process.env.SMTP_SERVICE,
  process.env.MAIL_SERVICE,
  process.env.EMAIL_SERVICE,
);
const smtpHost = firstDefined(
  process.env.SMTP_HOST,
  process.env.MAIL_HOST,
  process.env.EMAIL_HOST,
  smtpService ? "" : "smtp.gmail.com",
);
const smtpPort = firstNumber(
  process.env.SMTP_PORT,
  process.env.MAIL_PORT,
  process.env.EMAIL_PORT,
) || 587;
const smtpUser = firstDefined(
  process.env.SMTP_USER,
  process.env.MAIL_USER,
  process.env.EMAIL_USER,
  process.env.MAIL_USERNAME,
  process.env.GMAIL_USER,
);
const smtpPass = firstDefined(
  process.env.SMTP_PASS,
  process.env.MAIL_PASS,
  process.env.EMAIL_PASS,
  process.env.MAIL_PASSWORD,
  process.env.GMAIL_APP_PASSWORD,
);
const smtpFrom = firstDefined(
  process.env.SMTP_FROM,
  process.env.MAIL_FROM,
  process.env.EMAIL_FROM,
  smtpUser,
);
const smtpFromName = firstDefined(
  process.env.SMTP_FROM_NAME,
  process.env.MAIL_FROM_NAME,
  process.env.EMAIL_FROM_NAME,
  "Alumni Sangham",
);
const smtpSecureRaw = firstDefined(
  process.env.SMTP_SECURE,
  process.env.MAIL_SECURE,
  process.env.EMAIL_SECURE,
);
const smtpSecure =
  smtpSecureRaw !== ""
    ? /^(1|true|yes)$/i.test(smtpSecureRaw)
    : smtpPort === 465;

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGO_URI,
  corsOrigin: process.env.CORS_ORIGIN || "",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // SMTP / mail provider envs for OTP emails.
  smtpService,
  smtpHost,
  smtpPort,
  smtpSecure,
  smtpUser,
  smtpPass,
  smtpFrom,
  smtpFromName,
  mailConfigured: Boolean(smtpUser && smtpPass && (smtpService || smtpHost)),
};
