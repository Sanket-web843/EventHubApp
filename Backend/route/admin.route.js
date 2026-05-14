import express from "express";
import { getPlatformStats, getAllUsers, removeUser, approveOrganizer } from "../controller/admin.controller.js";
import { verifyToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// All admin routes require Admin role
router.get("/stats", verifyToken, checkRole("Admin"), getPlatformStats);
router.get("/users", verifyToken, checkRole("Admin"), getAllUsers);
router.delete("/users/:userId", verifyToken, checkRole("Admin"), removeUser);
router.put("/approve/:userId", verifyToken, checkRole("Admin"), approveOrganizer);

export default router;
