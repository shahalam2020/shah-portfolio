# Shah Alam — 3D Full Stack Portfolio

React + Vite + Tailwind + Framer Motion + React Three Fiber. Dark/light themes, data-driven projects & skills,
dynamic case-study routes, optional admin dashboard, view counter, contact form.

## Run it (PowerShell)
```powershell
Expand-Archive .\portfolio-3d.zip -DestinationPath .
cd .\portfolio-3d
npm install
Copy-Item .env.example .env
npm run dev
```
Open http://localhost:5173. Production build: `npm run build` → `dist/` (preview: `npm run preview`).

## Change YOUR details (one place)
`src/config/site.js` — name, role, email, GitHub, LinkedIn, location, URL, resume path, profile image, SEO text.
- Photo: drop `profile.jpg` in `public/assets/` and set `profileImage: '/assets/profile.jpg'` (4:5 portrait looks best).
- Resume: replace `public/assets/resume.pdf` (placeholder included).
- OG image: replace `public/assets/og-image.png` (1200×630).
- Set `url` to your real domain **before** building (sitemap, canonical and OG tags use it).

## Add content
- **Project** → add an object in `src/data/projects.js` (screenshots optional; a generated mockup is used until you add real images in `public/projects/...`).
- **Skill** → add an object in `src/data/skills.js` (`icon: { si: 'siReact' }` needs the import in `src/utils/iconMap.js`).
- **Timeline / services / about** → `src/data/*.js`.
Project details in `projects.js` were drafted from what is known about each app — please review and edit the wording, GitHub links and add live demo URLs.

## Backends (all optional)
Choose with `VITE_BACKEND` (or leave blank for auto-detect): `firebase` | `api` | `local`.
| Feature | firebase | api (ASP.NET Core) | local |
|---|---|---|---|
| Contact form | Firestore `messages` | `POST /contact` | mailto fallback |
| View counter | Firestore `stats/portfolio` | `/analytics/*` | this-browser counter |
| Admin login | Google sign-in | JWT + Google ID token | demo preview (dev only) |
EmailJS can be added on top for inbox delivery. Setup: fill `.env`, publish `firestore.rules` / `storage.rules`.
ASP.NET contract + sample controllers: `docs/backend-contract.md`.

A visit is counted once per browser per 24 h (anonymous id in localStorage) — reloads never inflate it, and nothing is randomised.

## Admin
`/admin` (not linked publicly, `noindex`). Protected by role: Firebase admin email list / `admins/{uid}` doc, or JWT `Admin` role.
Manage projects, skills, messages, resume & profile image. Set `VITE_REMOTE_CONTENT=true` so the public site reads from the backend.

## Performance & accessibility notes
- Three.js scene is lazy-loaded after idle, pauses off-screen, falls back to a CSS 3D cube (no WebGL / Save-Data / reduced motion).
- Firebase, admin and case-study pages are separate chunks; fonts are self-hosted; images lazy-load.
- `prefers-reduced-motion` disables tilt, floating, marquee and the 3D spin. Skip link, focus rings, ARIA tabs and a keyboard-navigable lightbox are included.

## Deploy
Vercel / Netlify work out of the box (`vercel.json` and `public/_redirects` provide SPA routing).
Material UI is listed in your skills but intentionally not bundled, to keep the site fast.
