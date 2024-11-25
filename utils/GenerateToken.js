import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES; // Thời hạn Access Token

// Tạo Access Token
export const generateAccessToken = (userID) => {
    return jwt.sign(
        { userId: String(userID) },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
};


