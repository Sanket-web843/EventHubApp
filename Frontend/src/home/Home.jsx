import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Freeevents from "../components/Freeevents";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <main className="pt-20">
        <Banner />
        <Freeevents />
        <Footer />
      </main>
    </div>
  );
}

export default Home; // Only one export default at the bottom