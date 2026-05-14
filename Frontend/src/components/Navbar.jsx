import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./Login"; 

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 10);
    
    const syncAuth = () => {
      const user = sessionStorage.getItem("Users");
      if (user) {
        setAuthUser(JSON.parse(user));
      } else {
        setAuthUser(null);
      }
    };

    syncAuth(); // Initial check

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check for login query param to open modal automatically
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("login") === "true") {
      setIsLoginModalOpen(true);
      // Remove query param without reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDashboardPage = location.pathname.includes("/dashboard");

  // Update nav background based on scroll or page type
  const navBgClass = (sticky || isAuthPage || isDashboardPage) 
    ? "bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5 py-3 shadow-xl" 
    : "bg-transparent py-5";

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleLogout = () => {
    sessionStorage.removeItem("Users");
    sessionStorage.removeItem("token");
    alert("Logged out successfully");
    setAuthUser(null);
    setIsOpen(false);
    navigate("/");
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setIsOpen(false);
      navigate(`/Event?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear after search
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/Event" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  if (authUser && (authUser.role === "Organizer" || authUser.role === "Admin")) {
    navLinks.push({ name: "Dashboard", path: "/organizer/dashboard" });
  }

  const navItems = (
    <>
      {navLinks.map((item) => (
        <li key={item.name} className="relative group px-2 lg:px-4">
          <Link
            to={item.path}
            onClick={() => setIsOpen(false)}
            className="font-bold text-sm tracking-widest uppercase text-gray-200 transition-colors group-hover:text-purple-400 block py-2"
          >
            {item.name}
            <span className="absolute bottom-0 left-4 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-2/3 hidden md:block"></span>
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${navBgClass}`}>
        <div className="max-w-screen-2xl container mx-auto px-6 flex justify-between items-center text-white relative">

          {/* LOGO - Stays above mobile menu */}
          <div className="flex items-center relative z-[100]">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center group">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform active:scale-95">
                <span className="font-black text-xl italic text-white leading-none">EH</span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter ml-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">EventHub</h1>
            </Link>
          </div>

          {/* DESKTOP NAV (Hidden on Tablets and Mobile) */}
          <div className="hidden lg:flex items-center flex-grow justify-center">
            <ul className="flex items-center">{navItems}</ul>
          </div>

          <div className="hidden lg:flex items-center gap-4 lg:gap-6">
            <div className="relative group hidden lg:block">
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-white/5 border border-white/10 text-sm pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-40 xl:w-64 transition-all focus:w-72" 
              />
              <span className="absolute left-3 top-2.5 opacity-50">🔍</span>
            </div>

            {authUser ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 group/profile transition-all">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black shadow-lg border border-white/20 group-hover/profile:scale-110 transition-transform">
                    {authUser.fullname?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Account</span>
                    <span className="text-xs font-bold text-white group-hover/profile:text-purple-400 transition-colors uppercase">Your Profile</span>
                  </div>
                </Link>
                <button onClick={handleLogout} className="bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-6 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-95 ml-2">Logout</button>
              </div>
            ) : (
              <button
                className="bg-white text-black font-black px-8 py-2.5 rounded-full hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                onClick={() => setIsLoginModalOpen(true)}
              >
                LOGIN
              </button>
            )}
          </div>

          {/* MOBILE BURGER TOGGLE - High Z-index to stay clickable */}
          <div className="lg:hidden relative z-[100]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-[#1e293b] rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 active:scale-95 transition-transform"
              aria-label="Toggle Menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between relative">
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE OVERLAY MENU - Moved Outside <nav> to fix backdrop-blur clipping issue */}
      <div className={`fixed inset-0 z-[90] bg-[#0f172a] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col pt-24 pb-8 px-6 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <ul className="flex flex-col space-y-6 text-2xl font-black uppercase tracking-widest text-center mt-10">
          {navItems}
        </ul>

        <div className="mt-auto pt-10 space-y-4 w-full max-w-sm mx-auto">
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-slate-800/80 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-purple-500 text-lg" 
            />
            <span className="absolute left-4 top-4 text-xl opacity-50">🔍</span>
          </div>

          {authUser ? (
            <div className="space-y-4 w-full">
              <button 
                onClick={() => { setIsOpen(false); navigate("/profile"); }}
                className="w-full bg-slate-800 border border-gray-700 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform"
              >
                👤 YOUR PROFILE
              </button>
              <button onClick={handleLogout} className="w-full bg-red-500/20 border border-red-500/50 text-red-400 py-4 rounded-2xl font-black active:scale-95 transition-transform">LOGOUT</button>
            </div>
          ) : (
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-transform"
              onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }}
            >
              JOIN EVENTHUB
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Login isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

export default Navbar;