import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ["alumni", "student"], required: true },
    batchYear: { type: Number, default: null },
    rollNumber: { type: String, default: null },
    currentJobTitle: { type: String, default: null },
    currentCompany: { type: String, default: null },
    industry: { type: String, default: null },
    currentYear: { type: Number, default: null },
    enrollmentNumber: { type: String, default: null },
    interests: { type: [String], default: [] },
    department: { type: String, required: true },
    linkedinUrl: { type: String, default: null },
    photoUrl: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    showEmail: { type: Boolean, default: false },
    showInDirectory: { type: Boolean, default: true },
    showOnMap: { type: Boolean, default: true },
  },
  { timestamps: true }
);

profileSchema.index({ location: "2dsphere" });

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
