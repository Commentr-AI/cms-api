import express from "express";

import {
  sendOtp,
  verifyOtp,
  getProfile,
  updateProfile,
  getAllMobileUsers,
  getMobileUserById,
} from "../controllers/mobileUsers.js";

import { firebaseAuth, protectMobileUser } from "../middleware/mobileAuthMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // For admin panel usage

const router = express.Router();

// ================================
// Public Routes (NO AUTH)
// ================================

// Send OTP (Login or Signup)
router.post("/firebase-login", firebaseAuth);
router.post("/send-otp", sendOtp);

// Verify OTP → returns token + user
router.post("/verify-otp", verifyOtp);

// ================================
// Mobile User Protected Routes
// ================================

// Get logged-in user profile
router.get("/profile", protectMobileUser, getProfile);

// Update mobile user profile
router.put("/profile", protectMobileUser, updateProfile);

// ================================
// Admin Routes (Protected)
// ================================

// Get all Mobile Users (For admin panel)
router.get("/", protect, admin, getAllMobileUsers);

// View single mobile user by ID
router.get("/:id", protect, admin, getMobileUserById);

export default router;
