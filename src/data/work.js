// Research studies, design work, and the featured modeling project.
//
// tier: "featured"  → large row on the homepage (with figure)
//       "secondary" → compact row on the homepage
// caseStudy: true   → gets a dedicated page at /work/:slug
//
// Every claim here should be traceable to public/CV.pdf. Where the CV gives no
// result yet, the entry says what the work is set up to answer instead.

export const RESEARCH = [
  {
    slug: "thumb-musculoskeletal-modeling",
    index: "R.01",
    tier: "featured",
    caseStudy: true,
    title: "Personalized models of the thumb in osteoarthritis",
    area: ["Biomechanics", "Musculoskeletal modeling"],
    lab: "Nichols Lab",
    org: "University of Florida",
    period: "Aug 2024 – Present",
    role: "Undergraduate Research Assistant",
    question:
      "If you build a thumb model from a person's own muscle measurements, how much do the predicted muscle forces change? And do those forces look different in people with thumb arthritis?",
    summary:
      "Carpometacarpal osteoarthritis (CMCOA) is arthritis at the base of the thumb. It makes pinching and gripping painful, but there's no direct way to measure the muscle forces involved. I build OpenSim models of individual people's thumbs, using muscle measurements from ultrasound, to estimate those forces in healthy older adults and in adults with CMCOA.",
    problem:
      "Most musculoskeletal models are scaled from cadaver data, so they may not match a real person's muscles very well, especially in older adults with arthritis. It also helps to know which measurements actually change the results, since some are much harder to collect than others.",
    approach: [
      {
        label: "Data collection",
        text: "I collect fine-wire EMG and Vicon motion capture while participants do pinch and grasp tasks, then process the signals in Python.",
      },
      {
        label: "Personalized models",
        text: "Each subject gets their own OpenSim thumb model, with Hill-type muscle parameters taken from ultrasound.",
      },
      {
        label: "Simulation",
        text: "I use inverse kinematics and static optimization to get joint angles, moment arms, and muscle forces for each task.",
      },
      {
        label: "Sensitivity",
        text: "I ran sensitivity and uncertainty analyses on optimal fiber length, tendon slack length, and physiological cross-sectional area to see which one matters most, and how measurement error carries through to the force estimates.",
      },
      {
        label: "Simpler model",
        text: "I built a reduced Hill-type model to check whether a much simpler setup shows the same personalization effects as the full OpenSim simulation.",
      },
      {
        label: "Statistics",
        text: "I also compared multi-muscle EMG across CMCOA stages using paired t-tests and two-way ANOVA.",
      },
    ],
    contributions: [
      "Collecting motion capture and fine-wire EMG data",
      "Signal processing and statistics in Python",
      "Building subject-specific models in OpenSim",
      "Designing and running the sensitivity and uncertainty analyses",
      "Setting up the reduced Hill-type model",
    ],
    outcomes: [
      {
        label: "Healthy vs. CMCOA",
        text: "Predicted muscle forces for both groups across pinch and grasp tasks.",
      },
      {
        label: "Key parameters",
        text: "Which ultrasound measurements have the biggest effect on the personalized model.",
      },
      {
        label: "Simpler model",
        text: "Whether a reduced model can stand in for the full simulation.",
      },
    ],
    tools: ["OpenSim", "Vicon", "Fine-wire EMG", "Python", "Ultrasound", "Hill-type models", "ANOVA"],
    figure: "hill",
  },
  {
    slug: "holt-lab",
    index: "R.02",
    tier: "featured",
    caseStudy: true,
    title: "Evolution, dispersal, and plant disease in the Holt Lab",
    area: ["Evolutionary modeling", "Computational ecology", "Computer vision"],
    lab: "Holt Lab",
    org: "University of Florida",
    period: "Dec 2025 – Present",
    role: "Undergraduate Research Assistant",
    summary:
      "I work on three separate projects in the Holt Lab. Two are simulation studies in evolutionary ecology: one on how limits to phenotypic plasticity evolve, and one on how dispersal evolves in patchy, variable habitats. The third uses computer vision to measure leaf damage and disease from photos.",
    subprojects: [
      {
        id: "plasticity",
        title: "Limits on plasticity and evolutionary rescue",
        short: "Can a population survive a changing environment better if the limits on its plasticity can evolve?",
        question:
          "When there are limits on how much a population can adjust its phenotype, and those limits can themselves evolve, does that change whether the population survives a changing environment?",
        background:
          "This project replicates and extends Khare, Holt & Scheiner (2024, Evolution), which modeled how developmental limits on phenotypic plasticity affect evolutionary rescue and genetic assimilation. In that model, each individual has a sigmoidal reaction norm with a fixed shape. I added two new sets of loci so the shape itself can evolve: one controls where the reaction norm switches (its inflection point, E0), and the other controls how wide a range of phenotypes development can produce (Dc).",
        approach: [
          {
            label: "Replication",
            text: "Rebuilt the model and checked that it reproduces the published results before changing anything.",
          },
          {
            label: "Extension",
            text: "Added evolvable loci for the inflection point and the developmental range, with switches to compare four conditions: neither evolves, either one evolves, or both do.",
          },
          {
            label: "Simulation",
            text: "Ran a sweep of about 424,000 replicate simulations on UF's HiPerGator cluster, varying environmental autocorrelation, the cost of plasticity, and developmental versus environmental noise.",
          },
        ],
        finding:
          "Early results suggest that letting the developmental range evolve substantially improves survival. Letting the inflection point evolve doesn't help, and when plasticity has a cost it even evolves in an unexpected direction.",
        status:
          "Finishing the replication figures and double-checking the noise settings across runs. Next I'm writing up a paper on the two new evolvable traits.",
        tools: ["Python", "Numba", "HiPerGator", "SLURM", "Individual-based simulation"],
      },
      {
        id: "dispersal",
        title: "How dispersal evolves in sink metapopulations",
        short: "Does natural selection push dispersal toward the rate that maximizes total population size?",
        question:
          "In a group of habitat patches that can't support a population on their own, does the dispersal rate that evolves match the rate that keeps the most individuals alive?",
        background:
          "Roy, Holt & Barfield (2005) showed that when conditions fluctuate out of sync across sink patches, moving between them can keep a population going (the inflationary effect), and total abundance peaks at an intermediate dispersal rate, m*. Dr. Holt's question is whether evolution actually lands on m*.",
        approach: [
          {
            label: "Baseline model",
            text: "Built a two-patch Ricker model with autocorrelated (AR(1)) environmental noise and global dispersal, and reproduced the hump-shaped abundance curve from Roy et al. (Fig. 4C).",
          },
          {
            label: "Invasion tests",
            text: "Set up resident versus rare-mutant competition following McPeek & Holt (1992), with a persistence rule based on mean abundance over a time window and Lyapunov exponents to find where populations persist.",
          },
          {
            label: "Invasion fitness",
            text: "Tracked the log ratio of mutant to resident abundance, whose slope gives invasion fitness directly, alongside pairwise invasibility plots.",
          },
        ],
        status:
          "The two methods currently give different estimates of the evolutionarily stable dispersal rate. I'm working out why, then sweeping across parameters to see how it compares with m*.",
        tools: ["Python", "Stochastic simulation", "Invasion analysis", "Pairwise invasibility plots"],
      },
      {
        id: "plant-disease",
        title: "Measuring leaf damage and disease from photos",
        short: "Two computer vision pipelines: one measures leaves, the other detects disease in field images.",
        question: "Can leaf size, shape, damage, and disease be measured automatically and consistently from images?",
        background:
          "Measuring leaves and scoring disease by hand is slow and varies from person to person. I'm building two pipelines to automate it.",
        approach: [
          {
            label: "Leaf measurement",
            text: "Uses SAM 3 to find and segment each leaf, then measures area, perimeter, solidity, circularity, and other shape descriptors. Contour analysis picks out holes and tears, and a reference tag in each photo converts pixels to real units.",
          },
          {
            label: "Disease detection",
            text: "A YOLO-based detector for disease, including *Bipolaris gigantea*, in field images sampled across plots and distances. I've converted the first set of about 119 annotated images to Ultralytics format.",
          },
        ],
        status:
          "The leaf measurement pipeline works, and I presented it at a lab meeting. For disease detection, the next steps are finalizing the class labels, auditing the annotations, choosing between bounding boxes and segmentation masks, and training.",
        tools: ["Python", "SAM 3", "YOLO / Ultralytics", "OpenCV", "PyTorch"],
      },
    ],
    tools: ["Python", "Numba", "HiPerGator", "Stochastic simulation", "SAM 3", "YOLO"],
    figure: "sigmoid",
  },
  {
    slug: "lung-transplant-pgd",
    index: "R.03",
    tier: "featured",
    caseStudy: false,
    title: "Modeling primary graft dysfunction after lung transplant",
    area: ["Mechanistic modeling", "Pulmonary"],
    lab: "Brunson Lab",
    org: "University of Florida",
    period: "May 2026 – Present",
    role: "Undergraduate Research Assistant",
    question:
      "What drives primary graft dysfunction, and could a mechanistic model help predict which patients are at risk?",
    summary:
      "Primary graft dysfunction (PGD) is an injury to a transplanted lung that shows up soon after surgery. I'm building a mechanistic model of PGD to understand what causes it and, eventually, to help with risk stratification. Alongside that, I'm doing a systematic review of the literature to figure out what the model needs to include.",
    approach: [
      {
        label: "Literature",
        text: "A systematic review of mechanistic and clinical PGD studies, to pull together what's already known and find the gaps.",
      },
      {
        label: "Model",
        text: "Building the mechanistic model based on what the review turns up.",
      },
    ],
    status: "Early stage: literature review and model development.",
    tools: ["Mechanistic modeling", "Systematic review"],
    figure: "pgd",
  },
  {
    slug: "parkinsons-immunotherapy",
    index: "R.04",
    tier: "secondary",
    caseStudy: false,
    title: "Immunotherapy and inflammation in Parkinson's disease",
    area: ["Neuroimmunology", "Translational"],
    lab: "Vedam-Mai Lab",
    org: "University of Florida",
    period: "Sept 2025 – Present",
    role: "Undergraduate Research Assistant · Lead author, systematic review",
    summary:
      "I'm the lead author on a systematic review of immunotherapy for Parkinson's disease. I designed the search strategy, screen and extract studies, and am pulling together the evidence on active, passive, and cell-based approaches. I also analyze datasets on immune markers, gut microbiome composition, and disease progression, with a focus on T-cell responses and inflammation along the gut–brain axis.",
    tools: ["Systematic review", "Data analysis", "Visualization"],
  },
  {
    slug: "surgical-simulation",
    index: "R.05",
    tier: "secondary",
    caseStudy: false,
    title: "Surgical simulation for transplant and pediatric procedures",
    area: ["Surgical education", "Clinical research"],
    lab: "Dream Team Engineering",
    org: "University of Florida",
    period: "Jan 2024 – Present",
    role: "Surgical Research Team Captain",
    summary:
      "I captain the surgical research team. I write IRB applications, study protocols, and statistical analysis plans, and design skills assessments for surgical residents. We work with transplant surgeons to build simulation models for kidney and liver transplants and infant IV placement, and we've published and presented results from our surveys and experiments.",
    tools: ["IRB protocols", "Study design", "Statistical analysis plans", "3D printing"],
  },
];

