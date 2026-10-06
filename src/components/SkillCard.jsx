import { ExternalLink } from 'lucide-react';
import TiltCard from './TiltCard';
import TechIcon, { useIconColor } from './TechIcon';
import { levelLabels } from '../data/skills';

export default function SkillCard({ skill }) {
  const color = useIconColor(skill.icon);
  const level = skill.level || 3;
  return (
    <TiltCard
      className="card beam group h-full p-5 transition-shadow duration-500 hover:shadow-[0_22px_50px_-22px_var(--c)]"
      style={{ '--c': color }}
      max={11}
      scale={1.03}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid h-14 w-14 place-items-center rounded-2xl border transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:scale-110"
          style={{ background: `${color}1f`, borderColor: `${color}40`, boxShadow: `0 8px 26px -12px ${color}` }}
        >
          <TechIcon icon={skill.icon} size={28} label={`${skill.name} logo`} />
        </span>
        {skill.officialUrl && (
          <a
            href={skill.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${skill.name} website`}
            className="rounded-lg p-1.5 text-muted opacity-60 transition hover:text-primary-ink group-hover:opacity-100"
          >
            <ExternalLink size={15} />
          </a>
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug">{skill.name}</h3>
      <p className="mt-0.5 text-xs font-medium text-primary-ink">{skill.category}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{skill.description}</p>

      <div className="mt-4 flex items-center justify-between gap-3" role="img" aria-label={`Proficiency: ${levelLabels[level]}`}>
        <div className="flex gap-1" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className="h-1.5 w-7 rounded-full transition-all duration-500"
              style={{ background: n <= level ? color : 'rgb(var(--border) / 0.22)', transitionDelay: `${n * 40}ms` }}
            />
          ))}
        </div>
        <span className="text-[11px] text-muted">{levelLabels[level]}</span>
      </div>
    </TiltCard>
  );
}
