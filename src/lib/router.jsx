import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { glideTo, jumpTo } from "./motion.js";

// A very small History-API router: paths for pages, hashes for sections.
const Ctx = createContext(null);

// The folder the site is served from, without a trailing slash: "" or "/portfolio".
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");
export const asset = (p) => BASE + p;
const strip = (p) => (BASE && p.startsWith(BASE) ? p.slice(BASE.length) : p);

const read = () => ({
  path: strip(window.location.pathname).replace(/\/+$/, "") || "/",
  hash: window.location.hash.slice(1),
  key: Math.random(),
});

export function Router({ children }) {
  const [loc, setLoc] = useState(read);
  useEffect(() => {
    const on = () => setLoc(read());
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  const navigate = useCallback((to) => {
    window.history.pushState({}, "", BASE + to);
    setLoc(read());
  }, []);
  return <Ctx.Provider value={{ loc, navigate }}>{children}</Ctx.Provider>;
}

export const useRouter = () => useContext(Ctx);

export function scrollToId(id, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return false;
  smooth ? glideTo(el) : jumpTo(el);
  return true;
}

// Internal link. Scrolls to hashes on the current page without a reload.
export function Link({ to, children, onClick, ...rest }) {
  const { loc, navigate } = useRouter();
  const external = /^(https?:|mailto:)/.test(to) || to.endsWith(".pdf");
  if (external) {
    const href = to.startsWith("/") ? asset(to) : to;
    const newTab = !to.startsWith("mailto:");
    return (
      <a href={href} {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  const click = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const [path, hash] = to.split("#");
    if ((path || "/") === loc.path && hash) {
      window.history.pushState({}, "", BASE + to);
      scrollToId(hash);
    } else navigate(to);
  };
  return (
    <a href={BASE + to} onClick={click} {...rest}>
      {children}
    </a>
  );
}
