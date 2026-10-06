import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useFinePointer } from '../hooks/useMediaQuery';

/**
 * Interactive 3D card: perspective tilt + moving glare + optional magnetic pull toward the cursor.
 * Falls back to a plain element on touch devices and for prefers-reduced-motion.
 */
export default function TiltCard({ children, className = '', max = 9, scale = 1.015, glare = true, magnet = 0, as = 'div', style, ...rest }) {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;
  const [hover, setHover] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 220, damping: 22, mass: 0.6 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const x = useTransform(sx, [0, 1], [-magnet, magnet]);
  const y = useTransform(sy, [0, 1], [-magnet, magnet]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(360px circle at ${gx} ${gy}, rgb(var(--primary) / 0.16), transparent 62%)`;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { px.set(0.5); py.set(0.5); setHover(false); };

  const M = motion[as];
  if (!enabled) {
    const T = as;
    return <T ref={ref} className={className} style={style} {...rest}>{children}</T>;
  }

  return (
    <M
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={reset}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{ ...style, rotateX, rotateY, x: magnet ? x : 0, y: magnet ? y : 0, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      {...rest}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg, opacity: hover ? 1 : 0, transition: 'opacity .35s ease' }}
        />
      )}
    </M>
  );
}
