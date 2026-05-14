import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_12345";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};

// ==========================================
// 1. SIGN UP CONTROLLER 
// ==========================================
export const signup = async (req, res) => {
    try {
        // Frontend se aane wale saare naye fields ko receive karna
        const { role, fullname, collegeId, college, whatsapp_no, email, password } = req.body;

        // Check karu ki user aadhi pasun astitvat aahe ka (Email ya College ID se)
        const userExists = await User.findOne({ $or: [{ email }, { collegeId }] });
        if (userExists) {
            return res.status(400).json({ message: "User with this Email or Student/Emp ID already exists" });
        }

        // Password la secure (hash) karne
        const hashPassword = await bcryptjs.hash(password, 10);

        // Navin user DB madhye save karne
        const createdUser = new User({
            role: role === "Student" ? "Student" : "Organizer",
            isApproved: role === "Student", // Students auto-approved, Organizers not
            fullname,
            collegeId,
            college,
            whatsapp_no,
            email,
            password: hashPassword,
        });

        await createdUser.save();

        res.status(201).json({
            message: "Account created successfully 🎉",
            token: generateToken(createdUser._id, createdUser.role),
            user: {
                _id: createdUser._id,
                role: createdUser.role,
                fullname: createdUser.fullname,
                collegeId: createdUser.collegeId,
                email: createdUser.email,
            },
        });
    } catch (error) {
        console.log("Error in signup: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ==========================================
// 2. LOGIN CONTROLLER 
// ==========================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        const isMatch = await bcryptjs.compare(password, user ? user.password : "");

        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Login hone ke baad frontend ko user ka poora data bhejenge (taaki profile me dikha sake)
        res.status(200).json({
            message: "Login successful 🎉",
            token: generateToken(user._id, user.role),
            user: {
                _id: user._id,
                role: user.role,
                fullname: user.fullname,
                collegeId: user.collegeId,
                college: user.college,
                whatsapp_no: user.whatsapp_no,
                email: user.email,
                isApproved: user.isApproved,
            },
        });
    } catch (error) {
        console.log("Error in login: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ==========================================
// 3. LOGOUT CONTROLLER
// ==========================================
export const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ==========================================
// 4. GET PROFILE CONTROLLER
// ==========================================
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ==========================================
// 5. UPDATE PROFILE CONTROLLER
// ==========================================
export const updateUserProfile = async (req, res) => {
    try {
        const { fullname, collegeId, college, whatsapp_no, email, oldPassword, newPassword } = req.body;
        
        if (!oldPassword) {
            return res.status(400).json({ message: "Current password is required to save changes" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password. Please try again." });
        }

        // Check if new email already exists (excluding current user)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use by another account" });
            }
            user.email = email;
        }

        // Check if new collegeId already exists (excluding current user)
        if (collegeId && collegeId !== user.collegeId) {
            const idExists = await User.findOne({ collegeId });
            if (idExists) {
                return res.status(400).json({ message: "College/Student ID already in use" });
            }
            user.collegeId = collegeId;
        }

        if (fullname) user.fullname = fullname;
        if (college) user.college = college;
        if (whatsapp_no) user.whatsapp_no = whatsapp_no;
        
        // Update password if new one is provided
        if (newPassword && newPassword.trim() !== "") {
            user.password = await bcryptjs.hash(newPassword, 10);
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully 🎉",
            user: {
                _id: user._id,
                role: user.role,
                fullname: user.fullname,
                collegeId: user.collegeId,
                college: user.college,
                whatsapp_no: user.whatsapp_no,
                email: user.email,
            },
        });
    } catch (error) {
        console.log("Error in updateProfile: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};