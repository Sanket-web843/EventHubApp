import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    
    // Check session on load
    const user = localStorage.getItem("Users");
    if (user) setAuthUser(JSON.parse(user));

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Users");
    alert("Logged out successfully");
    setAuthUser(null);
    navigate("/");
    window.location.reload();
  };

  const navItems = (
    <>
      <li className="hover:text-purple-400 transition-colors cursor-pointer font-medium px-4"><Link to="/">Home</Link></li>
      <li className="hover:text-purple-400 transition-colors cursor-pointer font-medium px-4"><Link to="/Event">Events</Link></li>
      <li className="hover:text-purple-400 transition-colors cursor-pointer font-medium px-4"><Link to="/contact">Contact</Link></li>
      <li className="hover:text-purple-400 transition-colors cursor-pointer font-medium px-4"><Link to="/about">About</Link></li>
    </>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      sticky || isOpen ? "bg-[#0f172a]/95 backdrop-blur-md shadow-xl py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-screen-2xl container mx-auto px-6 md:px-20 flex justify-between items-center text-white">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer z-50">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg">
              <span className="font-black text-xl italic">EH</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight ml-2">EventHub</h1>
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center flex-grow justify-center">
          <ul className="flex space-x-4 text-sm uppercase tracking-widest">{navItems}</ul>
        </div>

        {/* DESKTOP RIGHT: SEARCH & LOGIN */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <input type="text" placeholder="Search..." className="bg-slate-800/40 border border-gray-700 text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-purple-500 w-40 lg:w-56 transition-all focus:w-64" />
            <span className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-purple-400 transition-colors">🔍</span>
          </div>
          
          {authUser ? (
            <button onClick={handleLogout} className="bg-red-500 text-white font-bold px-6 py-2 rounded-xl hover:bg-red-600 transition-all shadow-lg active:scale-95">
              Logout
            </button>
          ) : (
            <button 
              className="bg-white text-black font-bold px-6 py-2 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-lg active:scale-95"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              Login
            </button>
          )}
        </div>

        {/* MOBILE: ANIMATED 3-LINE BUTTON */}
        <div className="md:hidden z-50">
          <button onClick={() => setIsOpen(!isOpen)} className="flex flex-col justify-center items-center w-10 h-10 relative focus:outline-none">
            <span className={`block absolute h-0.5 w-6 bg-white transform transition duration-500 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
            <span className={`block absolute h-0.5 w-6 bg-white transform transition duration-500 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block absolute h-0.5 w-6 bg-white transform transition duration-500 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
          </button>
        </div>

        {/* MOBILE OVERLAY MENU */}
        <div className={`absolute top-0 left-0 w-full h-screen bg-[#0f172a] transition-all duration-700 ease-in-out md:hidden flex flex-col items-center justify-center space-y-10 ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
          <ul className="flex flex-col items-center space-y-6 text-2xl uppercase tracking-widest" onClick={() => setIsOpen(false)}>{navItems}</ul>
          
          <div className="w-4/5 max-w-sm space-y-5">
            {/* Mobile Search - Now functional in the UI */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search events..." 
                className="w-full bg-slate-800/80 border border-gray-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-purple-500 transition-all text-lg"
              />
              <span className="absolute left-4 top-4 text-xl opacity-70">🔍</span>
            </div>
            
            {/* Toggle Login/Logout for Mobile */}
            {authUser ? (
              <button 
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-lg active:scale-95 transition-all"
              >
                Logout
              </button>
            ) : (
              <button 
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] active:scale-95 transition-all"
                onClick={() => { setIsOpen(false); document.getElementById("my_modal_3").showModal(); }}
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Moved Login outside of specific containers so it's always accessible by ID */}
      <Login />
    </nav>
  );
}

export default Navbar;