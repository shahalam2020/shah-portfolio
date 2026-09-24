import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, Download, Code2, Server } from "lucide-react";

export default function Hero() {
  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero container">
      <div className="hero-copy">
        <motion.div
          className="availability"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="dot" /> Available for opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          Hi, I'm <span>Shah Alam</span>
          <br />
          <strong>Full Stack Developer</strong>
        </motion.h1>

        <motion.p
          className="hero-text"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          I build modern, scalable web applications with clean interfaces,
          reliable APIs and practical solutions to real-world problems.
        </motion.p>

        <div className="hero-actions">
          <button className="primary" onClick={() => go("projects")}>
            View My Work <ArrowUpRight size={18} />
          </button>
         
        </div>

        <div className="socials">
          <a href="https://github.com/shahalam2020" target="_blank" rel="noreferrer">
            <Github />
          </a>
          <a href="https://www.linkedin.com/in/shah-alam-9430a3420/" target="_blank" rel="noreferrer">
            <Linkedin />
          </a>
          {/* Mail icon -> Contact section (EmailJS form) tak smooth scroll */}
          <a
            href="#contact"
            aria-label="Contact me"
            onClick={(e) => {
              e.preventDefault();
              go("contact");
            }}
          >
            <Mail />
          </a>
        </div>
      </div>

      <motion.div
        className="hero-art"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
          const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
          e.currentTarget.style.setProperty("--mx", `${x}deg`);
          e.currentTarget.style.setProperty("--my", `${y}deg`);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.setProperty("--mx", "0deg");
          e.currentTarget.style.setProperty("--my", "0deg");
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        style={{ transform: "rotateY(var(--mx, 0deg)) rotateX(var(--my, 0deg))" }}
      >
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="code-card">
          <div className="window-bar">
            <i />
            <i />
            <i />
          </div>
          <pre>{`const developer = {
  name: "Shah Alam",
  role: "Full Stack Developer",
  frontend: ["React", "TailwindCss", "JavaScript", "Lucide React","Motion-Dev",],
  backend: [".NET Core", "C#","ASP.NET Web API",],
  database: "MySQL","Entity Framework",
  mindset: "Build. Learn. Improve."
};`}</pre>
        </div>
        <div className="floating-badge">
          <Code2 size={17} /> Clean Code
        </div>
        <div className="floating-badge badge-two">
          <Server size={17} /> REST APIs
        </div>
      </motion.div>
    </section>
  );
}