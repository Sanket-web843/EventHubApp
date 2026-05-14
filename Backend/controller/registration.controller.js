import mongoose from "mongoose";
import Registration from "../model/registration.model.js";
import Event from "../model/event.model.js";
import User from "../model/user.model.js";

// ==========================================
// 1. GET EVENT PARTICIPANTS (Organizer Only)
// ==========================================
export const getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Ensure event exists and belongs to the organizer
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    if (event.organizer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to view participants for this event" });
    }

    const participants = await Registration.find({ eventId }).populate("userId", "fullname email college collegeId whatsapp_no");
    res.status(200).json(participants);
  } catch (error) {
    console.log("Error in getEventParticipants: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ==========================================
// 1.5 GET ALL REGISTRATIONS (Organizer Only)
// ==========================================
export const getAllOrganizerRegistrations = async (req, res) => {
  try {
    let registrations;

    if (req.user.role === "Admin") {
      // Admin sees everything
      registrations = await Registration.find()
        .populate("userId", "fullname email college collegeId whatsapp_no")
        .populate("eventId", "title");
    } else {
      // Organizer sees only their events' registrations
      const organizerEvents = await Event.find({ organizer_id: req.user._id }).select("_id");
      const eventIds = organizerEvents.map(event => event._id);

      registrations = await Registration.find({ eventId: { $in: eventIds } })
        .populate("userId", "fullname email college collegeId whatsapp_no")
        .populate("eventId", "title");
    }

    res.status(200).json(registrations);
  } catch (error) {
    console.log("Error in getAllOrganizerRegistrations: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ==========================================
// 2. MANUALLY ADD PARTICIPANT (Organizer Only)
// ==========================================
export const addParticipant = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email, paymentStatus } = req.body; // Add by email

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    if (event.organizer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to add participants to this event" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found with this email" });

    // Check if already registered
    const existingRegistration = await Registration.findOne({ eventId, userId: user._id });
    if (existingRegistration) {
      return res.status(400).json({ message: "User is already registered for this event" });
    }

    const newRegistration = new Registration({
      eventId,
      userId: user._id,
      paymentStatus: paymentStatus || "Free"
    });

    await newRegistration.save();

    // Increment joined_count
    event.joined_count += 1;
    await event.save();

    res.status(201).json({ message: "Participant added successfully", registration: newRegistration });
  } catch (error) {
    console.log("Error in addParticipant: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ==========================================
// 3. REMOVE PARTICIPANT (Organizer Only)
// ==========================================
export const removeParticipant = async (req, res) => {
  try {
    const { eventId, registrationId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to remove participants from this event" });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    await Registration.findByIdAndDelete(registrationId);

    // Decrement joined_count
    if (event.joined_count > 0) {
      event.joined_count -= 1;
      await event.save();
    }

    res.status(200).json({ message: "Participant removed successfully" });
  } catch (error) {
    console.log("Error in removeParticipant: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
// ==========================================
// 4. STUDENT JOINS EVENT (Any Authenticated User)
// ==========================================
export const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { paymentStatus } = req.body;

    // 1. Basic validation for eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID format" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2. Check if registration is still open (optional but good)
    if (event.deadline && new Date(event.deadline) < new Date()) {
      return res.status(400).json({ message: "Registration for this event has closed" });
    }

    // 3. Check if already registered
    const existingRegistration = await Registration.findOne({ eventId, userId: req.user._id });
    if (existingRegistration) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // 4. Create new registration
    const newRegistration = new Registration({
      eventId,
      userId: req.user._id,
      paymentStatus: paymentStatus || (event.price === 0 ? "Free" : "Paid")
    });

    await newRegistration.save();

    // 5. Increment joined_count
    event.joined_count = (event.joined_count || 0) + 1;
    await event.save();

    res.status(201).json({ message: `Successfully registered for ${event.title}!`, registration: newRegistration });
  } catch (error) {
    console.error("Error in joinEvent: ", error);
    
    // Handle specific Mongoose errors
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID provided" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error occurred during registration", error: error.message });
  }
};

// ==========================================
// 5. GET USER'S REGISTRATIONS (Current User Only)
// ==========================================
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate({
        path: "eventId",
        select: "title description start_date start_time venue price image organizer mobile_no"
      });
    res.status(200).json(registrations);
  } catch (error) {
    console.log("Error in getMyRegistrations: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
