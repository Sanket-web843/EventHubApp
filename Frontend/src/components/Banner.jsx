import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Added for navigation

function Banner() {
  const images = [
    "/new1.png",
    "/new2.png",
    "/new3.png",
    "/rit2.jpg",
    "/rit3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // Slightly slower for a more professional feel
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="bg-[#0f172a] text-white">
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-6 flex flex-col md:flex-row items-center pt-28 pb-20">
        
        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            <span className="text-gray-400 text-xl md:text-2xl font-bold block mb-2 uppercase tracking-widest">
              Welcome to
            </span>
            <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 text-transparent bg-clip-text">
              RIT's EventHub
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
            Discover events, connect with people, and add a new achievement in your progress with us.
          </p>

          <div className="flex gap-4 pt-4">
            {/* Added Link to your specific button layout */}
            <Link to="/Event">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20">
                Explore Events
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT - SLIDER */}
        <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0">
          <div className="relative w-full max-w-lg h-[300px] md:h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="event"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}

            {/* Gradient Overlay for the Slider */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60"></div>

            {/* Indicators */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    current === i ? "w-8 bg-purple-500" : "w-2 bg-gray-500 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Banner;