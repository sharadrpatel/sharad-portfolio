import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ─── MOTION CONFIG ──────────────────────────────────────────────────────────
   Central place to tune all animation parameters.
   ─────────────────────────────────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1];         // soft, spring-like — Apple-style easing
const easeMid = [0.25, 0.46, 0.45, 0.94]; // smoother easing for hover
const dur = { xs: 0.3, sm: 0.5, md: 0.72, lg: 0.95 }; // duration scale
const VP = { once: true, amount: 0.1 };  // viewport trigger config

// Shared entrance variants used across components
const FU = {   // fade up
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0  },
};
const SI = {   // scale in
  hidden: { opacity: 0, scale: 0.94 },
  show:   { opacity: 1, scale: 1   },
};
const SL = {   // slide from left
  hidden: { opacity: 0, x: -32 },
  show:   { opacity: 1, x: 0   },
};
const SR = {   // slide from right
  hidden: { opacity: 0, x: 32  },
  show:   { opacity: 1, x: 0   },
};


// ─── DATA ────────────────────────────────────────────────────────────────────

const ROTATING_WORDS = [
  "medicine",
  "health",
  "discovery",
  "patients",
  "tomorrow",
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
  { label: "CV", href: "/CV.pdf", download: true },
];

const EXPERIENCE = [
  // ── Research ──
  {
    title: "Holt Lab",
    role: "Computer Vision & Ecological Modeling",
    period: "Dec 2025 – Present",
    tags: ["Computer Vision", "ML Pipeline", "SAM 3", "PyTorch"],
    description:
      "Developing CV/ML pipelines to segment leaf images and quantify disease severity. Constructing simulation models of environmental change incorporating phenotypic plasticity and sigmoidal response functions.",
    color: "#6ee7b7",
    category: "Research",
  },
  {
    title: "Vedam-Mai Lab",
    role: "Neuroimmunology & Parkinson's Disease",
    period: "Sept 2025 – Present",
    tags: ["Immunology", "Gut-Brain Axis", "Data Analysis", "Translational Research"],
    description:
      "Investigating T-cell responses and neuroinflammation along the gut–brain axis in Parkinson's disease. Analyzing biological datasets to evaluate relationships between immune markers, microbiome composition, and disease progression.",
    color: "#93c5fd",
    category: "Research",
  },
  {
    title: "Dr. Nichols Lab (MBL)",
    role: "Biomechanics & Motion Capture",
    period: "Aug 2024 – Present",
    tags: ["Vicon", "Python", "OpenSim", "EMG", "Machine Learning"],
    description:
      "Analyzing motion capture and fine wire EMG data to study carpometacarpal osteoarthritis. Developing personalized hand models using inverse kinematics and integrating ML techniques into biomechanics research.",
    color: "#fbbf24",
    category: "Research",
  },
  // ── Engineering ──
  {
    title: "Dream Team Engineering",
    role: "Surgical Research Team Captain",
    period: "Jan 2024 – Present",
    tags: ["IRB", "Surgical Simulation", "Statistical Analysis", "3D Printing"],
    description:
      "Leading research on surgical training methods — authored published findings, developed IRB applications and study protocols, and collaborated with transplant surgeons to replicate complex procedures including kidney and liver transplant.",
    color: "#f472b6",
    category: "Engineering",
  },
  {
    title: "GRiP Gaming Team",
    role: "Circuits & Software Developer",
    period: "Aug 2023 – Present",
    tags: ["Arduino", "C++", "Myosensors", "3D Printing"],
    description:
      "Collaborating on electrical and software development for a 3D-printed prosthetic hand for a child with a below-elbow amputation. Programming EMG-based control using Arduino and myosensors.",
    color: "#a78bfa",
    category: "Engineering",
  },
  // ── Leadership & Teaching ──
  {
    title: "Teaching Assistant — Cellular Systems & Physiology",
    role: "University of Florida",
    period: "Jan 2026 – Present",
    tags: ["Physiology", "Lab Instruction", "Quantitative Reasoning"],
    description:
      "Leading weekly laboratory sessions guiding students through experiments in human physiology. Helping students apply engineering and quantitative reasoning to interpret physiological data and build conceptual models.",
    color: "#67e8f9",
    category: "Leadership",
  },
  {
    title: "Teaching Assistant — Organic Chemistry",
    role: "University of Florida",
    period: "Jan 2026 – Present",
    tags: ["Organic Chemistry", "Mentoring", "Grading"],
    description:
      "Conducting weekly office hours reinforcing reaction mechanisms, synthesis strategy, and spectroscopy interpretation. Providing targeted feedback on problem sets and exams.",
    color: "#34d399",
    category: "Leadership",
  },
  {
    title: "BAPS Swaminarayan Sanstha",
    role: "Regional Core Team",
    period: "May 2021 – Present",
    tags: ["Program Design", "Youth Development", "Team Leadership"],
    description:
      "Designing comprehensive programs for 750–1000 children aimed at empowerment and personal growth. Collaborating with a team of six to develop and implement weekly plans for a youth program serving 50–100 kids.",
    color: "#fb923c",
    category: "Leadership",
  },
  {
    title: "BAPS Charities",
    role: "Project Lead",
    period: "Aug 2022 – Present",
    tags: ["Event Management", "Community Outreach", "Volunteer Coordination"],
    description:
      "Leading multi-cause community events including walkathons, health fairs, and blood drives. Coordinating 30–100+ volunteers, managing logistics, and building engagement campaigns reaching diverse populations.",
    color: "#e879f9",
    category: "Leadership",
  },
];

