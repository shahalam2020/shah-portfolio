import { motion } from 'framer-motion';
import { ArrowDown, Download, FileText, Github, Linkedin, Mail, MapPin, Rocket, Send } from 'lucide-react';
import SplitText from '../components/SplitText';
import ProfileCard from '../components/ProfileCard';
import HeroScene from '../components/HeroScene';
import ButtonLink from '../components/ButtonLink';
import { site } from '../config/site';
import useContent from '../hooks/useContent';
import { scrollToId } from '../utils/scroll';
import { ease } from '../utils/motion';

const hl = 'font-semibold text-ink';
const social = 'icon-btn';

export default function Hero() {
  const { settings } = useContent();
  const fade = (delay) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay } });

  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] scroll-mt-0 items-center pb-16 pt-28 sm:pt-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <div>
          <motion.span {...fade(0.05)} className="chip border-primary/30 bg-primary/10 font-mono text-[11px] font-semibold tracking-[0.14em] text-primary-ink">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-primary" aria-hidden="true" />
            {site.hero.badge}
          </motion.span>

          <h1 id="hero-title" className="mt-6 text-[2.5rem] font-bold leading-[1.04] sm:text-6xl lg:text-[4.1rem]">
            <span className="block">
              <SplitText text={site.hero.greeting} delay={0.15} />{' '}
              <SplitText text={site.name} delay={0.3} wordClass="text-gradient" />
            </span>
            <span className="mt-1 block text-ink/95">
              <SplitText text={site.hero.headline} delay={0.5} />
            </span>
          </h1>

          <motion.div {...fade(0.9)} className="mt-6 max-w-xl space-y-3">
            <p className="text-lg leading-relaxed text-ink/90 sm:text-xl">
              <span className="text-gradient font-semibold">Full Stack</span> Web Developer specializing in modern <span className={hl}>React</span> frontends, scalable{' '}
              <span className={hl}>ASP.NET Core</span> APIs, real-time applications, authentication, databases and interactive user experiences.
            </p>
            <p className="text-base leading-relaxed text-muted">{site.hero.description}</p>
          </motion.div>

          <motion.div {...fade(1.05)} className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={settings.resumePath} download={site.resumeFileName} icon={Download}>Download Resume</ButtonLink>
            <ButtonLink variant="ghost" icon={Rocket} onClick={() => scrollToId('projects')}>View Projects</ButtonLink>
            <ButtonLink variant="ghost" icon={Send} onClick={() => scrollToId('contact')}>Contact Me</ButtonLink>
          </motion.div>

          <motion.div {...fade(1.2)} className="mt-8 flex flex-wrap items-center gap-3">
            <a className={social} href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Github size={19} /></a>
            <a className={social} href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><Linkedin size={19} /></a>
            <button type="button" className={social} onClick={() => scrollToId('contact')} aria-label="Email me — jump to contact form"><Mail size={19} /></button>
            <span className="mx-1 hidden h-6 w-px bg-line/30 sm:block" aria-hidden="true" />
            <a href={settings.resumePath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-muted transition hover:text-primary-ink">
              <FileText size={16} aria-hidden="true" /> View Resume
            </a>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={15} aria-hidden="true" /> {site.location}
            </span>
          </motion.div>
        </div>

        <motion.div {...fade(0.35)} className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
          <div className="relative mx-auto max-w-[420px] px-6 pb-8 pt-10 sm:px-0">
            <ProfileCard />
            <HeroScene className="absolute -inset-x-6 -inset-y-14 z-30 sm:-inset-x-14" />
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => scrollToId('about')}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted transition hover:text-ink md:flex"
        aria-label="Scroll to About section"
      >
        <span>Scroll</span>
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={16} aria-hidden="true" />
        </motion.span>
      </button>
    </section>
  );
}
