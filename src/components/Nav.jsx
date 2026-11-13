import { useEffect, useRef, useState } from "react";
import { jumpTo } from "../lib/motion.js";
import { Link } from "../lib/router.jsx";
import { PROFILE } from "../data/site.js";
import ThemeToggle from "./ThemeToggle.jsx";

const LINKS = [
  ["about", "About"],
  ["research", "Research"],
  ["projects", "Projects"],
  ["record", "Record"],
  ["preparation", "Preparation"],
  ["contact", "Contact"],
];

export default function Nav({ page }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef(null);

  // Highlight the section being read, and add a rule once the page has moved.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("transform", `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`);
      if (page !== "home") return setActive("");
      let cur = "";
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav__in">
        <Link to="/" className="nav__name" onClick={() => { setOpen(false); if (page === "home") jumpTo(0); }}>
          Sanandan Ojha
        </Link>
        <nav id="site-nav" className="nav__links" aria-label="Sections">
          {LINKS.map(([id, label]) => (
            <Link key={id} to={`/#${id}`} className={active === id ? "is-active" : ""} aria-current={active === id ? "true" : undefined} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link to={PROFILE.cv} className="nav__cv" onClick={() => setOpen(false)}>
            CV <span aria-hidden="true">↓</span>
          </Link>
        </nav>
        <ThemeToggle />
        <button type="button" className="nav__menu" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <span className="nav__bar" ref={bar} aria-hidden="true" />
    </header>
  );
}
