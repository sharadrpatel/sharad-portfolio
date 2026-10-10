// Modeling, computation, and software projects (shown as an expandable index).
// Structure: problem → method → outcome → tools.

export const PROJECTS = [
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
