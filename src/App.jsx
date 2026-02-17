import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ROTATING_WORDS = [
  "research",
  "innovation",
  "discovery",
  "impact",
  "solutions",
  "insight",
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
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
  },
  {
    title: "Glioma Tumor Microenvironment Model",
    category: "Mathematical Biology",
    metric: "ODE-Based",
    metricLabel: "Immunotherapy Sim",
    tools: ["MATLAB", "Python", "Sensitivity Analysis"],
    description:
      "Mechanistic ODE model capturing tumor-immune interactions, calibrated against experimental data, with therapeutic scenario simulations.",
  },
  {
    title: "SCUDEM — Outstanding Award",
    category: "Mathematical Modeling",
    metric: "Outstanding",
    metricLabel: "International Award",
    tools: ["MATLAB", "Monte Carlo", "KL Divergence"],
    description:
      "Modeled AI model collapse in multi-model ecosystems using Markov chains and discrete distributions. Demonstrated diversity stabilizes recursive training.",
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
  },
  {
    title: "Neural Network from Scratch",
    category: "Machine Learning",
    metric: "MNIST",
    metricLabel: "Handwritten Digits",
    tools: ["Python", "NumPy", "Matplotlib"],
    description:
      "Feedforward neural network using only NumPy — forward prop, backprop, and mini-batch gradient descent implemented from first principles.",
  },
  {
    title: "COMAP MCM — Battery Dynamics",
    category: "Applied Mathematics",
    metric: "10⁴ Sims",
    metricLabel: "Monte Carlo Analysis",
    tools: ["MATLAB", "ODE45", "Stochastic Modeling"],
    description:
      "Physics-grounded SOC model with coupled nonlinear ODEs, Fourier-series CPU patterns, Peukert losses, and Monte Carlo sensitivity analysis.",
  },
  {
    title: "EMG Signal Analysis for CMCOA",
    category: "Biomedical Signal Processing",
    metric: "Multi-Muscle",
    metricLabel: "EMG Analysis",
    tools: ["Python", "ANOVA", "Pandas", "Seaborn"],
    description:
      "EDA on multi-muscle EMG recordings assessing activation patterns across CMCOA stages with paired t-tests, ANOVA, and visualization pipelines.",
  },
  {
    title: "Student Org Application Analysis",
    category: "Data Science",
    metric: "Bias Detection",
    metricLabel: "Process Improvement",
    tools: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    description:
      "Analyzed multi-year application data to detect reviewer-order bias, track repeat applicant trajectories, and recommend fair process changes.",
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
  { value: "3", label: "Publications" },
  { value: "10+", label: "Projects" },
  { value: "MD/PhD", label: "Track" },
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

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 clamp(1.5rem, 4vw, 4rem)",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(8,8,12,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <a
        href="#hero"
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
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              color: "rgba(255,255,255,0.6)",
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
              (e.target.style.color = "rgba(255,255,255,0.6)")
            }
          >
            {l.label}
          </a>
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
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 72,
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
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
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
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const [word, animating] = useRotatingWord(ROTATING_WORDS);

  return (
    <section
      id="hero"
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
      {/* Animated mesh gradient orbs */}
      <div className="mesh-gradient-container" style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}>
        {/* Primary green orb — top right */}
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
        {/* Secondary pink/magenta orb — bottom left */}
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
        {/* Tertiary purple/violet orb — center */}
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
        {/* Fourth accent — warm yellow/amber glow */}
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
      </div>

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

      {/* Hero content — two column */}
      <div className="hero-content" style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "clamp(2rem, 5vw, 5rem)",
        alignItems: "center",
        maxWidth: 1200,
        width: "100%",
      }}>
        {/* Left — text */}
        <div>
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(0.75rem, 1vw, 0.9rem)",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#6ee7b7",
            marginBottom: "1.5rem",
            opacity: 0,
            animation: "fadeUp 0.8s 0.2s forwards",
          }}
        >
          Biomedical Engineer · Pre-Med · Aspiring MD/PhD
        </p>

        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            fontWeight: 400,
            lineHeight: 1.08,
            color: "#f0f0f0",
            margin: 0,
            maxWidth: "900px",
            opacity: 0,
            animation: "fadeUp 0.8s 0.4s forwards",
          }}
        >
          Sharad Patel
        </h1>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 400,
            lineHeight: 1.15,
            margin: "0.25rem 0 0 0",
            color: "rgba(255,255,255,0.35)",
            opacity: 0,
            animation: "fadeUp 0.8s 0.6s forwards",
          }}
        >
          Turning data into{" "}
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
        </h2>

        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            maxWidth: 600,
            marginTop: "2rem",
            opacity: 0,
            animation: "fadeUp 0.8s 0.8s forwards",
          }}
        >
          BS Biomedical Engineering & Pre-Med at the University of Florida.
          Pursuing an MD/PhD to bridge clinical medicine with computational
          and data-driven research in human health.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2.5rem",
            flexWrap: "wrap",
            opacity: 0,
            animation: "fadeUp 0.8s 1s forwards",
          }}
        >
          <a href="#projects" style={btnPrimary}>
            View Projects
          </a>
          <a href="#contact" style={btnSecondary}>
            Get in Touch
          </a>
        </div>
        </div>

        {/* Right — headshot */}
        <div style={{
          opacity: 0,
          animation: "fadeUp 0.8s 0.6s forwards",
        }}>
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
            {/*
              ── REPLACE THIS WITH YOUR HEADSHOT ──
              1. Add your photo to /public/headshot.jpg
              2. Uncomment the <img> tag below
              3. Delete the placeholder <div> below
            */}
            {/* <img
              src="/headshot.jpg"
              alt="Sharad Patel"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            /> */}

            {/* Placeholder — remove once you add your photo */}
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "0.5rem",
              background: "linear-gradient(135deg, rgba(110,231,183,0.08) 0%, rgba(147,197,253,0.05) 100%)",
            }}>
              <span style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "3.5rem",
                color: "rgba(110,231,183,0.3)",
                lineHeight: 1,
              }}>SP</span>
              <span style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.6rem",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>Add headshot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: 0,
          animation: "fadeUp 0.8s 1.4s forwards",
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 32,
            background:
              "linear-gradient(to bottom, rgba(110,231,183,0.5), transparent)",
            animation: "pulse 2s infinite",
          }}
        />
      </div>
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
          <div
            key={s.label}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.6s ${i * 0.12}s ease`,
            }}
          >
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                color: "#6ee7b7",
                fontWeight: 400,
              }}
            >
              {s.value}
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
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  const [ref, visible] = useInView();
  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="About Me" visible={visible} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
          maxWidth: 800,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s 0.2s ease",
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
          Florida with a minor in mathematics, working toward an{" "}
          <span style={{ color: "#6ee7b7" }}>MD/PhD</span> to integrate
          clinical practice with computational research in human disease.
        </p>
        <p
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
        </p>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [ref, visible] = useInView();
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = ["All", "Research", "Engineering", "Leadership"];

  const filtered = activeFilter === "All"
    ? EXPERIENCE
    : EXPERIENCE.filter((e) => e.category === activeFilter);

  return (
    <section
      id="experience"
      ref={ref}
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="Experience" visible={visible} />
      <h3
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          color: "#f0f0f0",
          fontWeight: 400,
          marginBottom: "2rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s 0.15s ease",
        }}
      >
        Where curiosity meets rigor
      </h3>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(15px)",
          transition: "all 0.6s 0.25s ease",
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
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {filtered.map((item, i) => (
          <ExperienceShowcard key={item.title} data={item} index={i} parentVisible={visible} />
        ))}
      </div>
    </section>
  );
}

function ExperienceShowcard({ data, index, parentVisible }) {
  const [hovered, setHovered] = useState(false);
  const bgGrad = `linear-gradient(135deg, ${data.color}08 0%, ${data.color}03 50%, transparent 100%)`;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bgGrad,
        border: `1px solid ${hovered ? data.color + "30" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20,
        padding: "clamp(1.5rem, 3vw, 2.5rem)",
        transition: `all 0.5s ease, opacity 0.5s ${index * 0.07}s ease, transform 0.5s ${index * 0.07}s ease`,
        cursor: "default",
        opacity: parentVisible ? 1 : 0,
        transform: parentVisible ? (hovered ? "translateY(-3px)" : "translateY(0)") : "translateY(30px)",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1.5rem",
        alignItems: "start",
      }}
      className="experience-showcard"
    >
      {/* Accent glow on hover */}
      <div style={{
        position: "absolute",
        top: "-50%",
        right: "-20%",
        width: "50%",
        height: "200%",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${data.color}${hovered ? "0a" : "04"} 0%, transparent 70%)`,
        filter: "blur(60px)",
        transition: "all 0.5s ease",
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
    </div>
  );
}

function ProjectsSection() {
  const [ref, visible] = useInView();
  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="Featured Projects" visible={visible} />
      <h3
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          color: "#f0f0f0",
          fontWeight: 400,
          marginBottom: "3rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s 0.15s ease",
        }}
      >
        Building at the intersection of biology &amp; computation
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {PROJECTS.map((p, i) => (
          <ProjectShowcard key={p.title} data={p} index={i} parentVisible={visible} />
        ))}
      </div>
    </section>
  );
}

function ProjectShowcard({ data, index, parentVisible }) {
  const [hovered, setHovered] = useState(false);
  const colors = [
    "#6ee7b7", "#93c5fd", "#fbbf24", "#f472b6",
    "#a78bfa", "#34d399", "#fb923c", "#67e8f9",
  ];
  const accent = colors[index % colors.length];
  const bgGrad = `linear-gradient(135deg, ${accent}08 0%, ${accent}03 50%, transparent 100%)`;

  const Wrapper = data.link ? "a" : "div";
  const wrapperProps = data.link
    ? { href: data.link, target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none", display: "block" } }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: bgGrad,
          border: `1px solid ${hovered ? accent + "30" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 20,
          padding: "clamp(1.5rem, 3vw, 2.5rem)",
          transition: `all 0.5s ease, opacity 0.6s ${index * 0.08}s ease, transform 0.6s ${index * 0.08}s ease`,
          cursor: data.link ? "pointer" : "default",
          opacity: parentVisible ? 1 : 0,
          transform: parentVisible ? (hovered ? "translateY(-3px)" : "translateY(0)") : "translateY(30px)",
          position: "relative",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "clamp(1.5rem, 3vw, 2.5rem)",
          alignItems: "start",
        }}
        className="project-showcard"
      >
        {/* Accent glow on hover */}
        <div style={{
          position: "absolute",
          top: "-40%",
          right: "-15%",
          width: "45%",
          height: "180%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}${hovered ? "0a" : "04"} 0%, transparent 70%)`,
          filter: "blur(60px)",
          transition: "all 0.5s ease",
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
            {data.link && (
              <span style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.3)",
                transition: "color 0.3s",
                ...(hovered && { color: accent }),
              }}>
                View on GitHub ↗
              </span>
            )}
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
      </div>
    </Wrapper>
  );
}

