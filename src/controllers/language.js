import Language from "../models/Language.js";

// @desc Create a new language
// @desc Create language (draft or published)
export const createLanguage = async (req, res) => {
  try {
    const { language, slug, description, isDraft } = req.body;

    if (!language || !slug) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Language.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Language already exists" });
    }

    const newLanguage = new Language({
      language,
      slug,
      description,
      isDraft: isDraft ?? true, // default true
    });

    await newLanguage.save();
    res.status(201).json({
      message: isDraft ? "Language saved as draft" : "Language published",
      data: newLanguage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get only published languages (public)
export const getPublishedLanguages = async (req, res) => {
  try {
    const languages = await Language.find({ isDraft: false }).sort({
      createdAt: -1,
    });
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all languages (admin use)
// controllers/languageController.js
export const getAllLanguages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { language: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Language.countDocuments(query);

    const languages = await Language.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: languages,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get single language
export const getLanguageById = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return res.status(404).json({ message: "Language not found" });
    }
    res.status(200).json(language);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update language
export const updateLanguage = async (req, res) => {
  try {
    const { language, slug, description, isDraft } = req.body;

    const updatedLanguage = await Language.findByIdAndUpdate(
      req.params.id,
      { language, slug, description, isDraft }, // include isDraft
      { new: true, runValidators: true }
    );

    if (!updatedLanguage) {
      return res.status(404).json({ message: "Language not found" });
    }

    res.status(200).json({
      message: isDraft ? "Language updated as draft" : "Language published",
      data: updatedLanguage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete language
export const deleteLanguage = async (req, res) => {
  try {
    const deletedLanguage = await Language.findByIdAndDelete(req.params.id);

    if (!deletedLanguage) {
      return res.status(404).json({ message: "Language not found" });
    }

    res.status(200).json({ message: "Language deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
