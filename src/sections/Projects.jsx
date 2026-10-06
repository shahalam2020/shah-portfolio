import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import Reveal from '../components/Reveal';
import { projectCategories } from '../data/projects';
import useContent from '../hooks/useContent';

export default function Projects() {
  const { projects } = useContent();
  const [filter, setFilter] = useState('All');

  const counts = useMemo(
    () => Object.fromEntries(projectCategories.map((c) => [c, c === 'All' ? projects.length : projects.filter((p) => p.categories.includes(c)).length])),
    [projects],
  );
  const visible = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))), [projects, filter]);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="container-x">
        <SectionHeading
          id="projects-title"
          eyebrow="Selected work"
          title="Projects built to be used, not just looked at."
          subtitle="Each one has a full case study — problem, architecture, API, challenges and what I learned."
        />

        <Reveal>
          <div role="group" aria-label="Filter projects by category" className="mb-10 flex flex-wrap gap-2">
            {projectCategories.map((c) => {
              const on = filter === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(c)}
                  className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-colors ${on ? 'border-primary/40 text-ink' : 'border-line/20 text-muted hover:border-primary/30 hover:text-ink'}`}
                >
                  {on && <motion.span layoutId="project-filter" className="absolute inset-0 rounded-full bg-primary/12" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative">{c}</span>
                  <span className="relative ml-1.5 font-mono text-[11px] text-muted">{counts[c]}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-6 lg:grid-cols-2" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p className="glass rounded-3xl p-10 text-center text-muted">No “{filter}” projects yet — add one in <code className="font-mono text-primary-ink">src/data/projects.js</code>.</p>
        )}
      </div>
    </section>
  );
}
