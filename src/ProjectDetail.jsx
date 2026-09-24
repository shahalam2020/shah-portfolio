import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Smartphone, CheckCircle2 } from "lucide-react";
import { projects } from "./data/Skills";
import ScreenshotGallery from "./components/Screenshotgallery";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  const hasLive = project.live && project.live !== "#";
  const hasPlayStore = !!project.playStore;

  return (
    <div className="pd-page">
      <div className="container">
        <Link to="/#projects" className="pd-back">
          <ArrowLeft size={15} /> Back to Projects
        </Link>

        <header className="pd-hero">
          <div className="pd-hero-top">
            <span className="pd-badge">{project.status}</span>
            <span className="pd-no">{String(project.index + 1).padStart(2, "0")}</span>
          </div>
          <h1>{project.title}</h1>
          {project.subtitle && <p className="pd-subtitle">{project.subtitle}</p>}
          <p className="pd-desc">{project.description}</p>
          {project.dateRange && <p className="pd-date">{project.dateRange}</p>}

          {project.tags?.length > 0 && (
            <div className="pd-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}

          <div className="pd-actions">
            {hasLive && (
              <a href={project.live} target="_blank" rel="noreferrer" className="primary">
                <ExternalLink size={15} /> Visit {project.title}
              </a>
            )}
            {hasPlayStore && (
              <a href={project.playStore} target="_blank" rel="noreferrer" className="outline">
                <Smartphone size={15} /> View on Google Play
              </a>
            )}
          </div>
        </header>

        {/* Screenshots — Overview ke UPAR */}
        {project.screenshots && (
          <ScreenshotGallery
            screenshots={project.screenshots}
            title={project.title}
          />
        )}

        {project.overview && (
          <section className="pd-section">
            <h2>Overview</h2>
            <p>{project.overview}</p>
          </section>
        )}

        {project.problem && (
          <section className="pd-section">
            <h2>The Problem</h2>
            <p>{project.problem}</p>
          </section>
        )}

        {project.solution && (
          <section className="pd-section">
            <h2>The Solution</h2>
            <p>{project.solution}</p>
          </section>
        )}

        {project.keyFeatures?.length > 0 && (
          <section className="pd-section">
            <h2>Key Features</h2>
            <div className="pd-feature-grid">
              {project.keyFeatures.map((f) => (
                <div className="pd-feature-card" key={f.title}>
                  <CheckCircle2 size={16} className="pd-feature-icon" />
                  <div>
                    <b>{f.title}</b>
                    <p>{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.techStack && (
          <section className="pd-section">
            <h2>Technical Implementation</h2>
            <div className="pd-tech-grid">
              {Object.entries(project.techStack).map(([label, value]) => (
                <div className="pd-tech-item" key={label}>
                  <span>{label}:</span>
                  <b>{value}</b>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.architectureNote && (
          <section className="pd-section">
            <h2>{project.architectureTitle || "Architecture"}</h2>
            <p>{project.architectureNote}</p>
          </section>
        )}

        {project.platforms?.length > 0 && (
          <section className="pd-section pd-last">
            <h2>Platform</h2>
            <div className="pd-platform-pills">
              {project.platforms.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
            {project.platformNote && <p className="pd-platform-note">{project.platformNote}</p>}
          </section>
        )}

        <div className="pd-footer-actions">
          <Link to="/#projects" className="outline">
            <ArrowLeft size={15} /> Back to Projects
          </Link>
          {hasLive && (
            <a href={project.live} target="_blank" rel="noreferrer" className="primary">
              <ExternalLink size={15} /> Visit {project.title}
            </a>
          )}
        </div>
        
      </div>
    </div>
  );
}