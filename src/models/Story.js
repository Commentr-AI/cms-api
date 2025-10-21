import mongoose from "mongoose";

const ElementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["image", "text", "shape"], required: true },
  src: { type: String }, // only for image
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  width: { type: Number, default: 100 },
  height: { type: Number, default: 100 },
  rotation: { type: Number, default: 0 },
}, { _id: false });

const PageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  elements: [ElementSchema],
}, { _id: false });

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  pages: [PageSchema],
  currentPageId: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Story", StorySchema);
