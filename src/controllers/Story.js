import Story from "../models/Story.js";


// ✅ Create Story
export const createStory = async (req, res) => {
  try {
    const { title, pages, currentPageId } = req.body;

    const story = new Story({
      title,
      pages,
      currentPageId,
    });

    await story.save();
    res.status(201).json({ success: true, message: "Story created successfully", story });
  } catch (error) {
    console.error("Create Story Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Get All Stories
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, stories });
  } catch (error) {
    console.error("Get Stories Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Get Single Story by ID
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);

    if (!story) return res.status(404).json({ success: false, message: "Story not found" });
    res.status(200).json({ success: true, story });
  } catch (error) {
    console.error("Get Story Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Update Story
export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pages, currentPageId } = req.body;

    const story = await Story.findByIdAndUpdate(
      id,
      { title, pages, currentPageId },
      { new: true }
    );

    if (!story) return res.status(404).json({ success: false, message: "Story not found" });
    res.status(200).json({ success: true, message: "Story updated successfully", story });
  } catch (error) {
    console.error("Update Story Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Delete Story
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findByIdAndDelete(id);

    if (!story) return res.status(404).json({ success: false, message: "Story not found" });
    res.status(200).json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    console.error("Delete Story Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
