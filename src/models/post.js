import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true }, // keep or remove? Just tell me
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

    // ❌ accessLevel removed completely

    bannerImage: {
      url: { type: String },
      public_id: { type: String },
    },

    tags: [{ type: String }],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    isMainPost: {
      type: Boolean,
      default: false,
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
