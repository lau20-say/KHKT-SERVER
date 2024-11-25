import express from "express";
import { SignIn, SignUp, getCodeAuthEmail, authCodeEmail, getMyInfo, updateUser } from "../controllers/User.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/sign-in", SignIn);
router.post("/sign-up", SignUp);
router.post("/get-code", getCodeAuthEmail);
router.post("/auth-code", authCodeEmail);
router.post("/get-user", authMiddleware, getMyInfo)
router.post("/update-user", authMiddleware, updateUser)

export default router;
