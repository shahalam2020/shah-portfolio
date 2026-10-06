import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { navLinks } from '../config/site';
import useScrollSpy from '../hooks/useScrollSpy';
import useContent from '../hooks/useContent';
import { scrollToId } from '../utils/scroll';

const ids = navLinks.map((l) => l.id);

function Burger({ open }) {
  const bar = 'absolute left-0 block h-0.5 w-5 rounded-full bg-current';
  return (
    <span className="relative block h-5 w-5" aria-hidden="true">
      <motion.span className={bar} style={{ top: 3 }} animate={open ? { y: 5.5, rotate: 45 } : { y: 0, rotate: 0 }} />
      <motion.span className={bar} style={{ top: 9.5 }} animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.3 : 1 }} />
      <motion.span className={bar} style={{ top: 16 }} animate={open ? { y: -5.5, rotate: -45 } : { y: 0, rotate: 0 }} />
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';
  const active = useScrollSpy(ids, isHome);
  const { settings } = useContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const go = useCallback((e, id) => {
    e.preventDefault();
    setOpen(false);
    if (isHome) {
      if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else scrollToId(id);
      window.history.replaceState(null, '', id === 'home' ? '/' : `/#${id}`);
    } else {
      navigate(id === 'home' ? '/' : `/#${id}`);
    }
  }, [isHome, navigate]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.1 }}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-3xl border px-4 transition-all duration-500 sm:px-5 ${
          scrolled || open
            ? 'glass border-line/25 py-2 shadow-card'
            : 'border-transparent bg-transparent py-3 shadow-none'
        }`}
      >
        <Link to="/" onClick={(e) => go(e, 'home')} aria-label={`${navLinks[0].label} — back to top`} className="rounded-xl">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const isActive = isHome && active === l.id;
            return (
              <li key={l.id}>
                <a
                  href={l.id === 'home' ? '/' : `/#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative block rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl border border-primary/25 bg-primary/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a href={settings.resumePath} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm hidden sm:inline-flex">
            <FileText size={15} aria-hidden="true" /> Resume
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn h-10 w-10 rounded-xl lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Burger open={open} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden"
          >
            <ul className="grid gap-1">
              {navLinks.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <a
                    href={l.id === 'home' ? '/' : `/#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium ${isHome && active === l.id ? 'bg-primary/10 text-primary-ink' : 'text-ink hover:bg-primary/5'}`}
                  >
                    {l.label}
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href={settings.resumePath} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2 w-full">
              <FileText size={16} aria-hidden="true" /> View Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
