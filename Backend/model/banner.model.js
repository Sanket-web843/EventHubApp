import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: { 
      type: String, 
      required: true 
    },
    altText: { 
      type: String, 
      default: "Event Banner" 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { 
    timestamps: true 
  }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
