import express from "express";
import { signup, login, logout, getUserProfile, updateUserProfile } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// USER ROUTES (Frontend varun ya URLs var request yeil)
// ==========================================
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Profile Routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

export default router;