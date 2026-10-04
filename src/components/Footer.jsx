import { PROFILE } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Arrow } from "./ui.jsx";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <p className="site-footer__name">
          {PROFILE.name}
          <span> · {PROFILE.degree}, {PROFILE.school}</span>
        </p>
        <ul className="site-footer__links">
          <li><Link to="/blog">Blog</Link></li>
          <li><a href={`mailto:${PROFILE.email}`}>Email</a></li>
          <li><a href={PROFILE.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href={PROFILE.github} target="_blank" rel="noopener">GitHub</a></li>
          <li><a href={PROFILE.cv} target="_blank" rel="noopener">CV</a></li>
          <li>
            <Link to="/" className="site-footer__top">
              Top <Arrow dir="up" />
            </Link>
          </li>
        </ul>
        <p className="site-footer__note">© {new Date().getFullYear()} {PROFILE.name}. Built with React and Vite.</p>
      </div>
    </footer>
  );
}
