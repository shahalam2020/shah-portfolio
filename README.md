# Solox Nobita — 3D Full Stack Developer Portfolio

VS Code-ready React + Vite portfolio with a premium dark 3D/glass visual style.

## Folder Structure
```
solox-fullstack-portfolio/
├── index.html            # HTML entry, mounts #root
├── package.json
├── package-lock.json
├── vite.config.js        # Vite + React plugin config
├── .gitignore
├── public/
│   └── resume.pdf         # replace resume.pdf.placeholder with your real CV
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # top-level layout, composes sections
    ├── styles.css         # global styles
    ├── data/
    │   └── portfolioData.js   # skills, projects, stats arrays
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── Stats.jsx
        ├── About.jsx
        ├── Skills.jsx
        ├── Projects.jsx
        ├── Contact.jsx
        └── Footer.jsx
```

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Customize
- Edit `src/data/portfolioData.js` to change skills, projects and stats.
- Edit individual files in `src/components/` for section-specific content, links and copy.
- Put your real CV at `public/resume.pdf` (rename `resume.pdf.placeholder`).

### 3D features
- Interactive mouse-reactive hero
- 3D perspective code card
- Floating depth badges
- Elevated project cards
- 3D hover effects on skills/stats
- Glow, glass and depth shadows
