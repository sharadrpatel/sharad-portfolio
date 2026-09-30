// Research studies and major design work.
//
// tier: "featured"  → large editorial row on the homepage (with figure)
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
    title: "Personalized musculoskeletal models of the osteoarthritic thumb",
    area: ["Biomechanics", "Musculoskeletal modeling"],
    lab: "Nichols Lab",
    org: "University of Florida",
    period: "Aug 2024 – Present",
    role: "Undergraduate Research Assistant",
    question:
      "Does personalizing a thumb model with ultrasound-measured muscle architecture change its predicted muscle forces — and how do those forces differ in carpometacarpal osteoarthritis?",
    summary:
      "Osteoarthritis at the base of the thumb (CMCOA) makes pinching and grasping painful, but the muscle forces behind those tasks cannot be measured directly. I build subject-specific OpenSim models, personalized with ultrasound-derived muscle parameters, to estimate them and compare healthy older adults with adults with CMCOA.",
    problem:
      "Generic musculoskeletal models are scaled from cadaveric data and may not reflect an individual's muscle architecture — a real gap in an older, arthritic population. Knowing which personalized parameters actually move the predictions tells us where measurement effort matters.",
    approach: [
      {
        label: "Experimental data",
        text: "Collected fine-wire EMG and Vicon motion capture during pinch and grasp tasks; processed signals in Python to characterize movement and muscle activation.",
      },
      {
        label: "Personalization",
        text: "Built subject-specific OpenSim thumb models with Hill-type muscle parameters derived from ultrasound measurements.",
      },
      {
        label: "Simulation",
        text: "Applied inverse kinematics and static optimization to estimate joint angles, moment arms, and muscle forces across tasks.",
      },
      {
        label: "Uncertainty",
        text: "Ran sensitivity and uncertainty analyses on optimal fiber length, tendon slack length, and physiological cross-sectional area, propagating measurement error into force predictions.",
      },
      {
        label: "Model reduction",
        text: "Developed a reduced Hill-type model to test whether a simplified formulation reproduces the personalization effects of the full OpenSim simulation.",
      },
      {
        label: "Statistics",
        text: "Performed exploratory analysis of multi-muscle EMG with paired t-tests and two-way ANOVA across CMCOA stages.",
      },
    ],
    contributions: [
      "Motion capture and fine-wire EMG data collection",
      "Signal processing and statistical analysis in Python",
      "Subject-specific model building in OpenSim",
      "Design and execution of the sensitivity and uncertainty analyses",
      "Formulation of the reduced Hill-type model",
    ],
    outcomes: [
      {
        label: "Comparison",
        text: "Predicted muscle forces compared between healthy older adults and adults with CMCOA across pinch and grasp tasks.",
      },
      {
        label: "Drivers",
        text: "Identification of which ultrasound-derived parameters dominate the effect of personalization.",
      },
      {
        label: "Simplification",
        text: "A test of whether a reduced model can stand in for the full simulation.",
      },
    ],
    tools: ["OpenSim", "Vicon", "Fine-wire EMG", "Python", "Ultrasound", "Hill-type models", "ANOVA"],
    figure: "hill",
  },
  {
    slug: "in-stent-restenosis",
    index: "R.02",
    tier: "featured",
    caseStudy: true,
    title: "A mechanobiological model of in-stent restenosis in peripheral arteries",
    area: ["Mechanobiology", "PDE modeling"],
    lab: "Team project with Medtronic",
    org: "Modeling & Simulation Innovation Group",
    period: "Aug 2026 – Present",
    role: "Problem definition, physiological rationale, and chronic-outward-force module (team of 5)",
    question:
      "Can a restenosis model built for coronary stents be adapted to predict tissue regrowth inside self-expanding nitinol stents in the femoral artery?",
    summary:
      "Restenosis — the re-narrowing of an artery after stenting — is driven by smooth muscle cell migration and proliferation and by extracellular matrix deposition. Our team is adapting a published reaction–diffusion model (Escuer et al., 2019) from balloon-expandable coronary stents to self-expanding nitinol stents in the femoral artery.",
    problem:
      "A self-expanding nitinol stent keeps pushing outward on the vessel wall long after it is deployed. That chronic outward force — and the arterial stress it creates — is absent from models built for balloon-expandable coronary stents.",
    approach: [
      {
        label: "Base model",
        text: "Re-implemented a reaction–diffusion system coupling growth factors, MMP-2, extracellular matrix, and contractile and synthetic smooth muscle cell phenotypes.",
      },
      {
        label: "Physiological rationale",
        text: "Led problem definition, connecting the stent's chronic outward force to smooth muscle cell migration and proliferation, ECM deposition, and neointimal hyperplasia.",
      },
      {
        label: "New mechanics",
        text: "Added a chronic outward force module linking stent oversizing to arterial hoop stress.",
      },
      {
        label: "Verification",
        text: "Benchmarked the re-implemented base model against published outputs, then ran a blind test against porcine data.",
      },
    ],
    contributions: [
      "Problem definition and physiological rationale",
      "Chronic outward force module (oversizing → hoop stress)",
      "Benchmarking against published model output",
    ],
    outcomes: [
      {
        value: "24.8%",
        label: "Base-model benchmark",
        text: "Restenosis at 300 days from the re-implemented model, versus ~25% in the published model.",
      },
      {
        value: "73%",
        label: "Blind test",
        text: "Area stenosis predicted by the phenotype-switch pathway, versus 64 ± 17% observed in porcine data.",
      },
    ],
    tools: ["PDE modeling", "Numerical simulation", "Parameter calibration", "Sensitivity analysis"],
    figure: "restenosis",
    secondaryFigure: "artery",
  },
  {
    slug: "lung-transplant-pgd",
    index: "R.03",
    tier: "featured",
    caseStudy: false,
    title: "Mechanistic modeling of primary graft dysfunction after lung transplantation",
    area: ["Mechanistic modeling", "Pulmonary"],
    lab: "Lung Modeling Lab · Dr. Brunson",
    org: "University of Florida",
    period: "May 2026 – Present",
    role: "Undergraduate Research Assistant",
    question:
      "Which pathophysiological drivers underlie primary graft dysfunction, and can a mechanistic model help identify which transplant recipients are at risk?",
    summary:
      "Primary graft dysfunction (PGD) is an acute injury to the transplanted lung that develops soon after surgery. I am developing a mechanistic model of PGD to characterize its underlying drivers and inform risk stratification, grounded in a systematic review of the mechanistic and clinical literature.",
    approach: [
      {
        label: "Evidence",
        text: "Systematic review of the PGD literature to synthesize mechanistic and clinical findings and identify the gaps the model should address.",
      },
      {
        label: "Model",
        text: "Development of a mechanistic model of PGD pathophysiology, structured by the review.",
      },
    ],
    status: "Early stage — literature synthesis and model development.",
    tools: ["Mechanistic modeling", "Systematic review"],
    figure: "pgd",
  },
  {
    slug: "plasticity-disease-dynamics",
    index: "R.04",
    tier: "secondary",
    caseStudy: true,
    title: "Plasticity, migration, and disease in changing environments",
    area: ["ODE modeling", "Computer vision"],
    lab: "Holt Lab",
    org: "University of Florida",
    period: "Dec 2025 – Present",
    role: "Undergraduate Research Assistant",
    question:
      "How do phenotypic plasticity and movement shape population and disease dynamics as environments change — and how can infection be measured at scale?",
    summary:
      "Two connected threads: ODE models of population and disease dynamics in which organisms respond plastically to their environment, and a computer-vision pipeline that turns leaf photographs into quantitative infection measurements.",
    problem:
      "Ecological models often treat traits as fixed, yet organisms adjust to their environment and move through it. Testing those models also needs disease measurements across many samples — slow and subjective when scored by eye.",
    approach: [
      {
        label: "Plasticity",
        text: "Built simulation models of environmental change in which phenotypic plasticity is represented with sigmoidal response functions; implemented and validated ODE models of population and disease dynamics.",
      },
      {
        label: "Movement",
        text: "Extended the framework with migration dynamics, coupling movement behavior with plasticity to capture spatial spread under environmental change.",
      },
      {
        label: "Segmentation",
        text: "Built a pipeline using the Segment Anything Model (SAM) to segment leaves, generate per-leaf masks, and isolate regions of interest.",
      },
      {
        label: "Measurement",
        text: "Computed percent infected tissue and structural damage via contour and convex-hull analysis; calibrated pixels to real-world area with reference tags.",
      },
      {
        label: "Performance",
        text: "Optimized execution on Apple Silicon with PyTorch MPS acceleration.",
      },
    ],
    contributions: [
      "ODE model implementation and validation",
      "Migration extension to the modeling framework",
      "End-to-end segmentation and severity-scoring pipeline",
    ],
    outcomes: [
      {
        label: "Severity metrics",
        text: "Percent-infection estimates across samples to support large-scale ecological analysis.",
      },
      {
        label: "Framework",
        text: "A modeling framework that couples plastic responses with migration to study spatial spread.",
      },
    ],
    tools: ["Python", "PyTorch", "OpenCV", "SAM", "Ultralytics", "ODE modeling"],
    figure: "sigmoid",
  },
  {
    slug: "parkinsons-immunotherapy",
    index: "R.05",
    tier: "secondary",
    caseStudy: false,
    title: "Immunotherapy and neuroinflammation in Parkinson's disease",
    area: ["Neuroimmunology", "Translational"],
    lab: "Vedam-Mai Lab",
    org: "University of Florida",
    period: "Sept 2025 – Present",
    role: "Undergraduate Research Assistant · Lead author, systematic review",
    summary:
      "Lead author of a systematic review of immunotherapy in Parkinson's disease — designing the search strategy, screening and extracting studies, and synthesizing evidence across active, passive, and cell-based approaches. I also analyze biological datasets relating immune markers and microbiome composition to disease progression, with a focus on T-cell responses and neuroinflammation along the gut–brain axis.",
    tools: ["Systematic review", "Data analysis", "Visualization"],
  },
  {
    slug: "surgical-simulation",
    index: "R.06",
    tier: "secondary",
    caseStudy: false,
    title: "Surgical simulation for transplant and pediatric procedures",
    area: ["Surgical education", "Clinical research"],
    lab: "Dream Team Engineering",
    org: "University of Florida",
    period: "Jan 2024 – Present",
    role: "Surgical Research Team Captain",
    summary:
      "I lead the team's surgical simulation research: writing IRB applications, study protocols, and statistical analysis plans, and designing skills assessments for surgical residents. With transplant surgeons, we develop simulation models for kidney and liver transplantation and infant IV administration, and publish and present the findings from our surveys and experiments.",
    tools: ["IRB protocols", "Study design", "Statistical analysis plans", "3D printing"],
  },
];

