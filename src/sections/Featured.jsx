import { useEffect, useRef } from "react";
import {
  MODELING_FEATURE,
  CANOPY_FEATURE,
  COLLAGEN_FEATURE,
  SHOT_DNA_FEATURE,
  SEATROUT_FEATURE,
  SCUDEM_FEATURE,
  MCM_FEATURE,
  DESIGN,
} from "../data/work.js";
import { Link } from "../lib/router.jsx";
import { Arrow, Badge } from "../components/ui.jsx";
import { FigureArt } from "../components/figures.jsx";
import { useScrub, refreshScrub } from "../lib/scroll.js";
import { jumpTo } from "../lib/scrolling.js";

const PINNED = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

// The projects that have a plot, render, or micrograph to show, led by the
// picture. `figure` overrides the lead figure where a results plot says more
// than the default one.
const CRUTCH = DESIGN.find((w) => w.slug === "pediatric-crutch");
const FEATURED = [
  { w: MODELING_FEATURE },
  { w: CANOPY_FEATURE },
  { w: COLLAGEN_FEATURE },
  { w: CRUTCH },
  { w: SHOT_DNA_FEATURE },
  { w: SEATROUT_FEATURE },
  { w: SCUDEM_FEATURE, figure: "scudem-kl" },
  { w: MCM_FEATURE, figure: "mcm-soc" },
].filter((f) => f.w);

const pad = (n) => String(n).padStart(2, "0");

// A strip of picture-led cards. On wide screens the strip pins and vertical
// scrolling moves it sideways (the section is made exactly as tall as the
// distance the strip has to travel, so the two stay 1:1). On small screens
// and under reduced motion it is an ordinary swipeable row with snap points.
export default function Featured() {
  const track = useRef(null);
  const frame = useRef(null);
  const counter = useRef(null);

  const root = useScrub("pin", {
    onProgress: (p) => {
      if (counter.current) counter.current.textContent = pad(Math.round(p * (FEATURED.length - 1)) + 1);
    },
  });

  // How far the strip has to travel: its full width less what is on screen.
  useEffect(() => {
    const el = root.current;
    const measure = () => {
      const travel = Math.max(0, track.current.scrollWidth - frame.current.clientWidth);
      el.style.setProperty("--travel", `${Math.ceil(travel)}px`);
      refreshScrub();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    ro.observe(frame.current);
    return () => ro.disconnect();
  }, []);

  // Keyboard: tabbing to a card that is off to the side scrolls the page to
  // the point where the strip has brought that card on screen.
  const bringIntoView = (i) => (e) => {
    if (!e.target.matches(":focus-visible") || !window.matchMedia(PINNED).matches) return;
    const el = root.current;
    const travel = parseFloat(el.style.getPropertyValue("--travel")) || 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    jumpTo(top + (i / (FEATURED.length - 1)) * travel);
  };

  return (
    <section className="featured" ref={root} aria-labelledby="featured-title">
      <div className="featured__pin">
        <div className="wrap featured__head">
          <h3 id="featured-title" className="featured__title">Selected work</h3>
          <p className="featured__count" aria-hidden="true">
            <span ref={counter}>01</span>
            <span className="featured__of">/ {pad(FEATURED.length)}</span>
          </p>
        </div>

        <div className="featured__frame" ref={frame}>
          <ol className="featured__track" ref={track}>
            {FEATURED.map(({ w, figure }, i) => (
              <li key={w.slug} className="fcard" style={{ "--k": i }}>
                <Link to={`/work/${w.slug}`} className="fcard__link" onFocus={bringIntoView(i)}>
                  <span className="fcard__plate" aria-hidden="true">
                    <FigureArt name={figure ?? w.figure} />
                  </span>
                  <span className="fcard__meta">
                    <span className="fcard__code">{w.index}</span>
                    <span>{w.area[0]}</span>
                    {w.badge && <Badge>{w.badge}</Badge>}
                  </span>
                  <span className="fcard__title">{w.title}</span>
                  <span className="fcard__more">
                    Case study
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="wrap">
          <div className="featured__bar" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
