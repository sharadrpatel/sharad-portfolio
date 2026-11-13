import { Link } from "../lib/router.jsx";
import { PROFILE } from "../data/site.js";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <p>
          © {new Date().getFullYear()} {PROFILE.name} · {PROFILE.location}
        </p>
        <p>
          <Link to={`mailto:${PROFILE.email}`}>Email</Link>
          <Link to={PROFILE.github}>GitHub</Link>
          {PROFILE.linkedin && <Link to={PROFILE.linkedin}>LinkedIn</Link>}
          <Link to={PROFILE.cv}>CV (PDF)</Link>
        </p>
      </div>
    </footer>
  );
}
