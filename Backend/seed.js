import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./model/event.model.js";
import User from "./model/user.model.js";

dotenv.config();

const mongoURI = process.env.mongoDBURI || "mongodb://localhost:27017/eventHub";

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for seeding...");

    // Find an organizer or create one
    let organizer = await User.findOne({ role: "Organizer" });
    if (!organizer) {
      organizer = new User({
        fullname: "Seed Organizer",
        email: "organizer@seed.com",
        password: "password123", // Doesn't matter, just for seeding
        collegeId: "ORG101",
        college: "Seed College",
        whatsapp_no: "9876543210",
        role: "Organizer"
      });
      await organizer.save();
      console.log("Created dummy organizer");
    }

    // Define 6 events (3 free, 3 paid)
    const eventsToSeed = [
      {
        eventId: 1001,
        title: "National Hackathon 2026",
        description: "Join the biggest 24-hour coding marathon. Build innovative solutions, win exciting prizes, and get recognized by top tech companies.",
        organizer: organizer.fullname,
        organizer_id: organizer._id,
        mobile_no: organizer.whatsapp_no,
        venue: "Main Campus Auditorium",
        price: 0,
        category: "Technical",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
        media_link: "https://youtube.com/hackathon",
        start_date: "2026-10-15",
        start_time: "09:00",
        deadline: new Date("2026-10-10T23:59:00Z"),
        joined_count: 0
      },
      {
        eventId: 1002,
        title: "Cloud Computing Workshop",
        description: "A hands-on workshop covering AWS basics, Docker, and Kubernetes. Perfect for beginners and intermediate developers.",
        organizer: organizer.fullname,
        organizer_id: organizer._id,
        mobile_no: organizer.whatsapp_no,
        venue: "Computer Lab 3",
        price: 0,
        category: "Workshop",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
        media_link: "",
        start_date: "2026-11-05",
        start_time: "10:30",
        deadline: new Date("2026-11-01T23:59:00Z"),
        joined_count: 0
      },
      {
        eventId: 1003,
        title: "Open Source Contribution Drive",
        description: "Learn how to contribute to open source projects on GitHub. A collaborative session with seasoned open-source contributors.",
        organizer: organizer.fullname,
        organizer_id: organizer._id,
        mobile_no: organizer.whatsapp_no,
        venue: "Library Seminar Hall",
        price: 0,
        category: "Technical",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        media_link: "",
        start_date: "2026-12-01",
        start_time: "14:00",
        deadline: new Date("2026-11-28T23:59:00Z"),
        joined_count: 0
      },
      {
        eventId: 1004,
        title: "Annual Cultural Fest - EUPHORIA",
        description: "Experience the magic of music, dance, and art. The biggest cultural night of the year featuring celebrity guest performers.",
        organizer: organizer.fullname,
        organizer_id: organizer._id,
        mobile_no: organizer.whatsapp_no,
        venue: "College Ground",
        price: 499,
        category: "Cultural",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop",
        media_link: "https://youtube.com/euphoria",
        start_date: "2027-01-20",
        start_time: "18:00",
        deadline: new Date("2027-01-15T23:59:00Z"),
        joined_count: 0
      },
      {
        eventId: 1005,
        title: "AI & Machine Learning Bootcamp",
        description: "A comprehensive 2-day bootcamp on deep learning, neural networks, and computer vision. Includes certification.",
        organizer: organizer.fullname,
        organizer_id: organizer._id,
        mobile_no: organizer.whatsapp_no,
        venue: "Tech Park Block B",
        price: 999,
        category: "Seminar",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop",
        media_link: "",
        start_date: "2027-02-10",
        start_time: "09:00",
        deadline: new Date("2027-02-05T23:59:00Z"),
        joined_count: 0
      },
      {
        eventId: 1006,
        title: "Inter-College Sports Tournament",
        description: "Compete in cricket, football, and basketball tournaments against top colleges in the state. Exciting cash prizes for winners.",
        organizer: organizer.fullname,
        organizer_id: organizer._id,
        mobile_no: organizer.whatsapp_no,
        venue: "Sports Complex",
        price: 250,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
        media_link: "",
        start_date: "2027-03-15",
        start_time: "08:00",
        deadline: new Date("2027-03-10T23:59:00Z"),
        joined_count: 0
      }
    ];

    for (const ev of eventsToSeed) {
      // Check if eventId exists to avoid duplicate key errors
      const exists = await Event.findOne({ eventId: ev.eventId });
      if (!exists) {
        await new Event(ev).save();
        console.log(`Seeded: ${ev.title}`);
      } else {
        console.log(`Already exists: ${ev.title}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
