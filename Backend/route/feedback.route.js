import express from "express";
import { submitFeedback, getFeedbacks, deleteFeedback } from "../controller/feedback.controller.js";
import { verifyToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/submit", submitFeedback); // Public
router.get("/all", verifyToken, checkRole("Admin"), getFeedbacks); // Admin only
router.delete("/:id", verifyToken, checkRole("Admin"), deleteFeedback); // Admin only

export default router;
