import MasterTemplate from "../models/MaterTemplate.js";

// CREATE OR UPDATE (Upsert)
export const saveMasterTemplate = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and Content are required.",
      });
    }

    // Check if master template exists
    let existingTemplate = await MasterTemplate.findOne();

    if (existingTemplate) {
      // ------- UPDATE EXISTING -------
      existingTemplate.title = title;
      existingTemplate.description = description;
      existingTemplate.content = content;

      const updated = await existingTemplate.save();

      return res.status(200).json({
        success: true,
        action: "updated",
        message: "Master Template updated successfully.",
        data: updated,
      });
    }

    // ------- CREATE NEW -------
    const newTemplate = new MasterTemplate({
      title,
      description,
      content,
    });

    const saved = await newTemplate.save();

    return res.status(201).json({
      success: true,
      action: "created",
      message: "Master Template created successfully.",
      data: saved,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET MASTER TEMPLATE
export const getMasterTemplate = async (req, res) => {
  try {
    const template = await MasterTemplate.findOne();

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "No Master Template found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: template,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
