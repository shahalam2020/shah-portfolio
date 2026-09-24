import { projects } from "../data/Skills";
import ProjectCard from "./Projectcard";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-label">03 — Selected Work</div>
            <h2>
              Recent <span>projects</span>
            </h2>
          </div>
        </div>

        <div className="projects">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}