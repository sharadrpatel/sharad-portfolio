// Whether the intro screen plays on this page load. Decided once, at startup,
// so the hero figure knows not to draw itself when the intro will hand its
// drawing over instead.
import { prefersReducedMotion } from "./motion.js";

const KEY = "sp-intro-seen";

function decide() {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
}

export const INTRO = decide();

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* private mode: the intro may show again, which is harmless */
  }
}
