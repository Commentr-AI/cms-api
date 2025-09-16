import Settings from "../models/Settings.js";
import cloudinary from "../config/cloudinary.js";

export const saveSettings = async (req, res) => {
  try {
    const {
      siteTitle,
      tagline,
      siteAddress,
      adminEmail,
      timezone,
      dateFormat,
      timeFormat,
      weekStartsOn,
      copyrightMessage,
      socialMedia,
    } = req.body;

    let logoData = null;

    if (req.files && req.files.logo) {
      const file = req.files.logo;
      const uploadRes = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "cmp/logo",
      });

      logoData = {
        public_id: uploadRes.public_id,
        url: uploadRes.secure_url,
      };
    }

    // find or create (only one settings document)
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        siteTitle,
        tagline,
        siteAddress,
        adminEmail,
        timezone,
        dateFormat,
        timeFormat,
        weekStartsOn,
        copyrightMessage,
        socialMedia: JSON.parse(socialMedia || "{}"),
        ...(logoData && { logo: logoData }),
      });
    } else {
      settings.siteTitle = siteTitle;
      settings.tagline = tagline;
      settings.siteAddress = siteAddress;
      settings.adminEmail = adminEmail;
      settings.timezone = timezone;
      settings.dateFormat = dateFormat;
      settings.timeFormat = timeFormat;
      settings.weekStartsOn = weekStartsOn;
      settings.copyrightMessage = copyrightMessage;
      settings.socialMedia = JSON.parse(socialMedia || "{}");

      if (logoData) {
        // delete old logo if exists
        if (settings.logo?.public_id) {
          await cloudinary.uploader.destroy(settings.logo.public_id);
        }
        settings.logo = logoData;
      }

      await settings.save();
    }

    res.status(201).json({
      success: true,
      msg: "Settings saved successfully!",
      data: settings,
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to save settings!",
    });
  }
};

// Get Settings (only one document)
export const getSettings = async (req, res) => {
  console.log("Fetching settings...");
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        msg: "Settings not found",
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch settings!",
    });
  }
};
