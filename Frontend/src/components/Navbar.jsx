import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./Login"; 

// Simple SVG Icons
const Icon = ({ name }) => {
  const baseClasses = "w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity";
  switch (name) {
    case "Home":
      return (
        <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "Events":
      return (
        <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "Contact":
      return (
        <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "About":
      return (
        <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "Dashboard":
      return (
        <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    default:
      return null;
  }
};

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
    ? "bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 shadow-xl" 
    : "bg-[#0f172a]/80 backdrop-blur-sm lg:bg-transparent py-2 lg:py-5";

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
        <li key={item.name} className="relative group px-1 xl:px-3">
          <Link
            to={item.path}
            onClick={() => setIsOpen(false)}
            className="flex items-center text-[15px] font-medium text-gray-300 transition-colors group-hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
          >
            <Icon name={item.name} />
            {item.name}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${navBgClass} ${!sticky && !isAuthPage && !isDashboardPage ? 'py-4' : 'py-3'}`}>
        <div className="max-w-[1400px] container mx-auto px-6 flex justify-between items-center text-white relative">

          {/* LOGO - Stays above mobile menu */}
          <div className="flex items-center relative z-[100]">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center group">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg transition-transform group-active:scale-95">
                <span className="font-black text-xl italic text-white leading-none">EH</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight ml-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">EventHub</h1>
            </Link>
          </div>

          {/* DESKTOP NAV (Hidden on Tablets and Mobile) */}
          <div className="hidden lg:flex items-center flex-grow justify-center">
            <ul className="flex items-center space-x-1">{navItems}</ul>
          </div>

          <div className="hidden lg:flex items-center gap-5">
            {/* SEARCH BAR */}
            <div className="relative group hidden lg:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-[#1e293b]/80 border border-gray-700 text-sm text-gray-200 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:border-purple-500/50 focus:bg-[#1e293b] focus:ring-1 focus:ring-purple-500/50 w-48 xl:w-64 transition-all shadow-inner" 
              />
            </div>

            {authUser ? (
              <div className="flex items-center gap-4">
                {/* ACCOUNT SECTION */}
                <Link to="/profile" className="flex items-center gap-3 group/profile transition-all px-2 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-md border border-white/10 group-hover/profile:scale-105 transition-transform">
                    {authUser.fullname?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col items-start hidden sm:flex">
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider leading-none mb-1">{authUser.role}</span>
                    <span className="text-sm font-semibold text-white leading-tight capitalize">{authUser.fullname || 'User'}</span>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-full transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <button
                className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg transition-all active:scale-95"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE BURGER TOGGLE */}
          <div className="lg:hidden relative z-[100]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* CLEAN MOBILE OVERLAY MENU */}
      <div className={`fixed inset-0 z-[90] bg-[#0f172a]/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full pt-24 pb-8 px-6 overflow-y-auto">
          
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Search */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-[#1e293b] border border-gray-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-[15px]" 
              />
            </div>

            {/* Mobile Nav Links */}
            <ul className="flex flex-col space-y-2 mb-8">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center text-lg font-medium text-gray-300 py-3 px-4 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Icon name={item.name} />
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-px bg-gray-800 w-full mb-8"></div>

            {/* Mobile Account / Auth */}
            {authUser ? (
              <div className="space-y-4">
                <Link 
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between bg-[#1e293b] border border-gray-700 text-white p-4 rounded-xl active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xl shadow-md">
                      {authUser.fullname?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-purple-400 font-bold uppercase tracking-wider leading-none mb-1">{authUser.role}</span>
                      <span className="font-semibold text-white capitalize">{authUser.fullname || 'User'}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3.5 rounded-xl font-semibold transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-transform"
                onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }}
              >
                Sign In / Join Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Login isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

export default Navbar;