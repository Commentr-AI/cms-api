import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  changePassword,
  forgotPassword,
  updateProfile,
} from "../controllers/userControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.get("/", protect, admin, getUsers);
router.put("/profile", protect, updateProfile);

export default router;