// Class modeling project, featured at the top of "Modeling & computation".
export const MODELING_FEATURE = {
  slug: "in-stent-restenosis",
  index: "M.01",
  tier: "featured",
  caseStudy: true,
  title: "Modeling restenosis in femoral artery stents",
  area: ["Mechanobiology", "PDE modeling"],
  lab: "Class project, team of 5",
  org: "University of Florida",
  period: "Aug 2026 – Present",
  role: "Led problem definition and built the outward-force module",
  question:
    "Can a restenosis model built for coronary stents be adapted to self-expanding nitinol stents in the leg?",
  summary:
    "Restenosis is when an artery narrows again after a stent goes in, mostly because smooth muscle cells move in, multiply, and lay down new tissue. For this class project, our team took a published restenosis model (Escuer et al., 2019) built for balloon-expandable coronary stents and adapted it to self-expanding nitinol stents in the femoral artery.",
  problem:
    "Nitinol stents keep pushing outward on the artery wall for as long as they're in place. The original model doesn't include that force, and the extra stress it puts on the wall can drive more tissue growth.",
  approach: [
    {
      label: "Base model",
      text: "We re-implemented the reaction–diffusion model, which tracks growth factors, MMP-2, extracellular matrix, and two types of smooth muscle cells (contractile and synthetic).",
    },
    {
      label: "Physiology",
      text: "I led the problem definition and worked out how the stent's outward force should connect to smooth muscle cell migration and growth, matrix buildup, and neointimal hyperplasia.",
    },
    {
      label: "Outward force",
      text: "I added a module that relates how much the stent is oversized to the hoop stress in the artery wall.",
    },
    {
      label: "Checking",
      text: "We compared our version of the base model to the published results, then ran a blind prediction against porcine data.",
    },
  ],
  contributions: [
    "Problem definition and the physiological reasoning",
    "The chronic outward force module",
    "Checking the base model against published results",
  ],
  outcomes: [
    {
      value: "24.8%",
      label: "Base model check",
      text: "Our re-implementation predicted 24.8% restenosis at 300 days. The published model reports about 25%.",
    },
    {
      value: "73%",
      label: "Blind prediction",
      text: "The phenotype-switch pathway predicted 73% area stenosis. The porcine data showed 64 ± 17%.",
    },
  ],
  tools: ["PDE modeling", "Numerical simulation", "Parameter calibration", "Sensitivity analysis"],
  figure: "restenosis",
  secondaryFigure: "artery",
};

