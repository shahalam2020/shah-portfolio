import { useId } from 'react';

/**
 * Generated app-UI illustrations (pure SVG) used when a project has no screenshots yet.
 * Replace with real images any time via `image` / `screenshots` in data/projects.js.
 */
const N = { card: '#101a38', line: '#1d2b52', soft: '#2a3a63', text: '#3a4d7c' };

const Card = ({ x, y, w, h, r = 8 }) => <rect x={x} y={y} width={w} height={h} rx={r} fill={N.card} stroke={N.line} />;
const Line = ({ x, y, w, h = 5, c = N.soft, g }) => <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={g || c} />;

function Frame({ g, children }) {
  return (
    <>
      <rect width="320" height="200" fill="#0a1020" />
      <rect width="44" height="200" fill="#0d1630" />
      <rect x="12" y="12" width="20" height="20" rx="6" fill={g} />
      {[52, 72, 92, 112].map((y, i) => <rect key={y} x="14" y={y} width="16" height="10" rx="4" fill={i === 0 ? N.soft : N.line} />)}
      <Line x={58} y={14} w={110} h={9} c={N.line} />
      <circle cx="298" cy="19" r="8" fill={g} />
      <circle cx="276" cy="19" r="6" fill={N.line} />
      {children}
    </>
  );
}

const Row = ({ y, g, i }) => (
  <>
    <Card x={58} y={y} w={254} h={26} r={7} />
    <circle cx="74" cy={y + 13} r="7" fill={i % 2 ? N.soft : g} opacity={i % 2 ? 1 : 0.85} />
    <Line x={90} y={y + 7} w={70 + (i * 17) % 40} />
    <Line x={90} y={y + 16} w={40} h={4} c={N.line} />
    <rect x="266" y={y + 7} width="36" height="12" rx="6" fill={g} opacity={0.4 + (i % 3) * 0.2} />
  </>
);

const Bars = ({ g, x = 66, y = 150, count = 9, w = 18, gap = 8, h = 70 }) =>
  Array.from({ length: count }, (_, i) => {
    const bh = 14 + ((i * 37 + 11) % h);
    return <rect key={i} x={x + i * (w + gap)} y={y - bh} width={w} height={bh} rx="5" fill={g} opacity={0.35 + (bh / h) * 0.65} />;
  });

const Ring = ({ g, cx, cy, r, pct }) => {
  const c = 2 * Math.PI * r;
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={N.line} strokeWidth="11" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={g} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} transform={`rotate(-90 ${cx} ${cy})`} />
      <Line x={cx - 18} y={cy - 4} w={36} h={7} c={N.text} />
      <Line x={cx - 12} y={cy + 8} w={24} h={4} c={N.line} />
    </>
  );
};

