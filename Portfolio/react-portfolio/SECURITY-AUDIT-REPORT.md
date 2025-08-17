# Security Audit Report — react-portfolio

Date: 2025-08-17
Reviewer: Automated static review (Codex CLI)
Scope: Entire repository excluding `node_modules/`

## Summary
- No hardcoded secrets, API keys, or private keys found.
- No unsafe DOM sinks detected (no `dangerouslySetInnerHTML`, `eval`, `innerHTML` assigns, or `document.write`).
- No network calls present; app is a static portfolio with local state only.
- Telemetry utilities are opt-in, PII-redacting by default.
- Main gap: missing `.gitignore` (risk of accidentally committing secrets/artifacts in the future).
- Minor hardening opportunities: CSP compatibility for inline script, add security headers at hosting layer, form backend safeguards if added later.

## Findings

### 1) Secrets Exposure (None Found)
- Searched for patterns: `api[_-]?key`, `secret`, `password`, `token`, `client[_-]?secret`, `private key`, AWS (`AKIA…`), Google (`AIza…`), OpenAI (`sk-…`), GitHub (`ghp_…`), Slack tokens, JWT-like strings, and common provider names (Stripe, Twilio, Mapbox, Supabase, S3, Discord, Mailgun, Firebase).
- Result: No matches beyond documentation text in `docs/` (policy statements, not real secrets).
- No `.env*` files committed. No secrets in `package.json` scripts or configs.

### 2) Insecure React/DOM Patterns (None Found)
- No `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write`, or raw `innerHTML =` usage.
- No untrusted HTML rendering. Components use safe JSX and typed inputs.

### 3) Storage & State
- `localStorage` used only to persist `theme` preference in `src/App.tsx` and `index.html` bootstrap. Safe as it stores non-sensitive data. If XSS were introduced later, values in localStorage are readable—keep it for non-sensitive data only.

### 4) Network Surface
- No `fetch`, `axios`, `XMLHttpRequest`, or WebSockets. No CORS/CSRF exposure in current codebase.

### 5) Build/Dev Config
- `vite.config.ts` is minimal and reasonable. Dev/preview port is fixed to `5173`. No `host: true` exposure.
- `tsconfig.json` is strict; `skipLibCheck` enabled (DX choice, not a security concern).

### 6) Telemetry Utilities (Opt-in)
- `src/ai/telemetry.js` redacts PII and is disabled by default (`REACT_APP_AI_TELEMETRY_ENABLED=false`). Logs via `console.debug` only when enabled and sampled. No network egress in this helper.

### 7) Repo Hygiene
- No `.gitignore` present. Risk: future commits could accidentally include `dist/`, local `.env`, logs, etc.

## Potential Risks (Low Severity)
- Inline script in `index.html` (theme bootstrap) will not work with a strict CSP unless you add a nonce/hash or externalize the script.
- `mailto:` link in `Contact.tsx` can attract spam (not a vulnerability, a nuisance).

## Recommendations

### A) Prevent Secret/Artifact Commits
- Add a `.gitignore` with at minimum:
  - `node_modules/`, `dist/`, `.env`, `.env.*`, `*.local`, `*.log`, `.DS_Store`.
- Consider enabling repository secret scanning (e.g., GitHub Advanced Security) or a CI job with `gitleaks`/`trufflehog`.

### B) Security Headers at Host/CDN
- Content-Security-Policy (strict example):
  - `default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'self';`.
  - For scripts, prefer external file + `script-src 'self'` (avoid `'unsafe-inline'`). If keeping inline, use a nonce or hash.
- HSTS: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- Other headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy` (restrict features), `Cross-Origin-Opener-Policy: same-origin`.

### C) CSP-Friendly Theme Init
- Move the inline theme script from `index.html` to a small external module (e.g., `src/theme-init.ts`) that Vite bundles, and include it with `defer`. This enables a strict CSP without `'unsafe-inline'`.

### D) Future Backend/Form Integration
- If you wire the contact form to a backend, implement input validation, server-side sanitization, CSRF protection (if session-based), rate limiting, and bot protection (e.g., Turnstile/hCaptcha).

### E) Dependency Hygiene
- In CI, run `npm audit --production --audit-level=high` and monitor with Dependabot/Renovate. Lockfile should be respected in CI builds.

## Methodology
- Pattern scan via recursive grep on all tracked files (excluding `node_modules/`).
- Checked for: secret patterns, unsafe DOM/JS patterns, link security attributes, storage usage, network calls, and config pitfalls.
- Manual review of key files: `index.html`, `vite.config.ts`, `src/App.tsx`, `src/components/*`, `src/ai/*`, `tailwind.config.js`, `tsconfig.json`, `README.md`, `SECURITY.md`.

## Notes
- No changes were made to application code during this audit.
- Network-restricted environment prevented running `npm audit`; add it to CI for full coverage.

---
If you want, I can:
- Add a `.gitignore` with safe defaults.
- Externalize the theme bootstrap to enable a strict CSP.
- Provide example `_headers` (Netlify) or `vercel.json` with security headers.
- Wire up a CI secret scan (`gitleaks`) and dependency audit.

