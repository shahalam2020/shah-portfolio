import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import BrowserMockup from './BrowserMockup';

export default function Lightbox({ project, items, index, onClose, onChange }) {
  const open = index !== null;
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, index, items.length, onClose, onChange]);

  const item = open ? items[index] : null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} screenshot ${index + 1} of ${items.length}`}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }} className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <BrowserMockup project={project} src={item.src} alt={item.caption} view={index} priority />
            <p className="mt-4 text-center text-sm text-white/80">{item.title ? `${item.title} — ` : ''}{item.caption}</p>
          </motion.div>
          <button type="button" onClick={onClose} aria-label="Close" className="icon-btn absolute right-4 top-4 !text-white"><X size={20} /></button>
          {items.length > 1 && (
            <>
              <button type="button" aria-label="Previous screenshot" onClick={(e) => { e.stopPropagation(); onChange((index - 1 + items.length) % items.length); }} className="icon-btn absolute left-3 top-1/2 -translate-y-1/2 !text-white"><ChevronLeft size={20} /></button>
              <button type="button" aria-label="Next screenshot" onClick={(e) => { e.stopPropagation(); onChange((index + 1) % items.length); }} className="icon-btn absolute right-3 top-1/2 -translate-y-1/2 !text-white"><ChevronRight size={20} /></button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
