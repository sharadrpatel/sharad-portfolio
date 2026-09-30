import { PROFILE } from "../data/profile.js";
import { SectionHead, Arrow } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";

const CHANNELS = [
  { label: "LinkedIn", value: "in/patel108", href: PROFILE.linkedin },
  { label: "GitHub", value: "sharadrpatel", href: PROFILE.github },
  { label: "CV", value: "PDF, updated 2026", href: PROFILE.cv },
];

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead id="contact-title" number="06" label="Contact" title="Get in touch." />
        <Reveal className="contact__grid">
          <div>
            <p className="contact__lede">
              For research, collaboration, or questions about my work, email is the best way to reach me.
            </p>
            <a className="contact__email" href={`mailto:${PROFILE.email}`}>
              {PROFILE.email}
              <Arrow />
            </a>
            <p className="meta">{PROFILE.location}</p>
          </div>
          <ul className="contact__channels">
            {CHANNELS.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noopener">
                  <span className="label label--muted">{c.label}</span>
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
