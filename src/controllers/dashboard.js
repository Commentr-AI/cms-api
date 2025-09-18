import Langs from "../models/Language.js";
import Category from "../models/Category.js";
import Post from "../models/post.js";

export const getCounts = async (req, res) => {
  console.log("getCounts called");
  try {
    const [langsCount, categoryCount, postCount] = await Promise.all([
      Langs.countDocuments(),
      Category.countDocuments(),
      Post.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      counts: {
        langs: langsCount,
        categories: categoryCount,
        posts: postCount,
      },
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching counts",
      error: error.message,
    });
  }
};
