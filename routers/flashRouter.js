import express from "express";
import {
  createTopic,
  addFlashCardToTopic,
  deleteFlashCardFromTopic,
  deleteTopic,
  getAllTopicsNames,
  getTopicDetails,
  listTopics,
} from "../controllers/FlashCard.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-topic", createTopic);
router.post("/topics/:topicId/flashcards",authMiddleware, addFlashCardToTopic);
router.delete("/topics/:topicId/flashcards/:flashCardId",authMiddleware, deleteFlashCardFromTopic);
router.post("/delete-topic/:topicId",authMiddleware, deleteTopic);
router.get("/topics/:idAdmin", getAllTopicsNames);

router.post("/topics/:topicId", getTopicDetails);


export default router;
