import mongoose from "mongoose";

const PromptTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    prompt: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: function () {
        return !this.isMaster; // required only if NOT master
      },
    },
    isMaster: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PromptTemplate", PromptTemplateSchema);
