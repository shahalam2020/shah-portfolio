import { site } from '../config/site';

export default function Logo({ compact = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0 drop-shadow-[0_0_10px_rgb(var(--primary)/0.45)]">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'rgb(var(--primary))' }} />
            <stop offset="1" style={{ stopColor: 'rgb(var(--secondary))' }} />
          </linearGradient>
        </defs>
        <path d="M32 6l22 12.7v26.6L32 58 10 45.3V18.7z" fill="rgb(var(--surface) / 0.7)" stroke="url(#logo-g)" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M26 25l-7 7 7 7M38 25l7 7-7 7" fill="none" stroke="rgb(var(--text))" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[17px] font-bold tracking-tight text-ink">{site.name}</span>
          <span className="mt-1 block font-mono text-[10.5px] text-muted">&lt;fullstack /&gt;</span>
        </span>
      )}
    </span>
  );
}