const PROJECTS = [
  {
    title: "Leaf Segmentation Pipeline (SAM 3)",
    category: "Computer Vision",
    metric: "Automated",
    metricLabel: "Disease Quantification",
    tools: ["Python", "PyTorch", "OpenCV", "NumPy"],
    description:
      "End-to-end CV pipeline using SAM 3 for leaf segmentation, reference-tag calibration, and infection severity scoring across image batches.",
    details: {
      overview: "Built an automated pipeline that takes raw leaf images, detects reference color tags for calibration, segments individual leaves using Meta's Segment Anything Model 3, and quantifies disease severity through color-space analysis.",
      challenges: [
        "Handling variable lighting conditions across field-collected images",
        "Calibrating color measurements against reference tags for consistency",
        "Batch processing hundreds of images with varying leaf orientations",
      ],
      outcomes: [
        "Reduced manual annotation time by ~90% compared to hand-labeling",
        "Achieved consistent disease severity scoring across image batches",
        "Pipeline deployed for ongoing ecological monitoring in the Holt Lab",
      ],
      role: "Sole developer — designed architecture, implemented segmentation, and validated outputs against expert annotations.",
    },
  },
  {
    title: "Glioma Tumor Microenvironment Model",
    category: "Mathematical Biology",
    metric: "ODE-Based",
    metricLabel: "Immunotherapy Sim",
    tools: ["MATLAB", "Python", "Sensitivity Analysis"],
    description:
      "Mechanistic ODE model capturing tumor-immune interactions, calibrated against experimental data, with therapeutic scenario simulations.",
    details: {
      overview: "Developed a system of coupled ordinary differential equations modeling the interactions between glioma tumor cells, immune effector cells, and the surrounding microenvironment, with parameters for immunotherapy intervention.",
      challenges: [
        "Parameter estimation from sparse experimental data",
        "Ensuring model stability across wide parameter ranges",
        "Balancing biological fidelity with computational tractability",
      ],
      outcomes: [
        "Model reproduces known tumor growth dynamics under control conditions",
        "Sensitivity analysis identified key parameters driving treatment response",
        "Simulations suggest combination timing windows for immunotherapy efficacy",
      ],
      role: "Lead modeler — formulated equations, performed parameter fitting, and ran therapeutic simulations.",
    },
  },
  {
    title: "SCUDEM — Outstanding Award",
    category: "Mathematical Modeling",
    metric: "Outstanding",
    metricLabel: "International Award",
    tools: ["MATLAB", "Monte Carlo", "KL Divergence"],
    description:
      "Modeled AI model collapse in multi-model ecosystems using Markov chains and discrete distributions. Demonstrated diversity stabilizes recursive training.",
    details: {
      overview: "Investigated the phenomenon of 'model collapse' — where AI models trained on synthetic data from other models progressively lose output diversity. Used Markov chain theory and KL divergence to quantify degradation across recursive training generations.",
      challenges: [
        "Formalizing model collapse as a mathematical process",
        "Designing Monte Carlo experiments with meaningful convergence criteria",
        "Presenting complex stochastic results to a judging panel clearly",
      ],
      outcomes: [
        "Received Outstanding Award — top tier in the international competition",
        "Demonstrated that ecosystem diversity (multiple heterogeneous models) significantly slows collapse",
        "Paper and presentation delivered within the 48-hour competition window",
      ],
      role: "Team lead — drove mathematical formulation, implemented Monte Carlo simulations, and led the final presentation.",
    },
  },
  {
    title: "Spotted Seatrout ODE Model",
    category: "Ecological Modeling",
    metric: "<10%",
    metricLabel: "Relative Error",
    tools: ["Python", "SciPy", "NumPy", "Pandas"],
    description:
      "Stock-assessment ODE model for Florida seatrout combining logistic growth with fishing mortality. Validated against independent SSB data.",
    link: "https://github.com/sharadrpatel/Fish_Stock_ODE_Modeling",
    details: {
      overview: "Built a stock-assessment model for Florida's spotted seatrout using coupled ODEs combining logistic population growth with time-varying fishing mortality, calibrated against decades of spawning stock biomass (SSB) data.",
      challenges: [
        "Integrating heterogeneous data sources (catch records, survey data, SSB estimates)",
        "Handling noisy historical data with missing years",
        "Selecting appropriate functional forms for density-dependent mortality",
      ],
      outcomes: [
        "Achieved <10% relative error against independent SSB validation data",
        "Model captures seasonal fishing pressure dynamics",
        "Open-sourced on GitHub for use by other ecological modelers",
      ],
      role: "Sole developer — data processing, model design, parameter optimization, and validation.",
    },
  },
  {
    title: "Neural Network from Scratch",
    category: "Machine Learning",
    metric: "MNIST",
    metricLabel: "Handwritten Digits",
    tools: ["Python", "NumPy", "Matplotlib"],
    description:
      "Feedforward neural network using only NumPy — forward prop, backprop, and mini-batch gradient descent implemented from first principles.",
    details: {
      overview: "Implemented a complete feedforward neural network from scratch using only NumPy — no ML frameworks. Includes forward propagation, backpropagation with chain rule derivations, and mini-batch stochastic gradient descent, trained on the MNIST handwritten digit dataset.",
      challenges: [
        "Deriving and implementing backpropagation gradients by hand",
        "Debugging numerical instabilities in softmax and cross-entropy",
        "Tuning learning rate and batch size without framework utilities",
      ],
      outcomes: [
        "Achieved competitive accuracy on MNIST test set",
        "Deep understanding of gradient flow, weight initialization, and optimization",
        "Codebase serves as a teaching resource for understanding neural network internals",
      ],
      role: "Sole developer — derived math, implemented all layers, and trained from scratch.",
    },
  },
  {
    title: "COMAP MCM — Battery Dynamics",
    category: "Applied Mathematics",
    metric: "10⁴ Sims",
    metricLabel: "Monte Carlo Analysis",
    tools: ["MATLAB", "ODE45", "Stochastic Modeling"],
    description:
      "Physics-grounded SOC model with coupled nonlinear ODEs, Fourier-series CPU patterns, Peukert losses, and Monte Carlo sensitivity analysis.",
    details: {
      overview: "Developed a physics-based state-of-charge (SOC) model for laptop batteries using coupled nonlinear ODEs. Incorporated Fourier-series approximations for realistic CPU usage patterns, Peukert's law for discharge rate effects, and temperature-dependent capacity degradation.",
      challenges: [
        "Coupling thermal, electrical, and chemical dynamics in a single ODE system",
        "Modeling realistic usage patterns with Fourier series decomposition",
        "Running 10,000+ Monte Carlo simulations for robust sensitivity analysis",
      ],
      outcomes: [
        "Model predicts battery life within realistic bounds across usage scenarios",
        "Sensitivity analysis identified temperature as the dominant degradation factor",
        "Submitted within the 96-hour COMAP competition deadline",
      ],
      role: "Mathematical modeler — designed ODE system, implemented Peukert corrections, and ran Monte Carlo analysis.",
    },
  },
  {
    title: "EMG Signal Analysis for CMCOA",
    category: "Biomedical Signal Processing",
    metric: "Multi-Muscle",
    metricLabel: "EMG Analysis",
    tools: ["Python", "ANOVA", "Pandas", "Seaborn"],
    description:
      "EDA on multi-muscle EMG recordings assessing activation patterns across CMCOA stages with paired t-tests, ANOVA, and visualization pipelines.",
    details: {
      overview: "Performed exploratory data analysis on fine-wire EMG recordings from multiple hand and forearm muscles in patients with carpometacarpal osteoarthritis (CMCOA), comparing activation patterns across disease severity stages.",
      challenges: [
        "Processing noisy fine-wire EMG signals with motion artifacts",
        "Handling small, unbalanced sample sizes across CMCOA stages",
        "Selecting appropriate statistical tests for repeated-measures designs",
      ],
      outcomes: [
        "Identified significant activation pattern differences between early and advanced CMCOA",
        "Visualization pipelines adopted by the MBL lab for ongoing analysis",
        "Statistical findings contributed to biomechanics research on hand function",
      ],
      role: "Data analyst — signal processing, statistical testing, and visualization pipeline development.",
    },
  },
  {
    title: "Student Org Application Analysis",
    category: "Data Science",
    metric: "Bias Detection",
    metricLabel: "Process Improvement",
    tools: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    description:
      "Analyzed multi-year application data to detect reviewer-order bias, track repeat applicant trajectories, and recommend fair process changes.",
    details: {
      overview: "Conducted a data-driven audit of a student organization's multi-year application and review process, testing for systematic biases in reviewer scoring order, tracking how repeat applicants' scores evolved, and producing actionable recommendations.",
      challenges: [
        "Cleaning and standardizing inconsistent multi-year application records",
        "Designing statistical tests appropriate for ordinal scoring data",
        "Communicating bias findings diplomatically to org leadership",
      ],
      outcomes: [
        "Detected statistically significant reviewer-order bias in scoring",
        "Repeat applicant analysis revealed scoring improvements over cycles",
        "Recommendations adopted: randomized review order, blinded scoring",
      ],
      role: "Lead analyst — data cleaning, hypothesis testing, visualization, and recommendations report.",
    },
  },
];

