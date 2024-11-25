import mongoose, { Schema } from "mongoose";

// Define Room schema
const flashCard = new Schema({
  
   p1: {
    type: String,
    require: true
  },
  p2: {
    type: String,
    require: true
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create Room model
const FlashCard = mongoose.model("flashCard", flashCard);

export default FlashCard;
