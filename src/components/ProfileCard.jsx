import { motion, useReducedMotion } from 'framer-motion';
import { Terminal, Radio } from 'lucide-react';
import TiltCard from './TiltCard';
import TechIcon from './TechIcon';
import { site } from '../config/site';
import useContent from '../hooks/useContent';

const badges = [
  { name: 'React', icon: { si: 'siReact' }, cls: 'left-[-6%] top-[14%]', d: 5.2 },
  { name: 'ASP.NET Core', icon: { si: 'siDotnet' }, cls: 'right-[-9%] top-[46%]', d: 6.4 },
  { name: 'SQL Server', icon: { lucide: 'Database', color: '#e5484d' }, cls: 'left-[-10%] bottom-[22%]', d: 5.8 },
];

function Float({ children, className, d = 5, y = 8, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      animate={reduce ? undefined : { y: [0, -y, 0] }}
      transition={{ duration: d, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export default function ProfileCard() {
  const { settings } = useContent();
  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 blur-3xl" aria-hidden="true" />

      <TiltCard max={8} scale={1.02} className="group relative rounded-[2.2rem]">
        <div className="spin-border rounded-[2.2rem] p-[2px]">
          <div className="glass rounded-[2.1rem] p-2.5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-bg-2">
              <img
                src={settings.profileImage}
                alt={`Portrait of ${site.name}, ${site.role}`}
                width="800"
                height="1000"
                fetchpriority="high"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white backdrop-blur-md">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold">{site.name}</p>
                  <p className="truncate text-xs text-white/70">{site.role}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-xs text-emerald-300">
                  <span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-400" aria-hidden="true" />
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>

      {badges.map((b, i) => (
        <Float key={b.name} className={`${b.cls} hidden sm:block`} d={b.d} delay={i * 0.4}>
          <span className="glass flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold">
            <TechIcon icon={b.icon} size={16} /> {b.name}
          </span>
        </Float>
      ))}

      <Float className="-bottom-5 right-[-4%] hidden md:block" d={6.6} y={6} delay={0.8}>
        <div className="glass w-52 rounded-2xl p-3 font-mono text-[11px] leading-5">
          <div className="mb-1 flex items-center gap-1.5 text-muted"><Terminal size={12} aria-hidden="true" /> api.http</div>
          <p><span className="text-accent">GET</span> /api/projects</p>
          <p className="text-emerald-500 dark:text-emerald-400">200 OK · 4 items</p>
        </div>
      </Float>

      <Float className="-top-4 right-[6%] hidden md:block" d={7.2} y={5} delay={1.2}>
        <span className="glass flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-medium">
          <Radio size={12} className="text-primary-ink" aria-hidden="true" /> SignalR · live
        </span>
      </Float>
    </div>
  );
}
