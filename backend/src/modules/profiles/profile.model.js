import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    updatedAt: { type: String, default: "" },
    visibility: { type: String, default: "" },
    summary: { type: String, default: "" },
    tone: { type: String, default: "from-[#202636] to-[#12151b]" },
    actionLabel: { type: String, default: "View" },
    fileUrl: { type: String, default: null },
  },
  { _id: false }
);

const trackItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    meta: { type: String, default: "" },
    note: { type: String, default: "" },
    accent: { type: String, default: "#8f7cff" },
  },
  { _id: false }
);

const externalLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const checklistItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ["alumni", "student"], required: true },
    displaySlug: { type: String, sparse: true, unique: true, trim: true },
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
    portfolioUrl: { type: String, default: null },
    photoUrl: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    headline: { type: String, default: null },
    focus: { type: String, default: null },
    region: { type: String, default: null },
    chapter: { type: String, default: null },
    domain: { type: String, default: null },
    yearsExperience: { type: String, default: null },
    supportModes: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    referralOpen: { type: Boolean, default: false },
    about: { type: String, default: null },
    memberCode: { type: String, default: null },
    memberSinceLabel: { type: String, default: null },
    baseLabel: { type: String, default: null },
    avatarTone: { type: String, default: "from-[#8f7cff] to-[#4d82ff]" },
    documents: { type: [documentSchema], default: [] },
    trackTitle: { type: String, default: null },
    trackSubtitle: { type: String, default: null },
    trackItems: { type: [trackItemSchema], default: [] },
    checklist: { type: [checklistItemSchema], default: [] },
    referralTarget: { type: mongoose.Schema.Types.Mixed, default: null },
    profileComplete: { type: Boolean, default: false },
    cgpa: { type: String, default: null },
    targetRoles: { type: String, default: null },
    preferredLocations: { type: String, default: null },
    referralGoal: { type: String, default: null },
    program: { type: String, default: null },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    showEmail: { type: Boolean, default: false },
    showInDirectory: { type: Boolean, default: true },
    showOnMap: { type: Boolean, default: true },
    resumeLink: { type: String, default: null, trim: true },
    externalLinks: {
      type: [externalLinkSchema],
      default: [],
      validate: [arr => arr.length <= 10, "Maximum 10 external links allowed"],
    },
  },
  { timestamps: true }
);

profileSchema.index({ location: "2dsphere" });

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