const PUBLICATIONS = [
  {
    title:
      "Improving Pediatric MRIs: A Prospective Study using a Mock Scanner as a Replacement for Sedation",
    venue: "International Undergraduate Journal of Medicine, Disease, and Society",
    date: "Aug 2024",
    type: "Journal",
  },
  {
    title:
      "Effectiveness of 3D Box Model Trainers in Kidney Transplantation Training: A Controlled Study",
    venue: "Surgeons and Engineers: A Dialogue on Surgical Simulation",
    date: "Mar 2025",
    type: "Conference",
  },
  {
    title:
      "Enhancing Anesthesia Monitoring with Computer Vision-Powered Train-of-Four Testing",
    venue: "Engineering Research Symposium",
    date: "Apr 2025",
    type: "Conference",
  },
];

const SKILLS = {
  Languages: ["Python", "C++", "R", "MATLAB", "LaTeX", "JavaScript"],
  "Data Science & ML": [
    "NumPy",
    "Pandas",
    "SciPy",
    "PyTorch",
    "OpenCV",
    "Matplotlib",
    "Seaborn",
    "Scikit-learn",
  ],
  "Modeling & Simulation": [
    "ODE Systems",
    "Monte Carlo",
    "Sensitivity Analysis",
    "Stochastic Processes",
    "OpenSim",
  ],
  "Wet Lab": [
    "Cell Culture",
    "ELISA",
    "Flow Cytometry",
    "SDS-PAGE",
    "Chromatography",
    "BSL-2",
  ],
  "Engineering Tools": [
    "SolidWorks",
    "Onshape",
    "Arduino",
    "Vicon",
    "3D Printing",
    "Git",
  ],
};

const STATS = [
  { value: "3.92", label: "GPA" },
  { value: "3", label: "Publications & Presentations" },
  { value: "10+", label: "Projects" },
  { value: "Pre-Medical", label: "Track" },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useRotatingWord(words, interval = 2400) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setAnimating(false);
      }, 400);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);
  return [words[index], animating];
}

