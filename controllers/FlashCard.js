import FlashCard from "../models/FlashCard.js";
import TopicFlash from "../models/TopicFlash.js";

// CREATE a new topic
export const createTopic = async (req, res) => {
  try {
    const { name, admin } = req.body;

    const newTopic = new TopicFlash({ name, admin });
    await newTopic.save();

    res.status(200).json({ message: "Topic created successfully", topic: newTopic });
  } catch (error) {
    res.status(500).json({ message: "Error creating topic", error: error.message });
  }
};

// ADD a flashcard to a topic
export const addFlashCardToTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { id } = req.user; 
    const { p1, p2 } = req.body;

    // Create a new flashcard
    const newFlashCard = new FlashCard({ p1, p2 });
    await newFlashCard.save();

    // Link flashcard to topic
    const topic = await TopicFlash.findById(topicId);
    if(topic.admin.toString() !== id.toString()){
      return res.status(210).json({ message: "You are not admin" });
    }
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    topic.flash.push(newFlashCard._id);
    await topic.save();

    res.status(200).json({ message: "Flashcard added to topic", flashCard: newFlashCard });
  } catch (error) {
    res.status(500).json({ message: "Error adding flashcard to topic", error: error.message });
  }
};

// DELETE a flashcard from a topic
export const deleteFlashCardFromTopic = async (req, res) => {
  try {
    const { topicId, flashCardId } = req.params;
    const { id } = req.user; // ID của người dùng

    // Kiểm tra xem chủ đề có tồn tại hay không
    const topic = await TopicFlash.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Kiểm tra flashcard có nằm trong danh sách của topic không
    if (!topic.flash.includes(flashCardId)) {
      return res.status(404).json({ message: "Flashcard not found in this topic" });
    }

    // Xóa flashcard khỏi cơ sở dữ liệu
    await FlashCard.findByIdAndDelete(flashCardId);

    // Loại bỏ ID flashcard khỏi mảng topic.flash
    topic.flash = topic.flash.filter((id) => id.toString() !== flashCardId);
    await topic.save();

    res.status(200).json({ message: "Flashcard removed from topic" });
  } catch (error) {
    res.status(500).json({
      message: "Error removing flashcard from topic",
      error: error.message,
    });
  }
};


// DELETE a topic
export const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { id } = req.user; 

    // Check if the topic exists
    const topic = await TopicFlash.findById(topicId);
    if(id.toString() !== topic.admin.toString()){
      return res.status(210).json({ message: "you have no rights" });
    }
    console.log(topic)
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Delete all flashcards linked to the topic
    await FlashCard.findByIdAndDelete(topic.flash);

    // Delete the topic itself
    await TopicFlash.findByIdAndDelete(topicId);

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting topic", error: error.message });
  }
};

// LIST all topics
export const listTopics = async (req, res) => {
  try {
    const topics = await TopicFlash.find().populate("admin").populate("flash");

    res.status(200).json({ message: "Topics retrieved successfully", topics });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving topics", error: error.message });
  }
};


// Get details of a specific topic
export const getTopicDetails = async (req, res) => {
  try {
    const { topicId } = req.params;

    // Fetch the topic with populated flash field
    const topic = await TopicFlash.findById(topicId).populate({
      path: "flash", // Field to populate
      model: "flashCard", // Explicitly mention the model name
      select: "p1 p2", // Only fetch the p1 and p2 fields
    });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({
      message: "Topic details retrieved successfully",
      topic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving topic details",
      error: error.message,
    });
  }
};


  // Get all topics with only name
export const getAllTopicsNames = async (req, res) => {
  try {
    // Fetch all topics, selecting only the name field
    const {idAdmin} = req.params;
    const topics = await TopicFlash.find({admin: idAdmin});

    res.status(200).json({ message: "Topics retrieved successfully", topics });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving topics", error: error.message });
  }
};
