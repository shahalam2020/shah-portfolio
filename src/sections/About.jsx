import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import { aboutCards, buildList, philosophy } from '../data/about';
import { lucideIcons } from '../utils/iconMap';
import { site } from '../config/site';
import { staggerContainer, staggerItem } from '../utils/motion';

const techChips = ['React', 'ASP.NET Core', 'C#', 'SQL Server', 'MySQL', 'Tailwind CSS', 'SignalR', 'Capacitor'];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container-x">
        <SectionHeading
          id="about-title"
          eyebrow="About me"
          title="A developer who sweats the details you can feel."
          subtitle="I enjoy owning a feature from database schema to the last animation frame."
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-8 lg:col-span-5">
            <Reveal className="space-y-4 text-base leading-relaxed text-muted sm:text-[1.05rem]">
              <p>
                I’m <strong className="font-semibold text-ink">{site.name}</strong>, a Full Stack Web Developer from Mau, Uttar Pradesh. I build web and mobile apps at{' '}
                <strong className="font-semibold text-ink">Cubical 8</strong> — including the LoopBook expense-splitting app — while training as a Full Stack Developer at Coders Academy and finishing my B.Sc. at Gopinath P.G College (2026).
              </p>
              <p>
                My journey runs from the browser to the server: React’s component model first, then ASP.NET Core, SQL Server and real-time features. Today I like shipping complete slices — schema, endpoint, interface and the small motion that makes it feel finished.
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h3 className="mb-3 text-sm font-semibold text-ink">How I work</h3>
              <ul className="space-y-3">
                {philosophy.map((p) => (
                  <li key={p.title} className="border-l-2 border-primary/50 pl-4">
                    <p className="text-sm font-semibold text-ink">{p.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{p.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">What I build</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {buildList.map((b) => (
                    <li key={b} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">Technologies I work with</h3>
                <div className="flex flex-wrap gap-2">
                  {techChips.map((t) => <span key={t} className="chip-tech">{t}</span>)}
                </div>
              </div>
            </Reveal>
          </div>

          <motion.ul
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 sm:grid-cols-2 lg:col-span-7"
          >
            {aboutCards.map((c, i) => {
              const Icon = lucideIcons[c.icon];
              return (
                <motion.li key={c.n} variants={staggerItem} className={i % 2 === 1 ? 'sm:translate-y-8' : ''}>
                  <TiltCard className="card beam group h-full p-6" max={8}>
                    <div className="mb-8 flex items-start justify-between">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/20 to-secondary/20 text-primary-ink transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg] group-hover:scale-110">
                        <Icon size={26} aria-hidden="true" />
                      </span>
                      <span className="font-mono text-sm text-muted">{c.n}</span>
                    </div>
                    <h3 className="text-xl font-semibold">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
                  </TiltCard>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
