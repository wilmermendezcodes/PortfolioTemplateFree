import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen w-full text-gray-900">
      <Header />
      <main>
        <Hero />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}