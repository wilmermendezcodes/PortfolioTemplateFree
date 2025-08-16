import React from "react";

export default function About() {
  return (
    <section id="about" className="w-full">
      <div className="section-container py-16 sm:py-20">
        <div className="pixel-border rounded-xl bg-white p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold text-green-900">About</h2>
          <p className="mt-4 text-gray-700">
            I am Wilmer, a full‑stack developer who loves building experiences that feel
            inviting and intuitive. I gravitate toward component‑driven design,
            strong typing, and performance that quietly does the right thing.
          </p>
          <p className="mt-4 text-gray-700">
            My career goal is to craft products that people enjoy using every day.
            From tiny polish details to scalable architecture, I thrive where
            engineering and design meet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-green-100 text-green-900 px-3 py-1 text-sm border border-green-200">
              Accessible UIs
            </span>
            <span className="inline-flex items-center rounded-full bg-green-100 text-green-900 px-3 py-1 text-sm border border-green-200">
              Type-safe systems
            </span>
            <span className="inline-flex items-center rounded-full bg-green-100 text-green-900 px-3 py-1 text-sm border border-green-200">
              Developer Experience
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}