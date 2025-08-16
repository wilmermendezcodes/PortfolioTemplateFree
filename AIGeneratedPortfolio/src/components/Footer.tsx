import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-green-200 bg-white/70 backdrop-blur">
      <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Wilmer. Built with React, TypeScript, and Tailwind.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <a href="#about" className="text-green-800 hover:text-green-900 transition-colors">About</a>
          <a href="#skills" className="text-green-800 hover:text-green-900 transition-colors">Skills</a>
          <a href="#contact" className="text-green-800 hover:text-green-900 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}