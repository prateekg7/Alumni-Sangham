import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorBatch: { type: Number, default: null },
    postType: { type: String, enum: ["article", "job", "discussion"], required: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    isPublished: { type: Boolean, default: true },
    body: {
      type: String,
      required() {
        return this.postType === "article" || this.postType === "discussion";
      },
    },
    coverImageUrl: { type: String, default: null },
    company: { type: String, required() { return this.postType === "job"; } },
    location: { type: String, required() { return this.postType === "job"; } },
    isRemote: { type: Boolean, default: false },
    jobType: { type: String, enum: ["full_time", "part_time", "internship"] },
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    description: { type: String, required() { return this.postType === "job"; } },
    applyLink: { type: String, required() { return this.postType === "job"; } },
    expiresAt: { type: Date },
    community: { type: String, default: "r/alumni-network" },
    tag: { type: String, default: "Update" },
    authorMeta: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      userName: { type: String, required: true },
      text: { type: String, required: true, maxlength: 2000 },
      createdAt: { type: Date, default: Date.now }
    }],
    readTime: { type: Number, default: 1 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", body: "text" });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
