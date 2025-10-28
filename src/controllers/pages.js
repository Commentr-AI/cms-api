import Page from "../models/pages.js";

// ✅ Create a new page
export const createPage = async (req, res) => {
  try {
    const { title, content } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return res.status(400).json({ message: "Page with this title already exists" });
    }

    const page = await Page.create({
      title,
      slug,
      content,
      createdBy: req.user?._id, // optional
    });

    res.status(201).json({ message: "Page created successfully", page });
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get all pages
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.status(200).json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get a single page by slug
export const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug });
    if (!page) return res.status(404).json({ message: "Page not found" });

    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findById({ _id:id });
    if (!page) return res.status(404).json({ message: "Page not found" });

    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update a page
export const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const updatedPage = await Page.findByIdAndUpdate(
      id,
      { title, slug, content },
      { new: true }
    );

    if (!updatedPage) return res.status(404).json({ message: "Page not found" });

    res.status(200).json({ message: "Page updated successfully", updatedPage });
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete a page
export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPage = await Page.findByIdAndDelete(id);
    if (!deletedPage) return res.status(404).json({ message: "Page not found" });

    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
