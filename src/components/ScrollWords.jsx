import { useScrub } from "../lib/scroll.js";

// A passage that inks in word by word as it travels up the screen, and fades
// back if you scroll away again. Screen readers get the plain sentence; the
// per-word copy is presentation only. At rest (and under reduced motion) the
// whole passage is fully inked.
export default function ScrollWords({ as: Tag = "p", text, className = "" }) {
  const ref = useScrub("sweep", { from: 0.88, to: 0.5 });
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={`scroll-words ${className}`} style={{ "--n": words.length }}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="scroll-words__w" style={{ "--i": i }}>
            {w}{" "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
