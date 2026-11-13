import { useEffect, useState } from "react";

// Charcoal (dark, the default) and paper (light). The choice is remembered.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#171718" : "#f4f3ef");
    try {
      localStorage.setItem("so-theme", theme);
    } catch {}
  }, [theme]);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button type="button" className="theme" onClick={() => setTheme(next)} aria-label={`Switch to the ${next === "dark" ? "dark" : "light"} theme`} title={next === "dark" ? "Dark" : "Light"}>
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
      </svg>
    </button>
  );
}
