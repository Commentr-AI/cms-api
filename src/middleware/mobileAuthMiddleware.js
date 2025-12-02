import jwt from "jsonwebtoken";
import MobileUser from "../models/MobileUsers.js";

import admin from "../utils/firebaseAdmin.js";


export const protectMobileUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to req object
    req.user = await MobileUser.findById(decoded.id).select("-otp");

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};



export const firebaseAuth = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) return res.status(400).json({ error: "Token missing" });

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    const mobile = decoded.phone_number; // comes from Firebase verified OTP

    if (!mobile) return res.status(400).json({ error: "No phone number found in Firebase token" });

    let user = await MobileUser.findOne({ mobile });

    if (!user) {
      user = await MobileUser.create({ mobile });
    }

    user.lastLogin = new Date();
    await user.save();

    // Create your JWT
    const token = jwt.sign(
      { id: user._id, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
