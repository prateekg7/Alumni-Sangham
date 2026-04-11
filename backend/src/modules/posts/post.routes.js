import { Router } from "express";
import {
  createPost,
  createDiscussion,
  deletePostById,
  getDiscussionFeed,
  getPostById,
  getPosts,
  updatePostById,
  createBlog,
  getBlogFeed,
  getBlogBySlug,
  toggleBlogLike,
  addBlogComment,
  getAdjacentBlogs,
} from "./post.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/feed/discussions", getDiscussionFeed);
router.post("/discussions", authGuard, createDiscussion);

// --- BLOG & JOB ROUTES ---
router.get("/blogs", getBlogFeed);
router.get("/blogs/:slug", getBlogBySlug);
router.post("/blogs", authGuard, createBlog);
router.post("/blogs/:id/like", authGuard, toggleBlogLike);
router.post("/blogs/:id/comments", authGuard, addBlogComment);
router.get("/blogs/:id/adjacent", getAdjacentBlogs);

// --- LEGACY GENERIC POST ROUTES ---
router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", authGuard, createPost);
router.patch("/:id", authGuard, updatePostById);
router.delete("/:id", authGuard, deletePostById);

export default router;
