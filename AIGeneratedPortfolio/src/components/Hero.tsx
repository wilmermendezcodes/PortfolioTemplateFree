import React from "react";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section id="hero" className="w-full">
      <div className="section-container py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs text-green-800 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              Available for new opportunities
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 leading-tight">
              Write code. Grow cozy experiences.
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              I am Wilmer — a full‑stack developer crafting warm, playful, and performant web apps.
              I blend game‑inspired UI touches with modern engineering to deliver delightful products.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#contact">
                <Button size="lg">Contact me</Button>
              </a>
              <a
                href="https://github.com/wilmer"
                target="_blank"
                rel="noreferrer"
              >
                <Button size="lg" variant="outline">View GitHub</Button>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="pixel-border rounded-xl bg-white/90 p-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[
                  "React",
                  "TypeScript",
                  "Node",
                  "MySQL",
                  "Express",
                  "Supabase",
                  "Git",
                  "Vercel",
                  "Docker",
                  "Drizzle",
                  "REST",
                  "UI/UX",
                ].map((t) => (
                  <div
                    key={t}
                    className="h-24 rounded-lg border-2 border-green-800 bg-green-100 flex items-center justify-center text-green-900 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                    aria-label={t}
                    title={t}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                A toolkit that feels like home: modern web, strong DX, and a cozy finish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}