import mongoose from "mongoose";

// Define EmailVerification schema
const emailVerificationSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true, // Ensures the email field is required
    unique: true // Ensures that the email is unique
  },
  isVerified: {
    type: Boolean,
    default: false // Default status is false until verified
  },
  verificationCode: {
    type: String,
    required: false // Code for email verification (optional for the schema)
  },
  passwordResetCode: {
    type: String,
    required: false // Code for password reset (optional for the schema)
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Create EmailVerification model
const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema);

export default EmailVerification;
