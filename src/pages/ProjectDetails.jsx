import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Layers, Lock, Server, Database, Network, Monitor, Lightbulb, Target, Wrench, Sparkles } from 'lucide-react';
import BrowserMockup from '../components/BrowserMockup';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import Lightbox from '../components/Lightbox';
import ButtonLink from '../components/ButtonLink';
import Reveal from '../components/Reveal';
import NotFound from './NotFound';
import useContent from '../hooks/useContent';
import useSEO from '../hooks/useSEO';
import { trackProjectView } from '../services/analyticsService';

const methodColor = { GET: 'text-emerald-500 dark:text-emerald-400', POST: 'text-sky-600 dark:text-sky-400', PUT: 'text-amber-600 dark:text-amber-400', DELETE: 'text-red-500 dark:text-red-400' };

function Block({ icon: Icon, title, children, className = '' }) {
  return (
    <Reveal className={`card p-6 sm:p-7 ${className}`}>
      <h3 className="mb-3 flex items-center gap-2.5 text-lg font-semibold">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary-ink"><Icon size={18} aria-hidden="true" /></span>
        {title}
      </h3>
      <div className="text-[0.95rem] leading-relaxed text-muted">{children}</div>
    </Reveal>
  );
}

export default function ProjectDetails() {
  const { slug } = useParams();
  const { projects } = useContent();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const [lightbox, setLightbox] = useState(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, reduce ? 0 : 50]);

  useSEO(project ? { title: `${project.title} — Case study`, description: project.description, path: `/projects/${project.slug}`, image: project.image || undefined, type: 'article' } : { title: 'Project not found', noindex: true });
  useEffect(() => { if (project) trackProjectView(project.slug); }, [project]);

  const shots = useMemo(() => {
    if (!project) return [];
    if (project.screenshots?.length) return project.screenshots.map((s, i) => (typeof s === 'string' ? { src: s, caption: `${project.title} screenshot ${i + 1}` } : s));
    return (project.mockScreens || []).map((m) => ({ ...m, src: '' }));
  }, [project]);

  if (!project) return <NotFound what="project" />;
  const d = project.details || {};
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pb-10 pt-28 sm:pt-32">
      <div className="container-x">
        <Link to="/#projects" className="inline-flex items-center gap-2 rounded-xl text-sm font-medium text-muted transition hover:text-primary-ink"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link>

        <header className="mt-6 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              {project.categories.map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">{project.title}</h1>
            <p className="mt-3 text-xl text-ink/80">{project.tagline}</p>
            <p className="mt-4 max-w-lg text-muted">{project.description}</p>
            <dl className="mt-6 grid max-w-md grid-cols-3 gap-4 text-sm">
              {[['Role', project.role], ['Year', project.year], ['Status', project.status]].map(([k, v]) => (
                <div key={k}><dt className="text-xs text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={project.github} external icon={Github} disabled={!project.github}>GitHub Repository</ButtonLink>
              <ButtonLink href={project.liveDemo} external variant="ghost" icon={ExternalLink} disabled={!project.liveDemo}>{project.liveDemo ? 'Live Demo' : 'Demo coming soon'}</ButtonLink>
            </div>
          </div>
          <motion.div style={{ y: heroY }} className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] opacity-60 blur-3xl" style={{ background: `linear-gradient(135deg, ${project.accent[0]}55, ${project.accent[1]}55)` }} aria-hidden="true" />
            <BrowserMockup project={project} src={project.image} priority />
          </motion.div>
        </header>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          <Block icon={Sparkles} title="Overview" className="lg:col-span-3">{d.overview}</Block>
          <Block icon={Target} title="The problem" className="lg:col-span-1">{d.problem}</Block>
          <Block icon={Lightbulb} title="The solution" className="lg:col-span-2">{d.solution}</Block>
        </div>

        <section className="mt-5 grid gap-5 lg:grid-cols-2" aria-labelledby="feat-title">
          <Reveal className="card p-6 sm:p-7">
            <h2 id="feat-title" className="mb-4 text-xl font-semibold">Key features</h2>
            <ul className="space-y-3">
              {project.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-muted"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{f}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="card p-6 sm:p-7" delay={0.05}>
            <h2 className="mb-4 text-xl font-semibold">Technologies used</h2>
            <ul className="flex flex-wrap gap-2">{project.technologies.map((t) => <li key={t} className="chip-tech px-3 py-1.5 text-xs">{t}</li>)}</ul>
          </Reveal>
        </section>

        {d.architecture && (
          <section className="mt-16" aria-labelledby="arch-title">
            <Reveal className="mb-8 text-center">
              <h2 id="arch-title" className="text-2xl font-bold sm:text-3xl">Architecture</h2>
              <p className="mx-auto mt-2 max-w-xl text-muted">{d.architecture.summary}</p>
            </Reveal>
            <ArchitectureDiagram layers={d.architecture.layers} />
          </section>
        )}

        <section className="mt-16 grid gap-5 md:grid-cols-2" aria-label="Technical details">
          {d.frontend && <Block icon={Monitor} title="Frontend">{d.frontend}</Block>}
          {d.backend && <Block icon={Server} title="Backend">{d.backend}</Block>}
          {d.database && <Block icon={Database} title="Database">{d.database}</Block>}
          {d.authentication && <Block icon={Lock} title="Authentication">{d.authentication}</Block>}
        </section>

        {d.api && (
          <Reveal className="card mt-5 p-6 sm:p-7">
            <h3 className="mb-1 flex items-center gap-2.5 text-lg font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary-ink"><Network size={18} aria-hidden="true" /></span> API information
            </h3>
            <p className="mb-4 text-sm text-muted">{d.api.summary}</p>
            <div className="overflow-x-auto rounded-2xl border border-line/15 bg-bg/50">
              <table className="w-full min-w-[480px] text-left text-sm">
                <caption className="sr-only">Key API endpoints</caption>
                <thead className="text-xs text-muted"><tr><th className="p-3 font-medium">Method</th><th className="p-3 font-medium">Endpoint</th><th className="p-3 font-medium">Purpose</th></tr></thead>
                <tbody>
                  {d.api.endpoints.map((e) => (
                    <tr key={e.method + e.path} className="border-t border-line/10">
                      <td className={`p-3 font-mono font-semibold ${methodColor[e.method]}`}>{e.method}</td>
                      <td className="p-3 font-mono text-[13px]">{e.path}</td>
                      <td className="p-3 text-muted">{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}

        {d.challenges?.length > 0 && (
          <section className="mt-16" aria-labelledby="chal-title">
            <h2 id="chal-title" className="mb-6 text-2xl font-bold sm:text-3xl">Challenges</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {d.challenges.map((c) => (
                <Reveal key={c.title} className="card p-6">
                  <Wrench size={18} className="mb-3 text-primary-ink" aria-hidden="true" />
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {d.learned?.length > 0 && (
          <Reveal className="card mt-5 p-6 sm:p-7">
            <h2 className="mb-4 flex items-center gap-2.5 text-xl font-semibold"><Layers size={20} className="text-primary-ink" aria-hidden="true" /> What I learned</h2>
            <ul className="grid gap-3 md:grid-cols-3">
              {d.learned.map((l) => <li key={l} className="rounded-2xl border border-line/15 bg-bg/40 p-4 text-sm text-muted">{l}</li>)}
            </ul>
          </Reveal>
        )}

        {shots.length > 0 && (
          <section className="mt-16" aria-labelledby="shots-title">
            <h2 id="shots-title" className="mb-6 text-2xl font-bold sm:text-3xl">Screenshots</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shots.map((s, i) => (
                <li key={`${s.title || s.caption}-${i}`}>
                  <button type="button" onClick={() => setLightbox(i)} className="group block w-full text-left" aria-label={`Open screenshot: ${s.title || s.caption}`}>
                    <div className="overflow-hidden rounded-2xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-glow">
                      <BrowserMockup project={project} src={s.src} alt={s.caption} view={i} imgClass="transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <p className="mt-3 text-sm font-medium">{s.title || `Screenshot ${i + 1}`}</p>
                    <p className="text-xs text-muted">{s.caption}</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        <Lightbox project={project} items={shots} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />

        <nav aria-label="More projects" className="mt-20 grid gap-4 sm:grid-cols-2">
          {projects.length > 1 && [['Previous', prev, ArrowLeft], ['Next', next, ArrowRight]].map(([label, p, Icon], i) => (
            <Link key={label} to={`/projects/${p.slug}`} className={`card beam group flex items-center justify-between gap-4 rounded-3xl p-6 transition hover:-translate-y-1 ${i === 1 ? 'flex-row-reverse text-right' : ''}`}>
              <Icon size={22} className={`text-primary-ink transition ${i === 1 ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} aria-hidden="true" />
              <span><span className="block text-xs text-muted">{label} project</span><span className="font-display text-xl font-bold">{p.title}</span></span>
            </Link>
          ))}
        </nav>
      </div>
    </article>
  );
}
