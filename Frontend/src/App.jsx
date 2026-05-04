import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Events from "./events/Events"; 
import Signup from "./components/Signup"; // Added Signup import

function App() {
  return (
    <div className="dark:bg-slate-900 dark:text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Event" element={<Events />} />
        <Route path="/signup" element={<Signup />} /> {/* Added Signup Route */}
      </Routes>
    </div>
  );
}

export default App;