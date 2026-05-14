import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Banner() {
  const defaultImages = [
    "/new1.png",
    "/new2.png",
    "/new3.png",
    "/rit2.jpg",
    "/rit3.jpg",
  ];

  const [images, setImages] = useState(defaultImages);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get('http://localhost:4001/api/banners/all');
        if (res.data && res.data.length > 0) {
          setImages(res.data.map(b => b.imageUrl));
        }
      } catch (error) {
        console.error("Failed to fetch banners, using defaults");
      }
    };
    fetchBanners();
  }, []);

  // Interval for the slider (4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative bg-[#0f172a] text-white min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      
      {/* Subtle Background Accent (CSS Only, no images needed) */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-screen-2xl container mx-auto px-6 md:px-20 flex flex-col md:flex-row items-center gap-12 lg:gap-16">
        
        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2 space-y-8 mt-10 md:mt-0">
          <div className="inline-block border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
            <p className="text-purple-300 text-xs font-bold tracking-widest uppercase">
              Rajarambapu Institute of Technology
            </p>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
            <span className="block text-white mb-2">
              Welcome to
            </span>
            {/* Animated Text Gradient */}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              EventHub
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg leading-relaxed max-w-lg font-medium">
            Your all-in-one platform to discover technical fests, connect with peers, and track your college achievements.
          </p>

          <div className="pt-4">
            <Link to="/Event" className="inline-block group">
              <button className="relative overflow-hidden bg-white text-black px-10 py-4 rounded-2xl font-black text-lg transition-all transform group-hover:scale-105 shadow-[0_0_30px_-10px_rgba(255,255,255,0.4)]">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Events 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                {/* Button Hover Glare Effect */}
                <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent group-hover:w-[200%] transition-all duration-700 ease-out -skew-x-12 -ml-10"></div>
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT - PREMIUM SLIDER */}
        <div className="w-full md:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[600px] aspect-[4/3] md:aspect-[4/5] lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-700/50 group">
            
            {/* Images */}
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Event highlight ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                  index === current 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-105" // Slight zoom effect on change
                }`}
              />
            ))}

            {/* Dark gradient overlay so the top progress bars are always visible */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0f172a]/90 to-transparent z-10"></div>
            {/* Bottom gradient just for aesthetic depth */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0f172a]/80 to-transparent z-10"></div>

            {/* INSTAGRAM-STYLE STORY INDICATORS */}
            <div className="absolute top-6 left-6 right-6 flex gap-2 z-20">
              {images.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer" onClick={() => setCurrent(i)}>
                  <div 
                    className={`h-full bg-purple-500 rounded-full transition-all ease-linear ${
                      current === i 
                        ? "w-full duration-[4000ms]" // Fills up exactly as the image shows
                        : current > i 
                        ? "w-full duration-0" // Already passed, stay filled
                        : "w-0 duration-0" // Not reached yet, stay empty
                    }`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-8 left-8 z-20">
              <p className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-md">
                Featured Highlights
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Add this CSS inside your global CSS file (index.css) to make the text gradient move:
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      */}
    </div>
  );
}

export default Banner;