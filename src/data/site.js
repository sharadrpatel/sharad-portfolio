// Identity, contact and education.
// Everything on the site is drawn from the CV (public/Sanandan_Ojha_CV.pdf).

export const PROFILE = {
  name: "Sanandan Ojha",
  school: "University of Florida",
  location: "Gainesville, Florida",
  email: "ojhasanandan@ufl.edu",
  github: "https://github.com/ojhasanandan",
  linkedin: "", // TODO: add your LinkedIn URL; the link appears once this is filled in.
  cv: "/Sanandan_Ojha_CV.pdf",
  statement:
    "I write down mathematical models of living systems, fit them to data, and ask how much the data really pins down.",
  lead:
    "I'm a senior at the University of Florida studying mathematics and biomedical engineering, with a minor in statistics. My work sits where differential equations, numerical methods and Bayesian inference meet biology and medicine.",
};

export const EDUCATION = {
  school: "University of Florida",
  location: "Gainesville, FL",
  dates: "August 2023 – May 2027",
  graduation: "May 2027",
  gpa: "3.91",
  degrees: ["B.S. Mathematics", "B.S. Biomedical Engineering", "Minor in Statistics"],
  // TODO: the CV has no course list. Add courses here (e.g. "Real Analysis") and a
  // "Selected coursework" block appears in the Preparation section automatically.
  coursework: [],
};

export const INTERESTS = [
  {
    title: "Numerical methods for nonlinear PDEs",
    text: "How to design schemes that stay stable and accurate when the equation is stiff or nonlinear, and how to prove that they do. I have built solvers; I want the theory behind them.",
  },
  {
    title: "Inference and uncertainty for mechanistic models",
    text: "Parameter estimation, sensitivity analysis and model selection when the likelihood is out of reach and the data are sparse. Which parts of a model can an experiment identify at all?",
  },
  {
    title: "Mathematical biology and medicine",
    text: "Continuum and agent-based models of cells and tissues, and mechanistic models of disease that could one day inform a clinical decision.",
  },
  {
    title: "Stochastic modeling and decisions",
    text: "Markov chains, Monte Carlo methods and data-driven models for systems where randomness is the point, from epidemics to rankings.",
  },
];

export const TRAJECTORY = [
  { when: "2022", title: "The clinic first", text: "Before college, a summer in radiology at the University of Pittsburgh: collating imaging and outcome data on PSMA PET, a first published article, and a first conference talk." },
  { when: "2023–24", title: "Bench and build", text: "At UF: purifying DNA repair proteins in a biochemistry lab, designing 3D-printed heart device models for pediatric patients, and a first agent-based model with iGEM." },
  { when: "2024–25", title: "Models that compute", text: "Diffusion models that generate MRI from CT, then a summer REU in Indianapolis building a lattice Boltzmann method for cells in viscous flow." },
  { when: "2025–26", title: "Models that answer to data", text: "Mathematical biology with Dr. Tracy Stepien: a two-layer model of migrating cells, fit with sequential Monte Carlo on a supercomputer. Modeling contests alongside." },
  { when: "Now", title: "Toward the theory", text: "An honors thesis on liver microcirculation, a mechanistic model of lung transplant injury, and a directed reading in the analysis of nonlinear PDEs." },
];
