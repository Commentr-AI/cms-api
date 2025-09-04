import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },
    accessLevel: {
      type: String,
      enum: ["free", "registered", "paid"],
      default: "free",
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