function PublicationsSection() {
  const [ref, visible] = useInView();
  return (
    <section
      id="publications"
      ref={ref}
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="Publications & Presentations" visible={visible} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {PUBLICATIONS.map((p, i) => (
          <div
            key={p.title}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "1.75rem 2rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.6s ${i * 0.12}s ease`,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.65rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: 100,
                  background:
                    p.type === "Journal"
                      ? "rgba(110,231,183,0.12)"
                      : "rgba(147,197,253,0.12)",
                  color: p.type === "Journal" ? "#6ee7b7" : "#93c5fd",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {p.type}
              </span>
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                {p.date}
              </span>
            </div>
            <h4
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#f0f0f0",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {p.title}
            </h4>
            <p
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {p.venue}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const [ref, visible] = useInView();
  return (
    <section
      id="skills"
      ref={ref}
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel text="Skills & Technologies" visible={visible} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Object.entries(SKILLS).map(([cat, items], ci) => (
          <div
            key={cat}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "1.75rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.6s ${ci * 0.1}s ease`,
            }}
          >
            <h4
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6ee7b7",
                fontWeight: 600,
                marginTop: 0,
                marginBottom: "1rem",
              }}
            >
              {cat}
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {items.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "0.76rem",
                    padding: "0.3rem 0.65rem",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [ref, visible] = useInView();
  return (
    <section
      id="contact"
      ref={ref}
      style={{
        padding: "7rem clamp(1.5rem, 6vw, 8rem) 5rem",
        maxWidth: 1200,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease",
        }}
      >
        <SectionLabel text="Get in Touch" visible={visible} center />
        <h3
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            color: "#f0f0f0",
            fontWeight: 400,
            margin: "0 0 1rem 0",
          }}
        >
          Let's connect
        </h3>
        <p
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
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href="mailto:sharadrpatel1933@gmail.com" style={btnPrimary}>
            Send Email
          </a>
          <a
            href="https://www.linkedin.com/in/patel108"
            target="_blank"
            rel="noopener noreferrer"
            style={btnSecondary}
          >
            LinkedIn
          </a>
        </div>
      </div>
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
          {
            label: "Email",
            href: "mailto:sharadrpatel1933@gmail.com",
          },
          {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/patel108",
          },
          {
            label: "GitHub",
            href: "https://github.com/sharadrpatel",
          },
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
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(255,255,255,0.3)")
            }
          >
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ─── SHARED UI ───────────────────────────────────────────────────────────────

function SectionLabel({ text, visible, center }) {
  return (
    <p
      style={{
        fontFamily: "'Instrument Sans', sans-serif",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#6ee7b7",
        marginBottom: "1rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.6s ease",
        textAlign: center ? "center" : "left",
      }}
    >
      {text}
    </p>
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

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        /* Mesh gradient orb animations */
        @keyframes meshOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          20% { transform: translate(-60px, 40px) scale(1.15); opacity: 0.85; }
          40% { transform: translate(30px, -30px) scale(0.9); opacity: 1; }
          60% { transform: translate(-40px, -50px) scale(1.2); opacity: 0.75; }
          80% { transform: translate(50px, 20px) scale(0.95); opacity: 0.9; }
        }
        @keyframes meshOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          25% { transform: translate(70px, -40px) scale(1.2); opacity: 0.8; }
          50% { transform: translate(-50px, 50px) scale(0.85); opacity: 1; }
          75% { transform: translate(40px, 30px) scale(1.1); opacity: 0.7; }
        }
        @keyframes meshOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.9; }
          30% { transform: translate(80px, 40px) scale(1.25); opacity: 0.6; }
          60% { transform: translate(-60px, -60px) scale(0.8); opacity: 1; }
          85% { transform: translate(30px, -30px) scale(1.15); opacity: 0.7; }
        }
        @keyframes meshOrb4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          35% { transform: translate(-40px, 50px) scale(1.3); opacity: 0.5; }
          65% { transform: translate(60px, -40px) scale(0.85); opacity: 0.9; }
          90% { transform: translate(-20px, -20px) scale(1.1); opacity: 0.6; }
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
        }

        /* Responsive nav */
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-btn { display: none !important; }
        }

        /* Smooth hover for buttons */
        a[style*="border-radius: 100"]:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <Navbar />
      <Hero />
      <StatsBar />
      <About />
      <ExperienceSection />
      <ProjectsSection />
      <PublicationsSection />
      <SkillsSection />
      <Contact />
      <Footer />
    </div>
  );
}