import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByCategory,
  getTopMainPosts,
} from "../controllers/post.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import fileUpload from "express-fileupload";

const router = express.Router();
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// Public: Get all published posts
router.get("/", getPosts);
router.get("/category-wise", getPostsByCategory);
router.get("/top-most-post",getTopMainPosts)

// Public: Get a single post
router.get("/:id", getPostById);

// Admin: Create, Update, Delete
router.post("/", protect, admin, createPost);
router.put("/:id", protect, admin, updatePost);
router.delete("/:id", protect, admin, deletePost);

export default router;
