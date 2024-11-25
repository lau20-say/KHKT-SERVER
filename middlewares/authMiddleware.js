import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv"
dotenv.config();
export const authMiddleware = async (req, res, next) => {
  // Kiểm tra token trong header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(210).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Tìm kiếm người dùng dựa trên ID từ token và loại bỏ trường password
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(210).json({ message: "User not found" });
    }

    // Gán thông tin người dùng đã xác thực vào req và tiếp tục
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(400).json({ message: "Invalid token" });
  }
};
