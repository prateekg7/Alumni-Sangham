import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorBatch: { type: Number, default: null },
    postType: { type: String, enum: ["article", "job"], required: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    isPublished: { type: Boolean, default: true },
    body: { type: String, required() { return this.postType === "article"; } },
    coverImageUrl: { type: String, default: null },
    category: {
      type: String,
      enum: ["college_news", "alumni_stories", "achievements", "announcements"],
      required() { return this.postType === "article"; },
    },
    company: { type: String, required() { return this.postType === "job"; } },
    location: { type: String, required() { return this.postType === "job"; } },
    isRemote: { type: Boolean, default: false },
    jobType: { type: String, enum: ["full_time", "part_time", "internship"] },
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    description: { type: String, required() { return this.postType === "job"; } },
    applyLink: { type: String, required() { return this.postType === "job"; } },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
