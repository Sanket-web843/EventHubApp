import express from "express";
import { addBanner, getBanners, deleteBanner } from "../controller/banner.controller.js";
import { verifyToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/all", getBanners); // Public
router.post("/add", verifyToken, checkRole("Admin"), addBanner); // Admin only
router.delete("/:id", verifyToken, checkRole("Admin"), deleteBanner); // Admin only

export default router;
