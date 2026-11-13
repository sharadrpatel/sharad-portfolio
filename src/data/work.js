// Research and projects. Source: the CV. Entries with `page: true` get a full
// page at /work/<slug>; the rest open in place on the home page.
//
// `explainer` paragraphs describe a general method, not results of this work.

export const THREADS = [
  { id: "inference", section: "research", title: "Mathematical biology & inference", blurb: "Mechanistic models of cells, tissues and disease, and the statistics of fitting them." },
  { id: "numerics", section: "research", title: "Numerical methods & scientific computing", blurb: "Writing and improving the solvers that the models depend on." },
  { id: "clinic", section: "research", title: "Medicine, imaging & clinical evidence", blurb: "Research done with clinicians, about patients and the people who treat them." },
  { id: "stochastic", section: "projects", title: "Modeling contests & data analysis", blurb: "Open-ended problems and independent analyses, most of them on a short clock." },
  { id: "design", section: "projects", title: "Engineering design", blurb: "Things designed, prototyped and handed to a user." },
];

export const WORK = [
  // ───────────────────────── Mathematical biology & inference
  {
    slug: "gastrulation",
    thread: "inference",
    page: true,
    figure: "layers",
    title: "Which model of collective cell migration do the data support?",
    short: "Two-layer cell migration model",
    where: "UF Mathematics · Mathematical biology",
    advisor: "Dr. Tracy Stepien",
    period: "October 2025 – present",
    summary:
      "A two-layer continuum mechanics model of cells migrating during gastrulation, fit to experimental data with sequential Monte Carlo and used to compare competing models.",
    why:
      "During gastrulation, sheets of embryonic cells spread and rearrange together to lay down the body plan, and cells in one layer can intercalate into the next. More than one mechanical story can be written down for the same spreading tissue. The useful question is which of them the experimental data can tell apart, and which parameters the data constrain at all.",
    did: [
      "Developing a two-layer continuum mechanics model for cell migration in the gastrulation stage of development.",
      "Running global sensitivity analysis with UQLab in MATLAB to find which parameters the model output responds to.",
      "Fitting parameters and comparing models against experimental data with Approximate Bayesian Computation – Sequential Monte Carlo (ABC-SMC), run on HiPerGator, UF's supercomputer.",
    ],
    explainer: {
      title: "The method: ABC-SMC",
      text: "When a model is easy to simulate but its likelihood is not available in closed form, approximate Bayesian computation replaces the likelihood with a comparison: draw parameters, simulate, and keep the draws whose output lands close to the data. The sequential Monte Carlo version does this in generations with a shrinking tolerance, so the population of accepted parameters moves from the prior toward the posterior. Running the same procedure across several candidate models gives a principled way to compare them. The figure at the top of the home page runs this algorithm live on a toy problem.",
    },
    outputs: [
      { kind: "Manuscript in preparation", text: "S. Ojha, J.-L. Choiseul, H. E. Lynch, M. Hazar, L. A. Davidson, T. L. Stepien. Model Selection of Collective Cell Migration in Multi-Layer Aggregates." },
      { kind: "Talk", text: "Undergraduate Mathematics Research Symposium, Gainesville, April 2026." },
      { kind: "Posters", text: "UF Spring Undergraduate Research Symposium, April 2026; Infectious Diseases and Economic Growth Workshop, March 2026." },
    ],
    status: "Ongoing. A manuscript is in preparation.",
    tools: ["MATLAB", "UQLab", "ABC-SMC", "Sensitivity analysis", "Continuum mechanics", "HiPerGator (HPC)"],
  },
  {
    slug: "honors-thesis",
    thread: "inference",
    title: "Honors thesis: estimating liver clearance from capillary shear stress",
    where: "UF · Honors thesis",
    advisor: "Dr. Tracy Stepien, Dr. Murfee and Dr. Mancy",
    period: "August 2026 – present",
    summary:
      "Extending a circulatory system code base to handle multiple inlets and outlets, in order to compute shear stress in capillaries, then using the shear stress data to estimate hepatic clearance under different scenarios.",
    tools: ["Mathematical modeling", "Microcirculation", "Shear stress"],
  },
  {
    slug: "lung-transplant",
    thread: "inference",
    title: "A mechanistic model of primary graft dysfunction after lung transplant",
    where: "UF · Systems medicine",
    advisor: "Dr. Brunson",
    period: "May 2026 – present",
    summary:
      "Developing a new mechanistic model of primary graft dysfunction, the acute injury that can follow lung transplantation. The model is being assembled from the literature by pathway mining and conceptual modeling.",
    tools: ["Mechanistic modeling", "Pathway mining", "Conceptual modeling"],
  },
  {
    slug: "covid-florida",
    thread: "inference",
    title: "Early COVID-19 in Florida: an epidemic model with an economy in it",
    where: "Infectious Diseases and Economic Growth Workshop, UF",
    period: "March 2026",
    summary:
      "A four-day workshop project. I built a simplified SIRS model with economic interactions in Python, fit it to early Florida infection data, and used Approximate Bayesian Computation to narrow the parameter space and compare the likely long-term behavior.",
    tools: ["Python", "SIRS model", "Approximate Bayesian Computation"],
  },
  {
    slug: "igem-sepsis",
    thread: "inference",
    title: "From differential equations to agents: sepsis in bone marrow",
    where: "UF iGEM · Gold medal, 2024 Grand Jamboree",
    advisor: "Dr. Pan",
    period: "February – October 2024",
    summary:
      "Adapted a differential-equation model of sepsis in bone marrow into an agent-based model in NetLogo, and helped write the team's project documentation in HTML. The team earned Gold at the 2024 iGEM Grand Jamboree.",
    tools: ["NetLogo", "Agent-based modeling", "HTML"],
  },
  {
    slug: "restenosis",
    thread: "inference",
    title: "Restenosis in self-expanding stents",
    where: "Quantitative Physiology (BME 4409) · course project",
    period: "August – December 2026",
    summary:
      "Adapting a restenosis model built for coronary stents to self-expanding nitinol stents in the leg. The model is simplified to 2D by applying a constant outward pressure to represent the load on the femoral artery.",
    tools: ["Mechanobiology", "PDE modeling"],
  },

  // ───────────────────────── Numerical methods
  {
    slug: "lattice-boltzmann",
    thread: "numerics",
    page: true,
    figure: "lattice",
    title: "A faster lattice Boltzmann–immersed boundary method for migrating cells",
    short: "Lattice Boltzmann–immersed boundary method",
    where: "Indiana University Indianapolis · Research Experience for Undergraduates",
    advisor: "Dr. Luoding Zhu",
    period: "May – July 2025",
    summary:
      "Developed a lattice Boltzmann–immersed boundary method for cells in low Reynolds number flow, then built an implicit framework around it.",
    why:
      "A cell moving through fluid is a fluid–structure problem: a deformable boundary pushes on the fluid and the fluid pushes back. At the scale of a cell, viscosity dominates and the Reynolds number is very small. The lattice Boltzmann–immersed boundary (LB-IB) method is a natural fit for this, but standard explicit couplings between an elastic boundary and the fluid can be costly in this regime, which is the motivation for linearized and implicit formulations.",
    did: [
      "Developed a lattice Boltzmann–immersed boundary method for cells in low Reynolds number flows.",
      "Increased efficiency by 300 steps per second over traditional LB-IB, with an error of about 1e-9 per time step.",
      "Constructed an implicit LB-IB framework for cell migration in low Reynolds number scenarios.",
    ],
    metrics: [
      { value: "+300", unit: "steps / s", label: "faster than traditional LB-IB" },
      { value: "1e-9", unit: "per step", label: "error against the traditional scheme" },
    ],
    explainer: {
      title: "The method: lattice Boltzmann meets immersed boundary",
      text: "The lattice Boltzmann method solves fluid flow by tracking how populations of particles stream between the nodes of a regular grid and relax toward equilibrium when they collide. The immersed boundary method represents a cell as a chain of points that moves freely through that grid: the points' elastic forces are spread onto nearby fluid nodes, and the fluid velocity is interpolated back to move the points. Neither half needs a mesh that conforms to the cell, which is what makes the pairing attractive for deforming, migrating bodies.",
    },
    outputs: [
      { kind: "Manuscript in preparation", text: "L. Zhu, S. Ojha, J. Gill, J. Barber. An Implicit Lattice Boltzmann – Immersed Boundary Method for Cell Migration." },
      { kind: "Talk", text: "Modeling Cell Migration with a Linearized Lattice-Boltzmann Immersed-Boundary Method. Indiana Undergraduate Math Conference, Indianapolis, July 2025." },
      { kind: "Poster", text: "Indiana University Indianapolis Summer Research Symposium, July 2025." },
    ],
    status: "REU complete. A manuscript is in preparation.",
    tools: ["Lattice Boltzmann method", "Immersed boundary method", "Implicit schemes", "Computational fluid dynamics"],
  },
  {
    slug: "radiation-transport",
    thread: "numerics",
    page: true,
    figure: "slab",
    title: "A solver for the radiation transport equation, built in two weeks",
    short: "Radiation transport solver",
    where: "Texas A&M · Summer school on Modeling and Simulating with PDEs",
    advisor: "Project directed by Dr. Guermond; school coordinated by Dr. Matthias Maier",
    period: "May 18 – 29, 2026",
    summary:
      "Theory and a working solver for the Boltzmann equation of radiation transport in 1D slab geometry, tested on standard benchmark problems.",
    why:
      "The radiation transport equation is a linear Boltzmann equation. It follows particles as they stream through a material, get absorbed, and scatter into new directions, and it is central to modeling inertial confinement fusion. The scattering term is an integral over every direction of travel, so the equation is integro-differential: each direction is coupled to all the others.",
    did: [
      "Developed the theory and a solver for the Boltzmann equation of inertial confinement fusion in 1D slab geometry, with a team of four.",
      "Coupled a streamline-upwind Petrov–Galerkin (SUPG) finite element solver with Richardson iteration for the integro-differential term.",
      "Solved benchmark problems including the Reed problem and the grazing problem.",
    ],
    explainer: {
      title: "The method: SUPG with an outer iteration",
      text: "Standard Galerkin finite elements oscillate on transport-dominated problems. Streamline-upwind Petrov–Galerkin fixes this by modifying the test functions so that stabilizing diffusion is added only along the direction of travel. To handle the scattering integral, the solver lags it: solve a pure transport problem in each direction using the previous estimate of the scattered source, update the source, and repeat until it stops changing. Benchmarks such as the Reed problem, a slab made of regions with sharply different material properties, test whether the scheme survives the discontinuities.",
    },
    outputs: [
      { kind: "Talk", text: "S. Ojha, R. Dadlani, R. Divan, G. Ratcliff. Radiation Transport Equation. TAMU Undergraduate Summer School in Modeling and Simulating with PDEs, College Station, May 2026." },
      { kind: "Poster", text: "S. Ojha, R. Dadlani, R. Divan, G. Ratcliff. Radiation Transport Equation. UIC Undergraduate Mathematics Symposium, Chicago, November 2026." },
    ],
    status: "Complete.",
    tools: ["Finite element method", "SUPG stabilization", "Richardson iteration", "Boltzmann transport"],
  },

  // ───────────────────────── Medicine, imaging & clinical evidence
  {
    slug: "theranostics",
    thread: "clinic",
    page: true,
    figure: "target",
    title: "Does the scan predict the outcome? Imaging evidence in theranostics",
    short: "Nuclear medicine and theranostics",
    where: "University of Pittsburgh Radiology · Florida Theragnostic Center",
    advisor: "Dr. Ashok Muthukrishnan (2022) and Dr. Krishnan (2026)",
    period: "Summer 2022 and May 2026",
    summary:
      "Two clinical data studies four years apart, both asking whether an imaging measurement tracks how patients do, plus a published article and a society talk.",
    why:
      "Theranostics pairs a diagnostic scan with a therapy aimed at the same molecular target: if a tumor lights up on the scan, the drug has somewhere to go. That only helps patients if the imaging measurement carries real information about outcomes, which is a question for data.",
    did: [
      "Pittsburgh, 2022: collated clinical and imaging data to evaluate the efficacy of prostate-specific membrane antigen (PSMA) imaging, and established a correlation between patient outcomes and PSMA PET performance relative to conventional PET.",
      "Wrote an article on the approval of Pluvicto, the first PSMA-targeted radioligand therapy, published in Targeted Therapies in Oncology.",
      "Florida Theragnostic Center, 2026: a case study of Xofigo (radium-223 dichloride) imaging and therapy, demonstrating a correlation between Bone Scan Index and patient outcomes.",
      "Shadowed radiologists, oncologists, a dosimetrist, a physicist, nurses and technicians at the VA Medical Center and the Florida Theragnostic Center in West Palm Beach.",
    ],
    outputs: [
      { kind: "Publication", text: "S. Ojha & A. Muthukrishnan (July 2022). Pluvicto Approval Launches Theragnostic in Prostate Cancer. Targeted Therapies in Oncology, 11(10):77." },
      { kind: "Talk", text: "Utility of SSTR PET Imaging in Management of Olfactory Neuroblastomas. Southeastern Chapter, Society of Nuclear Medicine and Molecular Imaging, Savannah, October 2022. Best Student Presenter." },
    ],
    status: "Both studies complete.",
    tools: ["Clinical data collation", "Outcome correlation", "PET imaging", "Bone Scan Index"],
  },
  {
    slug: "synthetic-mri",
    thread: "clinic",
    page: true,
    figure: "denoise",
    title: "Generating an MRI for patients who cannot have one",
    short: "Synthetic MRI from CT",
    where: "UF Dream Team Engineering",
    advisor: "Dr. Wong",
    period: "August 2024 – May 2025",
    summary:
      "Diffusion models that generate MRI images from CT, for planning deep brain stimulation surgery in patients for whom MRI is contraindicated.",
    why:
      "Surgeons plan deep brain stimulation on MRI, which shows the soft-tissue targets that CT does not. Some patients cannot be put in an MRI scanner. For them, the planning image has to come from somewhere else.",
    did: [
      "Used diffusion machine learning models to generate MRI images from CT scans.",
      "Aimed the work at perioperative planning for patients undergoing deep brain stimulation who are contraindicated for MRI.",
      "Presented the project with the team at the Yale Undergraduate Research Conference.",
    ],
    explainer: {
      title: "The method: diffusion models",
      text: "A diffusion model is trained by taking real images, adding noise in small steps until nothing is left, and learning to undo each step. Generation runs that process backward from pure noise. Conditioning the denoiser on a second image, here a CT slice, steers it toward an output that matches the patient's anatomy in a different modality.",
    },
    outputs: [
      { kind: "Poster", text: "S. Ojha, H. Kennedy, U. Sharma, J. Labasbas. Synthetic MRI Generation for Deep Brain Stimulation Preoperative Planning. Yale Undergraduate Research Conference, New Haven, April 2025." },
    ],
    status: "Complete.",
    tools: ["Diffusion models", "Medical imaging", "CT / MRI", "Machine learning"],
  },
  {
    slug: "surgical-simulators",
    thread: "clinic",
    page: true,
    figure: "probe",
    title: "Do simple surgical simulators teach? Designing the studies to find out",
    short: "Surgical simulator studies",
    where: "UF Dream Team Engineering",
    advisor: "Dr. Shah",
    period: "January 2025 – present",
    summary:
      "Testing liver, kidney, cholecystectomy and caudal block simulators with medical residents and students, and gathering the data to say whether they work.",
    why:
      "Residents need hands-on repetitions before they operate on patients, and low-cost physical and mixed-reality models can supply them. Whether a given simulator improves skill is an empirical claim, and it needs a study design that can support it.",
    did: [
      "Testing liver, kidney, cholecystectomy and caudal block surgical simulators with medical residents and students.",
      "Gathering data to establish how effective simple surgical models are at giving residents hands-on experience.",
      "As Director of Research for Dream Team Engineering (2025–26), oversaw five undergraduate research teams with 34 members, and ran a Research Bootcamp covering ANOVA and machine learning fundamentals.",
    ],
    outputs: [
      { kind: "Poster", text: "Efficacy of a Mixed-Reality Simulator for Ultrasound-Guided Infant Caudal Epidural Block Training: Study Design. Biomedical Engineering Society Annual Meeting, Orlando, October 2026; UF Fall Undergraduate Research Symposium, November 2026." },
      { kind: "Poster", text: "Evaluation of a Kidney Transplant Model for Educational Skill Development. Biomedical Engineering Society Annual Meeting, Orlando, October 2026." },
    ],
    status: "Ongoing.",
    tools: ["Study design", "Skills assessment", "ANOVA", "Research leadership"],
  },
  {
    slug: "igem-binder",
    thread: "clinic",
    title: "Designing a protein binder for osteocalcin with AI",
    where: "UF iGEM · Silver medal, 2025 Grand Jamboree",
    advisor: "Dr. Pan",
    period: "February – October 2025",
    summary:
      "Used AI protein design to create a new binder targeting osteocalcin, running the BindCraft workflow on HiPerGator, and contributed to the team's project documentation in React. The team earned Silver at the 2025 iGEM Grand Jamboree.",
    tools: ["BindCraft", "AlphaFold", "HiPerGator (HPC)", "React"],
  },
  {
    slug: "berlin-heart",
    thread: "clinic",
    title: "3D-printed heart device models for pediatric patient education",
    where: "UF Dream Team Engineering",
    advisor: "Dr. Chandran",
    period: "September 2023 – January 2025",
    summary:
      "Constructed the experimental design for testing whether a 3D-printed Berlin Heart model and supraventricular tachycardia education models help young patients. Presented as a poster on mitigating pediatric anxiety in congenital heart disease.",
    tools: ["Experimental design", "3D printing", "Patient education"],
  },
  {
    slug: "dna-repair",
    thread: "clinic",
    title: "Purifying and characterizing human DNA repair proteins",
    where: "UF Biochemistry",
    advisor: "Dr. Caglayan",
    period: "January 2024 – May 2025",
    summary:
      "Overexpression and purification of recombinant human DNA repair proteins, followed by their biochemical and structural characterization.",
    tools: ["Protein purification", "Overexpression", "Structural characterization"],
  },

  // ───────────────────────── Stochastic models & data analysis
  {
    slug: "ai-ouroboros",
    thread: "stochastic",
    page: true,
    figure: "chain",
    title: "An AI ouroboros: modeling what happens when models train on their own output",
    short: "AI model collapse as a Markov chain",
    where: "SCUDEM X 2025 · Problem B · Outstanding",
    advisor: "Team of three, with Pranav Kulkarni and Sharad Patel",
    period: "October 18 – November 11, 2025",
    summary:
      "A modified Markov chain over layered discrete distributions, built to model how a generative AI collapses across a space of tasks when it is trained on its own output.",
    why:
      "Generative models are increasingly trained on text and images that earlier models produced. SCUDEM X's Problem B asked what happens when that loop closes. A model that samples from its own output and refits tends to lose the rare cases first, and the challenge was to capture that drift mathematically.",
    did: [
      "Constructed a modified Markov chain and layered discrete distributions to model AI collapse in a task space.",
      "Made a ten-minute video presenting the model and its results.",
      "Recognized as an Outstanding participant and featured on the MathWorks website.",
    ],
    explainer: {
      title: "The idea: a chain that forgets",
      text: "A Markov chain describes a system that moves between states with probabilities that depend only on where it is now. Treating each training generation as one step of a chain turns a vague worry about self-training into something that can be iterated, measured and pushed to its long-run limit.",
    },
    outputs: [
      { kind: "Talk", text: "S. Ojha, P. Kulkarni, S. Patel. Modeling AI Model Collapse Using Markov Chains and Layered Discrete Distributions. Undergraduate Mathematics Research Symposium, Gainesville, April 2026." },
      { kind: "Award", text: "Outstanding SCUDEM X Participant, SIMIODE, Fall 2025." },
    ],
    status: "Complete.",
    tools: ["Markov chains", "Discrete probability distributions"],
  },
  {
    slug: "scudem-prosthetics",
    thread: "stochastic",
    title: "Pediatric prosthetics: a model that grows with the patient",
    where: "SCUDEM XI 2026 · Problem A · awaiting judging",
    period: "October 16 – November 10, 2026",
    summary:
      "Constructed a 2D quasi-static model of patient growth and motion paths using inverse kinematics and forces, and presented the results in a ten-minute video. Judging is under way.",
    tools: ["Inverse kinematics", "Quasi-static modeling", "Differential equations"],
  },
  {
    slug: "mcm",
    thread: "stochastic",
    title: "Three years of the Mathematical Contest in Modeling",
    where: "COMAP MCM/ICM · Successful Participant 2024, 2025, 2026",
    period: "2024 – 2026",
    summary:
      "Each contest is four days from an open-ended prompt to a finished paper.",
    items: [
      { head: "2026 · Modeling smartphone battery drain", text: "Continuous-time models in MATLAB with UQLab for sensitivity analysis. 25-page report." },
      { head: "2025 · The constant wear on stairs", text: "Three difference equations estimating three quantities from limited, measurable parameters. 15-page report." },
      { head: "2024 · Momentum in tennis", text: "Four models built in R from point-by-point Wimbledon Championships data. 25-page report." },
    ],
    tools: ["MATLAB", "UQLab", "R", "Difference equations", "Technical writing"],
  },
  {
    slug: "gymnastics",
    thread: "stochastic",
    title: "Picking an Olympic gymnastics team from the data",
    where: "UCSAS USOPC Data Challenge",
    period: "November 2023 – January 2024",
    summary:
      "Selected ten athletes for the U.S. Olympic gymnastics team by analyzing collated historical event data in Python, and wrote a short report on the methodology and conclusions.",
    tools: ["Python", "Sports analytics"],
  },
  {
    slug: "bias-detection",
    thread: "stochastic",
    title: "Looking for reviewer bias in eight cycles of applications",
    where: "Dream Team Engineering",
    period: "August – September 2025",
    summary:
      "Analyzed eight cycles of past application data and acceptances in R, looking for bias and trends in individual reviewers' decisions and in the applicant pool as a whole.",
    tools: ["R", "Statistical analysis"],
  },
  {
    slug: "auto-sorter",
    thread: "stochastic",
    title: "A grading auto-sorter for a physiology course",
    where: "PCB 3713C teaching team",
    period: "September – October 2025",
    summary:
      "Wrote a Python executable that formats student submissions for upload to Canvas, built for the course I was a teaching assistant in.",
    tools: ["Python", "Automation"],
  },

  // ───────────────────────── Engineering design
  {
    slug: "duffing",
    thread: "design",
    title: "A tabletop Duffing oscillator for teaching chaos",
    where: "Team project · teaching demo for Dynamical Systems and Chaos (MAP 4314)",
    period: "Fall 2026 – present",
    summary:
      "Working with a team on a classroom demonstration of the forced Duffing oscillator, the equation whose strange attractor draws itself when this site first loads. The aim is a device an instructor can put on a table to show bifurcations and chaos, with live measurements plotted against the numerical solution.",
    tools: ["Nonlinear dynamics", "Duffing equation", "Hardware prototyping"],
  },
  {
    slug: "conmed",
    thread: "design",
    title: "Senior design: a distal biceps tendon repair system for CONMED",
    where: "UF Biomedical Engineering · Industry-sponsored",
    period: "August 2026 – present",
    summary:
      "Designing a proof-of-concept distal biceps tendon repair system for our industry sponsor, CONMED, with a team of eight senior engineering students. The system includes the implant, instruments and sterile packaging, and a sports medicine surgeon will evaluate the design.",
    tools: ["Medical device design", "Team of eight"],
  },
  {
    slug: "walker",
    thread: "design",
    title: "A piston-powered walker for stairs and seating",
    where: "Dream Team Engineering Designathon",
    period: "November 2025",
    summary:
      "A weekend design for a modified walker that gives powered assistance on stairs and when sitting down. Modeled in Fusion 360, with a budget and a stakeholder analysis.",
    tools: ["Fusion 360", "Stakeholder analysis"],
  },
  {
    slug: "prescription-puzzles",
    thread: "design",
    title: "Prescription Puzzles: a pill dispenser unlocked by a jigsaw",
    where: "Dream Team Engineering Designathon",
    period: "October 2023",
    summary:
      "A low-cost pill dispenser run by a single Arduino and activated by completing a jigsaw puzzle.",
    tools: ["Arduino", "Prototyping"],
  },
  {
    slug: "hydraulic-crane",
    thread: "design",
    title: "Hydraulic cranes for middle schoolers",
    where: "Herbert Wertheim College of Engineering Outreach Design Competition",
    period: "February 2026",
    summary:
      "Designed 3D-printed mobile cranes with hydraulic booms for sixth to eighth graders in Fusion 360, with handouts explaining Pascal's law and mechanical advantage.",
    tools: ["Fusion 360", "3D printing", "Teaching materials"],
  },
];

export const findWork = (slug) => WORK.find((w) => w.slug === slug && w.page);
export const PAGES = WORK.filter((w) => w.page);
