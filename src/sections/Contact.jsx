import { useEffect, useRef, useState } from "react";
import { PROFILE } from "../data/profile.js";
import { SectionHead, Arrow } from "../components/ui.jsx";
import { useScrub } from "../lib/scroll.js";

const CHANNELS = [
  { label: "LinkedIn", value: "in/patel108", href: PROFILE.linkedin },
  { label: "GitHub", value: "sharadrpatel", href: PROFILE.github },
  { label: "CV", value: "PDF, updated 2026", href: PROFILE.cv },
];

// Copies the address for visitors whose browser has no mail app set up, and
// says so. Falls back to selecting the address when the clipboard is blocked.
function CopyEmail({ email, targetId }) {
  const [state, setState] = useState("idle"); // idle | copied | failed
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      const el = document.getElementById(targetId);
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    setState(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2400);
  };

  return (
    <button type="button" className="copy" onClick={copy} data-state={state}>
      <svg className="copy__icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path className="copy__sheet" d="M4.5 4.5h7v7h-7z M2.5 9.5v-7h7" />
        <path className="copy__tick" d="M3 7.5l2.8 2.8L11 4.5" />
      </svg>
      <span aria-live="polite">
        {state === "copied" ? "Address copied" : state === "failed" ? "Selected. Press Ctrl or ⌘ C" : "Copy address"}
      </span>
    </button>
  );
}

export default function Contact() {
  const [user, domain] = PROFILE.email.split("@");
  // The address slides in from the right as the band arrives.
  const slide = useScrub("enter", { end: 0.4 });
  return (
    <section id="contact" className="section section--night contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead
          id="contact-title"
          aside={PROFILE.location}
          title="Contact"
          dek="Email is the best way to reach me, about research, projects, or anything on this page."
          night
        />
        <div className="contact__grid">
          <div className="contact__lead">
            <a className="contact__email" href={`mailto:${PROFILE.email}`} ref={slide}>
              <span className="contact__email-text" id="contact-email">
                {user}
                <wbr />@{domain}
              </span>
              <Arrow />
            </a>
            <CopyEmail email={PROFILE.email} targetId="contact-email" />
          </div>
          <ul className="contact__channels">
            {CHANNELS.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noopener">
                  <span className="contact__label">{c.label}</span>
                  <span className="contact__value">{c.value}</span>
                  <Arrow dir="out" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
