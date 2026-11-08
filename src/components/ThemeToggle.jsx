import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "../lib/motion.js";

const KEY = "sp-theme";
const COLORS = { light: "#f3f2ee", dark: "#0e0e0d" };

function current() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COLORS[theme]);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* private mode: the choice just won't be remembered */
  }
}

// Swaps between the white and black versions of the site. Where the browser
// supports view transitions, the new theme spreads out from the button as a
// growing circle; otherwise (or under reduced motion) it switches at once.
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(() => (typeof document === "undefined" ? "light" : current()));

  // Follow the system setting until the visitor makes a choice of their own.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e) => {
      let saved = null;
      try {
        saved = localStorage.getItem(KEY);
      } catch {}
      if (saved) return;
      const t = e.matches ? "dark" : "light";
      document.documentElement.dataset.theme = t;
      setTheme(t);
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const toggle = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const swap = () => {
      apply(next);
      setTheme(next);
    };
    if (!document.startViewTransition || prefersReducedMotion()) {
      swap();
      return;
    }
    // Grow from the button (also when it was pressed from the keyboard).
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2;
    const y = e.clientY || r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.documentElement.classList.add("is-theming");
    const vt = document.startViewTransition(() => flushSync(swap));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.7, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
    vt.finished.finally(() => document.documentElement.classList.remove("is-theming"));
  };

  const dark = theme === "dark";
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      onClick={toggle}
    >
      <span className="theme-toggle__icon" aria-hidden="true" />
      <span className="theme-toggle__text" aria-hidden="true">
        {dark ? "Black" : "White"}
      </span>
    </button>
  );
}