function useCountUp(end, duration = 1800, trigger = false) {
  const [value, setValue] = useState(0);
  const numericEnd = parseFloat(end);
  const isNumeric = !isNaN(numericEnd);

  useEffect(() => {
    if (!trigger || !isNumeric) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numericEnd;
      setValue(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, numericEnd, duration, isNumeric]);

  if (!isNumeric) return end;
  if (String(end).includes(".")) return value.toFixed(2);
  return Math.round(value).toString();
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ onLogoSecret }) {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const logoClicksRef = useRef(0);
  const logoTimerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const handleLogoClick = (e) => {
    e.preventDefault();
    logoClicksRef.current++;
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    if (logoClicksRef.current >= 7) {
      logoClicksRef.current = 0;
      onLogoSecret?.();
    } else {
      logoTimerRef.current = setTimeout(() => {
        logoClicksRef.current = 0;
      }, 2000);
    }
    if (logoClicksRef.current <= 1) {
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      // Hide on scroll down, show on scroll up
      if (!prefersReduced) {
        if (y > lastScrollY.current + 6 && y > 120) {
          setNavVisible(false);
        } else if (y < lastScrollY.current - 6) {
          setNavVisible(true);
        }
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReduced]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: navVisible ? 0 : -80,
        opacity: navVisible ? 1 : 0,
      }}
      transition={{ duration: dur.sm, ease }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 clamp(1.5rem, 4vw, 4rem)",
        height: scrolled ? 60 : 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(8,8,12,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "height 0.4s ease, background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      <a
        href="#hero"
        onClick={handleLogoClick}
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontWeight: 700,
          fontSize: "1.15rem",
          color: "#f0f0f0",
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        SP<span style={{ color: "#6ee7b7" }}>.</span>
      </a>

      {/* Desktop links */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        }}
        className="nav-desktop"
      >
        {NAV_LINKS.map((l, i) => (
          <motion.a
            key={l.href}
            href={l.href}
            {...(l.download ? { download: true } : {})}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.sm, ease, delay: 0.05 + i * 0.04 }}
            style={{
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
              fontSize: "0.82rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transition: "color 0.25s",
              fontFamily: "'Instrument Sans', sans-serif",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#6ee7b7")}
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(255,255,255,0.55)")
            }
          >
            {l.label}
          </motion.a>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-mobile-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
        }}
        aria-label="Toggle menu"
      >
        <div style={{ width: 24, height: 18, position: "relative" }}>
          <span
            style={{
              display: "block",
              width: 24,
              height: 2,
              background: "#f0f0f0",
              borderRadius: 2,
              position: "absolute",
              top: menuOpen ? 8 : 0,
              transform: menuOpen ? "rotate(45deg)" : "none",
              transition: "all 0.3s",
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 2,
              background: "#f0f0f0",
              borderRadius: 2,
              position: "absolute",
              top: 8,
              opacity: menuOpen ? 0 : 1,
              transition: "all 0.3s",
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 2,
              background: "#f0f0f0",
              borderRadius: 2,
              position: "absolute",
              top: menuOpen ? 8 : 16,
              transform: menuOpen ? "rotate(-45deg)" : "none",
              transition: "all 0.3s",
            }}
          />
        </div>
      </button>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.xs, ease }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(8,8,12,0.97)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              zIndex: 999,
            }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                {...(l.download ? { download: true } : {})}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: dur.sm, ease, delay: i * 0.06 }}
                style={{
                  color: "#f0f0f0",
                  textDecoration: "none",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Hero() {
  const [word, animating] = useRotatingWord(ROTATING_WORDS);
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef(null);

  // Scroll-based parallax on the orb layer
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]); // tune: parallax intensity

  // Subtle mouse-tracked parallax on the headshot
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 20 }); // tune: stiffness/damping
  const springY = useSpring(mouseY, { stiffness: 35, damping: 20 });

  const handleMouseMove = useCallback(
    (e) => {
      if (prefersReduced) return;
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth - 0.5) * 14);  // tune: max ±7px horizontal drift
      mouseY.set((e.clientY / innerHeight - 0.5) * 10); // tune: max ±5px vertical drift
    },
    [mouseX, mouseY, prefersReduced]
  );

  // Hero stagger container
  const heroStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } }, // tune: stagger timing
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(1.5rem, 6vw, 8rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated mesh gradient orbs — with scroll parallax */}
      <motion.div
        style={{ y: orbY }}
        className="mesh-gradient-container"
        aria-hidden="true"
        initial={false}
      >
        <div style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: "55vw",
            height: "55vw",
            maxWidth: 700,
            maxHeight: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, rgba(110,231,183,0.25) 0%, rgba(52,211,153,0.1) 40%, transparent 70%)",
            filter: "blur(80px)",
            animation: "meshOrb1 14s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-10%",
            left: "-8%",
            width: "45vw",
            height: "45vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle at 60% 50%, rgba(244,114,182,0.2) 0%, rgba(236,72,153,0.08) 45%, transparent 70%)",
            filter: "blur(80px)",
            animation: "meshOrb2 18s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute",
            top: "30%",
            left: "20%",
            width: "40vw",
            height: "40vw",
            maxWidth: 500,
            maxHeight: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.15) 0%, rgba(139,92,246,0.05) 45%, transparent 70%)",
            filter: "blur(90px)",
            animation: "meshOrb3 20s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute",
            top: "60%",
            right: "15%",
            width: "25vw",
            height: "25vw",
            maxWidth: 350,
            maxHeight: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 65%)",
            filter: "blur(70px)",
            animation: "meshOrb4 16s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute",
            top: "10%",
            left: "-5%",
            width: "35vw",
            height: "35vw",
            maxWidth: 450,
            maxHeight: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle at 45% 55%, rgba(103,232,249,0.15) 0%, rgba(34,211,238,0.05) 45%, transparent 70%)",
            filter: "blur(75px)",
            animation: "meshOrb5 22s ease-in-out infinite",
          }} />
        </div>
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="hero-grid" style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
        zIndex: 0,
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
      }} />

      {/* Hero content — two column with staggered entrance */}
      <motion.div
        className="hero-content"
        variants={heroStagger}
        initial={prefersReduced ? "show" : "hidden"}
        animate="show"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(2rem, 5vw, 5rem)",
          alignItems: "center",
          maxWidth: 1200,
          width: "100%",
        }}
      >
        {/* Left — text */}
        <div>
          <motion.p
            variants={FU}
            transition={{ duration: dur.md, ease }}
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(0.75rem, 1vw, 0.9rem)",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#6ee7b7",
              marginBottom: "1.5rem",
            }}
          >
            Biomedical Engineer · Pre-Med · Aspiring MD/PhD
          </motion.p>

          <motion.h1
            variants={FU}
            transition={{ duration: dur.md, ease }}
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2.8rem, 7vw, 6rem)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: "#f0f0f0",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            Sharad Patel
          </motion.h1>

          <motion.h2
            className="hero-tagline"
            variants={FU}
            transition={{ duration: dur.md, ease }}
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              margin: "0.25rem 0 0 0",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Engineering solutions for{" "}
            <span
              style={{
                color: "#6ee7b7",
                display: "inline-block",
                transition: "opacity 0.35s, transform 0.35s",
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(12px)" : "translateY(0)",
                fontStyle: "italic",
              }}
            >
              {word}
            </span>
          </motion.h2>

          <motion.p
            variants={FU}
            transition={{ duration: dur.md, ease }}
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 600,
              marginTop: "2rem",
            }}
          >
            BS Biomedical Engineering & Pre-Med at the University of Florida.
            Pursuing an MD/PhD to bridge clinical medicine with computational
            and data-driven research in human health.
          </motion.p>

          <motion.div
            variants={FU}
            transition={{ duration: dur.md, ease }}
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            <a href="#projects" style={btnPrimary} className="btn-primary">
              View Projects
            </a>
            <a href="#contact" style={btnSecondary} className="btn-secondary">
              Get in Touch
            </a>
            <a href="/CV.pdf" download style={{
              ...btnSecondary,
              borderColor: "rgba(110,231,183,0.2)",
              color: "#6ee7b7",
            }} className="btn-secondary">
              CV ↓
            </a>
          </motion.div>
        </div>

        {/* Right — headshot with mouse parallax */}
        <motion.div
          variants={SI}
          transition={{ duration: dur.lg, ease }}
          style={{ x: springX, y: springY }}
        >
          <div style={{
            width: "clamp(200px, 20vw, 300px)",
            height: "clamp(200px, 20vw, 300px)",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(110,231,183,0.2)",
            boxShadow: "0 0 60px rgba(110,231,183,0.08), 0 0 120px rgba(110,231,183,0.04)",
            position: "relative",
            background: "rgba(255,255,255,0.03)",
          }}>
            <img
              src="/headshot.jpg"
              alt="Sharad Patel"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatsBar() {
  const [ref, visible] = useInView(0.3);
  return (
    <section
      ref={ref}
      style={{
        padding: "3rem clamp(1.5rem, 6vw, 8rem)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "2rem",
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {STATS.map((s, i) => (
          <StatItem key={s.label} stat={s} index={i} visible={visible} />
        ))}
      </div>
    </section>
  );
}

function StatItem({ stat, index, visible }) {
  const animatedValue = useCountUp(stat.value, 1800, visible);
  const isNumeric = !isNaN(parseFloat(stat.value));
  const suffix = stat.value.includes("+") ? "+" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: dur.md, ease, delay: index * 0.12 }} // tune: stagger delay
    >
      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(2rem, 4vw, 2.8rem)",
          color: "#6ee7b7",
          fontWeight: 400,
        }}
      >
        {isNumeric ? animatedValue + suffix : stat.value}
      </div>
      <div
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "0.78rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginTop: 4,
        }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

