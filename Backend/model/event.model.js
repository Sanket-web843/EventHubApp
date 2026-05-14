import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventId: { 
      type: Number, 
      required: true, 
      unique: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    organizer: { 
      type: String, 
      required: true 
    },
    organizer_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    mobile_no: { 
      type: String, 
      required: true 
    },
    venue: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    category: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      default: "/placeholder.png" 
    },
    media_link: { 
      type: String, 
      default: "" 
    },
    start_date: { 
      type: String, 
      required: true 
    },
    start_time: { 
      type: String, 
      required: true 
    },
    deadline: { 
      type: Date, 
      required: true 
    },
  
    joined_count: { 
      type: Number, 
      default: 0 
    }
  },
  {
   
    timestamps: true 
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;