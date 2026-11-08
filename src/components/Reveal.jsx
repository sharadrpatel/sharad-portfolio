import { useInView } from "../lib/motion.js";

// Plays an entrance as content scrolls into view, and resets once it drops
// back below the viewport so the entrance replays on the next pass. CSS owns
// the motion (and disables it under prefers-reduced-motion); this only toggles
// a class.
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, shown] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