// Engineering design, shown in the Projects section.
export const DESIGN = [
  {
    slug: "distal-biceps-repair",
    index: "D.01",
    caseStudy: true,
    title: "Distal biceps tendon repair system",
    area: ["Medical device design", "Orthopedics"],
    lab: "Senior design, sponsored by CONMED",
    org: "University of Florida",
    period: "Aug 2026 – Present",
    role: "Team member (team of 8)",
    question:
      "What does a distal biceps repair system need to do well enough for a surgeon to test it in a cadaver lab?",
    summary:
      "This is my senior design project. Our team of eight is designing a proof-of-concept distal biceps tendon repair system for CONMED, our industry sponsor. It includes the implant, instruments, and sterile packaging, and a sports medicine surgeon will evaluate it in a cadaveric simulated-use setting.",
    problem:
      "The repair has to survive repeated loading without the tendon pulling away from the bone, and it has to stay clear of nearby nerves. Before designing anything, we had to turn those needs into specific, measurable targets.",
    method:
      "We built a design traceability matrix with 12 user needs, each with marginal and ideal targets based on the biomechanics literature and FDA, ISO, and ASTM standards. We also benchmarked cortical-button, suture-anchor, and bone-tunnel repairs.",
    contribution:
      "I co-wrote the needs statement and traceability matrix and reviewed IP and regulatory requirements. That review pointed us to a Class II 510(k) pathway (21 CFR 888.3040) and gave us implant cost targets.",
    approach: [
      {
        label: "Needs",
        text: "Co-wrote the needs statement and a design traceability matrix of 12 user needs, each with marginal and ideal targets.",
      },
      {
        label: "Specifications",
        text: "Based the targets on the biomechanics literature and on FDA, ISO, and ASTM standards.",
      },
      {
        label: "Benchmarking",
        text: "Compared cortical-button, suture-anchor, and bone-tunnel repair constructs.",
      },
      {
        label: "Regulatory and IP",
        text: "Reviewed IP and regulatory requirements, which pointed to a Class II 510(k) pathway (21 CFR 888.3040) and set implant cost targets.",
      },
    ],
    specs: [
      { need: "Fixation strength", target: "≥ 310–440 N load to failure", basis: "After 3,600 physiologic cycles" },
      { need: "Repair integrity", target: "≤ 3 mm", basis: "Tendon–bone gap" },
      { need: "Nerve safety", target: "≥ 5 mm", basis: "Nerve clearance" },
      { need: "Regulatory pathway", target: "Class II · 510(k)", basis: "21 CFR 888.3040" },
    ],
    contributions: [
      "Needs statement and design traceability matrix",
      "Target specifications from the literature and standards",
      "Benchmarking existing repair constructs",
      "IP and regulatory review",
    ],
    tools: ["Design controls", "FDA / ISO / ASTM standards", "Benchmarking", "Regulatory analysis"],
  },
  {
    slug: "pediatric-crutch",
    index: "D.02",
    title: "Height-adjustable crutch for kids",
    area: ["CAD", "Technical drawing"],
    period: "Oct 2025",
    problem:
      "Kids grow out of fixed-length crutches, so this one needed to adjust to different heights and lock securely.",
    method:
      "I designed an 11-part telescoping crutch in Onshape, sized with the clinical rule that crutch length is about 77% of height. It fits users from 1.33 to 1.56 m with about 180 mm of pin-locked adjustment. The assembly uses slider mates and travel limits to simulate the telescoping leg.",
    contribution:
      "Dimensioned drawings for every part with ±0.01 mm tolerances at the sliding and pin interfaces, material choices for each part, and a technical report on the design reasoning, tolerancing, limitations, and next steps like FEA and a spring-loaded lock.",
    tools: ["Onshape", "Fusion 360", "Tolerancing", "Technical writing"],
  },
  {
    slug: "prosthetic-hand",
    index: "D.03",
    title: "Muscle-controlled 3D-printed prosthetic hand",
    area: ["Embedded systems", "Assistive devices"],
    lab: "GRiP Gaming Team",
    period: "Aug 2023 – May 2024",
    problem:
      "A child with a below-elbow amputation needed a prosthetic hand they could control with their own muscles.",
    method:
      "We built a 3D-printed hand. I worked on the electronics and code, programming the hand to close when an EMG sensor on the biceps picks up a signal.",
    contribution: "Circuits and control software, as part of the Circuits & Software team.",
    tools: ["Arduino", "C++", "EMG sensors", "3D printing"],
  },
];

export const CASE_STUDIES = [...RESEARCH, MODELING_FEATURE, ...DESIGN].filter((w) => w.caseStudy);

// Old URLs that should keep working.
const ALIASES = { "plasticity-disease-dynamics": "holt-lab" };

export function findCaseStudy(slug) {
  return CASE_STUDIES.find((w) => w.slug === (ALIASES[slug] ?? slug));
}
