import { Router } from "express";
import {
  createPost,
  createDiscussion,
  deletePostById,
  getDiscussionFeed,
  getPostById,
  getPosts,
  updatePostById,
} from "./post.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/feed/discussions", getDiscussionFeed);
router.post("/discussions", authGuard, createDiscussion);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", authGuard, createPost);
router.patch("/:id", authGuard, updatePostById);
router.delete("/:id", authGuard, deletePostById);

export default router;
