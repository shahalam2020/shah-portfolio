import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { ExternalLink, Github, GitFork, Star, Users, BookMarked } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import ButtonLink from '../components/ButtonLink';
import { getContributions, getGithubOverview, githubUser } from '../services/githubService';
import { site } from '../config/site';

const levels = ['rgb(var(--border)/0.14)', 'rgb(var(--primary)/0.28)', 'rgb(var(--primary)/0.5)', 'rgb(var(--primary)/0.75)', 'rgb(var(--primary))'];
const dateFmt = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });

const Stat = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-line/15 bg-bg/40 p-4">
    <Icon size={16} className="text-primary-ink" aria-hidden="true" />
    <p className="mt-2 font-display text-2xl font-bold">{value ?? '—'}</p>
    <p className="text-xs text-muted">{label}</p>
  </div>
);

export default function GitHubActivity() {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '300px' });
  const [overview, setOverview] = useState();
  const [contrib, setContrib] = useState();

  useEffect(() => {
    if (!visible) return;
    getGithubOverview().then(setOverview).catch(() => setOverview(null));
    getContributions().then(setContrib).catch(() => setContrib(null));
  }, [visible]);

  const weeks = contrib?.days ? Array.from({ length: Math.ceil(contrib.days.length / 7) }, (_, i) => contrib.days.slice(i * 7, i * 7 + 7)) : [];

  return (
    <section id="github" ref={ref} aria-labelledby="github-title" className="section">
      <div className="container-x">
        <SectionHeading id="github-title" eyebrow="Open source & activity" title="Building in public." subtitle="Live from the GitHub API — public data only, no tokens." />

        <Reveal className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {overview?.profile?.avatar ? (
                <img src={overview.profile.avatar} alt={`${githubUser} on GitHub`} width="64" height="64" loading="lazy" className="h-16 w-16 rounded-2xl border border-line/25" />
              ) : (
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line/25 bg-bg/50"><Github size={28} aria-hidden="true" /></span>
              )}
              <div>
                <p className="font-display text-xl font-bold">{overview?.profile?.name || site.name}</p>
                <a href={site.socials.github} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-primary-ink hover:underline">@{githubUser}</a>
              </div>
            </div>
            <ButtonLink href={site.socials.github} external variant="ghost" size="sm" icon={Github}>Follow on GitHub</ButtonLink>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={BookMarked} label="Public repositories" value={overview?.profile?.repos} />
            <Stat icon={Star} label="Stars earned" value={overview?.stars} />
            <Stat icon={Users} label="Followers" value={overview?.profile?.followers} />
            <Stat icon={Github} label="Contributions, last year" value={contrib?.total} />
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold">Contribution activity</h3>
            {contrib === undefined && <div className="skeleton h-28 rounded-2xl" aria-label="Loading contributions" />}
            {contrib === null && <p className="rounded-2xl border border-line/15 p-4 text-sm text-muted">Contribution graph is unavailable right now. See it on <a className="text-primary-ink underline" href={site.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>.</p>}
            {weeks.length > 0 && (
              <div className="overflow-x-auto pb-2" role="img" aria-label={`${contrib.total} contributions in the last year`}>
                <div className="flex w-max gap-[3px]">
                  {weeks.map((w, i) => (
                    <div key={i} className="grid gap-[3px]">
                      {w.map((d) => <span key={d.date} title={`${d.count} on ${d.date}`} className="h-[11px] w-[11px] rounded-[3px]" style={{ background: levels[d.level] }} />)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold">Featured repositories</h3>
            {overview === undefined && <div className="grid gap-3 sm:grid-cols-2">{[0, 1].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>}
            {overview === null && <p className="rounded-2xl border border-line/15 p-4 text-sm text-muted">GitHub data could not be loaded (rate limit or offline). Browse repositories on <a className="text-primary-ink underline" href={`${site.socials.github}?tab=repositories`} target="_blank" rel="noopener noreferrer">GitHub</a>.</p>}
            {overview?.featured?.length > 0 && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {overview.featured.map((r) => (
                  <li key={r.name}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="beam group block rounded-2xl border border-line/15 bg-bg/40 p-4 transition hover:-translate-y-0.5 hover:border-primary/40">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-semibold text-primary-ink">{r.name}</span>
                        <ExternalLink size={14} className="text-muted" aria-hidden="true" />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted">{r.description || 'No description yet.'}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                        {r.language && <span>{r.language}</span>}
                        <span className="inline-flex items-center gap-1"><Star size={12} aria-hidden="true" />{r.stars}</span>
                        <span className="inline-flex items-center gap-1"><GitFork size={12} aria-hidden="true" />{r.forks}</span>
                        <span>Updated {dateFmt.format(new Date(r.updated))}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
