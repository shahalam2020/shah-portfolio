import { Github, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ViewCounter from './ViewCounter';
import { quickLinks, site } from '../config/site';
import { scrollToId } from '../utils/scroll';

export default function Footer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const go = (e, id) => {
    e.preventDefault();
    if (pathname === '/') (id === 'home' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : scrollToId(id));
    else navigate(id === 'home' ? '/' : `/#${id}`);
  };
  const s = 'icon-btn h-10 w-10 rounded-xl';
  return (
    <footer className="relative mt-10 border-t border-line/15">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label={`${site.name} home`}><Logo /></Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{site.footerBlurb}</p>
          <ViewCounter className="mt-5" />
        </div>
        <nav aria-label="Quick links">
          <h2 className="mb-4 text-sm font-semibold">Quick links</h2>
          <ul className="space-y-2.5 text-sm text-muted">
            {quickLinks.map((l) => (
              <li key={l.id}><a href={l.id === 'home' ? '/' : `/#${l.id}`} onClick={(e) => go(e, l.id)} className="transition hover:text-primary-ink">{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 text-sm font-semibold">Find me online</h2>
          <div className="flex gap-3">
            <a className={s} href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a className={s} href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a className={s} href={`mailto:${site.email}`} aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-line/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-mono">{site.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
