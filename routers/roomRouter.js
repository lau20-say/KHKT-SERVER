import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkRoomExistence, createRoom, getAllRoom } from "../controllers/Room.js";
const router = express.Router()

router.post("/create-room", authMiddleware, createRoom);
router.post("/get-all-room", getAllRoom)
router.post("/check-room-exit", checkRoomExistence)

export default router