const variants = {
  expenses: (view, { g }) => {
    if (view % 3 === 1) {
      return (
        <>
          <Card x={58} y={38} w={110} h={150} r={12} />
          <Ring g={g} cx={113} cy={100} r={34} pct={0.68} />
          <Line x={78} y={150} w={70} h={5} c={N.soft} />
          <Line x={88} y={164} w={50} h={4} c={N.line} />
          {[38, 70, 102, 134].map((y, i) => <Row key={y} y={y} g={g} i={i} />).map((r, i) => <g key={i} transform="translate(114 0) scale(0.62 1)">{r}</g>)}
        </>
      );
    }
    if (view % 3 === 2) {
      return (
        <>
          {[0, 1, 2].map((i) => (<g key={i}><Card x={58 + i * 86} y={38} w={78} h={40} /><Line x={66 + i * 86} y={48} w={30} h={4} c={N.line} /><Line x={66 + i * 86} y={58} w={50} h={9} g={g} /></g>))}
          <Card x={58} y={88} w={254} h={104} r={12} />
          <Bars g={g} x={72} y={178} count={10} w={14} gap={10} h={62} />
        </>
      );
    }
    return (
      <>
        {[0, 1, 2].map((i) => (<g key={i}><Card x={58 + i * 86} y={38} w={78} h={44} /><Line x={66 + i * 86} y={48} w={26} h={4} c={N.line} /><Line x={66 + i * 86} y={58} w={46} h={9} g={i === 0 ? g : N.soft} /><Line x={66 + i * 86} y={72} w={34} h={4} c={N.line} /></g>))}
        {[96, 128, 160].map((y, i) => <Row key={y} y={y} g={g} i={i} />)}
      </>
    );
  },

  reminders: (view, { g }) => {
    const cal = (
      <>
        <Card x={58} y={38} w={160} h={152} r={12} />
        <Line x={70} y={50} w={60} h={7} c={N.text} />
        {Array.from({ length: 35 }, (_, i) => {
          const cx = 74 + (i % 7) * 21; const cy = 80 + Math.floor(i / 7) * 21;
          const sel = i === 16 + (view % 3);
          return (<g key={i}>{sel && <rect x={cx - 9} y={cy - 9} width="18" height="18" rx="6" fill={g} />}<circle cx={cx} cy={cy} r={sel ? 2.4 : 1.8} fill={sel ? '#fff' : N.soft} />{i % 6 === 2 && !sel && <circle cx={cx} cy={cy + 8} r="1.5" fill={g} />}</g>);
        })}
      </>
    );
    if (view % 3 === 1) {
      return (
        <>
          <Card x={58} y={38} w={254} h={152} r={12} />
          <Line x={74} y={52} w={90} h={8} c={N.text} />
          {[0, 1, 2].map((i) => <rect key={i} x="74" y={74 + i * 30} width="222" height="22" rx="8" fill="#0a1020" stroke={N.line} />)}
          <rect x="74" y="164" width="86" height="18" rx="9" fill={g} />
          <rect x="262" y="104" width="30" height="14" rx="7" fill={g} opacity="0.85" />
        </>
      );
    }
    return (
      <>
        {cal}
        {[0, 1, 2, 3].map((i) => (<g key={i}><Card x={228} y={38 + i * 38} w={84} h={32} r={8} /><rect x="236" y={48 + i * 38} width="12" height="12" rx="4" fill={i === 0 ? g : N.soft} /><Line x={254} y={49 + i * 38} w={46} /><Line x={254} y={59 + i * 38} w={28} h={4} c={N.line} /></g>))}
      </>
    );
  },

  orders: (view, { g }) => {
    if (view % 3 === 1) {
      return (
        <>
          <Card x={58} y={38} w={254} h={152} r={12} />
          <Line x={74} y={52} w={80} h={8} c={N.text} />
          <rect x="74" y="72" width="222" height="22" rx="8" fill="#0a1020" stroke={N.line} />
          {[0, 1, 2].map((i) => (<g key={i}><rect x="74" y={104 + i * 20} width="150" height="14" rx="6" fill="#0a1020" stroke={N.line} /><rect x="232" y={104 + i * 20} width="64" height="14" rx="6" fill="#0a1020" stroke={N.line} /></g>))}
          <rect x="74" y="168" width="100" height="16" rx="8" fill={g} />
        </>
      );
    }
    if (view % 3 === 2) {
      return (
        <>
          <Card x={58} y={38} w={120} h={150} r={12} />
          <Ring g={g} cx={118} cy={102} r={32} pct={0.6} />
          <Card x={186} y={38} w={126} h={70} r={12} /><Line x={198} y={52} w={40} h={4} c={N.line} /><Line x={198} y={64} w={70} h={10} g={g} />
          <Card x={186} y={118} w={126} h={70} r={12} /><Line x={198} y={132} w={40} h={4} c={N.line} /><Line x={198} y={144} w={56} h={10} c={N.soft} />
        </>
      );
    }
    return (
      <>
        {[0, 1].map((i) => (<g key={i}><Card x={58 + i * 130} y={38} w={122} h={40} /><Line x={68 + i * 130} y={48} w={34} h={4} c={N.line} /><Line x={68 + i * 130} y={58} w={60} h={9} g={i ? N.soft : g} /></g>))}
        {[88, 118, 148].map((y, i) => <Row key={y} y={y} g={g} i={i} />)}
      </>
    );
  },

  library: (view, { g }) => {
    if (view % 3 === 1) {
      return (
        <>
          <Card x={58} y={38} w={254} h={152} r={12} />
          <rect x="74" y="54" width="62" height="86" rx="8" fill={g} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x="148" y={54 + i * 24} width={148 - (i % 2) * 40} height="16" rx="7" fill="#0a1020" stroke={N.line} />)}
          <rect x="74" y="160" width="90" height="18" rx="9" fill={g} />
        </>
      );
    }
    if (view % 3 === 2) {
      return (<>{[0, 1, 2, 3].map((i) => <Row key={i} y={38 + i * 36} g={g} i={i} />)}</>);
    }
    return (
      <>
        <rect x="58" y="36" width="150" height="14" rx="7" fill="#0a1020" stroke={N.line} />
        {Array.from({ length: 8 }, (_, i) => {
          const x = 58 + (i % 4) * 64; const y = 60 + Math.floor(i / 4) * 66;
          return (<g key={i}><rect x={x} y={y} width="56" height="46" rx="8" fill={g} opacity={0.35 + ((i * 3) % 5) * 0.13} /><Line x={x} y={y + 52} w={44} h={4} c={N.soft} /><Line x={x} y={y + 60} w={28} h={3} c={N.line} /></g>);
        })}
      </>
    );
  },
};

export default function MockScreen({ variant = 'expenses', accent = ['#22d3ee', '#6366f1'], view = 0, className = '' }) {
  const id = `mg${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const g = `url(#${id})`;
  const draw = variants[variant] || variants.expenses;
  return (
    <svg viewBox="0 0 320 200" className={`block h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={accent[0]} />
          <stop offset="1" stopColor={accent[1]} />
        </linearGradient>
      </defs>
      <Frame g={g}>{draw(view, { g })}</Frame>
    </svg>
  );
}
