import { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { Briefcase, GraduationCap, Rocket, Flag } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { timeline } from '../data/experience';
import { ease } from '../utils/motion';

const icons = { Education: GraduationCap, Journey: Briefcase, Project: Rocket, Milestone: Flag };

export default function Experience() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <section id="experience" aria-labelledby="exp-title" className="section">
      <div className="container-x">
        <SectionHeading
          id="exp-title"
          eyebrow="Experience & journey"
          title="From first line of code to shipping products."
          subtitle="Education, hands-on roles and the projects that shaped how I build."
        />

        <div ref={ref} className="relative mx-auto max-w-4xl">
          <div className="absolute bottom-0 left-[19px] top-0 w-0.5 rounded-full bg-line/20 md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
          <motion.div
            aria-hidden="true"
            className="absolute left-[19px] top-0 w-0.5 origin-top rounded-full bg-gradient-to-b from-primary via-secondary to-accent shadow-[0_0_14px_rgb(var(--primary)/0.7)] md:left-1/2 md:-translate-x-1/2"
            style={{ height: '100%', scaleY: reduce ? 1 : progress }}
          />

          <ol className="space-y-10">
            {timeline.map((t, i) => {
              const Icon = icons[t.type] || Briefcase;
              const left = i % 2 === 0;
              return (
                <motion.li
                  key={t.title}
                  initial={reduce ? false : { opacity: 0, x: left ? -28 : 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease }}
                  className="relative grid gap-3 pl-14 md:grid-cols-2 md:gap-14 md:pl-0"
                >
                  <span className="absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-2xl border border-primary/40 bg-bg text-primary-ink shadow-glow md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
                    <Icon size={18} />
                  </span>

                  <div className={`${left ? 'md:text-right' : 'md:col-start-2'} md:pt-2`}>
                    <p className="font-mono text-sm text-primary-ink">{t.period}</p>
                    <p className="text-xs text-muted">{t.type}</p>
                  </div>

                  <div className={`card p-5 ${left ? 'md:col-start-2 md:row-start-1' : 'md:col-start-1 md:row-start-1'}`}>
                    <h3 className="text-lg font-semibold">{t.title}</h3>
                    <p className="text-sm font-medium text-muted">{t.org}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{t.text}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {t.tags.map((g) => <li key={g} className="chip-tech">{g}</li>)}
                    </ul>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
