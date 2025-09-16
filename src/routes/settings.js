import express from "express";
import fileUpload from "express-fileupload";

import { getSettings, saveSettings } from "../controllers/settings.js";

const router = express.Router();

// middleware for file upload
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.post("/save", saveSettings);
router.get("/", getSettings);

export default router;
