import mongoose from "mongoose";

// Unique ID generator
function generateTextNewsId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


const TextNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    textNews: {
      type: String,
      required: true,
      maxlength: 5000,
    },

    // Updated: store ObjectId reference
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },

    // Updated: store ObjectId reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    textNewsId: {
      type: String,
      unique: true,
      default: generateTextNewsId,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TextNews", TextNewsSchema);
