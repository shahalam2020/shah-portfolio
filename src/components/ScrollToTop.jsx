import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scrollToId } from '../utils/scroll';

/** Resets scroll on route change (or jumps to #hash) and shows a back-to-top button. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      let tries = 0;
      const t = window.setInterval(() => {
        tries += 1;
        if (scrollToId(id) || tries > 25) window.clearInterval(t);
      }, 120);
      return () => window.clearInterval(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          className="icon-btn fixed bottom-5 right-5 z-40 sm:bottom-8 sm:right-8"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
