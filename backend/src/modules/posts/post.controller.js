import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/ApiResponse.js";
import * as postService from "./post.service.js";

export const getPosts = asyncHandler(async (req, res) => {
  const data = await postService.getPosts();
  res.status(200).json(apiResponse({ message: "Posts fetched", data }));
});
export const getPostById = asyncHandler(async (req, res) => {
  const data = await postService.getPostById(req.params.id);
  res.status(200).json(apiResponse({ message: "Post fetched", data }));
});
export const createPost = asyncHandler(async (req, res) => {
  const data = await postService.createPost(req.body);
  res.status(201).json(apiResponse({ message: "Post created", data }));
});
export const updatePostById = asyncHandler(async (req, res) => {
  const data = await postService.updatePostById(req.params.id, req.body);
  res.status(200).json(apiResponse({ message: "Post updated", data }));
});
export const deletePostById = asyncHandler(async (req, res) => {
  const data = await postService.deletePostById(req.params.id);
  res.status(200).json(apiResponse({ message: "Post deleted", data }));
});
