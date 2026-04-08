import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    purpose: {
      type: String,
      required: true,
      enum: ["email_verify", "password_reset"],
    },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 2 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Auto-delete expired docs via TTL index (MongoDB cleans up ~every 60s)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index: one active OTP per email+purpose
otpSchema.index({ email: 1, purpose: 1 });

const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

export default OTP;
