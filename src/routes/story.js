import express from "express";
import {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
} from "../controllers/Story.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// /api/stories
router.post("/",protect, admin,  createStory);
router.get("/", getStories);
router.get("/:id", getStoryById);
router.put("/:id",protect, admin,  updateStory);
router.delete("/:id",protect, admin,  deleteStory);

export default router;
