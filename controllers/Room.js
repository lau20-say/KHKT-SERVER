import Room from "../models/Room.js";
import { generateUUID } from "../utils/GenerateUUID.js";

export const createRoom = async (req, res) => {
    try {
        const { id } = req.user; // Lấy thông tin user từ token
        const { name, topic, limit, intro } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!name || !topic || !limit || !intro) {
            return res.status(210).json({ message: "Please fill all fields!" });
        }

        // Tạo phòng mới
        const uuid = generateUUID()
        const newRoom = await Room.create({
            name,
            topic: Array.isArray(topic) ? topic : [topic], // Đảm bảo topic là một mảng
            limit,
            intro,
            admin: id,
            uuid
        });

        return res.status(200).json({ message: "Taọ phòng thành công!", room: newRoom });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllRoom = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Đảm bảo giá trị mặc định nếu không truyền
        const skip = (page - 1) * limit;

        // Lấy danh sách phòng, kèm populate admin và history
        const rooms = await Room.find()
            .populate("admin", "avatar name") // Lấy thông tin admin với avatar và name
            .populate({
                path: "history",
                select: "name avatar", // Chỉ lấy các trường cần thiết của người dùng trong history
                options: { limit: 6, sort: { createdAt: -1 } }, // Lấy 4 người dùng gần nhất
            })
            .skip(skip)
            .limit(Number(limit)); // Ép kiểu limit sang số để tránh lỗi

        return res.status(200).json({ message: "Rooms retrieved successfully", rooms });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const checkRoomExistence = async (req, res) => {
    try {
        const { id } = req.body; // Lấy id từ request body
        // Kiểm tra sự tồn tại của phòng bằng uuid
        const room = await Room.findOne({ uuid: id }); // Tìm phòng theo uuid
        if (!room) {
            return res.status(210).json()
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
