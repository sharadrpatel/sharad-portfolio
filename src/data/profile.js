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
    "I'm a biomedical engineering student at UF. I build computational models of how the body works, mostly in biomechanics and physiology, and compare them against experimental data.",
};

// Shown in the hero ledger. Keep to the most representative current work.
export const CURRENTLY = [
  {
    what: "Modeling lung injury after transplant",
    where: "Brunson Lab",
    since: "2026",
    href: "/#research-lung-transplant-pgd",
  },
  {
    what: "OpenSim models of the arthritic thumb",
    where: "Nichols Lab",
    since: "2024",
    href: "/work/thumb-musculoskeletal-modeling",
  },
  {
    what: "Plasticity and migration models",
    where: "Holt Lab",
    since: "2025",
    href: "/work/plasticity-disease-dynamics",
  },
  {
    what: "Systematic review of Parkinson's immunotherapy",
    where: "Vedam-Mai Lab",
    since: "2025",
    href: "/#research-parkinsons-immunotherapy",
  },
  {
    what: "Biceps tendon repair device for CONMED",
    where: "Senior design",
    since: "2026",
    href: "/work/distal-biceps-repair",
  },
  {
    what: "CNA on a medical–surgical unit",
    where: "HCA Florida North Florida",
    since: "2026",
    href: "/#experience",
  },
];

export const EDUCATION = {
  school: "University of Florida",
  location: "Gainesville, FL",
  degree: "B.S. Biomedical Engineering",
  minor: "Minor in Mathematics",
  graduation: "May 2027",
  gpa: "3.94",
  coursework: [
    "Differential Equations",
    "Linear Algebra",
    "Modeling in Mathematical Biology",
    "Biomedical Transport Phenomena",
    "Biomedical Instrumentation",
    "Biosignals",
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
    items: ["Python (NumPy, pandas, SciPy, PyTorch, OpenCV)", "MATLAB", "C++", "R", "JavaScript", "LaTeX"],
  },
  {
    group: "Modeling & analysis",
    items: [
      "ODE & PDE modeling",
      "Monte Carlo simulation",
      "Sensitivity & uncertainty analysis",
      "Parameter estimation",
      "Statistical testing (t-tests, ANOVA)",
      "Computer vision",
    ],
  },
  {
    group: "Biomechanics",
    items: ["OpenSim", "Vicon motion capture", "EMG", "Hill-type muscle models"],
  },
  {
    group: "Design & build",
    items: ["SolidWorks", "Onshape", "Fusion 360", "Arduino", "3D printing", "Git"],
  },
  {
    group: "Research practice",
    items: [
      "Systematic reviews",
      "IRB applications & study protocols",
      "Technical reports",
      "Scientific writing",
      "BSL-2 lab techniques",
    ],
  },
  {
    group: "Clinical",
    items: ["Certified Nursing Assistant (CNA)", "Basic Life Support (BLS)"],
  },
];
