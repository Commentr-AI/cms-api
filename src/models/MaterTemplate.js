import mongoose from "mongoose";

const MasterTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MasterTemplate", MasterTemplateSchema);
