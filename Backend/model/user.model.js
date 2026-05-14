import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            // Dropdown options (Student ya Organizer ya Admin)
            enum: ["Student", "Organizer", "Admin"],
            default: "Student"
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        fullname: {
            type: String,
            required: true,
        },
        collegeId: {
            type: String, // Student ID ya Employee ID ke liye
            required: true,
            unique: true, // Ek ID se ek hi account banega
        },
        college: {
            type: String,
            required: true,
        },
        whatsapp_no: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true // Account kab create hua uska time save karega
    }
);

const User = mongoose.model("User", userSchema);
export default User;