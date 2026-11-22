// The blog's identity, used by the masthead, nav, footer, and page metadata.
export const BLOG = {
  name: "Cross Sections",
  volume: "Vol. 1",
  established: "2026",
  tagline:
    "I write here about the research and engineering projects I'm working on, and what I learn from them as I go.",
  description:
    "Cross Sections is Sharad Patel's blog about research and engineering projects.",
};

// Posts are numbered in the order they were published: the first is No. 01.
export const issueNo = (n) => `No. ${String(n).padStart(2, "0")}`;
