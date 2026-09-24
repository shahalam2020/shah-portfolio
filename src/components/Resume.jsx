import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Check,
  Code2,
  Database,
  Download,
  GraduationCap,
  Layout,
  Mail,
  MapPin,
  Phone,
  Server,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react";
import ContactForm from "./Contact"; // path apne folder ke hisab se adjust karo

/* =========================================================
   CONTENT  (resume ka saara data yahin hai — yahin edit karo)
   ========================================================= */
const PROFILE = {
  name: "Shah Alam",
  role: "Full Stack Web Developer",
  location: "Mau, Uttar Pradesh, India",
  email: "shahalamx2020@gmail.com",
  phone: "+91 9580429387",
  phoneHref: "+919580429387",
  pdf: "/Shah-Alam-Resume.pdf", // PDF ko public/ folder me isi naam se rakho
  summary:
    "I build full stack web and mobile apps with React JS, ASP.NET Core Web API and MySQL. I add secure sign-in (JWT, OAuth, Firebase Google Auth) with role-based access, and one of my apps is live on the Google Play Store.",
};

const ROLE_LINES = [
  "React JS interfaces",
  "ASP.NET Core Web APIs",
  "secure JWT and Google sign-in",
  "Android apps on Google Play",
];

const SHEET_ROWS = [
  ["Frontend", "React JS, Tailwind CSS"],
  ["Backend", "ASP.NET Core, C#"],
  ["Database", "MySQL"],
  ["Auth", "JWT, OAuth, Firebase"],
  ["Mobile", "Ionic Capacitor"],
];

const TIMELINE = [
  {
    kind: "work",
    title: "Full Stack Developer Trainee",
    org: "Coders Academy, Mau",
    when: "2025 – Present",
    points: [
      "Build full stack web apps with React JS on the frontend and ASP.NET Core Web API on the backend.",
      "Implemented secure authentication and authorization with JWT tokens and OAuth.",
      "Tested and documented APIs using Postman and Scaller.",
    ],
  },
  {
    kind: "edu",
    title: "Bachelor of Science (B.Sc.)",
    org: "Gopinath P.G College, Mau, Uttar Pradesh",
    when: "2023 - 2026",
    points: [],
  },
];

const PROJECTS = [
  {
    name: "LoopBook",
    kind: "Full stack mobile app",
    status: "Live on Google Play",
    lead: true,
    points: [
      "Built and published a full stack mobile app with React JS and an ASP.NET Core Web API. It is live on the Play Store.",
      "Smooth UI animation and icons with Framer Motion and Lucide React, with Axios for API calls.",
      "Sign-in with Firebase Google Auth, sessions secured with JWT, push notifications through Firebase Cloud Messaging.",
      "Packaged for Android with Ionic Capacitor.",
    ],
    tags: [
      "React JS",
      "Tailwind CSS",
      "Lucide React",
      "Framer Motion",
      "Axios",
      "ASP.NET Core Web API",
      "C#",
      "MySQL",
      "JWT",
      "Firebase Google Auth",
      "Firebase Cloud Messaging",
      "Ionic Capacitor",
    ],
  },
  {
    name: "RemindMe",
    kind: "Reminder management app",
    points: [
      "Cross-platform reminder app with React JS and an ASP.NET Core Web API backend.",
      "Create and edit reminders, with a responsive Tailwind CSS interface and Axios API calls.",
      "Reminder notifications through Firebase Cloud Messaging, packaged for Android with Ionic Capacitor.",
    ],
    tags: ["React JS", "Tailwind CSS", "C#", "ASP.NET Core", "Axios", "FCM", "Ionic Capacitor"],
  },
  {
    name: "Book Management System",
    kind: "Full stack web app",
    points: [
      "Book management app built with React JS, Tailwind CSS and ASP.NET Core Web API.",
      "Role-based access control (RBAC) to manage user permissions and secure API endpoints.",
      "JWT-based authentication for secure user sessions.",
    ],
    tags: ["React JS", "Tailwind CSS", "ASP.NET Core", "C#", "JWT", "RBAC"],
  },
];

const SKILL_GROUPS = [
  { title: "Languages", icon: Code2, color: "#fbbf24", items: ["HTML", "CSS", "JavaScript", "C#"] },
  { title: "Frontend", icon: Layout, color: "#24a7ff", items: ["React JS", "Tailwind CSS"] },
  { title: "Backend", icon: Server, color: "#7c5cff", items: ["ASP.NET Core Web API", ".NET Core"] },
  { title: "Database", icon: Database, color: "#2dd4bf", items: ["MySQL"] },
  {
    title: "Authentication and security",
    icon: ShieldCheck,
    color: "#34d399",
    items: ["JWT Token", "Firebase Google Auth", "Role-Based Access Control"],
  },
  { title: "Mobile", icon: Smartphone, color: "#f472b6", items: ["Ionic", "Capacitor"] },
  {
    title: "Tools and services",
    icon: Wrench,
    color: "#ff7a3d",
    items: ["Firebase Cloud Messaging", "Postman", "Scaller", "Axios"],
  },
];

