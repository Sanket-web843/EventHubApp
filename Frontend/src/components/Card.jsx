import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Card({ item, className = "" }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [joinedCount, setJoinedCount] = useState(item.joined_count || 0);
  const [hasRegistered, setHasRegistered] = useState(false);

  // MODAL STATES
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");

  const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";
  const isFree = item.price === 0;

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

  // INITIAL CLICK HANDLER
  const handleRegisterClick = () => {
    const user = sessionStorage.getItem("Users");
    if (!user) {
      toast.error("Access Denied: Please log in first.");
      const modal = document.getElementById("my_modal_3");
      if (modal) modal.showModal();
      return;
    }

    if (!isFree) {
      // Open Payment Modal instead of direct registration
      setShowPaymentModal(true);
    } else {
      // Open Confirmation Modal for free events
      setShowConfirmModal(true);
    }
  };

  const handleConfirmRegistration = () => {
    setShowConfirmModal(false);
    finalizeRegistration();
  };

  // PAYMENT PROCESSING SIMULATION
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network request delay (2 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      setUpiId(""); // Clear input
      finalizeRegistration();
    }, 2000);
  };

  // FINAL REGISTRATION UPDATE
  const finalizeRegistration = async () => {
    if (!hasRegistered) {
      try {
        const token = sessionStorage.getItem("token");
        
        await axios.post(
          `http://localhost:4001/api/registrations/event/${item._id}/join`,
          { paymentStatus: isFree ? "Free" : "Paid" },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setJoinedCount((prev) => prev + 1);
        setHasRegistered(true);
        toast.success(`Successfully registered for ${item.title}!`);
      } catch (error) {
        console.error("Registration error:", error);
        const errorMessage = error.response?.data?.message || "Failed to register for the event";
        
        if (error.response && error.response.status === 401) {
          toast.error("Please log in first to register.");
        } else {
          toast.error(errorMessage);
        }
      }
    }
  };

  const mobile = item.mobile_no || item.mobile;
  const media = item.media_link || item.mediaLink;

  return (
    <>
      <div className={`bg-[#1e293b] border border-gray-700/50 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_-15px_rgba(168,85,247,0.4)] group h-[720px] w-full shrink-0 relative ${className}`}>
        
        {/* IMAGE & TIMER OVERLAY */}
        <div className="relative h-52 shrink-0 overflow-hidden bg-slate-800 flex items-center justify-center">
          <img
            src={item.image || PLACEHOLDER_IMAGE}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
          />
          
          <div className={`absolute top-4 left-4 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-lg shadow-lg z-10 ${isFree ? 'bg-purple-600' : 'bg-indigo-600'}`}>
            {isFree ? "Free Access" : `₹ ${item.price}`}
          </div>

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

            <div className="mt-4 flex items-center gap-2">
              {joinedCount > 0 && (
                <div className="flex -space-x-2">
                  {[...Array(Math.min(joinedCount, 3))].map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[#1e293b] bg-slate-600"></div>
                  ))}
                </div>
              )}
              <p className="text-xs font-semibold text-gray-500">
                {joinedCount === 0 ? (
                  <span className="text-purple-400">Be the first to join!</span>
                ) : (
                  <><span className="text-white">{joinedCount}</span> {joinedCount === 1 ? 'Student' : 'Students'} Joined</>
                )}
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
                onClick={handleRegisterClick}
                disabled={isExpired || hasRegistered}
                className={`w-full font-bold py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-xl ${
                  isExpired 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                    : hasRegistered
                    ? 'bg-green-600/20 text-green-400 border border-green-500/50 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-purple-500 hover:text-white'
                }`}
              >
                {isExpired 
                  ? "Registration Closed" 
                  : hasRegistered 
                  ? "Registered ✓" 
                  : isFree 
                  ? "Register Now (Free)" 
                  : `Pay ₹${item.price} & Register`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PAYMENT OVERLAY MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/90 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-2xl w-full max-w-md relative animate-fadeIn">
            
            {/* Close Button */}
            {!isProcessing && (
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}

            <h3 className="font-black text-2xl text-white mb-2 tracking-tighter">
              Secure <span className="text-purple-500">Checkout</span>
            </h3>
            <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-gray-700">
              Complete your payment to reserve a spot for <span className="text-white font-bold">{item.title}</span>.
            </p>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Fake Amount Display */}
              <div className="bg-slate-900 rounded-2xl p-4 flex justify-between items-center border border-purple-500/30">
                <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">Total Amount</span>
                <span className="text-2xl font-black text-white">₹{item.price}</span>
              </div>

              {/* UPI Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Enter UPI ID</label>
                <input
                  type="text"
                  required
                  placeholder="sanket@ybl"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all disabled:opacity-50"
                />
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${item.price} Securely`
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 text-xs mt-6">
              🔒 Payments are safely processed via EventHub Gateway.
            </p>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/90 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-2xl w-full max-w-sm relative animate-fadeIn text-center">
            <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-purple-500/20">
               ❓
            </div>
            <h3 className="font-black text-xl text-white mb-2 uppercase tracking-tighter">
              Confirm <span className="text-purple-500">Registration</span>
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Do you want to register for <span className="text-white font-bold">{item.title}</span>?
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 border border-gray-700"
              >
                No, Cancel
              </button>
              <button 
                onClick={handleConfirmRegistration}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20"
              >
                Yes, Register
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;