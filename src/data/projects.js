// Modeling, computation, and software projects (shown as an expandable index).
// Structure: problem → method → outcome → tools.

export const PROJECTS = [
  {
    id: "model-collapse",
    title: "Modeling AI model collapse",
    context: "SCUDEM International Modeling Competition",
    domain: "Stochastic modeling",
    badge: "Outstanding award",
    problem:
      "When models are trained recursively on AI-generated data, the diversity of their outputs can erode — a failure mode known as model collapse.",
    method:
      "Two complementary frameworks: a Markov-chain ecosystem model for early-stage information loss and a layered discrete-distribution model for late-stage collapse. Monte Carlo experiments simulated recursive human–AI training, with distribution drift tracked by KL divergence and tail coverage.",
    outcome:
      "Showed that model diversity stabilizes performance. Received the Outstanding designation — the highest award level — among international teams, and later presented at the UF Undergraduate Mathematics Research Symposium.",
    tools: ["MATLAB", "Markov chains", "Monte Carlo", "Information theory"],
  },
  {
    id: "battery-dynamics",
    title: "Smartphone battery dynamics",
    context: "COMAP Mathematical Contest in Modeling",
    domain: "ODE modeling · UQ",
    problem:
      "Predict a smartphone's state of charge under realistic, irregular user behavior.",
    method:
      "A physics-grounded continuous-time ODE model including processor load, display brightness, network activity, and thermal effects. User activity was modeled with stochastic indicator functions and Fourier-series CPU and network profiles.",
    outcome:
      "A global Monte Carlo sensitivity analysis over 10⁴ simulations identified processor load as the dominant driver of battery depletion.",
    tools: ["MATLAB", "ode45", "Stochastic modeling", "Uncertainty quantification"],
  },
  {
    id: "seatrout",
    title: "Spotted seatrout population model & management simulator",
    context: "Independent project",
    domain: "ODE modeling · Calibration",
    problem:
      "Estimate the population dynamics of Florida spotted seatrout and evaluate fishing policies against sustainable-yield reference points.",
    method:
      "A stock-assessment ODE model combining logistic growth with fishing-mortality removals, fit to a unified 2000–2023 series of FWC landings, CPUE, and spawning-stock-biomass data using constrained Nelder–Mead optimization.",
    outcome:
      "Trajectories validated against independent SSB data with under 10% relative error; 10-year constant-F simulations identified F_MSY and B_MSY.",
    tools: ["Python", "SciPy", "pandas", "Matplotlib", "Jupyter"],
    link: { label: "Source on GitHub", href: "https://github.com/sharadrpatel/Fish_Stock_ODE_Modeling" },
  },
  {
    id: "leaf-segmentation",
    title: "Leaf segmentation for disease severity",
    context: "Holt Lab",
    domain: "Computer vision",
    problem: "Scoring infection on leaves by eye is slow and subjective across large sample sets.",
    method:
      "An end-to-end pipeline using the Segment Anything Model to produce per-leaf masks, with contour and convex-hull analysis of damage and reference-tag calibration from pixels to real-world area. Accelerated on Apple Silicon with PyTorch MPS.",
    outcome: "Percent-infected-tissue and structural-damage metrics for downstream ecological analysis.",
    tools: ["Python", "PyTorch", "OpenCV", "Ultralytics"],
    link: { label: "Read the case study", href: "/work/plasticity-disease-dynamics", internal: true },
  },
  {
    id: "neural-network",
    title: "Neural network from first principles",
    context: "Independent project",
    domain: "Machine learning",
    problem: "Understand how a neural network learns by building one without a deep-learning framework.",
    method:
      "A feedforward network in NumPy with hand-implemented forward propagation, backpropagation, and mini-batch gradient descent.",
    outcome: "Trained on MNIST handwritten digits, with training and validation loss and accuracy curves.",
    tools: ["Python", "NumPy", "Matplotlib"],
  },
  {
    id: "review-bias",
    title: "Reviewer bias in student organization applications",
    context: "Data analysis",
    domain: "Statistics",
    problem: "Were application outcomes being shaped by the review process rather than the applicants?",
    method:
      "Analyzed multi-year application data for trends, acceptance predictors, and sources of reviewer bias, quantifying reviewer-order effects on final outcomes.",
    outcome:
      "Scoring dashboards and recommended process changes: blinded first-pass review, balanced reviewer assignment, and calibration sessions.",
    tools: ["Python", "pandas", "Seaborn"],
  },
  {
    id: "connections",
    title: "Connections word game",
    context: "Full-stack web application",
    domain: "Software",
    problem: "Rebuild the NYT Connections puzzle as a complete, playable web app.",
    method:
      "Front and back end implementing the core mechanics — animated tile interactions, color-coded category reveals, and guess tracking.",
    outcome: "A persistent global leaderboard that tracks scores across sessions for competitive play.",
    tools: ["JavaScript", "HTML", "CSS"],
    link: { label: "Source on GitHub", href: "https://github.com/sharadrpatel/BKST_NYC" },
  },
];
