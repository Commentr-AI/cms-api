import express from "express";

import { getCounts } from "../controllers/dashboard.js";

const router = express.Router();

// Admin protected
router.get("/count", getCounts);

export default router;
