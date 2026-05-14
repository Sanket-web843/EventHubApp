import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Events from "./events/Events";
import Signup from "./components/Signup";
import Contact from "./components/Contact"; // Imported Contact
import About from "./components/About";     // Imported About
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import OrganizerDashboard from "./components/OrganizerDashboard";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="dark:bg-slate-900 dark:text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Event" element={<Events />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} /> {/* Contact Route */}
        <Route path="/about" element={<About />} />     {/* About Route */}
        <Route path="/organizer/dashboard" element={
          <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;