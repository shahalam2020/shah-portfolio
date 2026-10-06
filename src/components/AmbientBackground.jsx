import { useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery';

/** Static gradient + grid backdrop with one soft pointer-following glow (desktop only). */
export default function AmbientBackground() {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bg = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, rgb(var(--primary) / 0.10), transparent 65%)`;

  useEffect(() => {
    if (!fine || reduce) return undefined;
    const move = (e) => { mx.set((e.clientX / window.innerWidth) * 100); my.set((e.clientY / window.innerHeight) * 100); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [fine, reduce, mx, my]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-secondary/20 blur-[120px] dark:bg-secondary/25" />
      <div className="absolute -right-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-[120px] dark:bg-primary/12" />
      <div className="absolute bottom-[-12rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-[130px]" />
      <div className="bg-grid absolute inset-0" />
      {fine && !reduce && <motion.div className="absolute inset-0" style={{ background: bg }} />}
    </div>
  );
}
