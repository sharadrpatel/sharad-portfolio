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
      "When AI models are trained over and over on AI-generated data, their outputs can lose diversity. This is called model collapse.",
    method:
      "We used two models: a Markov-chain model of an ecosystem of AI models for the early loss of information, and a layered discrete-distribution model for later-stage collapse. We ran Monte Carlo simulations of repeated human and AI training and tracked how the distributions drifted using KL divergence and tail coverage.",
    outcome:
      "Having a variety of models kept performance more stable. Our team received the Outstanding designation, the highest award level, and we later presented the work at UF's Undergraduate Mathematics Research Symposium.",
    tools: ["MATLAB", "Markov chains", "Monte Carlo", "Information theory"],
  },
  {
    id: "battery-dynamics",
    title: "Smartphone battery drain",
    context: "COMAP Mathematical Contest in Modeling",
    domain: "ODE modeling · UQ",
    problem: "Predict how a phone's battery charge drops over a day of realistic, uneven use.",
    method:
      "A continuous-time ODE model that includes processor load, screen brightness, network activity, and temperature effects. We modeled user behavior with random on/off indicator functions and Fourier-series patterns for CPU and network use.",
    outcome:
      "A global Monte Carlo sensitivity analysis (10⁴ simulations) showed processor load was the biggest driver of battery drain.",
    tools: ["MATLAB", "ode45", "Stochastic modeling", "Uncertainty quantification"],
  },
  {
    id: "seatrout",
    title: "Spotted seatrout population model",
    context: "Independent project",
    domain: "ODE modeling · Calibration",
    problem:
      "Estimate how Florida's spotted seatrout population changes over time and test fishing policies against sustainable-yield targets.",
    method:
      "A stock-assessment ODE model with logistic growth and fishing removals. I combined FWC landings, CPUE, and spawning stock biomass data from 2000 to 2023 into one time series and fit the parameters with constrained Nelder–Mead optimization.",
    outcome:
      "The model matched independent spawning stock biomass data with less than 10% relative error. Ten-year simulations at constant fishing rates gave estimates of F_MSY and B_MSY.",
    tools: ["Python", "SciPy", "pandas", "Matplotlib", "Jupyter"],
    link: { label: "Code on GitHub", href: "https://github.com/sharadrpatel/Fish_Stock_ODE_Modeling" },
  },
  {
    id: "leaf-segmentation",
    title: "Leaf segmentation for measuring disease",
    context: "Holt Lab",
    domain: "Computer vision",
    problem: "Scoring leaf infection by eye is slow and inconsistent when there are a lot of samples.",
    method:
      "A pipeline built on the Segment Anything Model that makes a mask for each leaf, measures damage with contour and convex-hull analysis, and uses reference tags to convert pixels to real area. It runs on Apple Silicon with PyTorch MPS.",
    outcome: "Percent infected tissue and structural damage for each leaf, used in the lab's ecological analysis.",
    tools: ["Python", "PyTorch", "OpenCV", "Ultralytics"],
    link: { label: "More on the Holt Lab project", href: "/work/plasticity-disease-dynamics", internal: true },
  },
  {
    id: "neural-network",
    title: "Neural network from scratch",
    context: "Independent project",
    domain: "Machine learning",
    problem: "I wanted to understand how neural networks learn, so I built one without a deep learning library.",
    method:
      "A feedforward network written in NumPy, with forward propagation, backpropagation, and mini-batch gradient descent coded by hand.",
    outcome: "Trained it on the MNIST handwritten digits and plotted training and validation loss and accuracy.",
    tools: ["Python", "NumPy", "Matplotlib"],
  },
  {
    id: "review-bias",
    title: "Reviewer bias in club applications",
    context: "Data analysis",
    domain: "Statistics",
    problem: "Were a student organization's application decisions being affected by how applications were reviewed?",
    method:
      "I analyzed several years of application data to look at trends, what predicted acceptance, and sources of reviewer bias, including how much the order of review affected final outcomes.",
    outcome:
      "Built scoring dashboards and recommended changes: a blinded first round, more balanced reviewer assignments, and calibration sessions for reviewers.",
    tools: ["Python", "pandas", "Seaborn"],
  },
  {
    id: "connections",
    title: "Connections word game",
    context: "Web app",
    domain: "Software",
    problem: "Build a working copy of the NYT Connections puzzle, front end and back end.",
    method: "Recreated the main gameplay: animated tiles, color-coded category reveals, and guess tracking.",
    outcome: "Added a global leaderboard that saves scores across sessions so people can compete.",
    tools: ["JavaScript", "HTML", "CSS"],
    link: { label: "Code on GitHub", href: "https://github.com/sharadrpatel/BKST_NYC" },
  },
];
