import express from "express";
import {
  createPage,
  updatePage,

  deletePage,
  getAllPages,
  getPageBySlug,
  getPageById,
} from "../controllers/pages.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin protected routes
router.post("/", protect, admin, createPage);
router.put("/:id", protect, admin, updatePage);
router.delete("/:id", protect, admin, deletePage);

// ✅ Public routes
router.get("/", getAllPages);
router.get("/:id", getPageById);
router.get("/:slug", getPageBySlug);

export default router;