function About() {
  return (
    <section
      id="about"
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="About Me" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: dur.md, ease, delay: 0.1 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
          maxWidth: 800,
        }}
      >
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.85)",
            fontWeight: 400,
          }}
        >
          I'm a pre-medical biomedical engineering student at the University of
          Florida with a minor in mathematics, working toward applying to an{" "}
          <span style={{ color: "#6ee7b7" }}>MD/PhD</span> program to integrate
          clinical practice with computational research in human disease.
        </p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: dur.md, ease, delay: 0.22 }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          My work spans neuroimmunology, biomechanics, and ecological modeling —
          from investigating the gut–brain axis in Parkinson's disease, to
          building computer vision pipelines for ecological analysis, to
          developing prosthetics for children. I'm driven by the belief that
          physician-scientists who can move between the bedside and the bench are
          uniquely positioned to translate discovery into patient impact.
        </motion.p>
      </motion.div>
    </section>
  );
}

function ExperienceSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = ["All", "Research", "Engineering", "Leadership"];

  const filtered = activeFilter === "All"
    ? EXPERIENCE
    : EXPERIENCE.filter((e) => e.category === activeFilter);

  return (
    <section
      id="experience"
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="Experience" />
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: dur.md, ease, delay: 0.1 }}
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          color: "#f0f0f0",
          fontWeight: 400,
          marginBottom: "2rem",
        }}
      >
        Where curiosity meets rigor
      </motion.h3>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: dur.sm, ease, delay: 0.18 }}
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 600,
              padding: "0.45rem 1.1rem",
              borderRadius: 100,
              border: `1px solid ${activeFilter === cat ? "#6ee7b7" : "rgba(255,255,255,0.1)"}`,
              background: activeFilter === cat ? "rgba(110,231,183,0.1)" : "transparent",
              color: activeFilter === cat ? "#6ee7b7" : "rgba(255,255,255,0.45)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              letterSpacing: "0.03em",
            }}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      <motion.div
        key={activeFilter}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} // tune: card stagger
        initial="hidden"
        animate="show"
        style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
      >
        {filtered.map((item, i) => (
          <ExperienceShowcard key={item.title} data={item} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

function ExperienceShowcard({ data, index }) {
  const bgGrad = `linear-gradient(135deg, ${data.color}08 0%, ${data.color}03 50%, transparent 100%)`;
  const slideVariant = index % 2 === 0 ? SL : SR;

  return (
    <motion.div
      variants={slideVariant}
      transition={{ duration: dur.md, ease }} // tune: card entrance duration
      whileHover={{ y: -4, transition: { duration: 0.28, ease: easeMid } }} // tune: hover lift
      style={{
        background: bgGrad,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 20,
        padding: "clamp(1.5rem, 3vw, 2.5rem)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1.5rem",
        alignItems: "start",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = data.color + "30";
        e.currentTarget.style.boxShadow = `0 8px 40px ${data.color}08`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
      className="experience-showcard"
    >
      {/* Accent glow */}
      <div style={{
        position: "absolute",
        top: "-50%",
        right: "-20%",
        width: "50%",
        height: "200%",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${data.color}06 0%, transparent 70%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      {/* Left content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.62rem",
            padding: "0.2rem 0.6rem",
            borderRadius: 100,
            background: data.color + "18",
            color: data.color,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {data.category}
          </span>
          <span style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.65rem",
            padding: "0.2rem 0.6rem",
            borderRadius: 100,
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            {data.role}
          </span>
        </div>

        <h4 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
          fontWeight: 400,
          color: "#f0f0f0",
          margin: "0.75rem 0 0.6rem 0",
          lineHeight: 1.2,
        }}>
          {data.title}
        </h4>

        <p style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.45)",
          margin: "0 0 1.25rem 0",
          maxWidth: 650,
        }}>
          {data.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {data.tags.map((t) => (
            <span key={t} style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.7rem",
              padding: "0.3rem 0.7rem",
              borderRadius: 100,
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right — period badge */}
      <div style={{
        position: "relative",
        zIndex: 1,
        textAlign: "right",
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
        }}>
          {data.period}
        </span>
      </div>
    </motion.div>
  );
}

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      id="projects"
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="Featured Projects" />
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: dur.md, ease, delay: 0.1 }}
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          color: "#f0f0f0",
          fontWeight: 400,
          marginBottom: "3rem",
        }}
      >
        Building at the intersection of biology &amp; computation
      </motion.h3>

      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }} // tune: project card stagger
        initial="hidden"
        whileInView="show"
        viewport={VP}
        style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
      >
        {PROJECTS.map((p, i) => (
          <ProjectShowcard
            key={p.title}
            data={p}
            index={i}
            onClick={() => setSelectedProject(p)}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal data={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectShowcard({ data, index, onClick }) {
  const colors = [
    "#6ee7b7", "#93c5fd", "#fbbf24", "#f472b6",
    "#a78bfa", "#34d399", "#fb923c", "#67e8f9",
  ];
  const accent = colors[index % colors.length];
  const bgGrad = `linear-gradient(135deg, ${accent}08 0%, ${accent}03 50%, transparent 100%)`;
  const slideVariant = index % 2 === 0 ? SL : SR;

  return (
    <motion.div
      variants={slideVariant}
      transition={{ duration: dur.md, ease }} // tune: card entrance duration
      whileHover={{ y: -4, transition: { duration: 0.28, ease: easeMid } }} // tune: hover lift
      onClick={onClick}
      style={{
        background: bgGrad,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: "clamp(1.5rem, 3vw, 2.5rem)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "clamp(1.5rem, 3vw, 2.5rem)",
        alignItems: "start",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent + "30";
        e.currentTarget.style.boxShadow = `0 8px 40px ${accent}08`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
      className="project-showcard"
    >
      {/* Accent glow */}
      <div style={{
        position: "absolute",
        top: "-40%",
        right: "-15%",
        width: "45%",
        height: "180%",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}06 0%, transparent 70%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      {/* Left — big metric */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "clamp(80px, 10vw, 120px)",
        padding: "1rem 0",
      }}>
        <span style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
          color: accent,
          fontWeight: 400,
          lineHeight: 1,
        }}>
          {data.metric}
        </span>
        <span style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "0.62rem",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginTop: "0.35rem",
          textAlign: "center",
          lineHeight: 1.3,
        }}>
          {data.metricLabel}
        </span>
      </div>

      {/* Right — content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.65rem",
            padding: "0.25rem 0.7rem",
            borderRadius: 100,
            background: accent + "18",
            color: accent,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {data.category}
          </span>
          <span style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.3)",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => e.target.style.color = accent}
          onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.3)"}
          >
            Click to expand ↗
          </span>
        </div>

        <h4 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
          fontWeight: 400,
          color: "#f0f0f0",
          margin: "0.6rem 0 0.5rem 0",
          lineHeight: 1.25,
        }}>
          {data.title}
        </h4>

        <p style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "clamp(0.84rem, 1.1vw, 0.93rem)",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.42)",
          margin: "0 0 1.1rem 0",
          maxWidth: 650,
        }}>
          {data.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {data.tools.map((t) => (
            <span key={t} style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.68rem",
              padding: "0.25rem 0.65rem",
              borderRadius: 100,
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.48)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ data, onClose }) {
  const colors = {
    "Computer Vision": "#6ee7b7", "Mathematical Biology": "#93c5fd",
    "Mathematical Modeling": "#fbbf24", "Ecological Modeling": "#f472b6",
    "Machine Learning": "#a78bfa", "Applied Mathematics": "#34d399",
    "Biomedical Signal Processing": "#fb923c", "Data Science": "#67e8f9",
  };
  const accent = colors[data.category] || "#6ee7b7";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: dur.xs, ease }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(8,8,12,0.88)", backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: dur.sm, ease }} // tune: modal entrance duration
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d0d14",
          border: `1px solid ${accent}25`,
          borderRadius: 24,
          padding: "clamp(2rem, 4vw, 3.5rem)",
          maxWidth: 750,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "1.1rem",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "#f0f0f0"; }}
        onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.color = "rgba(255,255,255,0.5)"; }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.65rem", padding: "0.25rem 0.7rem",
            borderRadius: 100, background: accent + "18",
            color: accent, fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {data.category}
          </span>
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.8rem", color: accent, fontWeight: 400, lineHeight: 1,
          }}>
            {data.metric}
          </span>
          <span style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.6rem", color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            {data.metricLabel}
          </span>
        </div>

        <h2 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          fontWeight: 400, color: "#f0f0f0",
          margin: "0 0 1.25rem 0", lineHeight: 1.2,
        }}>
          {data.title}
        </h2>

        {/* Tools */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "2rem" }}>
          {data.tools.map((t) => (
            <span key={t} style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.72rem", padding: "0.3rem 0.75rem",
              borderRadius: 100, background: accent + "12",
              color: accent, border: `1px solid ${accent}25`,
            }}>
              {t}
            </span>
          ))}
        </div>

        {data.details && (
          <>
            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.7rem", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: accent, marginBottom: "0.75rem",
              }}>
                Overview
              </h4>
              <p style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.95rem", lineHeight: 1.75,
                color: "rgba(255,255,255,0.6)",
              }}>
                {data.details.overview}
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.7rem", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: accent, marginBottom: "0.75rem",
              }}>
                Key Challenges
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {data.details.challenges.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ color: accent, fontSize: "0.7rem", marginTop: "0.3rem", flexShrink: 0 }}>▸</span>
                    <span style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.9rem", lineHeight: 1.65,
                      color: "rgba(255,255,255,0.5)",
                    }}>
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.7rem", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: accent, marginBottom: "0.75rem",
              }}>
                Outcomes
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {data.details.outcomes.map((o, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ color: accent, fontSize: "0.7rem", marginTop: "0.3rem", flexShrink: 0 }}>✓</span>
                    <span style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.9rem", lineHeight: 1.65,
                      color: "rgba(255,255,255,0.5)",
                    }}>
                      {o}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: "1.25rem 1.5rem", borderRadius: 14,
              background: `linear-gradient(135deg, ${accent}08, transparent)`,
              border: `1px solid ${accent}15`,
            }}>
              <h4 style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.65rem", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: accent, marginBottom: "0.5rem",
              }}>
                My Role
              </h4>
              <p style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.9rem", lineHeight: 1.65,
                color: "rgba(255,255,255,0.55)", margin: 0,
              }}>
                {data.details.role}
              </p>
            </div>
          </>
        )}

        {data.link && (
          <a href={data.link} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            marginTop: "1.5rem", padding: "0.6rem 1.25rem",
            borderRadius: 100, background: accent + "15",
            border: `1px solid ${accent}30`, color: accent,
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.8rem", fontWeight: 600,
            textDecoration: "none", transition: "all 0.25s",
          }}>
            View on GitHub ↗
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

