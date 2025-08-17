React Portfolio (Vite + React + TS)

Modern, glossy portfolio template built with Vite, React 18, TypeScript, and Tailwind. It ships with shadcn-style UI primitives, a light/dark theme toggle, and clean sectioned layout you can customize in minutes.

Key Features

- Polished UI: glassmorphism accents, soft gradients, subtle motion.
- Sections: Hero, About, Experience, Projects, Contact, Footer.
- Theme: system-aware light/dark with persistent toggle.
- UI Primitives: Button, Card, Badge, Input, Label, Textarea, Separator.
- Fast DX: Vite + TypeScript + Tailwind with CSS variables for theming.

Requirements

- Node 18+ and npm 9+ (recommended).

Quick Start

- Install: `npm install`
- Develop: `npm run dev` (opens on `http://localhost:5173`)
- Build: `npm run build` (outputs to `dist`)
- Preview build: `npm run preview`

Scripts

- `npm run dev`: Starts Vite dev server with HMR.
- `npm run build`: Builds a production bundle to `dist`.
- `npm run preview`: Serves the built bundle locally for verification.

Project Structure

- `index.html`: Root HTML, sets initial theme class before React mounts.
- `src/main.tsx`: React entry; mounts `<App />` and loads styles.
- `src/App.tsx`: Assembles sections and manages theme toggle state.
- `src/components/`: Page sections and UI primitives.
  - `Navbar.tsx`, `Hero.tsx`, `About.tsx`, `Experience.tsx`, `Projects.tsx`, `Contact.tsx`, `Footer.tsx`
  - `ui/`: Reusable primitives (Button, Card, Badge, Input, Label, Textarea, Separator)
- `src/index.css`: Tailwind directives + design tokens (CSS variables) and utility classes.
- `src/lib/utils.ts`: `cn(...)` helper (clsx + tailwind-merge).
- `tailwind.config.js`: Tailwind config and color mappings to CSS variables.
- `postcss.config.js`: PostCSS + Autoprefixer.
- `vite.config.ts`: Vite config (port, JSX runtime).
- `public/`: Static assets (e.g., `favicon.svg`).

Customize Content

- Branding: Update text and links in `Navbar.tsx`, `Hero.tsx`, and `Footer.tsx`.
- About: Edit bio and skills list in `About.tsx`.
- Experience: Update the `timeline` array in `Experience.tsx`.
- Projects: Edit the `projects` array in `Projects.tsx` (title, description, tags, link).
- Contact: Adjust email target in `Contact.tsx` (`mailto:` link) or wire the form to your backend.
- Favicon: Replace `public/favicon.svg`.
- Metadata: Edit title/description in `index.html`.

Theming

- Design tokens live in `src/index.css` under `:root` (dark) and `.light` (light) scopes.
- Tailwind colors map to these tokens in `tailwind.config.js` (e.g., `bg-background`, `text-foreground`, `bg-primary`).
- The theme toggle stores the selection in `localStorage('theme')` and toggles `document.documentElement` classes (`dark`/`light`).

UI Primitives (shadcn-style)

- Location: `src/components/ui/*`
- Usage: Import and compose like standard shadcn components; variants are implemented via `class-variance-authority` and merged with `tailwind-merge`.
- Examples:
  - Button: `import { Button } from './components/ui/button'`
  - Card: `import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'`
  - Badge: `import { Badge } from './components/ui/badge'`

Deploy

- Vercel / Netlify
  - Build command: `npm run build`
  - Output directory: `dist`
  - Framework preset: Vite (or detect automatically)
- GitHub Pages (static)
  - Option A: Deploy `dist` to `gh-pages` branch (e.g., `git subtree` or an action).
  - Option B: Use a GitHub Action for Vite deploy. If deploying under a subpath (e.g., `/username.github.io/repo/`), set `base` in `vite.config.ts` accordingly.

Accessibility & Performance

- Color tokens target good contrast; tweak in `src/index.css` as needed.
- `index.html` sets the theme class pre-hydration to avoid flash of incorrect theme.
- Components prefer semantic HTML and keyboard-friendly defaults.

Troubleshooting

- Tailwind classes not applying: Ensure files are matched by `content` in `tailwind.config.js`.
- Wrong theme on first load: Clear `localStorage['theme']` or verify the theme script in `index.html`.
- Dev server port in use: Change `server.port` in `vite.config.ts`.

Security & Policies

- See `SECURITY.md` for reporting and handling guidance.
- See `docs/` for Responsible AI and related templates (if applicable to your usage).

License

- Currently unlicensed (all rights reserved by default).

