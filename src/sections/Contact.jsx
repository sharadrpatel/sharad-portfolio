import { PROFILE } from "../data/profile.js";
import { SectionHead, Arrow } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { useScrub } from "../lib/scroll.js";

const CHANNELS = [
  { label: "LinkedIn", value: "in/patel108", href: PROFILE.linkedin },
  { label: "GitHub", value: "sharadrpatel", href: PROFILE.github },
  { label: "CV", value: "PDF, updated 2026", href: PROFILE.cv },
];

export default function Contact() {
  const [user, domain] = PROFILE.email.split("@");
  const slide = useScrub("enter", { end: 0.35 });
  return (
    <section id="contact" className="section section--night contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead
          id="contact-title"
          number="06 — Contact"
          aside={PROFILE.location}
          title="Contact"
          dek="Email is the best way to reach me, about research, projects, or anything on this page."
          night
        />
        <Reveal className="contact__grid">
          <a className="contact__email" href={`mailto:${PROFILE.email}`} ref={slide}>
            <span className="contact__email-text">
              {user}
              <wbr />@{domain}
            </span>
            <Arrow />
          </a>
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
        </Reveal>
      </div>
    </section>
  );
}
