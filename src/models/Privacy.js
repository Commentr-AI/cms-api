import mongoose from "mongoose";

const privacyPolicySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // keep createdAt & updatedAt automatically
  }
);

const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacyPolicySchema);
export default PrivacyPolicy;
