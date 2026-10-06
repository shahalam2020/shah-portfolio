import MockScreen from './MockScreen';

/** Browser-window frame around either a real screenshot or a generated mockup. */
export default function BrowserMockup({ project, src, alt, view = 0, className = '', imgClass = '', priority = false }) {
  const url = `${project.slug}.app`;
  return (
    <div className={`overflow-hidden rounded-2xl border border-line/25 bg-[#0a1020] shadow-card ${className}`}>
      <div className="flex items-center gap-3 border-b border-white/5 bg-[#0d1630] px-3.5 py-2.5" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto max-w-[60%] flex-1 truncate rounded-md bg-white/5 px-3 py-0.5 text-center font-mono text-[10px] text-slate-400">https://{url}</span>
        <span className="w-10" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {src ? (
          <img
            src={src}
            alt={alt || `${project.title} screenshot`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`h-full w-full object-cover object-top ${imgClass}`}
          />
        ) : (
          <div className={`h-full w-full ${imgClass}`}>
            <MockScreen variant={project.mock} accent={project.accent} view={view} />
          </div>
        )}
      </div>
    </div>
  );
}
