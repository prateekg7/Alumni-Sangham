import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    passwordHash: { type: String, default: null, select: false },
    role: { type: String, required: true, enum: ["student", "alumni", "admin"] },
    phone: { type: String, default: null, trim: true },
    department: { type: String, required: true, trim: true },
    expectedGradYear: { type: Number, default: null }, // student only
    gradYear: { type: Number, default: null },          // alumni only
    currentCompany: { type: String, default: null, trim: true }, // alumni only
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
    verificationDocUrl: { type: String, default: null },
    oauthProvider: { type: String, enum: ["google", null], default: null },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    refreshTokens: { type: [String], default: [], select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.refreshTokens;
        return ret;
      },
    },
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
