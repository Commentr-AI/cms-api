import express from "express";
import {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
} from "../controllers/category.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin protected
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

// Public
router.get("/", getCategories);
router.get("/:id", getCategoryById);

export default router;
