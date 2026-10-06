import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import SkillCard from '../components/SkillCard';
import TechMarquee from '../components/TechMarquee';
import Reveal from '../components/Reveal';
import { skillCategories } from '../data/skills';
import useContent from '../hooks/useContent';
import { staggerContainer, staggerItem } from '../utils/motion';

export default function Skills() {
  const { skills } = useContent();
  const [active, setActive] = useState(skillCategories[0].id);
  const grouped = useMemo(
    () => Object.fromEntries(skillCategories.map((c) => [c.id, skills.filter((s) => s.category === c.id)])),
    [skills],
  );
  const current = skillCategories.find((c) => c.id === active);

  const onKey = (e) => {
    const i = skillCategories.findIndex((c) => c.id === active);
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const target = skillCategories[(next + skillCategories.length) % skillCategories.length].id;
    setActive(target);
    document.getElementById(`tab-${target}`)?.focus();
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="section">
      <div className="container-x">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills & stack"
          title="The toolbox behind every build."
          subtitle="Real technologies I use day to day, grouped by where they sit in the stack."
        />

        <Reveal>
          <div role="tablist" aria-label="Skill categories" onKeyDown={onKey} className="glass mb-8 inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl p-1.5">
            {skillCategories.map((c) => {
              const on = c.id === active;
              return (
                <button
                  key={c.id}
                  id={`tab-${c.id}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="skills-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(c.id)}
                  className={`relative whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors ${on ? 'text-ink' : 'text-muted hover:text-ink'}`}
                >
                  {on && (
                    <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/12" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{c.id}</span>
                  <span className="relative ml-1.5 font-mono text-[11px] text-muted">{grouped[c.id].length}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="mb-6 text-sm text-muted" aria-live="polite">{current.blurb}</p>

        <AnimatePresence mode="wait">
          <motion.ul
            key={active}
            id="skills-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            variants={staggerContainer(0.045)}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {grouped[active].map((s) => (
              <motion.li key={s.name} variants={staggerItem}>
                <SkillCard skill={s} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className="mt-20">
        <TechMarquee />
      </div>
    </section>
  );
}
