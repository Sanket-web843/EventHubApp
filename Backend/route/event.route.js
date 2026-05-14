import express from "express";
import { createEvent, getEvents, getOrganizerEvents, updateEvent, deleteEvent } from "../controller/event.controller.js";
import { verifyToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get("/all", getEvents);

// ==========================================
// PROTECTED ROUTES (Organizer Only)
// ==========================================
// Frontend ne '/add' var POST request pathvli
router.post("/add", verifyToken, checkRole("Organizer", "Admin"), createEvent);

// Get organizer's own events
router.get("/organizer/events", verifyToken, checkRole("Organizer", "Admin"), getOrganizerEvents);

// Update an event
router.put("/:id", verifyToken, checkRole("Organizer", "Admin"), updateEvent);

// Delete an event
router.delete("/:id", verifyToken, checkRole("Organizer", "Admin"), deleteEvent);

export default router;