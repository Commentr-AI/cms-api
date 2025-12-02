import express from "express";
import {
  
  getMasterTemplate,
 
  saveMasterTemplate,
} from "../controllers/masterTemplate.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================================
// Public Routes
// ================================

// Get master template (only one allowed)
router.get("/", getMasterTemplate);

// ================================
// Admin Routes (Protected)
// ================================

// Create or Update Master Template (Same endpoint)
router.post("/", protect, admin, saveMasterTemplate);

// Optional: Allow delete only if needed
router.get("/", protect, admin, getMasterTemplate);

export default router;
