import React, { useEffect, useState } from "react";
import Card from "./Card";

function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/list.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Filtering events based on price
  const freeEvents = events.filter((e) => e.price === 0);
  const paidEvents = events.filter((e) => e.price > 0);

  return (
    <div className="bg-[#0f172a] min-h-screen py-16 px-6 md:px-20">
      {/* SECTION 1: FREE EVENTS */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Free <span className="text-purple-500">Access</span>
          </h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {freeEvents.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* SECTION 2: PAID EVENTS */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Premium <span className="text-indigo-500">Experiences</span>
          </h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {paidEvents.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Event;