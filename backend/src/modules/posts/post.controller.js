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
  const data = await postService.createPost(req.body);
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
  const data = await postService.updatePostById(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, data, "Post updated"));
});

export const deletePostById = asyncHandler(async (req, res) => {
  const data = await postService.deletePostById(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Post deleted"));
});
