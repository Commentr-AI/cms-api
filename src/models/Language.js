import mongoose from "mongoose";

const languageSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isDraft: {
      type: Boolean,
      default: true, // default to draft
    },
  },
  { timestamps: true }
);

export default mongoose.model("Language", languageSchema);
