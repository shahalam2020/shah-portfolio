import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

export default function useCountUp(target, duration = 1400) {
  const reduce = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target == null) return undefined;
    if (reduce) { setValue(target); return undefined; }
    let raf; const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - (1 - p) ** 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);
  return value;
}
