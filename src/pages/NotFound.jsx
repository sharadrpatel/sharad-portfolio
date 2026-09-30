import { Button } from "../components/ui.jsx";

export default function NotFound() {
  return (
    <section className="section not-found" aria-labelledby="nf-title">
      <div className="wrap">
        <p className="label label--accent">404</p>
        <h1 id="nf-title" className="h2">This page doesn't exist.</h1>
        <p className="dek">The link may be out of date. Everything on the site starts from the homepage.</p>
        <Button to="/">Back to the homepage</Button>
      </div>
    </section>
  );
}
