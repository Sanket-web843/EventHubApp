import React, { useState, useEffect } from "react";

function Card({ item, className = "" }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";

  // TIMER LOGIC
  useEffect(() => {
    if (!item.deadline) return;

    const calculateTimeLeft = () => {
      const targetDate = new Date(item.deadline).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("REGISTRATION CLOSED");
        setIsExpired(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [item.deadline]);

  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_IMAGE) e.target.src = PLACEHOLDER_IMAGE;
  };

  const isFree = item.price === 0;
  const mobile = item.mobile_no || item.mobile;
  const media = item.media_link || item.mediaLink;

  return (
    <div className={`bg-[#1e293b] border border-gray-700/50 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_-15px_rgba(168,85,247,0.4)] group cursor-pointer h-[720px] w-full shrink-0 ${className}`}>
      
      {/* IMAGE & TIMER OVERLAY */}
      <div className="relative h-52 shrink-0 overflow-hidden bg-slate-800 flex items-center justify-center">
        <img
          src={item.image || PLACEHOLDER_IMAGE}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
        />
        
        {/* PRICE BADGE */}
        <div className={`absolute top-4 left-4 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-lg shadow-lg z-10 ${isFree ? 'bg-purple-600' : 'bg-indigo-600'}`}>
          {isFree ? "Free Access" : `₹ ${item.price}`}
        </div>

        {/* DEADLINE TIMER BADGE */}
        {item.deadline && (
          <div className={`absolute bottom-4 left-4 right-4 backdrop-blur-md border px-3 py-2 rounded-xl text-center z-10 transition-colors ${isExpired ? 'bg-red-500/20 border-red-500/50' : 'bg-black/40 border-white/10'}`}>
            <p className="text-[9px] uppercase tracking-widest text-gray-300 font-bold mb-0.5">Registration Ends In</p>
            <p className={`text-sm font-mono font-bold ${isExpired ? 'text-red-400' : 'text-white'}`}>
               {timeLeft}
            </p>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent opacity-60"></div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h2 className="font-bold text-xl text-white group-hover:text-purple-400 transition-colors line-clamp-1 uppercase">
              {item.title}
            </h2>
            <span className="shrink-0 text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md border border-slate-600 uppercase font-bold">
              {item.category}
            </span>
          </div>

          {/* EVENT SCHEDULE ROW */}
          <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-purple-400/90 tracking-wide uppercase">
            <div className="flex items-center gap-1.5">
              <span>📅</span> {item.start_date}
            </div>
            <div className="flex items-center gap-1.5">
              <span>🕒</span> {item.start_time}
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-4 line-clamp-3 leading-relaxed">
            {item.description}
          </p>

          {/* PARTICIPANT COUNT HYPE */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-[#1e293b] bg-slate-600"></div>)}
            </div>
            <p className="text-xs font-semibold text-gray-500">
              <span className="text-white">{item.joined_count}+</span> Students Joined
            </p>
          </div>
        </div>

        {/* BOTTOM METADATA & ACTIONS */}
        <div className="mt-auto">
          <div className="pt-6 border-t border-gray-700/50 space-y-3 text-sm text-gray-300 mb-6">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-slate-700/50 rounded-lg text-xs">📍</span>
              <span className="truncate">{item.venue}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="p-2 bg-slate-700/50 rounded-lg text-xs">👤</span>
              <span className="text-gray-400">{item.organizer}</span>
            </div>
            {mobile && (
              <div className="flex items-center gap-3">
                <span className="p-2 bg-slate-700/50 rounded-lg text-xs">📞</span>
                <a href={`tel:${mobile}`} className="text-purple-400 font-semibold hover:underline">{mobile}</a>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {media && (
              <a href={media} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-wider text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 transition-all duration-300">
                🎥 Watch Highlights
              </a>
            )}
            <button 
              disabled={isExpired}
              className={`w-full font-bold py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-xl ${
                isExpired 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                : 'bg-white text-black hover:bg-purple-500 hover:text-white'
              }`}
            >
              {isExpired ? "Registration Closed" : isFree ? "Register Now (Free)" : "Pay & Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;