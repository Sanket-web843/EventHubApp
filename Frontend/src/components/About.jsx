import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function About() {
  const teamHeroImage = "/modern_gradient_banner_1778609705985.png";

  return (
    <>
      <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6 font-sans">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center space-y-12">

          {/* Header Section */}
          <div className="space-y-4 max-w-3xl animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              About <span className="bg-gradient-to-r from-purple-500 to-indigo-400 text-transparent bg-clip-text">EventHub</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              We are on a mission to revolutionize how college events are organized, discovered, and experienced at Rajarambapu Institute of Technology.
            </p>
          </div>

          {/* Modernized Team Banner Area */}
          <div className="w-full relative group animate-zoomIn mt-10">
            {/* Outer Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative w-full h-[300px] md:h-[500px] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
              {/* Vibrant Abstract Background Image */}
              <img
                src={teamHeroImage}
                alt="Team EventHub"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
              />

              {/* Sleek Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="relative z-10">
                  {/* Subtle glowing ring behind text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 bg-purple-500/40 rounded-full blur-[80px] pointer-events-none"></div>

                  <h2 className="relative text-4xl md:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-xl">
                    TEAM <span className="bg-gradient-to-r from-fuchsia-400 to-indigo-400 text-transparent bg-clip-text">EVENTHUB</span>
                  </h2>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 mx-auto rounded-full mb-6 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                  <p className="text-gray-200 font-bold tracking-[0.3em] text-xs md:text-sm uppercase drop-shadow-md">
                    Empowering students to build the beyond
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features / Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left mt-8 animate-fadeIn">
            <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-gray-700/50 shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-400 text-3xl mb-8 group-hover:bg-purple-500 group-hover:text-white transition-colors">🚀</div>
              <h3 className="text-white text-2xl font-black mb-4 uppercase tracking-tight">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">To create a seamless bridge between organizers and students, ensuring no one misses out on opportunities to learn, compete, and celebrate.</p>
            </div>

            <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-gray-700/50 shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-indigo-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-400 text-3xl mb-8 group-hover:bg-indigo-500 group-hover:text-white transition-colors">🎯</div>
              <h3 className="text-white text-2xl font-black mb-4 uppercase tracking-tight">For Students</h3>
              <p className="text-gray-400 leading-relaxed">Discover technical fests, cultural nights, and hackathons all in one place. Register with a single click and track your achievements effortlessly.</p>
            </div>

            <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-gray-700/50 shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-cyan-400 text-3xl mb-8 group-hover:bg-cyan-500 group-hover:text-white transition-colors">⚙️</div>
              <h3 className="text-white text-2xl font-black mb-4 uppercase tracking-tight">For Organizers</h3>
              <p className="text-gray-400 leading-relaxed">Manage registrations, track attendance, and broadcast updates without the chaos of spreadsheets and endless WhatsApp groups.</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-12 animate-fadeIn">
            <Link to="/Event">
              <button className="bg-white text-black hover:bg-purple-600 hover:text-white px-12 py-5 rounded-2xl font-black text-xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl uppercase tracking-widest">
                Explore Events 🚀
              </button>
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;