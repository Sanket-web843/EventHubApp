import express from "express";
import { getEventParticipants, getAllOrganizerRegistrations, addParticipant, removeParticipant, joinEvent, getMyRegistrations } from "../controller/registration.controller.js";
import { verifyToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// ANY AUTHENTICATED USER
// ==========================================
// Student registers for an event
router.post("/event/:eventId/join", verifyToken, joinEvent);

// Student fetches their registered events
router.get("/my-registrations", verifyToken, getMyRegistrations);

// ==========================================
// PROTECTED ROUTES (Organizer Only)
// ==========================================

// Get participants for a specific event
router.get("/event/:eventId/participants", verifyToken, checkRole("Organizer", "Admin"), getEventParticipants);

// Get ALL participants across ALL events for the organizer
router.get("/all-participants", verifyToken, checkRole("Organizer", "Admin"), getAllOrganizerRegistrations);

// Add a participant manually
router.post("/event/:eventId/participants", verifyToken, checkRole("Organizer", "Admin"), addParticipant);

// Remove a participant manually
router.delete("/event/:eventId/participants/:registrationId", verifyToken, checkRole("Organizer", "Admin"), removeParticipant);

export default router;
