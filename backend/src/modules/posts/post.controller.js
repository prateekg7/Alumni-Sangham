import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import * as postService from "./post.service.js";
import User from "../auth/user.model.js";

export const getPosts = asyncHandler(async (req, res) => {
  const data = await postService.getPosts();
  res.status(200).json(new ApiResponse(200, data, "Posts fetched"));
});

export const getDiscussionFeed = asyncHandler(async (req, res) => {
  const data = await postService.getDiscussionPosts();
  res.status(200).json(new ApiResponse(200, data, "Posts fetched"));
});

export const getPostById = asyncHandler(async (req, res) => {
  const data = await postService.getPostById(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Post fetched"));
});

export const createPost = asyncHandler(async (req, res) => {
  const authorUser = await User.findById(req.user.id);
  if (!authorUser) {
    throw new ApiError(404, "User not found");
  }
  const data = await postService.createPost(authorUser, req.body);
  res.status(201).json(new ApiResponse(201, data, "Post created"));
});

export const createDiscussion = asyncHandler(async (req, res) => {
  const authorUser = await User.findById(req.user.id);
  if (!authorUser) {
    throw new ApiError(404, "User not found");
  }
  const data = await postService.createDiscussionPost(authorUser, req.body);
  res.status(201).json(new ApiResponse(201, data, "Post created"));
});

export const updatePostById = asyncHandler(async (req, res) => {
  const data = await postService.updatePostById(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, data, "Post updated"));
});

export const deletePostById = asyncHandler(async (req, res) => {
  const data = await postService.deletePostById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, data, "Post deleted"));
});

// --- BLOG & JOB CONTROLLERS ---

export const createBlog = asyncHandler(async (req, res) => {
  const authorUser = await User.findById(req.user.id);
  if (!authorUser) {
    throw new ApiError(404, "User not found");
  }
  const data = await postService.createBlogPost(authorUser, req.body);
  res.status(201).json(new ApiResponse(201, data, "Blog created"));
});

export const getBlogFeed = asyncHandler(async (req, res) => {
  const data = await postService.getBlogFeed(req.query);
  res.status(200).json(new ApiResponse(200, data, "Blog feed fetched"));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const data = await postService.getBlogBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, data, "Blog fetched"));
});

export const toggleBlogLike = asyncHandler(async (req, res) => {
  const data = await postService.toggleLike(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, data, "Like toggled"));
});

export const addBlogComment = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const data = await postService.addComment(req.params.id, user, req.body.text);
  res.status(201).json(new ApiResponse(201, data, "Comment added"));
});

export const getAdjacentBlogs = asyncHandler(async (req, res) => {
  const data = await postService.getAdjacentPosts(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Adjacent posts fetched"));
});
