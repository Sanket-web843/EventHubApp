import React, { useEffect, useState } from "react";
import Card from "./Card";

function Freeevents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/list.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Filter for Free events (Price = 0)
  const freeEvents = events.filter(item => item && item.price === 0);

  return (
    <div className="bg-[#0f172a] py-20 px-6 md:px-20 overflow-hidden">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="font-black text-4xl md:text-5xl text-white mb-3 tracking-tight">
          Featured <span className="text-purple-500">Free</span> Events
        </h1>
        <div className="h-1.5 w-24 bg-purple-600 rounded-full mb-4"></div>
        <p className="text-gray-400 text-lg max-w-2xl font-medium">
          Limited-time opportunities to learn and compete. Secure your spot before the timer runs out!
        </p>
      </div>

      {/* HORIZONTAL SCROLL AREA */}
      <div
        className="flex items-stretch overflow-x-auto gap-8 pb-12 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {freeEvents.length === 0 ? (
          <div className="py-10 text-gray-500 italic">No free events scheduled currently.</div>
        ) : (
          freeEvents.map((item) => (
            <div key={item.id} className="min-w-[85%] md:min-w-[380px] snap-start flex">
               <Card item={item} />
            </div>
          ))
        )}
      </div>

      {/* SWIPE INDICATOR */}
      <div className="flex items-center justify-center gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2 md:hidden">
        <span className="w-10 h-[1px] bg-gray-800"></span>
        Swipe to Explore
        <span className="w-10 h-[1px] bg-gray-800"></span>
      </div>
    </div>
  );
}

export default Freeevents;