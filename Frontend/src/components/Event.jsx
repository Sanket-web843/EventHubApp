import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "./Card";
import axios from "axios";

function Event() {
  const [events, setEvents] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    axios.get("http://localhost:4001/api/events/all")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Filter events based on search query (Name, Category, or Organizer)
  const filteredEvents = events.filter((e) => {
    if (!searchParam) return true;
    const title = e.title?.toLowerCase() || "";
    const category = e.category?.toLowerCase() || "";
    const organizer = e.organizer?.toLowerCase() || "";

    return (
      title.includes(searchParam) ||
      category.includes(searchParam) ||
      organizer.includes(searchParam)
    );
  });

  // Further split for display logic
  const freeEvents = filteredEvents.filter((e) => e.price === 0);
  const paidEvents = filteredEvents.filter((e) => e.price > 0);

  return (
    <div className="bg-[#0f172a] min-h-screen py-16 px-6 md:px-20">
      {searchParam && (
        <div className="mb-12">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Search Results For:</p>
          <h3 className="text-3xl font-black text-white uppercase italic">"{searchParam}"</h3>
          <button
            onClick={() => window.history.pushState({}, '', '/Event')}
            className="text-purple-400 text-xs font-bold hover:underline mt-2"
          >
            Clear Search
          </button>
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">🔍</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">No Events Found</h2>
          <p className="text-gray-500 mt-2 font-bold">Try searching for something else or browse all events.</p>
        </div>
      ) : (
        <>
          {/* SECTION 1: FREE EVENTS */}
          {freeEvents.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  Free <span className="text-purple-500">Access</span>
                </h2>
                <div className="h-[2px] flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {freeEvents.map((item) => (
                  <Card key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: PAID EVENTS */}
          {paidEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  Premium <span className="text-indigo-500">Experiences</span>
                </h2>
                <div className="h-[2px] flex-grow bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {paidEvents.map((item) => (
                  <Card key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Event;