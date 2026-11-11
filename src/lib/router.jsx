// A deliberately tiny History-API router: the site only has a home page and
// case-study pages, so a routing library would be dead weight.
import { useEffect, useState } from "react";
import { glideTo } from "./scrolling.js";

const listeners = new Set();
const emit = (restoreY) => listeners.forEach((fn) => fn(restoreY));

export function scrollToHash(hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const el = id && document.getElementById(id);
  if (!el) return false;
  glideTo(el);
  // Move focus for keyboard and screen-reader users without a second jump.
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
}

export function navigate(to) {
  const url = new URL(to, window.location.origin);
  if (url.pathname === window.location.pathname) {
    history.pushState({}, "", url.pathname + url.hash);
    if (url.hash) scrollToHash(url.hash);
    else glideTo(0);
    return;
  }
  // Remember where we were so the back button returns to the same spot.
  history.replaceState({ ...history.state, scrollY: window.scrollY }, "");
  history.pushState({}, "", url.pathname + url.hash);
  emit(null);
}

export function useLocation() {
  const read = () => ({ path: window.location.pathname, hash: window.location.hash });
  const [loc, setLoc] = useState(read);

  useEffect(() => {
    const onChange = (restoreY) => setLoc({ ...read(), restoreY });
    const onPop = (e) => onChange(e.state?.scrollY ?? null);
    listeners.add(onChange);
    window.addEventListener("popstate", onPop);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return loc;
}

const isExternal = (href) => /^(https?:|mailto:|tel:)/.test(href) || /\.[a-z0-9]+$/i.test(href);

export function Link({ to, children, onClick, ...rest }) {
  if (isExternal(to)) {
    return (
      <a href={to} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
