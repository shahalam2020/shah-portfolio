import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useInView } from 'framer-motion';
import {
  AdditiveBlending, BoxGeometry, CanvasTexture, DoubleSide, EdgesGeometry, MathUtils, SRGBColorSpace,
} from 'three';
import useTheme from '../hooks/useTheme';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * Floating glass cube with code symbols on every face.
 * - Cheap: no external assets, no env maps, ~7 meshes, canvas textures made at runtime.
 * - Gentle: slow auto-rotation + damped mouse tilt.
 * - Polite: pauses off-screen, renders a single static frame for prefers-reduced-motion.
 */
const FACES = [
  { label: '</>', pos: [0, 0, 0.505], rot: [0, 0, 0] },
  { label: '{}', pos: [0.505, 0, 0], rot: [0, Math.PI / 2, 0] },
  { label: 'C#', pos: [0, 0, -0.505], rot: [0, Math.PI, 0] },
  { label: 'JS', pos: [-0.505, 0, 0], rot: [0, -Math.PI / 2, 0] },
  { label: 'API', pos: [0, 0.505, 0], rot: [-Math.PI / 2, 0, 0] },
  { label: '()', pos: [0, -0.505, 0], rot: [Math.PI / 2, 0, 0] },
];

const PALETTE = {
  dark: { edge: '#22d3ee', symbol: '#cffafe', glow: '#22d3ee', body: '#1d4ed8', core: '#a78bfa', ring: '#22d3ee', shard1: '#22d3ee', shard2: '#a78bfa', bodyOpacity: 0.2, halo: 'rgba(34,211,238,0.55)' },
  light: { edge: '#0e7490', symbol: '#312e81', glow: '#38bdf8', body: '#38bdf8', core: '#7c3aed', ring: '#0891b2', shard1: '#0891b2', shard2: '#7c3aed', bodyOpacity: 0.26, halo: 'rgba(14,116,144,0.28)' },
};

function labelTexture(label, color, glow) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  g.font = `700 ${label.length > 2 ? 92 : 120}px "JetBrains Mono Variable", ui-monospace, Menlo, Consolas, monospace`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.shadowColor = glow;
  g.shadowBlur = 26;
  g.fillStyle = color;
  g.fillText(label, 128, 138);
  g.shadowBlur = 0;
  g.fillText(label, 128, 138);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function haloTexture(color) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function Shard({ kind, frac, size, color, speed, reduce }) {
  const ref = useRef();
  const { viewport } = useThree();
  useFrame((s, dt) => {
    if (reduce || !ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.x += dt * speed;
    ref.current.rotation.y += dt * speed * 0.8;
    ref.current.position.y = viewport.height * frac[1] + Math.sin(t * 0.8 + frac[0] * 7) * viewport.height * 0.018;
  });
  const s = viewport.width * size;
  return (
    <mesh ref={ref} position={[viewport.width * frac[0], viewport.height * frac[1], -0.2]} scale={s} rotation={[0.5, 0.4, 0]}>
      {kind === 'octa' && <octahedronGeometry args={[1, 0]} />}
      {kind === 'tetra' && <tetrahedronGeometry args={[1, 0]} />}
      {kind === 'torus' && <torusGeometry args={[1, 0.28, 12, 28]} />}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.35} metalness={0.2} transparent opacity={0.9} />
    </mesh>
  );
}

