import React from 'react'
import Navbar from '../components/Navbar'
import Event from '../components/Event'
import Footer from '../components/Footer'

// 1. Removed 'export default' from here
// 2. Renamed 'Courses' to 'Events' for consistency
function Events() {
  return (
    <>
      {/* Added padding-top so the Navbar doesn't cover your events */}
      <div className="pt-20"> 
        <Event/>
      </div>
      <Footer />
    </>
  );
}

// 3. Keep only this single default export
export default Events;
