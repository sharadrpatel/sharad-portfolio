import { useEffect, useRef, useState } from "react";
import { Link } from "../lib/router.jsx";
import { PROFILE } from "../data/profile.js";
import { Arrow } from "./ui.jsx";

export const NAV = [
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Tracks which homepage section sits under the reading line.
function useActiveSection(enabled) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      if (window.scrollY < 200) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);
  return active;
}

export default function Nav({ path, section }) {
  const isHome = path === "/";
  const active = useActiveSection(isHome);
  const current = isHome ? active : section;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("menu-open");
    menuRef.current?.querySelector("a")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <header className={`site-nav ${scrolled || !isHome ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
        <div className="site-nav__inner wrap">
          <Link to="/" className="wordmark" aria-label={`${PROFILE.name}, home`}>
            <span className="wordmark__name">{PROFILE.name}</span>
            <span className="wordmark__role">Biomedical Engineering</span>
          </Link>

          <nav className="site-nav__links" aria-label="Primary">
            <ul>
              {NAV.map((n) => (
                <li key={n.id}>
                  <Link to={`/#${n.id}`} aria-current={current === n.id ? "true" : undefined}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a className="btn btn--small btn--outline" href={PROFILE.cv} target="_blank" rel="noopener">
              <span>CV</span>
              <Arrow dir="out" />
            </a>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="site-nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="site-nav__toggle-icon" aria-hidden="true" />
          </button>
        </div>
      </header>

        <div id="mobile-menu" ref={menuRef} className="mobile-menu" hidden={!open}>
          <nav aria-label="Primary mobile" className="wrap">
            <ol>
              {NAV.map((n, i) => (
                <li key={n.id}>
                  <Link to={`/#${n.id}`} onClick={() => setOpen(false)} aria-current={current === n.id ? "true" : undefined}>
                    <span className="mobile-menu__num">{String(i + 1).padStart(2, "0")}</span>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ol>
            <div className="mobile-menu__foot">
              <a className="btn btn--primary" href={PROFILE.cv} target="_blank" rel="noopener">
                <span>Download CV</span>
                <Arrow dir="out" />
              </a>
              <a className="text-link" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
            </div>
          </nav>
        </div>
    </>
  );
}
