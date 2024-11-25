import mongoose from "mongoose";

// Định nghĩa schema
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/564x/e1/bf/16/e1bf16afd3dbe6423e89712a4382b479.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
