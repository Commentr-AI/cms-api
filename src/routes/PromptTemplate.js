import express from "express";
import {
  createPromptTemplate,
  getAllPromptTemplates,
  getPromptTemplateById,
  updatePromptTemplate,
  deletePromptTemplate,
} from "../controllers/promptTemplate.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================================
// Public Routes
// ================================

// Get all Prompt Templates
router.get("/", getAllPromptTemplates);

// Get single Prompt Template by ID
router.get("/:id", getPromptTemplateById);

// ================================
// Admin Routes (Protected)
// ================================

// Create Prompt Template
router.post("/", protect, admin, createPromptTemplate);

// Update Prompt Template
router.put("/:id", protect, admin, updatePromptTemplate);

// Delete Prompt Template
router.delete("/:id", protect, admin, deletePromptTemplate);

export default router;
