import Event from "../model/event.model.js";

// ==========================================
// 1. ADD NEW EVENT (POST REQUEST)
// ==========================================
export const createEvent = async (req, res) => {
  try {
    // Check if organizer is approved
    if (req.user && req.user.role === "Organizer" && !req.user.isApproved) {
      return res.status(403).json({ 
        message: "Your account is pending approval. You cannot create events yet." 
      });
    }

    const eventData = req.body;
    
    // ==========================================
    // AUTO GENERATE EVENT ID (Smallest Available)
    // ==========================================
    const allEvents = await Event.find({}, { eventId: 1 }).sort({ eventId: 1 });
    const usedIds = allEvents.map(e => e.eventId);
    
    let nextId = 1;
    for (const id of usedIds) {
      if (id === nextId) {
        nextId++;
      } else if (id > nextId) {
        break; // Found a gap
      }
    }
    
    eventData.eventId = nextId;

    // If user is authenticated, override organizer_id with their ID
    if (req.user) {
      eventData.organizer_id = req.user._id;
    }

    // MongoDB madhye navin event banvnyasathi aapan aapla Model (Event) use karu
    const newEvent = new Event(eventData);
    
    // Database madhye save karne (Hi line thoda vel ghete mhanun 'await' lavla aahe)
    await newEvent.save();

    // Jevha successfully save hoil, tevha 201 (Created) status sobat success message pathvu
    res.status(201).json({
      message: "Event created successfully 🎉",
      event: newEvent
    });

  } catch (error) {
    console.log("Error in createEvent: ", error);
    // Jari konti field missing asel kiva error aala, tar 500 (Internal Server Error) pathvu
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// ==========================================
// 2. GET ALL EVENTS (GET REQUEST)
// ==========================================
export const getEvents = async (req, res) => {
  try {
    // Database madhun sagle events kadhnyasathi '.find()' use hoto
    const events = await Event.find();
    
    // Sagle events frontend var pathvun deu 200 (OK) status sobat
    res.status(200).json(events);

  } catch (error) {
    console.log("Error in getEvents: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ==========================================
// 3. GET ORGANIZER'S OWN EVENTS
// ==========================================
export const getOrganizerEvents = async (req, res) => {
  try {
    let events;
    if (req.user.role === "Admin") {
      // Admin sees ALL events platform-wide
      events = await Event.find();
    } else {
      // Organizer sees only their own events
      events = await Event.find({ organizer_id: req.user._id });
    }
    res.status(200).json(events);
  } catch (error) {
    console.log("Error in getOrganizerEvents: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ==========================================
// 4. UPDATE EVENT (Organizer Only)
// ==========================================
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if the current organizer owns this event OR is an Admin
    if (req.user.role !== "Admin" && event.organizer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.log("Error in updateEvent: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ==========================================
// 5. DELETE EVENT (Organizer Only)
// ==========================================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if the current organizer owns this event OR is an Admin
    if (req.user.role !== "Admin" && event.organizer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this event" });
    }

    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.log("Error in deleteEvent: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
