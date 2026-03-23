import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, trim: true },
    passwordHash: { type: String, default: null },
    role: { type: String, required: true, enum: ["student", "alumni", "admin"] },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      required: true,
      enum: [
        "pending",
        "auto_verified",
        "manual_pending",
        "verified",
        "rejected",
      ],
      default: "pending",
    },
    verifcationDocUrl: { type: String, default: null },
    oauthProvider: { type: String, enum: ["google", null], default: null },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
