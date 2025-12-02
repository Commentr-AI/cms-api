import mongoose from "mongoose";

const mobileUserSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
    notificationsEnabled: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("MobileUser", mobileUserSchema);
