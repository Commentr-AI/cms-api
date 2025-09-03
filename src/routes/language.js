import express from "express";
import {
  createLanguage,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
  getAllLanguages,
  getPublishedLanguages,
} from "../controllers/language.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD routes
router.post("/", protect, admin, createLanguage);

// Admin → get all (draft + published)
router.get("/", getAllLanguages);

// Public → only published
router.get("/published", getPublishedLanguages);

router.get("/:id", getLanguageById);
router.put("/:id", updateLanguage);
router.delete("/:id", deleteLanguage);
router.get("/:id", getLanguageById);
router.put("/:id", protect, admin, updateLanguage);
router.delete("/:id", protect, admin, deleteLanguage);

export default router;
