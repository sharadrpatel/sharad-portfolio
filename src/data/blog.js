// The blog's identity, used by the masthead, nav, footer, and page metadata.
export const BLOG = {
  name: "Cross Sections",
  volume: "Vol. 1",
  established: "2026",
  tagline:
    "Notes on research and engineering, taken one slice at a time: what I'm building, what I'm testing, and what I'm learning along the way.",
  description:
    "Cross Sections, a journal by Sharad Patel: notes on research and engineering, taken one slice at a time.",
};

// Posts are numbered in the order they were published: the first is No. 01.
export const issueNo = (n) => `No. ${String(n).padStart(2, "0")}`;
