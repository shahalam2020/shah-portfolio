import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import TiltCard from './TiltCard';
import BrowserMockup from './BrowserMockup';
import ButtonLink from './ButtonLink';

export default function ProjectCard({ project }) {
  const shown = project.technologies.slice(0, 5);
  const extra = project.technologies.length - shown.length;
  return (
    <TiltCard
      as="article"
      magnet={7}
      max={4}
      scale={1.01}
      className="card beam group flex h-full flex-col p-3.5 transition-shadow duration-500 hover:shadow-glow"
    >
      <Link to={`/projects/${project.slug}`} aria-label={`${project.title} — view case study`} className="block overflow-hidden rounded-2xl">
        <BrowserMockup project={project} src={project.image} imgClass="transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="chip">{project.category}</span>
          <span className="text-xs text-muted">{project.year} · {project.status}</span>
        </div>

        <h3 className="text-2xl font-bold">
          <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1.5 hover:text-primary-ink">
            {project.title}
            <ArrowUpRight size={20} className="translate-y-0.5 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {shown.map((t, i) => (
            <li
              key={t}
              className="chip-tech transition duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:bg-primary/15"
              style={{ transitionDelay: `${i * 45}ms` }}
            >
              {t}
            </li>
          ))}
          {extra > 0 && <li className="chip-tech opacity-70">+{extra}</li>}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <ButtonLink to={`/projects/${project.slug}`} size="sm" iconRight={ArrowUpRight} className="opacity-90 transition-all duration-300 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:shadow-glow">
            View Details
          </ButtonLink>
          <ButtonLink href={project.github} external variant="ghost" size="sm" icon={Github} disabled={!project.github} aria-label={`${project.title} on GitHub`}>
            GitHub
          </ButtonLink>
          <ButtonLink href={project.liveDemo} external variant="ghost" size="sm" icon={ExternalLink} disabled={!project.liveDemo} title={project.liveDemo ? undefined : 'Live demo coming soon'}>
            {project.liveDemo ? 'Live Demo' : 'Demo soon'}
          </ButtonLink>
        </div>
      </div>
    </TiltCard>
  );
}
