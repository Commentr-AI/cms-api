import express from "express";
import {
  getPrivacyPolicy,
  createOrUpdatePrivacyPolicy,
} from "../controllers/privacy.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin protected
router.get("/", getPrivacyPolicy);
router.post("/createOrUpdate", protect, admin, createOrUpdatePrivacyPolicy);
// router.delete("/:id", protect, admin, deleteCategory);

export default router;
