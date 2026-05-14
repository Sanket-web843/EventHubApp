import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="bg-[#0f172a] text-gray-300 relative border-t border-gray-800">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <footer className="flex flex-col items-center gap-8 py-12 px-6 max-w-screen-xl mx-auto">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <span className="font-black text-2xl italic text-white leading-none">EH</span>
          </div>
          <p className="font-black text-2xl text-white tracking-tight">
            RIT <span className="text-purple-500">EventHub</span>
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <Link to="/Event" className="hover:text-purple-400 transition-colors">Events</Link>
          <Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
        </nav>

        {/* SOCIAL ICONS (RIT OFFICIAL LINKS) */}
        <nav className="flex gap-5">
          {/* RIT Official Website */}
          <a href="https://www.ritindia.edu/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#1e293b] rounded-xl border border-gray-700 flex items-center justify-center hover:border-purple-500 hover:text-purple-400 transition-all hover:-translate-y-1 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </a>
          
          {/* RIT LinkedIn */}
          <a href="https://in.linkedin.com/school/rajarambapu-institute-of-technology-rajaramnagar/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#1e293b] rounded-xl border border-gray-700 flex items-center justify-center hover:border-purple-500 hover:text-purple-400 transition-all hover:-translate-y-1 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          {/* RIT Instagram */}
          <a href="https://www.instagram.com/ritindia/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#1e293b] rounded-xl border border-gray-700 flex items-center justify-center hover:border-purple-500 hover:text-purple-400 transition-all hover:-translate-y-1 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </nav>

        {/* COPYRIGHT & CREDITS */}
        <aside className="text-center mt-2 space-y-1.5">
          <p className="text-gray-500 text-sm">
            Copyright © {new Date().getFullYear()} - All rights reserved by RIT EventHub.
          </p>
          <p className="text-gray-400 text-sm font-medium tracking-wide">
            Designed by <span className="text-purple-400 font-bold">Sanket Pawar</span> from MCA
          </p>
        </aside>

      </footer>
    </div>
  );
}