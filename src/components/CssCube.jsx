import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

const FACES = [
  { l: '</>', t: 'rotateY(0deg)' },
  { l: '{}', t: 'rotateY(90deg)' },
  { l: 'C#', t: 'rotateY(180deg)' },
  { l: 'JS', t: 'rotateY(-90deg)' },
  { l: 'API', t: 'rotateX(90deg)' },
  { l: '()', t: 'rotateX(-90deg)' },
];

/** Pure-CSS 3D cube: instant placeholder while WebGL loads, and the fallback for reduced-motion / no WebGL. */
export default function CssCube({ size = 112, className = '' }) {
  const reduce = usePrefersReducedMotion();
  return (
    <div className={`perspective ${className}`} style={{ width: size, height: size, '--s': `${size}px` }} aria-hidden="true">
      <div
        className={`css-cube ${reduce ? '' : 'animate-spin3d'}`}
        style={reduce ? { transform: 'rotateX(-24deg) rotateY(38deg)' } : undefined}
      >
        {FACES.map((f) => (
          <div key={f.l} className="face rounded-lg text-xl" style={{ transform: `${f.t} translateZ(calc(var(--s) / 2))` }}>
            {f.l}
          </div>
        ))}
      </div>
    </div>
  );
}
