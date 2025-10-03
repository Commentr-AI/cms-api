// routes/mediaRoutes.js
import express from "express";
import {
  uploadMedia,
  getMedia,
  deleteMedia,
  bulkDeleteMedia,
} from "../controllers/media.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import fileUpload from "express-fileupload";

const router = express.Router();

router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    debug: true, // Enable debug mode to see what's happening
  })
);

router.post("/upload", protect, admin, uploadMedia);
router.post("/bulk-delete", protect, admin, bulkDeleteMedia);
router.delete("/:id", protect, admin, deleteMedia);
router.get("/", getMedia);

export default router;
