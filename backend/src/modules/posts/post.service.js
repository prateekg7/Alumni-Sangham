import Post from "./post.model.js";
import Profile from "../profiles/profile.model.js";
import ApiError from "../../utils/ApiError.js";
import { nanoid } from "nanoid";

/** Batch-enrich an array of Post docs with author photoUrl + profileKey from Profile */
async function enrichPostsWithAuthorProfile(posts) {
  if (!posts.length) return posts;
  const authorIds = [...new Set(posts.map((p) => String(p.authorId)))];
  const profiles = await Profile.find({ userId: { $in: authorIds } }).select("userId displaySlug photoUrl");
  const profileMap = new Map(profiles.map((p) => [String(p.userId), p]));
  return posts.map((p) => {
    const prof = profileMap.get(String(p.authorId));
    const obj = typeof p.toObject === "function" ? p.toObject() : { ...p };
    obj.authorPhotoUrl = prof?.photoUrl || null;
    obj.authorProfileKey = prof?.displaySlug || (prof ? String(prof._id) : null);
    return obj;
  });
}

export const getPosts = async (filter = {}) => Post.find(filter).sort({ createdAt: -1 });

export const getDiscussionPosts = async () => {
  const posts = await Post.find({ postType: "discussion", isPublished: true }).sort({ createdAt: -1 });
  return enrichPostsWithAuthorProfile(posts);
};

export const getPostById = async (id) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return post;
};

export const createPost = async (authorUser, body) => createDiscussionPost(authorUser, body);

function ensurePostOwnerOrAdmin(post, actor) {
  const isAdmin = actor?.role === "admin";
  const isOwner = String(post.authorId) === String(actor?.id);
  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "Only the author can modify this post");
  }
}

function pickPostUpdate(payload = {}, postType) {
  const allowed = ["title", "body", "community", "tag"];
  if (postType === "job") {
    allowed.push("company", "location", "isRemote", "jobType", "salaryMin", "salaryMax", "description", "applyLink", "expiresAt");
  }

  const update = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      update[key] = typeof payload[key] === "string" ? payload[key].trim() : payload[key];
    }
  }

  return update;
}

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

export const updatePostById = async (id, payload, actor) => {
  const existing = await Post.findById(id);
  if (!existing) {
    throw new ApiError(404, "Post not found");
  }
  ensurePostOwnerOrAdmin(existing, actor);

  const update = pickPostUpdate(payload, existing.postType);
  if (!Object.keys(update).length) {
    throw new ApiError(400, "No allowed fields to update");
  }

  const post = await Post.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return post;
};

export const deletePostById = async (id, actor) => {
  const existing = await Post.findById(id);
  if (!existing) {
    throw new ApiError(404, "Post not found");
  }
  ensurePostOwnerOrAdmin(existing, actor);
  await Post.deleteOne({ _id: id });
  return { id };
};

// --- BLOG & JOB FUNCTIONS ---

export const createBlogPost = async (authorUser, body) => {
  if (authorUser.role !== "alumni") {
    throw new ApiError(403, "Only alumni can post blogs and jobs");
  }

  const { title, body: text, postType, company, location, applyLink } = body ?? {};
  
  if (!title?.trim() || !text?.trim()) {
    throw new ApiError(400, "Title and body are required");
  }

  const isJob = postType === "job";
  if (isJob) {
    if (!company?.trim() || !location?.trim() || !applyLink?.trim()) {
      throw new ApiError(400, "Company, location, and apply link are required for job posts");
    }
  }

  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const slug = `${baseSlug}-${nanoid(6)}`;

  const wordCount = text.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const authorName = `${authorUser.firstName} ${authorUser.lastName}`.trim();
  const authorMeta = authorUser.gradYear ? `Alumni · '${String(authorUser.gradYear).slice(-2)}'` : "Alumni";

  const payload = {
    authorId: authorUser._id,
    authorName,
    authorBatch: authorUser.gradYear || null,
    postType: isJob ? "job" : "article",
    title: title.trim(),
    body: text.trim(),
    description: isJob ? text.trim() : undefined,
    slug,
    readTime,
    authorMeta,
    company: isJob ? company.trim() : undefined,
    location: isJob ? location.trim() : undefined,
    applyLink: isJob ? applyLink.trim() : undefined,
  };

  return Post.create(payload);
};

export const getBlogFeed = async (query = {}) => {
  const { search, type, period } = query;
  
  const filter = {
    postType: { $in: ["article", "job"] },
    isPublished: true
  };

  if (search) {
    filter.$text = { $search: search };
  }

  if (type === "article" || type === "job") {
    filter.postType = type;
  }

  if (period) {
    const now = new Date();
    let startDate;
    if (period === "day") {
      startDate = new Date(now.setHours(0,0,0,0));
    } else if (period === "week") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === "month") {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (period === "3months") {
      startDate = new Date(now.setDate(now.getDate() - 90));
    }
    if (startDate) {
      filter.createdAt = { $gte: startDate };
    }
  }

  const posts = await Post.find(filter).sort({ createdAt: -1 });
  return enrichPostsWithAuthorProfile(posts);
};

export const getBlogBySlug = async (slug) => {
  const post = await Post.findOne({ slug, isPublished: true, postType: { $in: ["article", "job"] } });
  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }
  // Enrich with author profile info
  const enriched = await enrichPostsWithAuthorProfile([post]);
  return enriched[0];
};

export const toggleLike = async (postId, userId) => {
  let post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const hasLiked = post.likes.some(id => id.toString() === userId.toString());
  
  if (hasLiked) {
    await Post.updateOne(
      { _id: postId },
      { $pull: { likes: userId } }
    );
  } else {
    await Post.updateOne(
      { _id: postId },
      { $addToSet: { likes: userId } }
    );
  }

  post = await Post.findById(postId);
  return { liked: !hasLiked, likesCount: post.likes.length };
};

export const addComment = async (postId, user, text) => {
  if (!text || !text.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > 200) {
    throw new ApiError(400, "Comment cannot exceed 200 words");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.comments.length >= 100) {
    throw new ApiError(400, "Comments limit reached for this post");
  }

  const userCommentCount = post.comments.filter(c => c.userId.toString() === user._id.toString()).length;
  if (userCommentCount >= 2) {
    throw new ApiError(400, "You can only comment twice on a post");
  }

  const newComment = {
    userId: user._id,
    userName: `${user.firstName} ${user.lastName}`.trim(),
    text: text.trim(),
  };

  post.comments.push(newComment);
  post.commentsCount = post.comments.length;
  await post.save();
  return post.comments;
};

export const getAdjacentPosts = async (currentPostId) => {
  const currentPost = await Post.findById(currentPostId);
  if (!currentPost) {
    throw new ApiError(404, "Post not found");
  }

  const next = await Post.findOne({
    postType: { $in: ["article", "job"] },
    isPublished: true,
    createdAt: { $gt: currentPost.createdAt }
  }).sort({ createdAt: 1 }).select("title slug");

  const previous = await Post.findOne({
    postType: { $in: ["article", "job"] },
    isPublished: true,
    createdAt: { $lt: currentPost.createdAt }
  }).sort({ createdAt: -1 }).select("title slug");

  return { next, previous };
};
