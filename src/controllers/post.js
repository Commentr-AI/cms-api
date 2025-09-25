import Post from "../models/post.js";
import Category from "../models/Category.js";
import Language from "../models/Language.js";
import cloudinary from "../config/cloudinary.js";

// Create Post (Draft or Publish)
export const createPost = async (req, res) => {
  try {
    const { title, body, category, language, accessLevel, tags, status } =
      req.body;

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
    }
    // Validate category and language exist
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const languageExists = await Language.findById(language);
    if (!languageExists) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const post = await Post.create({
      title,
      body,
      category,
      language,
      accessLevel,
      tags,
      status: status || "draft",
      createdBy: req.user._id,
      bannerImage: bannerImage, // user from auth middleware
    });

    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Posts (with filters for public/draft)
export const getPosts = async (req, res) => {
  try {
    const {
      status,
      category,
      language,
      accessLevel,
      search,
      date,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    // Status filter
    if (status && status !== "") {
      filter.status = status;
    }

    // Category filter (assuming category is ObjectId reference)
    if (category && category !== "") {
      filter.category = category;
    }

    // Language filter (assuming language is ObjectId reference)
    if (language && language !== "") {
      filter.language = language;
    }

    // Access Level filter
    if (accessLevel && accessLevel !== "") {
      filter.accessLevel = accessLevel;
    }

    // Date filter - posts created on or after the specified date
    if (date && date !== "") {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999); // End of the day

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Search filter - search in title and content
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
        { excerpt: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with population and pagination
    const posts = await Post.find(filter)
      .populate("category", "categoryName") // assuming category has categoryName field
      .populate("language", "language language code") // assuming language has name, language, and code fields
      .populate("createdBy", "name email avatar")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limitNum);
    console.log(posts, "posts");
    // Format response data
    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      category: post.category?.categoryName || "Uncategorized",
      categoryId: post.category?._id,
      language: post.language?.language || "Unknown",
      languageId: post.language?._id,
      tags: post.tags || [],
      bannerImage: post.bannerImage || null,
      accessLevel: post.accessLevel || "Free",
      status: post.status || "Draft",
      date: post.createdAt,
      updatedAt: post.updatedAt,
      createdBy: {
        id: post.createdBy?._id,
        name: post.createdBy?.name,
        email: post.createdBy?.email,
        avatar: post.createdBy?.avatar,
      },
      excerpt: post.excerpt,
      slug: post.slug,
      featured: post.featured || false,
      viewCount: post.viewCount || 0,
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
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
      filters: {
        status,
        category,
        language,
        accessLevel,
        search,
        date,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
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

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { title, body, category, language, accessLevel, tags, status } =
      req.body;
    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const bannerImage = existingPost.bannerImage;
    if (req.files && req.files.bannerImage) {
      const file = req.files.bannerImage;
      if (bannerImage?.public_id) {
        const deleteRes = await cloudinary.uploader.destroy(
          bannerImage.public_id
        );
      }
      const res = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "cmp/posts",
      });

      bannerImage = {
        public_id: res.public_id,
        url: res.secure_url,
      };
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        body,
        category,
        language,
        accessLevel,
        tags,
        status,
        bannerImage,
      },
      { new: true, runValidators: true }
    );
    if (updatedPost) {
      res.status(200).json({ message: "Post updated", data: updatedPost });
    }
  } catch (error) {
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
