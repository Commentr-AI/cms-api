// models/Media.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "audio"],
      required: true,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