/* =========================================================
   HELPERS
   ========================================================= */
const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Email click par mailto nahi, seedha contact form tak smooth scroll */
function scrollToContact(e) {
  const el = document.getElementById("contact");
  if (!el) return; // element na mile to normal link (#contact) hi chalega
  e.preventDefault();
  const top = el.getBoundingClientRect().top + window.scrollY - 90; // 90 = floating navbar ki jagah
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reducedMotion() ? "auto" : "smooth",
  });
}

/** Typing / erasing loop */
function useTypewriter(phrases) {
  const [text, setText] = useState(() => (reducedMotion() ? phrases[0] : ""));

  useEffect(() => {
    if (reducedMotion()) return undefined;
    let i = 0;
    let j = 0;
    let dir = 1;
    let timer;
    const tick = () => {
      const phrase = phrases[i];
      j += dir;
      setText(phrase.slice(0, j));
      let delay = dir === 1 ? 55 : 28;
      if (dir === 1 && j === phrase.length) {
        dir = -1;
        delay = 1600;
      } else if (dir === -1 && j === 0) {
        dir = 1;
        i = (i + 1) % phrases.length;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, [phrases]);

  return text;
}

/** Cursor-follow 3D tilt. CSS vars --rx --ry --mx --my set karta hai */
function useTilt(max = 8) {
  const ref = useRef(null);

  const onPointerMove = (e) => {
    if (e.pointerType === "touch" || reducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    ["--rx", "--ry", "--mx", "--my"].forEach((p) => el.style.removeProperty(p));
  };

  return { ref, onPointerMove, onPointerLeave };
}

/** Ek baar viewport me aaye to true */
function useSeen(threshold = 0.15) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen];
}

/** Scroll ke saath bharti timeline line + kaunse items "reach" hue */
function useTimelineProgress() {
  const ref = useRef(null);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.62;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty("--tl", p.toFixed(4));
      let n = 0;
      el.querySelectorAll(".rs-tl-item").forEach((item) => {
        if (item.getBoundingClientRect().top < line) n += 1;
      });
      setReached(n);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return [ref, reached];
}

/* =========================================================
   PIECES
   ========================================================= */
function Reveal({ delay = 0, className = "", children }) {
  const [ref, seen] = useSeen();
  return (
    <div
      ref={ref}
      className={`rs-reveal ${seen ? "is-in" : ""} ${className}`}
      style={{ "--d": delay }}
    >
      {children}
    </div>
  );
}

function ResumeSheet() {
  const tilt = useTilt(9);
  return (
    <div
      className="rs-stage"
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <div className="rs-glow rs-glow-a" aria-hidden="true" />
      <div className="rs-glow rs-glow-b" aria-hidden="true" />

      <div className="rs-drop">
        <div className="rs-bob">
          <div className="rs-tilt" ref={tilt.ref} aria-hidden="true">
            <div className="rs-layer rs-layer-2" />
            <div className="rs-layer rs-layer-1" />

            <div className="rs-sheet">
              <div className="rs-scan" />
              <div className="rs-sheet-bar">
                <i />
                <i />
                <i />
                <span>shah-alam.resume</span>
              </div>
              <div className="rs-sheet-body">
                <div className="rs-sheet-id">
                  <div className="rs-avatar">SA</div>
                  <div>
                    <b>{PROFILE.name}</b>
                    <small>{PROFILE.role}</small>
                  </div>
                </div>
                <div className="rs-rule" />
                {SHEET_ROWS.map(([label, value], i) => (
                  <div className="rs-row" key={label} style={{ "--i": i }}>
                    <span>{label}</span>
                    <em>{value}</em>
                  </div>
                ))}
                <div className="rs-rule" />
                <div className="rs-sheet-foot">
                  <GraduationCap size={14} />
                  B.Sc. 2026, Gopinath P.G College
                </div>
              </div>
              <div className="rs-gloss" />
            </div>

            <div className="rs-float rs-float-a">
              <Smartphone size={15} />
              LoopBook is live on Google Play
            </div>
            <div className="rs-float rs-float-b">
              <ShieldCheck size={15} />
              JWT and role-based access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const typed = useTypewriter(ROLE_LINES);
  return (
    <header className="container rs-hero">
      <div className="rs-hero-copy">
        <span className="availability" style={{ "--d": 0 }}>
          <span className="dot" />
          Trainee at Coders Academy
        </span>

        <h1 className="rs-name" style={{ "--d": 1 }}>
          {PROFILE.name}
        </h1>

        <p
          className="rs-type"
          style={{ "--d": 2 }}
          aria-label={`${PROFILE.role}. I build ${ROLE_LINES.join(", ")}.`}
        >
          <span aria-hidden="true">
            I build <b>{typed}</b>
            <span className="rs-caret" />
          </span>
        </p>

        <p className="rs-summary" style={{ "--d": 3 }}>
          {PROFILE.summary}
        </p>

        <div className="rs-actions" style={{ "--d": 4 }}>
          <a className="primary" href={PROFILE.pdf} download>
            <Download size={16} />
            Download resume
          </a>
          <a className="secondary" href="#contact" onClick={scrollToContact}>
            <Mail size={16} />
            Email me
          </a>
        </div>

        <div className="rs-meta" style={{ "--d": 5 }}>
          <span>
            <MapPin size={14} />
            {PROFILE.location}
          </span>
          <span>
            <Briefcase size={14} />
            {PROFILE.role}
          </span>
        </div>
      </div>

      <ResumeSheet />
    </header>
  );
}

function Experience() {
  const [ref, reached] = useTimelineProgress();
  return (
    <section className="container rs-section" id="experience">
      <div className="rs-split">
        <div className="rs-split-head">
          <h2 className="rs-h2">Experience and education</h2>
          <p className="rs-lead">
            Where I work and study right now. The line fills in as you scroll.
          </p>
        </div>

        <div className="rs-tl" ref={ref}>
          <div className="rs-tl-track" aria-hidden="true">
            <div className="rs-tl-fill" />
          </div>

          {TIMELINE.map((item, i) => {
            const Icon = item.kind === "work" ? Briefcase : GraduationCap;
            return (
              <article
                key={item.title}
                className={`rs-tl-item ${i < reached ? "is-reached" : ""}`}
              >
                <span className="rs-tl-node" aria-hidden="true">
                  <Icon size={11} />
                </span>
                <div className="rs-tl-head">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.org}</p>
                  </div>
                  <span className="rs-when">{item.when}</span>
                </div>
                {item.points.length > 0 && (
                  <ul className="rs-list">
                    {item.points.map((pt) => (
                      <li key={pt}>
                        <Check size={14} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const tilt = useTilt(5);
  return (
    <article
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className={`rs-project ${project.lead ? "rs-project-lead" : ""}`}
    >
      <div className="rs-project-main">
        <div className="rs-project-top">
          <span className="rs-kind">{project.kind}</span>
          {project.status && (
            <span className="rs-live">
              <span className="dot" />
              {project.status}
            </span>
          )}
        </div>
        <h3>{project.name}</h3>
        <ul className="rs-list">
          {project.points.map((pt) => (
            <li key={pt}>
              <Check size={14} />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rs-tags">
        {project.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section className="container rs-section" id="projects">
      <h2 className="rs-h2">Projects</h2>
      <p className="rs-lead">Three full stack apps, built with React JS and ASP.NET Core Web API.</p>

      <div className="rs-projects">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i} className={p.lead ? "rs-cell-lead" : ""}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SkillGroup({ group, delay }) {
  const [ref, seen] = useSeen(0.2);
  const Icon = group.icon;
  return (
    <div
      ref={ref}
      className={`rs-group rs-reveal ${seen ? "is-in" : ""}`}
      style={{ "--d": delay, "--c": group.color }}
    >
      <div className="rs-group-head">
        <span className="rs-group-icon">
          <Icon size={16} />
        </span>
        <h3>{group.title}</h3>
      </div>
      <div className="rs-chips">
        {group.items.map((item, i) => (
          <span className="rs-chip" key={item} style={{ "--i": i }}>
            <i />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  return (
    <section className="container rs-section" id="stack">
      <h2 className="rs-h2">Tech stack</h2>
      <p className="rs-lead">The tools I use across the frontend, backend, database and mobile.</p>
      <div className="rs-groups">
        {SKILL_GROUPS.map((g, i) => (
          <SkillGroup key={g.title} group={g} delay={i % 2} />
        ))}
      </div>
    </section>
  );
}

/* Phone / location / resume download wala box (email form alag hai: <ContactForm />) */
function GetInTouch() {
  return (
    <section className="container rs-section rs-last" id="get-in-touch">
      <div className="contact-box rs-contact">
        <div className="rs-contact-copy">
          <h2 className="rs-h2">Get in touch</h2>
          <p className="rs-lead">
            Message me about a role or a project, or download my resume. I speak Hindi and English.
          </p>
          <div className="rs-actions">
            <a className="primary" href={PROFILE.pdf} download>
              <Download size={16} />
              Download resume
            </a>
          </div>
        </div>

        <div className="cf-cards rs-contact-cards">
          <a className="cf-card" href="#contact" onClick={scrollToContact}>
            <span className="cf-card-icon">
              <Mail size={20} />
            </span>
            <span className="cf-card-text">
              <small>Email</small>
              <b>{PROFILE.email}</b>
            </span>
          </a>
          <a className="cf-card" href={`tel:${PROFILE.phoneHref}`}>
            <span className="cf-card-icon">
              <Phone size={20} />
            </span>
            <span className="cf-card-text">
              <small>Phone</small>
              <b>{PROFILE.phone}</b>
            </span>
          </a>
          <div className="cf-card">
            <span className="cf-card-icon">
              <MapPin size={20} />
            </span>
            <span className="cf-card-text">
              <small>Location</small>
              <b>{PROFILE.location}</b>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Resume() {
  return (
    <main className="rs-page">
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <ContactForm />
      <GetInTouch />
    </main>
  );
}