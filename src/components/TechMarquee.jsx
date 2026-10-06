import { Fragment, useMemo } from 'react';
import TechIcon from './TechIcon';
import { marqueeTech } from '../data/skills';
import useContent from '../hooks/useContent';

function Row({ items, reverse }) {
  const list = (hidden) => (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <Fragment key={`${t.name}-${i}`}>
          <li className="glass flex items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium">
            {t.icon && <TechIcon icon={t.icon} size={18} />}
            {t.name}
          </li>
          <li aria-hidden="true" className="text-primary/60">•</li>
        </Fragment>
      ))}
    </ul>
  );
  return (
    <div className={`marquee-track flex w-max ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
      {list(false)}
      {list(true)}
    </div>
  );
}

export default function TechMarquee() {
  const { skills } = useContent();
  const items = useMemo(
    () => marqueeTech.map((name) => ({ name, icon: skills.find((s) => s.name === name)?.icon })),
    [skills],
  );
  const display = items.map((i) => ({ ...i, name: i.name.replace(' Web API', '').replace('JWT Authentication', 'JWT').replace('React.js', 'React') }));
  const reversed = [...display].reverse();

  return (
    <div role="region" aria-label="Technologies I work with" className="pause-on-hover marquee-wrap mask-fade-x space-y-4 overflow-hidden">
      <Row items={display} />
      <Row items={reversed} reverse />
    </div>
  );
}
