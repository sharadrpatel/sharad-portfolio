import { useInView } from "../lib/motion.js";

// Plays an entrance the first time content scrolls into view. CSS owns the
// motion (and disables it under prefers-reduced-motion); this only toggles a
// class. Children with class "st" and a --si index come in one after another
// when the wrapper has class "has-st".
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
