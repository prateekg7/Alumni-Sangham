import mongoose from "mongoose";

const hallOfFameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    batchYear: { type: Number, required: true },
    currentRole: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "entrepreneur",
        "corporate_leader",
        "researcher",
        "public_service",
        "arts_culture",
        "sports",
        "young_achiever",
      ],
    },
    photoUrl: { type: String, default: null },
    achievement: { type: String, required: true },
    linkedinUrl: { type: String, default: null },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

hallOfFameSchema.index({ category: 1, displayOrder: 1 });

const HallOfFame =
  mongoose.models.HallOfFame || mongoose.model("HallOfFame", hallOfFameSchema);

export default HallOfFame;
