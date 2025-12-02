import PromptTemplate from "../models/PromptTemplate.js";

// CREATE
export const createPromptTemplate = async (req, res) => {
  try {
    const { name, prompt, category } = req.body;

    if (!name || !prompt || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newTemplate = new PromptTemplate({ name, prompt, category });
    await newTemplate.save();

    res.status(201).json({
      message: "Prompt Template created successfully!",
      data: newTemplate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL
export const getAllPromptTemplates = async (req, res) => {
  try {
    const templates = await PromptTemplate.find()
      .populate("category", "categoryName") // populate category name only
      .sort({ createdAt: -1 });

    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET SINGLE
export const getPromptTemplateById = async (req, res) => {
  try {
    const template = await PromptTemplate.findById(req.params.id).populate(
      "category",
      "categoryName"
    );

    if (!template) {
      return res.status(404).json({ message: "Prompt Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE
export const updatePromptTemplate = async (req, res) => {
  try {
    const updatedTemplate = await PromptTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: "Prompt Template not found" });
    }

    res.status(200).json({
      message: "Prompt Template updated successfully",
      data: updatedTemplate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE
export const deletePromptTemplate = async (req, res) => {
  try {
    const deletedTemplate = await PromptTemplate.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTemplate) {
      return res.status(404).json({ message: "Prompt Template not found" });
    }

    res.status(200).json({ message: "Prompt Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
