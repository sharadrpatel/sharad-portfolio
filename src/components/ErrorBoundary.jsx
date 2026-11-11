import { Component } from "react";
import { PROFILE } from "../data/profile.js";

// If a page fails to render, say so plainly and keep the essentials reachable
// instead of leaving a blank screen.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="section not-found" role="alert">
        <div className="wrap">
          <h1 className="h2">This page failed to load.</h1>
          <p className="dek">
            Reloading usually fixes it. The CV and my email address work either way.
          </p>
          <p className="not-found__links">
            <a className="btn btn--primary" href={window.location.pathname}>
              <span>Reload the page</span>
            </a>
            <a className="text-link" href={PROFILE.cv}>
              <span>CV (PDF)</span>
            </a>
            <a className="text-link" href={`mailto:${PROFILE.email}`}>
              <span>{PROFILE.email}</span>
            </a>
          </p>
        </div>
      </section>
    );
  }
}
