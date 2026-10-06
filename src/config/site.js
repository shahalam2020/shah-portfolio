/**
 * ───────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR YOUR IDENTITY
 *  Change values here — the whole site (and index.html meta
 *  tags, via vite.config.js) updates automatically.
 *  Keep this file free of import.meta.env (Vite reads it in Node).
 * ───────────────────────────────────────────────────────────
 */
export const site = {
  // ── Identity ────────────────────────────────────────────
  name: 'Shah Alam', // [YOUR NAME]
  handle: 'Solo x Nobita',
  initials: 'SA',
  role: 'Full Stack Web Developer',
  tagline: 'Building Digital Experiences That Feel Alive.',
  location: 'Mau, Uttar Pradesh, India', // [LOCATION]
  availability: 'Open to full-time roles & freelance work',
  url: 'https://your-domain.com', // used for canonical, OG & sitemap

  // ── Assets (put files in /public/assets) ─────────────────
  profileImage: '/assets/profile.png', // [YOUR PHOTO] → swap for /assets/profile.jpg (4:5 portrait works best)
  resumePath: '/assets/resume.pdf', // [RESUME PDF]
  resumeFileName: 'Shah-Alam-Resume.pdf',
  ogImage: '/assets/og-image.png',

  // ── Contact & social ─────────────────────────────────────
  email: 'shahalamx2020@gmail.com', // [EMAIL]
  socials: {
    github: 'https://github.com/shahalam2020', // [GITHUB URL]
    linkedin: 'https://www.linkedin.com/in/shah-alam-9430a3420/', // [LINKEDIN URL]
  },
  githubUsername: 'shahalam2020', // for the GitHub activity section

  // ── Copy ─────────────────────────────────────────────────
  hero: {
    badge: 'FULL STACK WEB DEVELOPER',
    greeting: "Hi, I'm",
    headline: 'Building Modern Web Experiences.',
    description:
      'I build scalable, responsive and interactive web applications using modern frontend technologies, robust backend APIs, databases, authentication systems and real-time communication.',
  },
  builtWith: 'Built with React & ASP.NET Core',
  footerBlurb:
    'Full Stack Web Developer crafting fast React interfaces and dependable ASP.NET Core backends — from first sketch to production.',

  // ── View counter ─────────────────────────────────────────
  viewCounter: {
    baseline: 0, // add a historic number if you are migrating from another counter
    label: 'Portfolio Views',
  },

  // ── SEO ──────────────────────────────────────────────────
  seo: {
    title: 'Shah Alam | Full Stack Web Developer',
    description:
      'Portfolio of Shah Alam, a Full Stack Web Developer specializing in React, ASP.NET Core, C#, REST APIs, SQL Server, MySQL and modern web applications.',
    twitterHandle: '@yourhandle',
  },
};

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const quickLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];
