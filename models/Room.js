import mongoose, { Schema } from "mongoose";

// Define Room schema
const roomSchema = new Schema({
  name: {
    type: String,
    required: true // Name of the room (required field)
  },
  topic: {
    type: [String],
    default: [] // Array of topics for the room
  },
  limit: {
    type: Number,
    required: true // Limit of members allowed in the room
  },
  intro: {
    type: String,
    required: true // Introduction or description of the room
  },
  uuid: {
    type: String,
    require: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // Reference to the admin (User model)
  },
  history: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [] // Array of users who have joined the room
  },
  block: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [] // Array of blocked users in the room
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create Room model
const Room = mongoose.model("Room", roomSchema);

export default Room;
