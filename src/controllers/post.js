import Post from "../models/post.js";
import Category from "../models/Category.js";
import Language from "../models/Language.js";
import cloudinary from "../config/cloudinary.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const {
      title,
      body,
      category,
      language,
      tags,
      status,
      bannerImageUrl,
      bannerImagePublicId,
      isMainPost
    } = req.body;

    let bannerImage = null;

    if (req.files && req.files.bannerImage) {
      const file = req.files.bannerImage;
      const uploadRes = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "cmp/posts",
      });
      bannerImage = {
        public_id: uploadRes.public_id,
        url: uploadRes.secure_url,
      };
    } else if (bannerImageUrl) {
      bannerImage = {
        public_id: bannerImagePublicId || "",
        url: bannerImageUrl,
      };
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const languageExists = await Language.findById(language);
    if (!languageExists) {
      return res.status(400).json({ message: "Invalid language" });
    }

    if (isMainPost === true || isMainPost === "true") {
      await Post.updateMany({}, { isMainPost: false });
    }

    const post = await Post.create({
      title,
      body,
      category,
      language,
      tags,
      status: status || "draft",
      createdBy: req.user._id,
      bannerImage,
      isMainPost: isMainPost || false
    });

    res.status(201).json({ message: "Post created successfully", data: post });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get All Posts
export const getPosts = async (req, res) => {
  try {
    const {
      status,
      category,
      language,
      search,
      date,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (language) filter.language = language;

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { body: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const posts = await Post.find(filter)
      .populate("category", "categoryName")
      .populate("language", "language")
      .populate("createdBy", "name email avatar")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limitNum);

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      category: post.category?.categoryName || "Uncategorized",
      categoryId: post.category?._id,
      language: post.language?.language || "Unknown",
      languageId: post.language?._id,
      tags: post.tags || [],
      bannerImage: post.bannerImage || null,
      status: post.status || "Draft",
      date: post.createdAt,
      updatedAt: post.updatedAt,
      createdBy: {
        id: post.createdBy?._id,
        name: post.createdBy?.name,
        email: post.createdBy?.email,
        avatar: post.createdBy?.avatar,
      },
      isMainPost: post.isMainPost,
    }));

    res.status(200).json({
      success: true,
      data: formattedPosts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
      filters: { status, category, language, search, date },
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
      error: error.message,
    });
  }
};


// Get Single Post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("category", "categoryName")
      .populate("language", "language")
      .populate("createdBy", "name email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update Post
export const updatePost = async (req, res) => {
  try {
    const {
      title,
      body,
      category,
      language,
      tags,
      status,
      bannerImageUrl,
      bannerImagePublicId,
      removeBannerImage,
      isMainPost
    } = req.body;

    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    let bannerImage = existingPost.bannerImage;

    if (removeBannerImage === "true" || removeBannerImage === true) {
      if (bannerImage?.public_id) {
        await cloudinary.uploader.destroy(bannerImage.public_id);
      }
      bannerImage = null;
    } else if (req.files && req.files.bannerImage) {
      const file = req.files.bannerImage;

      if (bannerImage?.public_id) {
        await cloudinary.uploader.destroy(bannerImage.public_id);
      }

      const uploadRes = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "cmp/posts",
      });

      bannerImage = {
        public_id: uploadRes.public_id,
        url: uploadRes.secure_url,
      };
    } else if (bannerImageUrl) {
      bannerImage = {
        public_id: bannerImagePublicId || "",
        url: bannerImageUrl,
      };
    }

    if (isMainPost === true || isMainPost === "true") {
      await Post.updateMany({ _id: { $ne: req.params.id } }, { isMainPost: false });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        body,
        category,
        language,
        tags,
        status,
        bannerImage,
        isMainPost: isMainPost ?? existingPost.isMainPost,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Post updated", data: updatedPost });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Posts by Category (latest 3 each)
export const getPostsByCategory = async (req, res) => {
  try {
    const categories = await Category.find({ status: "published" }).sort({
      categoryName: 1,
    });

    const results = [];

    for (const category of categories) {
      const posts = await Post.find({
        category: category._id,
        status: "published",
      })
        .populate("createdBy", "name email")
        .populate("language", "language")
        .sort({ createdAt: -1 })
        .limit(3);

      results.push({
        category: category.categoryName,
        categoryId: category._id,
        posts,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error in getPostsByCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Top 4 Main Posts
export const getTopMainPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      isMainPost: true,
      status: "published",
    })
      .populate("createdBy", "name email")
      .populate("language", "language")
      .populate("category", "categoryName")
      .sort({ createdAt: -1 })
      .limit(4);

    return res.status(200).json({
      success: true,
      message: "Top main posts fetched successfully",
      data: posts,
    });

  } catch (error) {
    console.error("Error in getTopMainPosts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
