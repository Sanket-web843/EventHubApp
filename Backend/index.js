import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"

// 1. Aapla navin route IMPORT kara
import eventRoute from "./route/event.route.js"; 
import userRoute from "./route/user.route.js"; 
import registrationRoute from "./route/registration.route.js"; 
import adminRoute from "./route/admin.route.js";
import feedbackRoute from "./route/feedback.route.js";
import bannerRoute from "./route/banner.route.js";

dotenv.config(); 

const app = express();

// Set permissive CORS for local development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

// Fix ERR_BLOCKED_BY_RESPONSE.NotSameOrigin
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  next();
});
const PORT = process.env.PORT || 4000; 
const URI = process.env.mongoDBURI; 

// ==================================================
// MAHATVACHE: Frontend kadun yenara JSON data 
// vachnyasathi he middleware line add karne compulsory aahe!
// ==================================================
app.use(express.json()); 

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(URI); 
    console.log("Connected to MongoDB successfully! 🎉");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error); 
  }
};
connectDB();

// ==================================================
// 2. ROUTES SETUP
// Jevha pan URL madhye '/api/events' yeyil, 
// tevha server 'eventRoute' kade request pathvel.
// Example: http://localhost:4000/api/events/all
// ==================================================
app.use("/api/events", eventRoute);
app.use("/api/users", userRoute);
app.use("/api/registrations", registrationRoute);
app.use("/api/admin", adminRoute);
app.use("/api/feedbacks", feedbackRoute);
app.use("/api/banners", bannerRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});