import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import "./ScreenshotGallery.css";

/**
 * ScreenshotGallery (3D + live animation version)
 * - Cards: cursor-follow 3D tilt, glare, parallax, floating, scan line
 * - Scroll pe 3D reveal
 * - Click -> lightbox (3D flip transition, tilt, dots)
 * - Esc = band, <- / -> = prev/next, phone pe swipe bhi chalta hai
 *
 * Usage:
 *   <ScreenshotGallery screenshots={project.screenshots} title={project.title} />
 */

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TILT_VARS = ["--rx", "--ry", "--mx", "--my", "--px", "--py"];

/** Cursor-follow tilt. CSS vars set karta hai: --rx --ry --mx --my --px --py */
function useTilt(max = 8) {
  const ref = useRef(null);

  const onPointerMove = (e) => {
    if (e.pointerType === "touch" || reducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--px", `${((x - 0.5) * -12).toFixed(2)}px`);
    el.style.setProperty("--py", `${((y - 0.5) * -12).toFixed(2)}px`);
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    TILT_VARS.forEach((v) => el.style.removeProperty(v));
  };

  return { ref, onPointerMove, onPointerLeave };
}

/** Ek baar viewport mein aaye to true */
function useSeen(ref, threshold = 0.15) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  return seen;
}

function Shot({ shot, index, title, onOpen }) {
  const tilt = useTilt(9);
  const seen = useSeen(tilt.ref);

  return (
    <div
      ref={tilt.ref}
      className={`shot-wrap ${seen ? "is-in" : ""}`}
      style={{ "--i": index }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <div className="shot-float">
        <button
          type="button"
          className="shot"
          onClick={() => onOpen(index)}
          aria-label={`Open ${shot.title} screenshot`}
        >
          <span className="shot-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span className="shot-bar-title">{shot.title}</span>
            <span className="shot-bar-no">
              {String(index + 1).padStart(2, "0")}
            </span>
          </span>

          <span className="shot-frame">
            <img
              src={shot.src}
              alt={`${title} ${shot.title} screen`}
              loading="lazy"
              draggable="false"
            />
            <span className="shot-scan" aria-hidden="true" />
            <span className="shot-overlay" aria-hidden="true">
              <span className="shot-zoom">
                <Maximize2 size={16} />
              </span>
            </span>
          </span>

          <span className="shot-caption">{shot.caption}</span>
          <span className="shot-glare" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function ScreenshotGallery({ screenshots = [], title = "" }) {
  const [active, setActive] = useState(null);
  const [dir, setDir] = useState(0); // 0 = pehli baar khula, 1 = next, -1 = prev
  const touchStartX = useRef(null);
  const lbTilt = useTilt(6);
  const total = screenshots.length;

  const open = useCallback((i) => {
    setDir(0);
    setActive(i);
  }, []);
  const close = useCallback(() => setActive(null), []);
  const next = useCallback(() => {
    setDir(1);
    setActive((i) => (i === null ? i : (i + 1) % total));
  }, [total]);
  const prev = useCallback(() => {
    setDir(-1);
    setActive((i) => (i === null ? i : (i - 1 + total) % total));
  }, [total]);

  function go(i) {
    if (i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
  }

  // Keyboard controls + page scroll lock jab lightbox open ho
  useEffect(() => {
    if (active === null) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, close, next, prev]);

  if (!total) return null;

  const current = active !== null ? screenshots[active] : null;
  const enterClass =
    dir === 1 ? "lb-in-next" : dir === -1 ? "lb-in-prev" : "lb-in-pop";

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next();
    else prev();
  }

  return (
    <section className="shots" aria-label={`${title} screenshots`}>
      <div className="shots-ambient" aria-hidden="true">
        <span className="shots-blob shots-blob-a" />
        <span className="shots-blob shots-blob-b" />
      </div>

      <div className="shots-head">
        <h2 className="shots-title">App screenshots</h2>
       
      </div>

      <div className="shots-grid">
        {screenshots.map((shot, i) => (
          <Shot
            key={shot.src}
            shot={shot}
            index={i}
            title={title}
            onOpen={open}
          />
        ))}
      </div>

      {current &&
        createPortal(
          <div
            className="lb"
            role="dialog"
            aria-modal="true"
            aria-label={`${current.title} screenshot`}
            onClick={close}
          >
            <button
              type="button"
              className="lb-close"
              onClick={close}
              aria-label="Close"
              autoFocus
            >
              <X size={20} />
            </button>

            {total > 1 && (
              <button
                type="button"
                className="lb-nav lb-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            <figure
              ref={lbTilt.ref}
              className="lb-stage"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onPointerMove={lbTilt.onPointerMove}
              onPointerLeave={lbTilt.onPointerLeave}
            >
              <div className="lb-tilt">
                <img
                  key={current.src}
                  className={`lb-img ${enterClass}`}
                  src={current.src}
                  alt={`${title} ${current.title} screen`}
                  draggable="false"
                />
                <span className="lb-glare" aria-hidden="true" />
              </div>

              <figcaption className="lb-caption">
                <strong>{current.title}</strong>
                <span>{current.caption}</span>
                <em>
                  {active + 1} / {total}
                </em>
              </figcaption>

              {total > 1 && (
                <div className="lb-dots" role="tablist" aria-label="Screenshots">
                  {screenshots.map((s, i) => (
                    <button
                      type="button"
                      key={s.src}
                      role="tab"
                      aria-selected={i === active}
                      aria-label={`Go to ${s.title}`}
                      className={`lb-dot ${i === active ? "is-active" : ""}`}
                      onClick={() => go(i)}
                    />
                  ))}
                </div>
              )}
            </figure>

            {total > 1 && (
              <button
                type="button"
                className="lb-nav lb-next"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next screenshot"
              >
                <ChevronRight size={26} />
              </button>
            )}
          </div>,
          document.body
        )}
    </section>
  );
}