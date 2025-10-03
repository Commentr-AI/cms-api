import cloudinary from "cloudinary";
import Media from "../models/media.js";
import fs from "fs";
// ======================= UPLOAD MEDIA =======================
export const uploadMedia = async (req, res) => {
  try {
    const { title, type, url, public_id } = req.body;

    if (!["image", "video", "audio"].includes(type)) {
      return res.status(400).json({ message: "Invalid media type" });
    }

    // If frontend already sent URL & public_id (video/audio)
    if ((type === "video" || type === "audio") && url && public_id) {
      const media = await Media.create({
        title: title || "Untitled",
        url,
        public_id,
        type,
        uploadedBy: req.user?._id,
      });

      return res.status(201).json({
        message: `${type} saved successfully`,
        data: media,
      });
    }

    // Image upload from backend
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const file = req.files.file;

    const uploadRes = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "cmp/media",
      resource_type: "image",
    });

    const media = await Media.create({
      title: title || file.name,
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      type: "image",
      uploadedBy: req.user?._id,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      data: media,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================= GET MEDIA =======================
export const getMedia = async (req, res) => {
  try {
    const { type, search } = req.query;

    let filter = {};
    if (type && ["image", "video", "audio"].includes(type)) {
      filter.type = type;
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const mediaItems = await Media.find(filter).sort({ createdAt: -1 });
    res.json({ data: mediaItems });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================= DELETE MEDIA =======================
export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: media.type === "image" ? "image" : "video",
    });

    // Delete from DB
    await Media.findByIdAndDelete(id);

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const bulkDeleteMedia = async (req, res) => {
  try {
    const { ids } = req.body; // Expect array of media IDs

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No media IDs provided" });
    }

    const mediaItems = await Media.find({ _id: { $in: ids } });

    if (mediaItems.length === 0) {
      return res.status(404).json({ message: "No media found" });
    }

    // Delete each file from Cloudinary
    for (const media of mediaItems) {
      await cloudinary.uploader.destroy(media.public_id, {
        resource_type: media.type === "image" ? "image" : "video",
      });
    }

    // Delete from DB
    await Media.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `${mediaItems.length} media item(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