function PublicationsSection() {
  return (
    <section
      id="publications"
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="Publications & Presentations" />
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} // tune: pub stagger
        initial="hidden"
        whileInView="show"
        viewport={VP}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        {PUBLICATIONS.map((p) => (
          <motion.div
            key={p.title}
            variants={FU}
            transition={{ duration: dur.md, ease }}
            whileHover={{ y: -2, transition: { duration: 0.25, ease: easeMid } }} // tune: pub hover lift
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "1.75rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              transition: "border-color 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.65rem",
                padding: "0.2rem 0.6rem",
                borderRadius: 100,
                background: p.type === "Journal" ? "rgba(110,231,183,0.12)" : "rgba(147,197,253,0.12)",
                color: p.type === "Journal" ? "#6ee7b7" : "#93c5fd",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                {p.type}
              </span>
              <span style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.3)",
              }}>
                {p.date}
              </span>
            </div>
            <h4 style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#f0f0f0",
              margin: 0,
              lineHeight: 1.4,
            }}>
              {p.title}
            </h4>
            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.35)",
              fontStyle: "italic",
              margin: 0,
            }}>
              {p.venue}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section
      id="skills"
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="Skills & Technologies" />
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} // tune: skill card stagger
        initial="hidden"
        whileInView="show"
        viewport={VP}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Object.entries(SKILLS).map(([cat, items]) => (
          <motion.div
            key={cat}
            variants={FU}
            transition={{ duration: dur.md, ease }}
            whileHover={{ y: -3, transition: { duration: 0.25, ease: easeMid } }} // tune: skill card hover
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "1.75rem",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(110,231,183,0.15)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(110,231,183,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <h4 style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6ee7b7",
              fontWeight: 600,
              marginTop: 0,
              marginBottom: "1rem",
            }}>
              {cat}
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {items.map((s) => (
                <span key={s} style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.76rem",
                  padding: "0.3rem 0.65rem",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem) 5rem",
        maxWidth: 1200,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: dur.md, ease }}
      >
        <SectionLabel text="Get in Touch" center />
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: dur.md, ease, delay: 0.1 }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            color: "#f0f0f0",
            fontWeight: 400,
            margin: "0 0 1rem 0",
          }}
        >
          Let's connect
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ duration: dur.md, ease, delay: 0.18 }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.4)",
            maxWidth: 500,
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}
        >
          Whether it's research collaboration, data science projects, or just
          talking about biomedical engineering — I'd love to hear from you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: dur.sm, ease, delay: 0.25 }}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href="mailto:sharadrpatel1933@gmail.com" style={btnPrimary} className="btn-primary">
            Send Email
          </a>
          <a
            href="https://www.linkedin.com/in/patel108"
            target="_blank"
            rel="noopener noreferrer"
            style={btnSecondary}
            className="btn-secondary"
          >
            LinkedIn
          </a>
          <a href="/CV.pdf" download style={btnSecondary} className="btn-secondary">
            Download CV ↓
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "2.5rem clamp(1.5rem, 6vw, 8rem)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <span
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        © 2025 Sharad Patel. Built with React.
      </span>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {[
          { label: "Email", href: "mailto:sharadrpatel1933@gmail.com" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/patel108" },
          { label: "GitHub", href: "https://github.com/sharadrpatel" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.3)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "color 0.25s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#6ee7b7")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.3)")}
          >
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ─── SHARED UI ───────────────────────────────────────────────────────────────

function SectionLabel({ text, center }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: dur.sm, ease }}
      style={{
        fontFamily: "'Instrument Sans', sans-serif",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#6ee7b7",
        marginBottom: "1rem",
        textAlign: center ? "center" : "left",
      }}
    >
      {text}
    </motion.p>
  );
}

