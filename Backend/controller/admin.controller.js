import User from "../model/user.model.js";
import Event from "../model/event.model.js";
import Registration from "../model/registration.model.js";
import Feedback from "../model/feedback.model.js";

// ==========================================
// 1. GET PLATFORM STATS (Admin Only)
// ==========================================
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();

    res.status(200).json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalFeedbacks
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// ==========================================
// 2. GET ALL USERS (Admin Only)
// ==========================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// ==========================================
// 3. REMOVE USER (Admin Only)
// ==========================================
export const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user's events if they are an organizer
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "Organizer") {
      await Event.deleteMany({ organizer_id: userId });
    }

    // Delete user's registrations
    await Registration.deleteMany({ userId: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and associated data removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing user", error: error.message });
  }
};

// ==========================================
// 4. APPROVE ORGANIZER (Admin Only)
// ==========================================
export const approveOrganizer = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isApproved: true }, { new: true });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Organizer approved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error approving organizer", error: error.message });
  }
};
