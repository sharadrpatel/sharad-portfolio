// The Cross Sections mark: a cut through a tube, the way the site's figures
// draw an artery or a bone. Ink rings, an accent cut line, hatched wall.
export default function CrossSectionsMark({ className = "" }) {
  return (
    <svg className={`xs-mark ${className}`} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="xs-wall">
          <path d="M24 4a20 20 0 1 1 0 40a20 20 0 1 1 0-40Zm0 9a11 11 0 1 0 0 22a11 11 0 1 0 0-22Z" clipRule="evenodd" />
        </clipPath>
      </defs>
      <g clipPath="url(#xs-wall)" className="xs-mark__hatch">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={-6 + i * 5} y1="48" x2={14 + i * 5} y2="0" />
        ))}
      </g>
      <circle className="xs-mark__ring" cx="24" cy="24" r="20" />
      <circle className="xs-mark__ring" cx="24" cy="24" r="11" />
      <line className="xs-mark__cut" x1="0" y1="24" x2="48" y2="24" />
    </svg>
  );
}
