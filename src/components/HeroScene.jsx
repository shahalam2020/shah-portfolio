import { Suspense, lazy, useEffect, useState } from 'react';
import CssCube from './CssCube';

const Scene3D = lazy(() => import('../three/Scene3D'));

const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
};

/**
 * Lazy 3D scene. Shows the CSS cube instantly, then cross-fades to the WebGL scene
 * once the three.js chunk has loaded (after the browser is idle).
 */
export default function HeroScene({ className = '' }) {
  const [enabled] = useState(() => supportsWebGL() && !navigator.connection?.saveData);
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const ric = window.requestIdleCallback;
    const id = ric ? ric(() => setIdle(true), { timeout: 1500 }) : window.setTimeout(() => setIdle(true), 500);
    return () => (ric ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, [enabled]);

  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <div className={`absolute right-[7%] top-[5%] transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>
        <CssCube size={104} />
      </div>
      {enabled && idle && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={null}>
            <Scene3D onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
