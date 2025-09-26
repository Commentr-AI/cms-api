// controllers/privacyPolicyController.js
import PrivacyPolicy from "../models/Privacy.js";

// Get the latest privacy policy
export const getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findOne().sort({ createdAt: -1 }); // get latest
    if (!policy) {
      return res.status(404).json({ message: "Privacy policy not found" });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create or Update privacy policy
export const createOrUpdatePrivacyPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Find the latest policy
    let policy = await PrivacyPolicy.findOne().sort({ createdAt: -1 });

    if (policy) {
      // Update existing
      policy.content = content;
      await policy.save();
      return res.json({
        message: "Privacy policy updated successfully",
        policy,
      });
    } else {
      // Create new
      policy = new PrivacyPolicy({ content });
      await policy.save();
      return res
        .status(201)
        .json({ message: "Privacy policy created successfully", policy });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
