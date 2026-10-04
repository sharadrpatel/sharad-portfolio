// Blog posts, newest first. Each post is a React component in its own folder
// so it can carry its own charts and data.
//
// To add a post:
//   1. Create src/posts/<slug>/index.jsx with a default-exported component
//      and a SECTIONS array of { id, label } for its headings.
//   2. Add an entry below.
import Curry2016, { SECTIONS as currySections } from "./curry-2015-16/index.jsx";

export const BLOG = {
  title: "Blog",
  dek: "Mostly things I got curious about and went and checked.",
};

export const POSTS = [
  {
    slug: "curry-2015-16",
    title: "Why Stephen Curry's 2015–16 season won't happen again",
    dek: "He made 402 threes when the record was 286. Ten seasons later the league takes over 50% more threes and nobody has made 380. I went through the numbers to see whether anyone could do it again.",
    date: "2026-10",
    minutes: 9,
    topics: ["Sports", "Statistics"],
    sections: currySections,
    Body: Curry2016,
  },
];

// Keeps a season like "2015–16" from breaking across two lines in a heading.
export const noBreak = (t) => t.replace(/(\d)–(\d)/g, "$1–\u2060$2");

export const findPost = (slug) => POSTS.find((p) => p.slug === slug);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatPostDate(ym) {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}
