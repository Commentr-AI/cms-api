import MobileUser from "../models/MobileUsers.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ---------------------- LOGIN (Send OTP) ----------------------
export const sendOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber)
      return res.status(400).json({ message: "Mobile number required" });

    let user = await MobileUser.findOne({ mobileNumber });

    if (!user) user = await MobileUser.create({ mobileNumber });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    // TODO: integrate SMS service (Twilio, MSG91)
    console.log("OTP:", otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- VERIFY OTP ----------------------
export const verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    const user = await MobileUser.findOne({ mobileNumber })
      .populate("categories languages");

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpires = null;
    user.lastLoggedIn = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "OTP Verified",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- GET PROFILE ----------------------
export const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// ---------------------- UPDATE PROFILE ----------------------
export const updateProfile = async (req, res) => {
  try {
    const { name, categories, languages, notificationsEnabled } = req.body;

    const user = await MobileUser.findByIdAndUpdate(
      req.user._id,
      { name, categories, languages, notificationsEnabled },
      { new: true }
    ).populate("categories languages");

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- GET ALL USERS (ADMIN USE) ----------------------
export const getAllMobileUsers = async (req, res) => {
  try {
    const users = await MobileUser.find()
      .sort({ createdAt: -1 })
      .populate("categories languages");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- GET USER BY ID ----------------------
export const getMobileUserById = async (req, res) => {
  try {
    const user = await MobileUser.findById(req.params.id).populate(
      "categories languages"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
