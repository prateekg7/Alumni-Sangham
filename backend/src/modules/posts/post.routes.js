import { Router } from "express";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  updatePostById,
} from "./post.controller.js";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", createPost);
router.patch("/:id", updatePostById);
router.delete("/:id", deletePostById);

export default router;
