import { useEffect, useLayoutEffect } from "react";
import { useRouter, scrollToId } from "./lib/router.jsx";
import { startSmooth, jumpTo } from "./lib/motion.js";
import Intro from "./components/Intro.jsx";
import { findWork } from "./data/work.js";
import { metaFor, applyMeta } from "./lib/meta.js";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import WorkPage from "./pages/WorkPage.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const { loc } = useRouter();
  const m = loc.path.match(/^\/work\/([\w-]+)$/);
  const work = m ? findWork(m[1]) : null;
  const page = loc.path === "/" ? "home" : work ? "work" : "404";

  useEffect(() => applyMeta(metaFor(page, work)), [page, work]);
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    startSmooth();
  }, []);

  // After a navigation: go to the hash target, or the top of the new page.
  useLayoutEffect(() => {
    if (loc.hash) requestAnimationFrame(() => scrollToId(loc.hash, false) || jumpTo(0));
    else jumpTo(0);
  }, [loc.path, loc.key]);

  return (
    <>
      <Intro />
      <a className="skip" href="#main">Skip to content</a>
      <Nav page={page} />
      <main id="main" key={loc.path}>
        {page === "home" && <Home />}
        {page === "work" && <WorkPage work={work} />}
        {page === "404" && <NotFound />}
      </main>
      <Footer />
    </>
  );
}
