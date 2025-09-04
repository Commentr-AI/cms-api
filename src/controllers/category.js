import Category from "../models/Category.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { categoryName, slug, parentCategory, description, status } =
      req.body;

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      categoryName,
      slug,
      parentCategory: parentCategory || null,
      description,
      status: status || "draft",
    });

    await newCategory.save();

    res.status(201).json({
      message: `Category ${
        status === "published" ? "published" : "saved as draft"
      } successfully`,
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { categoryName, slug, parentCategory, description, status } =
      req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        categoryName,
        slug,
        parentCategory: parentCategory || null,
        description,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: `Category ${
        status === "published" ? "published" : "updated as draft"
      } successfully`,
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { categoryName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Category.countDocuments(query);

    const categories = await Category.find(query)
      .populate("parentCategory", "categoryName slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      categories,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Single Category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parentCategory",
      "categoryName slug"
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
