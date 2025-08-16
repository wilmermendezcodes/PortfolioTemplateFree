import React, { useState } from "react";
import { Button } from "./ui/button";
import { PixelIcon } from "./PixelIcon";

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#hero", label: "Home" },
    { href: "#skills", label: "Skills" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-green-200">
      <div className="section-container flex items-center justify-between py-3">
        <a href="#hero" className="flex items-center gap-3 group">
          <PixelIcon label="W" />
          <div>
            <div className="text-green-900 font-semibold leading-none group-hover:text-green-800 transition-colors">
              Wilmer
            </div>
            <div className="text-xs text-green-700">Full‑stack Developer</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-green-900 hover:text-green-700 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact">
            <Button size="sm" className="ml-2">Get in touch</Button>
          </a>
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-green-200 bg-white text-green-800 hover:bg-green-50 transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-green-200 bg-white/90 backdrop-blur-sm">
          <div className="section-container py-3 flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-green-900 hover:text-green-700 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)}>
              <Button className="w-full">Get in touch</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}