function SectionDivider() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 clamp(1.5rem, 6vw, 8rem)",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease }} // tune: divider reveal duration
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(110,231,183,0.3), rgba(147,197,253,0.2), transparent)",
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}

const btnPrimary = {
  fontFamily: "'Instrument Sans', sans-serif",
  fontSize: "0.85rem",
  fontWeight: 600,
  padding: "0.8rem 2rem",
  borderRadius: 100,
  background: "#6ee7b7",
  color: "#080810",
  textDecoration: "none",
  letterSpacing: "0.01em",
  transition: "all 0.3s",
  display: "inline-block",
};

const btnSecondary = {
  fontFamily: "'Instrument Sans', sans-serif",
  fontSize: "0.85rem",
  fontWeight: 600,
  padding: "0.8rem 2rem",
  borderRadius: 100,
  background: "transparent",
  color: "rgba(255,255,255,0.7)",
  textDecoration: "none",
  letterSpacing: "0.01em",
  border: "1px solid rgba(255,255,255,0.15)",
  transition: "all 0.3s",
  display: "inline-block",
};

// ─── EASTER EGGS ─────────────────────────────────────────────────────────────

function useKonamiCode(callback) {
  const sequence = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  const inputRef = useRef([]);
  useEffect(() => {
    const handler = (e) => {
      inputRef.current.push(e.key);
      inputRef.current = inputRef.current.slice(-sequence.length);
      if (inputRef.current.join(",") === sequence.join(",")) {
        callback();
        inputRef.current = [];
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callback]);
}

function useSecretWord(word, callback) {
  const inputRef = useRef([]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key.length === 1) {
        inputRef.current.push(e.key.toLowerCase());
        inputRef.current = inputRef.current.slice(-word.length);
        if (inputRef.current.join("") === word.toLowerCase()) {
          callback();
          inputRef.current = [];
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [word, callback]);
}

function DNAHelix({ onClose }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let frame = 0;
    let animId;
    const draw = () => {
      ctx.fillStyle = "rgba(8,8,12,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const pairs = 30;
      for (let i = 0; i < pairs; i++) {
        const y = (canvas.height / pairs) * i;
        const offset = Math.sin((frame * 0.02) + (i * 0.3)) * 120;
        const x1 = centerX + offset;
        const x2 = centerX - offset;
        const alpha = 0.4 + Math.sin((frame * 0.02) + (i * 0.3)) * 0.3;
        ctx.beginPath();
        ctx.arc(x1, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110,231,183,${alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(167,139,250,${alpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      frame++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    const timeout = setTimeout(onClose, 6000);
    return () => { cancelAnimationFrame(animId); clearTimeout(timeout); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, cursor: "pointer" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Courier New', monospace", fontSize: "0.8rem",
        color: "#6ee7b7", letterSpacing: "0.1em", textAlign: "center",
      }}>
        ↑↑↓↓←→←→BA — DNA SEQUENCE ACTIVATED<br/>
        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>click to dismiss</span>
      </div>
    </div>
  );
}

function MatrixRain({ onClose }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = "ATCGATCGSHRADPATEL01MDPHDBME∑∫δθλμπ".split("");
    let animId;
    const draw = () => {
      ctx.fillStyle = "rgba(8,8,12,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "14px 'Courier New', monospace";
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const green = 180 + Math.random() * 75;
        ctx.fillStyle = `rgba(${Math.floor(green * 0.4)},${Math.floor(green)},${Math.floor(green * 0.7)},0.9)`;
        ctx.fillText(char, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    const timeout = setTimeout(onClose, 8000);
    return () => { cancelAnimationFrame(animId); clearTimeout(timeout); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, cursor: "pointer" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        fontFamily: "'Courier New', monospace", fontSize: "1.2rem",
        color: "#6ee7b7", textAlign: "center", textShadow: "0 0 20px rgba(110,231,183,0.5)",
      }}>
        WELCOME TO THE MATRIX, SHARAD<br/>
        <span style={{ fontSize: "0.7rem", color: "rgba(110,231,183,0.5)" }}>type "matrix" to enter • click to exit</span>
      </div>
    </div>
  );
}

function HackerTerminal({ onClose }) {
  const [lines, setLines] = useState([]);
  const [complete, setComplete] = useState(false);
  const terminalLines = [
    "> ssh sharad@uf-research.edu",
    "Connected to UF Biomedical Engineering Lab",
    "> cat ~/about.txt",
    "Name: Sharad Patel",
    "Track: Pre-Med → MD/PhD",
    "GPA: 3.92 | Labs: 3 active",
    "Status: Engineering solutions for tomorrow",
    "> ls ~/skills/",
    "Python/ C++/ MATLAB/ PyTorch/ OpenCV/",
    "ODE-Systems/ Monte-Carlo/ SDS-PAGE/",
    "> cat ~/secret.txt",
    "\"The best way to predict the future is to engineer it.\"",
    "> echo $EASTER_EGG",
    "🧬 You found the hidden terminal! Nice work.",
    "> exit",
    "Connection closed.",
  ];

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < terminalLines.length) {
        setLines((prev) => [...prev, terminalLines[i]]);
        i++;
      } else {
        setComplete(true);
        clearInterval(id);
      }
    }, 350);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(8,8,12,0.95)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        background: "rgba(0,0,0,0.8)", border: "1px solid rgba(110,231,183,0.3)",
        borderRadius: 12, padding: "1.5rem 2rem", maxWidth: 600, width: "100%",
        fontFamily: "'Courier New', monospace", fontSize: "0.8rem",
        maxHeight: "70vh", overflow: "auto",
        boxShadow: "0 0 40px rgba(110,231,183,0.1)",
      }}>
        <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
          <div onClick={onClose} style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", cursor: "pointer" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: "0.65rem" }}>
            sharad@portfolio — bash
          </span>
        </div>
        {lines.map((line, i) => (
          <div key={i} style={{
            color: line.startsWith(">") ? "#6ee7b7" : line.startsWith("\"") ? "#fbbf24" : "rgba(255,255,255,0.7)",
            marginBottom: 4, lineHeight: 1.6,
          }}>
            {line}
            {i === lines.length - 1 && !complete && (
              <span style={{ animation: "pulse 1s infinite", color: "#6ee7b7" }}>▊</span>
            )}
          </div>
        ))}
        {complete && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button onClick={onClose} style={{
              fontFamily: "'Courier New', monospace", fontSize: "0.75rem",
              padding: "0.4rem 1.2rem", borderRadius: 6,
              background: "rgba(110,231,183,0.15)", border: "1px solid rgba(110,231,183,0.3)",
              color: "#6ee7b7", cursor: "pointer",
            }}>
              Close Terminal [ESC]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [showDNA, setShowDNA] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  useKonamiCode(useCallback(() => setShowDNA(true), []));
  useSecretWord("matrix", useCallback(() => setShowMatrix(true), []));

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "H") {
        e.preventDefault();
        setShowTerminal(true);
      }
      if (e.key === "Escape") {
        setShowDNA(false);
        setShowMatrix(false);
        setShowTerminal(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08080c",
        color: "#f0f0f0",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Instrument+Serif:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }
        body {
          background: #08080c;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::selection {
          background: rgba(110,231,183,0.25);
          color: #f0f0f0;
        }

        /* Mesh orb container needs absolute positioning context */
        .mesh-gradient-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        /* Mesh gradient orb animations */
        @keyframes meshOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          15% { transform: translate(-120px, 80px) scale(1.2); opacity: 0.8; }
          35% { transform: translate(100px, -60px) scale(0.85); opacity: 1; }
          55% { transform: translate(-80px, -100px) scale(1.3); opacity: 0.7; }
          75% { transform: translate(130px, 50px) scale(0.9); opacity: 0.9; }
          90% { transform: translate(-40px, 30px) scale(1.1); opacity: 0.85; }
        }
        @keyframes meshOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          20% { transform: translate(140px, -70px) scale(1.25); opacity: 0.75; }
          40% { transform: translate(-90px, 110px) scale(0.8); opacity: 1; }
          60% { transform: translate(60px, -130px) scale(1.15); opacity: 0.65; }
          80% { transform: translate(-110px, 60px) scale(1.1); opacity: 0.85; }
        }
        @keyframes meshOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.9; }
          18% { transform: translate(150px, 90px) scale(1.3); opacity: 0.55; }
          38% { transform: translate(-100px, -80px) scale(0.75); opacity: 1; }
          58% { transform: translate(80px, -120px) scale(1.2); opacity: 0.6; }
          78% { transform: translate(-130px, 70px) scale(0.85); opacity: 0.8; }
          92% { transform: translate(50px, 40px) scale(1.15); opacity: 0.7; }
        }
        @keyframes meshOrb4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          22% { transform: translate(-100px, 120px) scale(1.35); opacity: 0.5; }
          45% { transform: translate(130px, -80px) scale(0.8); opacity: 0.9; }
          68% { transform: translate(-70px, -100px) scale(1.2); opacity: 0.6; }
          88% { transform: translate(90px, 50px) scale(0.9); opacity: 0.75; }
        }
        @keyframes meshOrb5 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.85; }
          16% { transform: translate(110px, -90px) scale(1.25); opacity: 0.6; }
          33% { transform: translate(-60px, 130px) scale(0.85); opacity: 0.9; }
          50% { transform: translate(140px, 60px) scale(1.15); opacity: 0.5; }
          66% { transform: translate(-120px, -70px) scale(0.9); opacity: 0.8; }
          83% { transform: translate(70px, -110px) scale(1.3); opacity: 0.65; }
        }

        /* Button hover states */
        .btn-primary:hover {
          opacity: 0.88;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(110,231,183,0.2);
        }
        .btn-secondary:hover {
          border-color: rgba(255,255,255,0.3);
          color: #f0f0f0;
          transform: translateY(-2px);
        }

        /* Responsive showcard layout */
        @media (max-width: 640px) {
          .experience-showcard {
            grid-template-columns: 1fr !important;
          }
          .project-showcard {
            grid-template-columns: 1fr !important;
          }
        }

        /* Responsive hero layout */
        @media (max-width: 900px) {
          .hero-content {
            grid-template-columns: 1fr !important;
            text-align: left;
          }
          .hero-content > div:last-child {
            display: flex;
            justify-content: flex-start;
            order: -1;
          }
          .hero-tagline {
            min-height: 2.3em;
          }
        }

        /* Responsive nav */
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-btn { display: none !important; }
        }

        /* Reduced motion — disable all animations */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Navbar onLogoSecret={() => setShowTerminal(true)} />
      <Hero />
      <StatsBar />
      <SectionDivider />
      <About />
      <SectionDivider />
      <ExperienceSection />
      <SectionDivider />
      <ProjectsSection />
      <SectionDivider />
      <PublicationsSection />
      <SectionDivider />
      <SkillsSection />
      <SectionDivider />
      <Contact />
      <Footer />

      {showDNA && <DNAHelix onClose={() => setShowDNA(false)} />}
      {showMatrix && <MatrixRain onClose={() => setShowMatrix(false)} />}
      {showTerminal && <HackerTerminal onClose={() => setShowTerminal(false)} />}
    </div>
  );
}
