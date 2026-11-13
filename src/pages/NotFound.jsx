import { Link } from "../lib/router.jsx";

export default function NotFound() {
  return (
    <section className="lost">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1>This page is outside the domain.</h1>
        <p>The address does not match anything on the site.</p>
        <Link to="/" className="btn btn--solid">Back to the start</Link>
      </div>
    </section>
  );
}
