import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const MOBILE_BP = 760; // CSS ke @media(max-width:760px) se match hona chahiye

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null); // scroll-spy: abhi kaunsa section screen par hai
  const [hovered, setHovered] = useState(null);
  const [chip, setChip] = useState({ x: 0, w: 0, show: false, snap: true });
  const [tick, setTick] = useState(0); // resize / font load par chip dobara naapne ke liye

  const wrapRef = useRef(null);
  const pillRef = useRef(null);
  const linkRefs = useRef({});
  const prevPath = useRef(null);

  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const isResume = pathname === "/resume";

  /* ---------- scroll to section ---------- */
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const go = (id) => {
    setOpen(false);

    // Resume (ya kisi aur) page par ho to pehle home par jao, phir section tak scroll
    if (pathname !== "/") {
      navigate("/", { state: id === "home" ? null : { scrollTo: id } });
      return;
    }
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else scrollToId(id);
  };

  /* ---------- route badalne par: section tak scroll, warna page ke top par ---------- */
  useEffect(() => {
    const changed = prevPath.current !== null && prevPath.current !== pathname;
    prevPath.current = pathname;

    const id = state?.scrollTo;
    if (id) {
      const t = setTimeout(() => {
        scrollToId(id);
        navigate(pathname, { replace: true, state: null }); // refresh par dobara scroll na ho
      }, 120);
      return () => clearTimeout(t);
    }
    if (changed) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, state]);

  /* ---------- scroll: shrink + scroll-spy + progress line ---------- */
  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      // scroll-spy (sirf home page par; /resume par koi section highlight nahi hoga)
      let current = null;
      if (!isResume) {
        const line = window.innerHeight * 0.38;
        for (const { id } of LINKS) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) current = id;
        }
        const atBottom =
          window.innerHeight + y >= document.documentElement.scrollHeight - 4;
        if (atBottom) current = LINKS[LINKS.length - 1].id;
      }
      setActive(current);

      // progress line (re-render nahi karta, seedha CSS variable set karta hai)
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      wrapRef.current?.style.setProperty("--progress", pct.toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      setTick((t) => t + 1);
      if (window.innerWidth > MOBILE_BP) setOpen(false);
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => setTick((t) => t + 1));

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isResume, pathname]);

  /* ---------- sliding glass chip (hover ya active link ke peeche) ---------- */
  const target = hovered ?? active;

  useLayoutEffect(() => {
    const el = target ? linkRefs.current[target] : null;
    if (!el) {
      setChip((c) => ({ ...c, show: false }));
      return;
    }
    setChip((c) => ({
      x: el.offsetLeft,
      w: el.offsetWidth,
      show: true,
      snap: !c.show, // pehli baar bina slide kiye seedha wahin dikhe
    }));
  }, [target, tick]);

  /* ---------- mobile menu: Esc ya bahar click se band ---------- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  /* ---------- 3D tilt + cursor spotlight ---------- */
  const onPointerMove = (e) => {
    if (e.pointerType === "touch") return;
    const el = pillRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--ry", `${(px - 0.5) * 7}deg`);
    el.style.setProperty("--rx", `${-(py - 0.5) * 10}deg`);
  };

  const onPointerLeave = () => {
    const el = pillRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  /* ---------- VIEW RESUME click ---------- */
  const onResumeClick = (e) => {
    setOpen(false);
    // Pehle se /resume par ho to sirf upar scroll kar do
    if (isResume) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      ref={wrapRef}
      className={`nav-wrap${scrolled ? " is-scrolled" : ""}`}
    >
      <div className="nav-shell">
        <nav
          ref={pillRef}
          className="nav-pill"
          aria-label="Primary"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <span className="nav-glass" aria-hidden="true" />
          <span className="nav-progress" aria-hidden="true" />

          <button
            className="brand"
            onClick={() => go("home")}
            aria-label="Shah Alam, back to top"
          >
            <span className="brand-l">&lt;</span>Shah Alam
            <span className="brand-r">/&gt;</span>
          </button>

          <div
            id="nav-links"
            className={`nav-links${open ? " show" : ""}`}
            onPointerLeave={() => setHovered(null)}
          >
            <span
              className={`nav-chip${chip.snap ? " snap" : ""}`}
              aria-hidden="true"
              style={{
                width: chip.w,
                opacity: chip.show ? 1 : 0,
                transform: `translate3d(${chip.x}px, 0, 6px)`,
              }}
            />

            {LINKS.map(({ id, label }, i) => (
              <button
                key={id}
                ref={(el) => (linkRefs.current[id] = el)}
                className={`nav-link${active === id ? " is-active" : ""}`}
                style={{ "--i": i }}
                onClick={() => go(id)}
                onPointerEnter={() => setHovered(id)}
                onFocus={() => setHovered(id)}
                onBlur={() => setHovered(null)}
                aria-current={active === id ? "location" : undefined}
              >
                <span className="roll" data-label={label}>
                  {label}
                </span>
              </button>
            ))}

            {/* chhoti screen par CTA yahin menu ke andar dikhta hai */}
            <Link
              to="/resume"
              className="nav-link nav-menu-cta"
              style={{ "--i": LINKS.length }}
              onClick={onResumeClick}
              aria-current={isResume ? "page" : undefined}
            >
              <span className="roll" data-label="VIEW RESUME">
                VIEW RESUME
              </span>
            </Link>
          </div>

          <div className="nav-actions">
            <Link
              to="/resume"
              className="nav-cta"
              onClick={onResumeClick}
              aria-current={isResume ? "page" : undefined}
            >
              <span className="nav-cta-label">VIEW RESUME</span>
              <ArrowUpRight size={15} className="nav-cta-arrow" aria-hidden="true" />
            </Link>

            <button
              className="menu"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="nav-links"
            >
              <span key={open ? "x" : "m"} className="menu-icon">
                {open ? <X size={20} /> : <Menu size={20} />}
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}