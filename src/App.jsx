import { useLayoutEffect, useEffect, lazy, Suspense } from "react";
import { useLocation, scrollToHash } from "./lib/router.jsx";
import { jumpTo } from "./lib/scrolling.js";
import { findCaseStudy, RESEARCH } from "./data/work.js";
import { applyMeta, homeMeta, caseMeta, blogMeta, postMeta, notFoundMeta } from "./lib/meta.js";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import CaseStudy from "./pages/CaseStudy.jsx";
import NotFound from "./pages/NotFound.jsx";
import Blog from "./pages/Blog.jsx";
import Loader from "./components/Loader.jsx";
import { findPost } from "./lib/posts.js";

// Loaded only when a post is opened, so the Markdown renderer stays off other pages.
const Post = lazy(() => import("./pages/Post.jsx"));

function resolve(path) {
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return { page: "home" };
  if (clean === "/blog") return { page: "blog" };
  const b = clean.match(/^\/blog\/([\w-]+)$/);
  if (b) {
    const post = findPost(b[1]);
    if (post) return { page: "post", post };
  }
  const m = clean.match(/^\/work\/([\w-]+)$/);
  if (m) {
    const work = findCaseStudy(m[1]);
    if (work) return { page: "case", work };
  }
  return { page: "404" };
}

export default function App() {
  const loc = useLocation();
  const route = resolve(loc.path);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  // Title, description, and canonical URL per route.
  useEffect(() => {
    const meta = {
      home: homeMeta,
      case: () => caseMeta(route.work),
      blog: blogMeta,
      post: () => postMeta(route.post),
      404: notFoundMeta,
    }[route.page]();
    applyMeta(meta);
  }, [route.page, route.work, route.post]);

  // Scroll after each route renders: hash target, restored position, or top.
  useLayoutEffect(() => {
    if (loc.hash) {
      requestAnimationFrame(() => scrollToHash(loc.hash) || jumpTo(0));
    } else if (loc.restoreY != null) {
      jumpTo(loc.restoreY);
    } else {
      jumpTo(0);
      if (route.page !== "home") document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [loc]);

  const section =
    route.page === "case"
      ? RESEARCH.includes(route.work)
        ? "research"
        : "projects"
      : route.page === "blog" || route.page === "post"
        ? "blog"
        : null;

  return (
    <>
      <Loader />
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav path={route.page === "home" ? "/" : loc.path} section={section} />
      <main id="main" tabIndex={-1} key={loc.path} className="page">
        <ErrorBoundary>
          {route.page === "home" && <Home />}
          {route.page === "case" && <CaseStudy work={route.work} />}
          {route.page === "blog" && <Blog />}
          {route.page === "post" && (
            <Suspense fallback={null}>
              <Post post={route.post} />
            </Suspense>
          )}
          {route.page === "404" && <NotFound />}
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
