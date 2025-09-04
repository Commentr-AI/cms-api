import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Get all published posts
router.get("/", getPosts);

// Public: Get a single post
router.get("/:id", getPostById);

// Admin: Create, Update, Delete
router.post("/", protect, admin, createPost);
router.put("/:id", protect, admin, updatePost);
router.delete("/:id", protect, admin, deletePost);

export default router;
