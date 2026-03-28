import Post from "./post.model.js";
import ApiError from "../../utils/ApiError.js";

export const getPosts = async (filter = {}) => Post.find(filter).sort({ createdAt: -1 });

export const getDiscussionPosts = async () =>
  Post.find({ postType: "discussion", isPublished: true }).sort({ createdAt: -1 });

export const getPostById = async (id) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return post;
};

export const createPost = async (payload) => Post.create(payload);

export const createDiscussionPost = async (authorUser, body) => {
  const { title, body: text, community, tag } = body ?? {};
  if (!title?.trim() || !text?.trim()) {
    throw new ApiError(400, "Title and body are required");
  }

  const authorName = `${authorUser.firstName} ${authorUser.lastName}`.trim();
  const roleLabel = authorUser.role === "student" ? "Student" : "Alumni";
  const batch =
    authorUser.role === "student"
      ? authorUser.expectedGradYear
      : authorUser.gradYear;
  const authorMeta = batch ? `${roleLabel} · '${String(batch).slice(-2)}'` : roleLabel;

  return Post.create({
    authorId: authorUser._id,
    authorName,
    authorBatch: batch || null,
    postType: "discussion",
    title: title.trim(),
    body: text.trim(),
    community: community?.trim() || "r/alumni-network",
    tag: tag?.trim() || "Update",
    authorMeta,
    upvotes: 0,
    commentsCount: 0,
  });
};

export const updatePostById = async (id, payload) => {
  const post = await Post.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return post;
};

export const deletePostById = async (id) => {
  const deleted = await Post.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(404, "Post not found");
  }
  return { id };
};
