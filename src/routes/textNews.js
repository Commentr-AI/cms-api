import express from "express";
import {
  createTextNews,
  getAllTextNews,
  getTextNewsById,
  updateTextNews,
  deleteTextNews,
} from "../controllers/textNews.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================================
// Public Routes
// ================================

// Get all Text News
router.get("/", getAllTextNews);

// Get single Text News by ID
router.get("/:id", getTextNewsById);

// ================================
// Admin Routes (Protected)
// ================================

// Create Text News
router.post("/", protect, admin, createTextNews);

// Update Text News
router.put("/:id", protect, admin, updateTextNews);

// Delete Text News
router.delete("/:id", protect, admin, deleteTextNews);

export default router;
