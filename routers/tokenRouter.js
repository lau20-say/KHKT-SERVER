import express from "express";
import { validateToken } from "../controllers/Token.js";
const router = express.Router()

router.post("/valid-token", validateToken);


export default router