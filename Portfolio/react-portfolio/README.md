React Portfolio (Vite + React + TS + shadcn/ui)

Overview

- Glossy, modern portfolio SPA built with Vite + React + TypeScript.
- Uses Tailwind + shadcn-style UI components (Button, Card, Badge, etc.).
- Sections: Hero, About, Experience, Projects, Contact, Footer.
- Aesthetic: glassmorphism, soft gradients, subtle motion, light/dark theme toggle.

Getting Started

1) Install deps

   npm install

2) Run dev server

   npm run dev

3) Build + preview

   npm run build
   npm run preview

Customize

- Update text/components under `src/components/*` and `src/App.tsx`.
- Tailwind tokens live in `src/index.css` (`:root` hsl variables). Adjust to taste.
- Replace links (GitHub/LinkedIn/Resume) in Hero and Footer.
- Favicon: `public/favicon.svg`

Notes

- Backdrop blur requires modern browsers; graceful fallback keeps contrast.
- The contact form is a demo; wire it to a backend or use a service.
- If you prefer the official shadcn CLI, you can add it and generate components; this project includes equivalent hand-rolled shadcn-style UI primitives so no extra step is required.

