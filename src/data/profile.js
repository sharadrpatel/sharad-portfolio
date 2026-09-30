// Single source for identity, contact, and education details.
// Source of truth: public/CV.pdf.

export const PROFILE = {
  name: "Sharad Patel",
  degree: "B.S. Biomedical Engineering",
  school: "University of Florida",
  classOf: "2027",
  location: "Gainesville, Florida",
  email: "sharadrpatel1933@gmail.com",
  linkedin: "https://www.linkedin.com/in/patel108",
  github: "https://github.com/sharadrpatel",
  cv: "/CV.pdf",
  disciplines: [
    "Biomedical Engineering",
    "Computational Modeling",
    "Biomechanics",
    "Translational Research",
  ],
  lead:
    "I build mechanistic and computational models of the human body — from muscle forces in the arthritic thumb to tissue regrowth inside arterial stents — and test them against experimental data.",
};

// Shown in the hero ledger. Keep to the most representative current work.
export const CURRENTLY = [
  {
    what: "Mechanistic model of primary graft dysfunction",
    where: "Lung Modeling Lab",
    since: "2026",
    href: "/#research-lung-transplant-pgd",
  },
  {
    what: "Personalized OpenSim models of the osteoarthritic thumb",
    where: "Nichols Lab",
    since: "2024",
    href: "/work/thumb-musculoskeletal-modeling",
  },
  {
    what: "In-stent restenosis model with Medtronic",
    where: "Modeling project",
    since: "2026",
    href: "/work/in-stent-restenosis",
  },
  {
    what: "Distal biceps tendon repair system for CONMED",
    where: "Senior design",
    since: "2026",
    href: "/work/distal-biceps-repair",
  },
  {
    what: "Certified nursing assistant, medical–surgical unit",
    where: "HCA Florida North Florida",
    since: "2026",
    href: "/#experience",
  },
];

export const AT_A_GLANCE = [
  { value: "3.94", label: "GPA", note: "B.S. Biomedical Engineering, UF" },
  {
    value: "4",
    label: "Research labs",
    note: "Musculoskeletal, pulmonary, ecological, neuroimmunology",
  },
  {
    value: "6",
    label: "Publications & presentations",
    note: "Including two posters at BMES 2026",
  },
  {
    value: "Outstanding",
    label: "SCUDEM",
    note: "Highest award level, international modeling competition",
  },
];

export const EDUCATION = {
  school: "University of Florida",
  degree: "Bachelor of Science in Biomedical Engineering",
  period: "Aug 2023 – May 2027",
  gpa: "3.94 / 4.0",
  coursework: [
    "Differential Equations",
    "Linear Algebra",
    "Modeling in Mathematical Biology",
    "Biomedical Transport Phenomena",
    "Biomedical Instrumentation",
    "Bio Signals",
    "Circuits",
    "Biomaterials",
    "Cellular Engineering Lab",
    "Clinically Inspired Engineering Design",
    "Biochemistry",
    "Organic Chemistry",
    "Genetics",
    "C++ Programming",
  ],
};

export const INTERESTS = [
  "Musculoskeletal biomechanics",
  "Mechanobiology & vascular remodeling",
  "Mechanistic models of disease",
  "Sensitivity & uncertainty analysis",
  "Surgical simulation & education",
];

// Skills grouped by what they are used for, not by file type.
export const TOOLKIT = [
  {
    group: "Programming",
    items: ["Python", "MATLAB", "C++", "R", "JavaScript", "LaTeX"],
  },
  {
    group: "Modeling",
    items: [
      "ODE & PDE models",
      "Mechanistic modeling",
      "Monte Carlo simulation",
      "Sensitivity & uncertainty analysis",
      "Parameter calibration",
      "Stochastic processes",
    ],
  },
  {
    group: "Biomechanics",
    items: ["OpenSim", "Vicon motion capture", "Fine-wire EMG", "Hill-type muscle models"],
  },
  {
    group: "Design & build",
    items: ["SolidWorks", "Onshape", "Fusion 360", "Arduino", "3D printing", "Git"],
  },
  {
    group: "Research practice",
    items: [
      "Systematic review",
      "IRB & study protocols",
      "Statistical analysis plans",
      "Scientific writing",
      "BSL-2 lab techniques",
    ],
  },
  {
    group: "Clinical",
    items: ["Certified Nursing Assistant (CNA)", "Basic Life Support (BLS)"],
  },
];
