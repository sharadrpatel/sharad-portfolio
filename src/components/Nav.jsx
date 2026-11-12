import { useEffect, useRef, useState } from "react";
import { Link } from "../lib/router.jsx";
import { PROFILE } from "../data/profile.js";
import { Arrow } from "./ui.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { holdScroll, releaseScroll } from "../lib/scrolling.js";

export const NAV = [
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "blog", label: "Blog", to: "/blog" },
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
  // Tucks away while reading down the page, comes back on any scroll up.
  const [tucked, setTucked] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const progressRef = useRef(null);
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) > 6) {
        setTucked(y > 320 && y > lastY);
        lastY = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [path]);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    holdScroll();
    // Everything behind the open menu is out of reach of the keyboard and
    // screen readers until it closes.
    const behind = [document.getElementById("main"), document.querySelector(".site-footer")].filter(Boolean);
    behind.forEach((el) => el.setAttribute("inert", ""));
    menuRef.current?.querySelector("a")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 1080 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      behind.forEach((el) => el.removeAttribute("inert"));
      releaseScroll();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <header
        className={`site-nav ${scrolled || !isHome ? "is-scrolled" : ""} ${open ? "is-open" : ""} ${
          tucked && !open ? "is-tucked" : ""
        }`}
        onFocus={() => setTucked(false)}
      >
        <div className="site-nav__inner wrap">
          <Link to="/" className="wordmark">
            <span className="wordmark__mark" aria-hidden="true">SP</span>
            <span className="wordmark__name">
              {PROFILE.name}
              <span className="visually-hidden">, home</span>
            </span>
            <span className="wordmark__role" aria-hidden="true">BME · University of Florida</span>
          </Link>

          <nav className="site-nav__links" aria-label="Primary">
            <ul>
              {NAV.map((n) => (
                <li key={n.id}>
                  <Link to={n.to ?? `/#${n.id}`} aria-current={current === n.id ? "true" : undefined}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a className="btn btn--small btn--outline" href={PROFILE.cv} target="_blank" rel="noopener">
              <span>
                CV<span className="visually-hidden"> (PDF, opens in a new tab)</span>
              </span>
              <Arrow dir="out" />
            </a>
          </nav>

          <ThemeToggle />

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
        <span className="site-nav__progress" ref={progressRef} aria-hidden="true" />
      </header>

      <div id="mobile-menu" ref={menuRef} className="mobile-menu" hidden={!open}>
        <nav aria-label="Primary mobile" className="wrap">
          <ul>
            {NAV.map((n, i) => (
              <li key={n.id}>
                <Link
                  to={n.to ?? `/#${n.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={current === n.id ? "true" : undefined}
                  style={{ "--i": i }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__foot">
            <a className="btn btn--primary" href={PROFILE.cv} target="_blank" rel="noopener">
              <span>Download CV</span>
              <Arrow dir="out" />
            </a>
            <a className="text-link" href={`mailto:${PROFILE.email}`}>
              <span>{PROFILE.email}</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