// Engineering design — shown in the Projects section, not Research.
export const DESIGN = [
  {
    slug: "distal-biceps-repair",
    index: "D.01",
    caseStudy: true,
    title: "Distal biceps tendon repair system",
    area: ["Medical device design", "Orthopedics"],
    lab: "Senior design · Sponsored by CONMED",
    org: "University of Florida",
    period: "Aug 2026 – Present",
    role: "Team member (team of 8)",
    question:
      "What would a distal biceps tendon repair system need to deliver for a sports medicine surgeon to evaluate it in a cadaveric simulated-use setting?",
    summary:
      "An eight-person senior design team designing a proof-of-concept repair system — implant, instruments, and sterile packaging — for industry sponsor CONMED, to be evaluated by a sports medicine surgeon in a cadaveric simulated-use setting.",
    problem:
      "A repaired distal biceps tendon has to hold under repeated physiologic loading without gapping from bone, while keeping clear of nearby nerves. Those needs have to become measurable, standards-grounded targets before anything is designed.",
    method:
      "Translated clinical needs into a design traceability matrix — 12 user needs with marginal and ideal targets grounded in the biomechanical literature and FDA, ISO, and ASTM standards — and benchmarked cortical-button, suture-anchor, and bone-tunnel constructs.",
    contribution:
      "Co-developed the needs statement and traceability matrix; reviewed IP and regulatory requirements, identifying a Class II 510(k) pathway (21 CFR 888.3040) and implant cost targets.",
    approach: [
      {
        label: "Needs",
        text: "Co-developed the needs statement and a design traceability matrix of 12 user needs, each with marginal and ideal target specifications.",
      },
      {
        label: "Specifications",
        text: "Grounded targets in the biomechanical literature and FDA, ISO, and ASTM standards.",
      },
      {
        label: "Benchmarking",
        text: "Compared cortical-button, suture-anchor, and bone-tunnel repair constructs.",
      },
      {
        label: "Regulatory & IP",
        text: "Reviewed IP and regulatory requirements, identifying a Class II 510(k) pathway (21 CFR 888.3040) and implant cost targets.",
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
      "Target specifications from literature and standards",
      "Competitive benchmarking of repair constructs",
      "IP and regulatory review",
    ],
    tools: ["Design controls", "FDA / ISO / ASTM standards", "Benchmarking", "Regulatory analysis"],
  },
  {
    slug: "pediatric-crutch",
    index: "D.02",
    title: "Height-adjustable pediatric axillary crutch",
    area: ["CAD", "Technical drawing"],
    period: "Oct 2025",
    problem:
      "Children outgrow fixed-length crutches. The design needed to fit a range of heights with secure, simple adjustment.",
    method:
      "Designed an 11-part telescoping crutch in Onshape, sized with the 77%-of-height clinical rule to fit users 1.33–1.56 m tall with about 180 mm of pin-locked adjustment. Built a full assembly with slider mates and travel limits to simulate the telescoping leg.",
    contribution:
      "Dimensioned multiview drawings for every part with ±0.01 mm tolerances at sliding and pin interfaces; material selection per part; a technical report covering design justification, tolerancing rationale, limitations, and next steps (FEA load simulation, spring-loaded locking).",
    tools: ["Onshape", "Fusion 360", "Tolerancing", "Technical writing"],
  },
  {
    slug: "prosthetic-hand",
    index: "D.03",
    title: "Myoelectric control for a 3D-printed prosthetic hand",
    area: ["Embedded systems", "Assistive devices"],
    lab: "GRiP Gaming Team",
    period: "Aug 2023 – May 2024",
    problem:
      "A child with a below-elbow amputation needed a prosthetic hand that responds to their own muscle signals.",
    method:
      "Co-developed the electrical and software systems for a 3D-printed hand, programming hand closure in response to bicep myosensor signals.",
    contribution: "Circuits and control software on the Circuits & Software team.",
    tools: ["Arduino", "C++", "Myosensors", "3D printing"],
  },
];

export const CASE_STUDIES = [...RESEARCH, ...DESIGN].filter((w) => w.caseStudy);

export function findCaseStudy(slug) {
  return CASE_STUDIES.find((w) => w.slug === slug);
}
