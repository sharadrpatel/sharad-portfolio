import { useLayoutEffect, useEffect } from "react";
import { useLocation, scrollToHash } from "./lib/router.jsx";
import { findCaseStudy, RESEARCH } from "./data/work.js";
import { PROFILE } from "./data/profile.js";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import CaseStudy from "./pages/CaseStudy.jsx";
import NotFound from "./pages/NotFound.jsx";
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";
import { findPost } from "./posts/index.js";

function resolve(path) {
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return { page: "home" };
  const m = clean.match(/^\/work\/([\w-]+)$/);
  if (m) {
    const work = findCaseStudy(m[1]);
    if (work) return { page: "case", work };
  }
  if (clean === "/blog") return { page: "blog" };
  const b = clean.match(/^\/blog\/([\w-]+)$/);
  if (b) {
    const post = findPost(b[1]);
    if (post) return { page: "post", post };
  }
  return { page: "404" };
}

export default function App() {
  const loc = useLocation();
  const route = resolve(loc.path);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  // Title per route.
  useEffect(() => {
    const base = `${PROFILE.name} — Biomedical Engineering`;
    const titles = {
      case: () => `${route.work.title} · ${PROFILE.name}`,
      blog: () => `Blog · ${PROFILE.name}`,
      post: () => `${route.post.title} · ${PROFILE.name}`,
      404: () => `Not found · ${PROFILE.name}`,
    };
    document.title = titles[route.page]?.() ?? base;
  }, [route.page, route.work, route.post]);

  // Scroll after each route renders: hash target, restored position, or top.
  useLayoutEffect(() => {
    if (loc.hash) {
      requestAnimationFrame(() => scrollToHash(loc.hash) || window.scrollTo(0, 0));
    } else if (loc.restoreY != null) {
      window.scrollTo(0, loc.restoreY);
    } else {
      window.scrollTo(0, 0);
      if (route.page !== "home") document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [loc]);

  const section =
    route.page === "case"
      ? RESEARCH.includes(route.work) ? "research" : "projects"
      : route.page === "blog" || route.page === "post"
        ? "blog"
        : null;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav path={route.page === "home" ? "/" : loc.path} section={section} />
      <main id="main" tabIndex={-1} key={loc.path} className="page">
        {route.page === "home" && <Home />}
        {route.page === "case" && <CaseStudy work={route.work} />}
        {route.page === "blog" && <Blog />}
        {route.page === "post" && <Post post={route.post} />}
        {route.page === "404" && <NotFound />}
      </main>
      <Footer />
    </>
  );
}
