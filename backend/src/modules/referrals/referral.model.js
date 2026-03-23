import mongoose from "mongoose";

const referralRequestSchema = new mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requesterName: { type: String, required: true },
    requesterDept: { type: String, required: true },
    requesterYear: { type: Number, required: true },
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    alumniName: { type: String, required: true },
    alumniCompany: { type: String, required: true },
    targetCompany: { type: String, required: true },
    targetRole: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    coverNote: { type: String, required: true },
    linkedinUrl: { type: String, default: null },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

referralRequestSchema.index({ alumniId: 1, status: 1 });
referralRequestSchema.index({ requesterId: 1, status: 1 });

const ReferralRequest =
  mongoose.models.ReferralRequest ||
  mongoose.model("ReferralRequest", referralRequestSchema);

export default ReferralRequest;
