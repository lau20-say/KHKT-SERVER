import mongoose, { Schema } from "mongoose";

// Define Room schema
const topicFlash = new Schema({
  name: {
    type: String,
    require: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // Reference to the admin (User model)
  },
  flash: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashCard", // Reference to the FlashCard model
    }
  ]
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create TopicFlash model
const TopicFlash = mongoose.model("TopicFlash", topicFlash);

export default TopicFlash;
