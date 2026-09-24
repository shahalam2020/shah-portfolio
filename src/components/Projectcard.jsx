import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Github, ArrowUpRight, Radio } from "lucide-react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [isIn, setIsIn] = useState(false);

  const hasGithub = project.github && project.github !== "#";
  const hasLive = project.live && project.live !== "#";

  // Entrance: card rises into place once, staggered by its index.
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return undefined;
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      setIsIn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Pointer-driven tilt + spotlight position, expressed as CSS custom properties
  // so the stylesheet controls how much each layer parallaxes.
  function handlePointerMove(e) {
    if (reducedMotion()) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    card.style.setProperty("--rx", `${((0.5 - py) * 10).toFixed(2)}deg`);
    card.style.setProperty("--ry", `${((px - 0.5) * 14).toFixed(2)}deg`);
    card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  }

  function handlePointerLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  }

  function goToDetail() {
    navigate(`/projects/${project.slug}`);
  }

  function stop(e) {
    e.stopPropagation();
  }

  return (
    <article
      ref={cardRef}
      className={`project project-3d ${isIn ? "is-in" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? goToDetail() : null)}
      style={{ "--stagger": index }}
    >
      <div className="project-sheen" aria-hidden="true" />
      <div className="project-spot" aria-hidden="true" />

      <div className="project-top">
        <span className="project-no">{String(index + 1).padStart(2, "0")}</span>

        {hasLive && (
          <a
            className="project-live"
            href={project.live}
            target="_blank"
            rel="noreferrer"
            onClick={stop}
          >
            <span className="project-live-dot" aria-hidden="true" />
            Live
          </a>
        )}
        {!hasLive && hasGithub && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} on GitHub`}
            onClick={stop}
          >
            <Github size={15} />
          </a>
        )}
      </div>

      <div className="project-visual">
        <div className="project-ring" aria-hidden="true" />
        <div className="project-ring project-ring-b" aria-hidden="true" />
        {project.logo ? (
          <img
            src={project.logo}
            alt={`${project.title} logo`}
            className="project-logo"
          />
        ) : (
          <span className="project-logo-fallback">{project.status}</span>
        )}
      </div>

      <span className="project-type">{project.status}</span>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.description}</p>

      <div className="project-links">
        <span className="project-view-detail">
          View Case Study
          <ArrowUpRight size={15} className="project-view-arrow" />
        </span>
      </div>
    </article>
  );
}