function Cube({ reduce, isDark }) {
  const pal = isDark ? PALETTE.dark : PALETTE.light;
  const rig = useRef();
  const tilt = useRef();
  const spin = useRef();
  const core = useRef();
  const ring = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const textures = useMemo(() => FACES.map((f) => labelTexture(f.label, pal.symbol, pal.glow)), [pal.symbol, pal.glow]);
  const halo = useMemo(() => haloTexture(pal.halo), [pal.halo]);
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(1, 1, 1)), []);
  useEffect(() => () => { textures.forEach((t) => t.dispose()); halo.dispose(); edges.dispose(); }, [textures, halo, edges]);

  useEffect(() => {
    if (reduce) return undefined;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce]);

  const baseX = viewport.width * 0.24;
  const baseY = viewport.height * 0.25;
  const unit = viewport.width * 0.25;

  useFrame((state, dt) => {
    if (reduce || !rig.current) return;
    const t = state.clock.elapsedTime;
    rig.current.position.y = baseY + Math.sin(t * 0.9) * unit * 0.06;
    tilt.current.rotation.x = MathUtils.damp(tilt.current.rotation.x, 0.32 + pointer.current.y * 0.32, 3, dt);
    tilt.current.rotation.y = MathUtils.damp(tilt.current.rotation.y, pointer.current.x * 0.45, 3, dt);
    spin.current.rotation.y += dt * 0.32;
    spin.current.rotation.z = Math.sin(t * 0.4) * 0.06;
    core.current.rotation.x -= dt * 0.55;
    core.current.rotation.y += dt * 0.45;
    ring.current.rotation.z += dt * 0.22;
  });

  return (
    <>
      <group ref={rig} position={[baseX, baseY, 0]} scale={unit}>
        <sprite scale={[3.6, 3.6, 1]} position={[0, 0, -0.6]}>
          <spriteMaterial map={halo} transparent opacity={isDark ? 0.5 : 0.7} depthWrite={false} blending={isDark ? AdditiveBlending : 1} />
        </sprite>
        <group ref={tilt} rotation={[0.32, 0.55, 0]}>
          <group ref={spin} rotation={reduce ? [0, 0.4, 0] : [0, 0, 0]}>
            {/* glass body */}
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial color={pal.body} transparent opacity={pal.bodyOpacity} roughness={0.08} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} side={DoubleSide} depthWrite={false} emissive={pal.body} emissiveIntensity={isDark ? 0.18 : 0.06} />
            </mesh>
            <lineSegments geometry={edges}>
              <lineBasicMaterial color={pal.edge} transparent opacity={0.95} />
            </lineSegments>
            {/* symbols */}
            {FACES.map((f, i) => (
              <mesh key={f.label} position={f.pos} rotation={f.rot}>
                <planeGeometry args={[0.8, 0.8]} />
                <meshBasicMaterial map={textures[i]} transparent depthWrite={false} side={DoubleSide} />
              </mesh>
            ))}
            {/* inner core */}
            <mesh ref={core} scale={0.2}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={pal.core} emissive={pal.core} emissiveIntensity={0.9} wireframe />
            </mesh>
          </group>
          {/* orbit ring */}
          <mesh ref={ring} rotation={[Math.PI / 2.4, 0.2, 0]}>
            <torusGeometry args={[0.95, 0.008, 8, 90]} />
            <meshBasicMaterial color={pal.ring} transparent opacity={0.7} />
          </mesh>
        </group>
      </group>
      <Shard kind="octa" frac={[0.34, -0.1]} size={0.032} color={pal.shard1} speed={0.7} reduce={reduce} />
      <Shard kind="tetra" frac={[-0.04, 0.38]} size={0.026} color={pal.shard2} speed={0.9} reduce={reduce} />
      <Shard kind="torus" frac={[0.08, -0.36]} size={0.022} color={pal.shard1} speed={0.5} reduce={reduce} />
    </>
  );
}

export default function Scene3D({ onReady }) {
  const { isDark } = useTheme();
  const reduce = usePrefersReducedMotion();
  const wrap = useRef(null);
  const inView = useInView(wrap, { margin: '120px' });

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={inView ? (reduce ? 'demand' : 'always') : 'never'}
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); onReady?.(); }}
      >
        <ambientLight intensity={isDark ? 0.9 : 1.4} />
        <pointLight position={[3, 3, 4]} intensity={isDark ? 60 : 40} color={isDark ? '#22d3ee' : '#ffffff'} />
        <pointLight position={[-3, -2, 3]} intensity={isDark ? 40 : 25} color={isDark ? '#a78bfa' : '#7c3aed'} />
        <Cube reduce={reduce} isDark={isDark} />
      </Canvas>
    </div>
  );
}
