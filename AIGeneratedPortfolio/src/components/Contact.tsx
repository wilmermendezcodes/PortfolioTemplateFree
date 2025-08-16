import React from "react";
import { Button } from "./ui/button";

export default function Contact() {
  return (
    <section id="contact" className="w-full">
      <div className="section-container py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900">Get in touch</h2>
          <p className="mt-3 text-gray-700">
            Have a project in mind or just want to say hello? I am always open to discussing
            new ideas, collaborations, and opportunities.
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          <div className="pixel-border rounded-xl bg-white p-6">
            <h3 className="text-xl font-semibold text-green-900">Email</h3>
            <p className="mt-2 text-gray-700">Reach me directly via email.</p>
            <a
              href="mailto:hi@wilmer.dev"
              className="mt-4 inline-flex text-green-800 hover:text-green-900 underline underline-offset-4"
            >
              hi@wilmer.dev
            </a>
          </div>

          <div className="pixel-border rounded-xl bg-white p-6">
            <h3 className="text-xl font-semibold text-green-900">Social</h3>
            <p className="mt-2 text-gray-700">Find my work and connect.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://github.com/wilmer"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline">GitHub</Button>
              </a>
              <a
                href="https://www.linkedin.com/in/wilmer"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline">LinkedIn</Button>
              </a>
              <a
                href="#hero"
              >
                <Button variant="secondary">Back to top</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}