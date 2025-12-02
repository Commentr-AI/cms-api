import TextNews from "../models/TextNews.js";

// =========================
// CREATE TEXT NEWS
// =========================
export const createTextNews = async (req, res) => {
  try {
    const { title, textNews, language, category } = req.body;

    // Validation
    if (!title || !textNews || !language || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTextNews = await TextNews.create({
      title,
      textNews,
      language,
      category,
    });

    return res.status(201).json({
      message: "Text News created successfully",
      data: newTextNews,
    });
  } catch (error) {
    console.error("Error creating text news:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// =========================
// GET ALL TEXT NEWS
// =========================
export const getAllTextNews = async (req, res) => {
  try {
    const newsList = await TextNews.find()
      .populate("language")   // populate full language object
      .populate("category")   // populate full category object
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Text News fetched successfully",
      data: newsList,
    });
  } catch (error) {
    console.error("Error fetching text news:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};


// =========================
// GET SINGLE TEXT NEWS BY ID
// =========================
export const getTextNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await TextNews.findById(id)
      .populate("language")
      .populate("category");

    if (!news) {
      return res.status(404).json({ message: "Text News not found" });
    }

    return res.status(200).json({
      message: "Text News fetched successfully",
      data: news,
    });
  } catch (error) {
    console.error("Error fetching text news:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// =========================
// UPDATE TEXT NEWS
// =========================
export const updateTextNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, textNews, language, category } = req.body;

    const updatedNews = await TextNews.findByIdAndUpdate(
      id,
      { title, textNews, language, category },
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "Text News not found" });
    }

    return res.status(200).json({
      message: "Text News updated successfully",
      data: updatedNews,
    });
  } catch (error) {
    console.error("Error updating text news:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// =========================
// DELETE TEXT NEWS
// =========================
export const deleteTextNews = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNews = await TextNews.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ message: "Text News not found" });
    }

    return res.status(200).json({
      message: "Text News deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting text news:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
