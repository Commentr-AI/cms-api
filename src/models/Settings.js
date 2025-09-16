import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema({
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  twitter: { type: String, default: "" },
  youtube: { type: String, default: "" },
});

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: "" },
    tagline: { type: String, default: "" },
    siteAddress: { type: String, default: "" },
    adminEmail: { type: String, default: "" },
    timezone: { type: String, default: "UTC-5:30" },
    dateFormat: { type: String, default: "august-28-2025" },
    timeFormat: { type: String, default: "11:09-am" },
    weekStartsOn: { type: String, default: "monday" },
    copyrightMessage: { type: String, default: "" },
    socialMedia: { type: socialMediaSchema, default: () => ({}) },
    logo: {
      url: { type: String }, // Cloudinary URL
      public_id: { type: String }, // Cloudinary public_id (for deletion if needed)
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
