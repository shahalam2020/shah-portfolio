import { Download, Eye, FileText } from 'lucide-react';
import Reveal from '../components/Reveal';
import ButtonLink from '../components/ButtonLink';
import TiltCard from '../components/TiltCard';
import ViewCounter from '../components/ViewCounter';
import { site } from '../config/site';
import useContent from '../hooks/useContent';

export default function Resume() {
  const { settings } = useContent();
  return (
    <section id="resume" aria-labelledby="resume-title" className="section">
      <div className="container-x">
        <Reveal>
          <div className="spin-border rounded-[2rem] p-[1.5px]">
            <div className="glass relative grid items-center gap-10 overflow-hidden rounded-[calc(2rem-1.5px)] p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <h2 id="resume-title" className="text-3xl font-bold sm:text-4xl">Want to know more about my experience?</h2>
                <p className="mt-4 max-w-lg text-muted">
                  My resume covers my roles, projects and full tech stack on one page. Read it in your browser or keep a copy.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={settings.resumePath} external icon={Eye}>View Resume</ButtonLink>
                  <ButtonLink href={settings.resumePath} download={site.resumeFileName} variant="ghost" icon={Download}>Download Resume</ButtonLink>
                </div>
                <ViewCounter className="mt-8" />
              </div>

              <TiltCard className="relative mx-auto w-full max-w-[260px]" max={12}>
                <div className="relative aspect-[3/4] rounded-2xl border border-line/25 bg-surface p-5 shadow-card" style={{ transform: 'rotate(-3deg)' }} aria-hidden="true">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white"><FileText size={16} /></span>
                    <div>
                      <div className="h-2.5 w-24 rounded bg-ink/80" />
                      <div className="mt-1.5 h-2 w-16 rounded bg-primary/70" />
                    </div>
                  </div>
                  {[70, 94, 82, 90, 60, 88, 76, 50].map((w, i) => (
                    <div key={i} className="mt-3.5 h-1.5 rounded bg-muted/30" style={{ width: `${w}%`, marginTop: i === 3 ? 22 : undefined }} />
                  ))}
                  <div className="absolute inset-x-5 bottom-5 flex gap-2">
                    {['React', '.NET', 'SQL'].map((t) => <span key={t} className="chip-tech text-[9px]">{t}</span>)}
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
