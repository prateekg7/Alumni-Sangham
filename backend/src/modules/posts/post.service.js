import Post from "./post.model.js";

export const getPosts = async () => Post.find().sort({ createdAt: -1 });
export const getPostById = async (id) => {
  const post = await Post.findById(id);
  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }
  return post;
};
export const createPost = async (payload) => Post.create(payload);
export const updatePostById = async (id, payload) => {
  const post = await Post.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }
  return post;
};
export const deletePostById = async (id) => {
  const deleted = await Post.findByIdAndDelete(id);
  if (!deleted) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }
  return { id };
};
