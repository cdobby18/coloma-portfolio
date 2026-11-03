import { useState, useEffect, useRef, createContext, useContext } from "react";
import RagDemo from "./demo/RagDemo";
import Architecture from "./Architecture";
import CertAccordion from "./CertAccordion";
import CardSwap from "./CardSwap";

function BackToTop() {
  const COLORS = useColors();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 44,
        height: 44,
        borderRadius: 999,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.navBg,
        backdropFilter: "blur(12px)",
        color: COLORS.textSecondary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: COLORS.isDark ? "0 12px 40px rgba(0,0,0,0.4)" : "0 12px 40px rgba(2,6,23,0.08)",
        zIndex: 90,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.accentBorder;
        e.currentTarget.style.color = COLORS.accent;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.color = COLORS.textSecondary;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
}

const DARK = {
  isDark: true,
  bg: "#040714",
  surface: "#0a1028",
  surfaceHigh: "#10182c",
  border: "rgba(148,163,184,0.16)",
  textPrimary: "#f8fafc",
  textSecondary: "#d6dcf5",
  textMuted: "#9aa3c4",
  accent: "#f59e0b",
  accentSoft: "rgba(245,158,11,0.16)",
  accentBorder: "rgba(245,158,11,0.38)",
  cyan: "#22d3ee",
  sky: "#38bdf8",
  emerald: "#34d399",
  violet: "#a78bfa",
  navBg: "rgba(4,7,20,0.92)",
  mobileMenuBg: "rgba(4,7,20,0.98)",
  chipBg: "rgba(148,163,184,0.1)",
  chipBorder: "rgba(148,163,184,0.22)",
  outlineBorder: "rgba(148,163,184,0.26)",
  outlineBg: "rgba(148,163,184,0.07)",
  divider: "rgba(148,163,184,0.22)",
  tagBg: "rgba(245,158,11,0.18)",
  stripBorder: "rgba(148,163,184,0.16)",
};

const LIGHT = {
  isDark: false,
  bg: "#f7f5f2",
  surface: "#ffffff",
  surfaceHigh: "#f3efe8",
  border: "rgba(30,41,59,0.08)",
  textPrimary: "#0f172a",
  textSecondary: "#334155",
  textMuted: "#475569",
  accent: "#b45309",
  accentSoft: "rgba(180,83,9,0.12)",
  accentBorder: "rgba(180,83,9,0.32)",
  cyan: "#0891b2",
  sky: "#0284c7",
  emerald: "#059669",
  violet: "#7c3aed",
  navBg: "rgba(247,245,242,0.94)",
  mobileMenuBg: "rgba(247,245,242,0.98)",
  chipBg: "rgba(30,41,59,0.04)",
  chipBorder: "rgba(30,41,59,0.1)",
  outlineBorder: "rgba(30,41,59,0.14)",
  outlineBg: "rgba(30,41,59,0.02)",
  divider: "rgba(30,41,59,0.12)",
  tagBg: "rgba(180,83,9,0.14)",
  stripBorder: "rgba(30,41,59,0.08)",
};

const ThemeCtx = createContext(DARK);
export const useColors = () => useContext(ThemeCtx);

const NAV_LINKS = [
  { label: "Home",       id: "hero"       },
  { label: "About",      id: "about"      },
  { label: "Experience", id: "experience" },
  { label: "Projects",   id: "projects"   },
  { label: "Skills",          id: "stack"      },
  { label: "Certifications",  id: "certs"      },
  { label: "Contact",         id: "contact"    },
  { label: "Blog",       id: "blog", href: "/blog.html" },
];

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const SKILL_GROUPS = [
  {
    label: "Languages & Frameworks",
    skills: ["Python", "JavaScript", "FastAPI", "Flask", "React", "Streamlit", "RESTful APIs"],
  },
  {
    label: "AI & ML",
    skills: ["OpenCV", "LangChain", "RAG", "GenAI", "Agentic AI", "Prompt Engineering", "Automation", "LLM APIs", "PyTorch", "HuggingFace"],
  },
  {
    label: "Data",
    skills: ["SQL", "Databricks", "ETL", "dbt", "Airflow", "PySpark", "Pandas", "NumPy", "Snowflake", "Kafka", "Spark", "BigQuery"],
    muted: true,
  },
  {
    label: "Developer Tools",
    skills: ["Docker", "Git", "VS Code", "Claude Code", "Hermes Agent", "Obsidian", "Exa AI", "Qdrant", "PostgreSQL", "Jupyter"],
  },
];

const EXPERIENCE = [
  {
    role: "Backend AI Engineer Intern",
    company: "FlyRank AI",
    period: "July 2026 – Present",
    points: [
      "Developed LLM-powered content generation and semantic ranking pipelines to improve content relevance at scale.",
      "Integrated embedding models with vector search to build semantic retrieval features across the platform.",
      "Contributed to prompt engineering workflows and output quality evaluation for production AI features.",
    ],
  },
  {
    role: "AI QA Intern",
    company: "SoFi AI Tech Solutions Inc.",
    period: "Apr 2026 – July 2026",
    points: [
      "Designed adversarial prompt test suites targeting hallucination, refusal, and instruction-following failure modes across conversational AI chatbots.",
      "Evaluated chatbot responses against adversarial prompts to label and track hallucination rates and response quality at scale.",
      "Partnered with ML teams to translate evaluation findings into concrete model behavior improvements, reducing error rates across key failure categories.",
    ],
  },
  {
    role: "AI Engineer Intern",
    company: "Lamina Studios",
    period: "Dec 2025 – Apr 2026",
    points: [
      "Built real-time YOLOv8 object detection pipelines with OpenCV, achieving production-ready inference speeds on GPU hardware.",
      "Trained XGBoost classification models on time-series datasets using Scikit-learn; deployed predictions to cut manual review overhead.",
      "Automated model retraining and evaluation workflows, reducing iteration cycles from days to hours.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Powerlift: Precision Pose Estimation for Powerlifting Performance Metrics",
    type: "Computer Vision",
    year: "2025",
    status: "Best Thesis",
    desc: "AI biomechanics analyzer for powerlifting built with YOLOv8, Kalman Filtering, and SVM classification. Tracks joint positions, stabilizes motion across frames, and classifies squat, bench, and deadlift mechanics in real time — delivering automated lift assessment and performance feedback on mobile hardware.",
    metric: "Mobile Application · Overall Best Thesis",
    tags: ["Python", "YOLOv8", "Kalman Filtering", "SVM", "MoveNet"],
    features: [
      "Real-time motion tracking for barbell and body landmarks",
      "Frame-stabilized posture analysis across lift phases",
      "Automated classification for squat, bench, and deadlift form",
      "Mobile-friendly inference optimized for practical evaluation"
    ],
    accent: "#22d3ee",
    featured: true,
    img: "/Powerlift.webp",
    link: "https://github.com/cdobby18/Powerlift",
    github: "https://github.com/cdobby18/Powerlift"
  },
    {
    title: "Sunny AI",
    type: "RAG-Built Mentor",
    private: true,
    year: "2026",
    status: "Prototype",
    desc: "A guided platform for aspiring AI engineers starting from zero. No fluff, no shortcuts — RAG-powered mentorship that meets you at the bottom and builds you up through fundamentals, production skills, and real-world readiness.",
    metric: "React · Python · LLMs · RAG · LangChain",
    tags: ["React", "Python", "LLMs", "RAG", "FastAPI"],
    features: [
      "Conversational mentoring grounded in structured AI learning paths",
      "Retrieval-backed explanations for fundamentals and projects",
      "Production-style workflows for beginner-to-builder progression",
      "Personalized guidance tuned around the learner's current stage"
    ],
    accent: "#0ea5e9",
    img: "/sunny.png",
    link: "#contact",
    github: "#contact"
  },
  {
    title: "Resume Analyzer",
    type: "Natural Language Processing",
    year: "2025",
    status: "Pipeline",
    desc: "Resume parsing pipeline using spaCy NER and Transformer-based semantic matching to extract skills, experience, and role fit. Processes 100+ documents per minute with structured JSON output ready for downstream ranking or ATS integration.",
    metric: "Python · spaCy NER + Semantic Match",
    tags: ["NLP", "spaCy", "Transformers", "FastAPI"],
    features: [
      "Entity extraction for skills, roles, and experience markers",
      "Semantic matching against target job descriptions",
      "Structured output for ranking, filtering, and system pipelines",
      "High-throughput processing for large candidate batches"
    ],
    accent: "#38bdf8",
    img: "/Resume.webp",
    link: "https://github.com/cdobby18/resume_analyzer",
    github: "https://github.com/cdobby18/resume_analyzer"
  },
  {
    title: "Document Summarizer",
    type: "Transformer Pipeline",
    year: "2024",
    status: "Research Build",
    desc: "Abstractive summarization system for multi-page PDFs using BART and T5. Handles long-document chunking strategies to stay within model context limits, then merges section-level summaries into a coherent output — outperforming extractive baselines on readability.",
    metric: "Python · NLP · BART",
    tags: ["BART", "T5", "HuggingFace", "PDF"],
    features: [
      "Chunk-aware processing for long-form multi-page documents",
      "Abstractive summarization with section-level synthesis",
      "Context-safe handling of extended inputs and token limits",
      "Readable outputs suitable for document review and search support"
    ],
    accent: "#34d399",
    img: "/Summarize.webp",
    link: "https://github.com/cdobby18/ai-summarizer",
    github: "https://github.com/cdobby18/ai-summarizer"
  },
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export function SectionLabel({ num, text }) {
  const COLORS = useColors();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em", opacity: 0.9 }}>{num}</span>
      <div style={{ width: 32, height: 1, background: COLORS.accentBorder }} />
      <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em" }}>{text}</span>
    </div>
  );
}

const SKILL_USED_IN = {
  "Python": "Powerlift, Resume Analyzer, Sunny AI",
  "JavaScript": "Portfolio, Sunny AI",
  "FastAPI": "Resume Analyzer, Sunny AI",
  "React": "Portfolio, Sunny AI",
  "PyTorch": "AI Engineering Roadmap",
  "OpenCV": "Powerlift, Lamina Studios",
  "LangChain": "Sunny AI",
  "RAG": "Sunny AI, Portfolio demo",
  "Docker": "Deployment workflows",
  "PostgreSQL": "Backend services",
  "Pandas": "Data pipelines",
  "NumPy": "ML experiments",
  "spaCy": "Resume Analyzer",
  "Transformers": "Document Summarizer",
  "YOLOv8": "Powerlift, Lamina Studios",
  "XGBoost": "Lamina Studios",
  "Kalman Filtering": "Powerlift",
};

function SkillPill({ name, delay = 0, muted = false }) {
  const COLORS = useColors();
  const usedIn = SKILL_USED_IN[name];
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 14px",
          borderRadius: 999,
          background: COLORS.chipBg,
          border: `1px solid ${COLORS.chipBorder}`,
          color: muted ? COLORS.textMuted : COLORS.textSecondary,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.01em",
          transition: "all 0.25s ease",
          cursor: "default",
          animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
          opacity: muted ? 0.85 : 1,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = COLORS.accentBorder;
          e.currentTarget.style.background = COLORS.accentSoft;
          e.currentTarget.style.color = COLORS.textPrimary;
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 6px 16px ${COLORS.accent}22`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = COLORS.chipBorder;
          e.currentTarget.style.background = COLORS.chipBg;
          e.currentTarget.style.color = muted ? COLORS.textMuted : COLORS.textSecondary;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
        }}
      >
        {name}
      </div>
      {hover && usedIn && (
        <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: COLORS.isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)", border: `1px solid ${COLORS.accentBorder}`, borderRadius: 8, padding: "6px 10px", color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 11, whiteSpace: "nowrap", zIndex: 50, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", pointerEvents: "none" }}>
          used in: <span style={{ color: COLORS.accent }}>{usedIn}</span>
        </div>
      )}
    </div>
  );
}

function Hero() {
  const COLORS = useColors();
  const [nameHover, setNameHover] = useState(false);
  const heroNameRef = useRef(null);
  const TYPE_LABELS = ["AI & Automation Engineer", "Software Engineer", "GenAI Engineer"];
  const [typedLabel, setTypedLabel] = useState("");
  const [typeIndex, setTypeIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = TYPE_LABELS[typeIndex];
    let timeout;
    if (!isDeleting && typedLabel === current) {
      timeout = setTimeout(() => setIsDeleting(true), 1400);
    } else if (isDeleting && typedLabel === "") {
      setIsDeleting(false);
      setTypeIndex((i) => (i + 1) % TYPE_LABELS.length);
    } else {
      const next = isDeleting ? current.slice(0, typedLabel.length - 1) : current.slice(0, typedLabel.length + 1);
      timeout = setTimeout(() => setTypedLabel(next), isDeleting ? 45 : 90);
    }
    return () => clearTimeout(timeout);
  }, [typedLabel, isDeleting, typeIndex]);

  useEffect(() => {
    const h1 = heroNameRef.current;
    if (!h1) return;
    const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+<>/";
    // split into letter spans if not already
    if (!h1.querySelector(".ch")) {
      Array.from(h1.childNodes).forEach((node) => {
        if (node.nodeType === 3) {
          const text = node.textContent || "";
          const frag = document.createDocumentFragment();
          for (let i = 0; i < text.length; i++) {
            if (text[i] === " ") {
              frag.appendChild(document.createTextNode(" "));
            } else {
              const c = document.createElement("span");
              c.className = "ch";
              c.dataset.final = text[i];
              c.textContent = text[i];
              frag.appendChild(c);
            }
          }
          node.parentNode.replaceChild(frag, node);
        }
      });
    }
    const chars = Array.from(h1.querySelectorAll(".ch")).map((el) => ({
      el,
      x: 0,
      y: 0,
      hot: false,
      until: 0,
      next: 0,
    }));
    let px = -1e4;
    let py = -1e4;
    let inside = false;
    let raf = 0;
    let measured = 0;
    let R = 80;

    const measure = (now) => {
      chars.forEach((c) => {
        const r = c.el.getBoundingClientRect();
        c.x = r.left + r.width / 2;
        c.y = r.top + r.height / 2;
        R = Math.max(48, r.height * 0.8);
      });
      measured = now;
    };
    const loop = (now) => {
      let any = false;
      if (inside && now - measured > 400) measure(now);
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (inside) {
          const dx = c.x - px;
          const dy = c.y - py;
          if (dx * dx + dy * dy < R * R) {
            c.hot = true;
            c.until = now + 140 + Math.random() * 260;
          }
        }
        if (!c.hot) continue;
        if (now >= c.until) {
          c.hot = false;
          c.el.textContent = c.el.dataset.final;
          c.el.classList.remove("glyph");
          continue;
        }
        any = true;
        if (now >= c.next) {
          c.next = now + 55 + Math.random() * 40;
          c.el.textContent = GLYPHS.charAt(Math.random() * GLYPHS.length | 0);
          c.el.classList.add("glyph");
        }
      }
      raf = any || inside ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onEnter = (e) => {
      if (e.pointerType === "touch") return;
      inside = true;
      measure(performance.now());
      kick();
    };
    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      if (!inside) {
        inside = true;
        measure(performance.now());
      }
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const onLeave = () => {
      inside = false;
      px = py = -1e4;
    };
    const onClick = (e) => {
      if (e.pointerType && e.pointerType !== "touch") return;
      const now = performance.now();
      chars.forEach((c, i) => {
        c.hot = true;
        c.next = 0;
        c.until = now + 250 + i * 35;
      });
      kick();
    };
    h1.addEventListener("pointerenter", onEnter);
    h1.addEventListener("pointermove", onMove);
    h1.addEventListener("pointerleave", onLeave);
    h1.addEventListener("click", onClick);
    return () => {
      h1.removeEventListener("pointerenter", onEnter);
      h1.removeEventListener("pointermove", onMove);
      h1.removeEventListener("pointerleave", onLeave);
      h1.removeEventListener("click", onClick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);


  return (
    <section id="hero" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px clamp(24px, 6vw, 96px) 56px", position: "relative", overflow: "hidden" }}>

      {/* Subtle nautical texture */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: COLORS.isDark ? 0.14 : 0.09 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves" width="200" height="48" patternUnits="userSpaceOnUse">
              <path d="M0 24 Q50 6 100 24 T200 24 L200 48 L0 48 Z" fill="none" stroke={COLORS.accentBorder} strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "-18%", right: "-12%", width: 560, height: 560, background: `radial-gradient(circle, ${COLORS.isDark ? "rgba(245,158,11,0.09)" : "rgba(180,83,9,0.07)"} 0%, transparent 72%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-32%", left: "-18%", width: 640, height: 640, background: `radial-gradient(circle, ${COLORS.isDark ? "rgba(34,211,238,0.07)" : "rgba(180,83,9,0.05)"} 0%, transparent 74%)`, pointerEvents: "none" }} />

      <div className="hero-grid" style={{ maxWidth: 1100, width: "100%", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "minmax(260px, 380px) minmax(0, 1fr)", alignItems: "center", gap: "clamp(32px, 5vw, 64px)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both" }}>
            <div style={{ width: "min(100%, 340px)", aspectRatio: "1 / 1.18", borderRadius: 30, overflow: "hidden", border: `1px solid ${COLORS.accentBorder}`, boxShadow: COLORS.isDark ? "0 40px 80px rgba(245,158,11,0.14)" : "0 40px 80px rgba(180,83,9,0.12)", background: COLORS.isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255,255,255,0.68)", backdropFilter: "blur(8px)" }}>
              <img src="/pic.jpeg" alt="Carl Joshua Coloma" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            </div>
          </div>
        </div>

        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: `1px solid ${COLORS.accentBorder}`, borderRadius: 999, background: COLORS.accentSoft, marginBottom: 22, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.12s both", position: "relative" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 0 6px ${COLORS.accentSoft}` }} />
            <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap", minWidth: 200, display: "inline-block" }}>{typedLabel}<span style={{ opacity: 0.7 }}>|</span></span>
          </div>

          <h1 id="heroName" ref={heroNameRef} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(42px, 6vw, 76px)", lineHeight: 0.98, letterSpacing: "-0.05em", color: COLORS.textPrimary, marginBottom: 18, fontWeight: 700, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both", cursor: "default", whiteSpace: "pre" }}>
            {"Carl Joshua Coloma".split("").map((c, i) => (c === " " ? " " : <span key={i} className="ch" data-final={c}>{c}</span>))}
          </h1>

          <p style={{ maxWidth: 680, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.9, marginBottom: 30, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s both" }}>
            AI Engineer focused on building reliable <span style={{ color: COLORS.textPrimary }}>agentic workflows, RAG systems, and production-ready ML</span> with Python.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start", marginBottom: 16, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.44s both" }}>
            <a href="#projects"
              style={{ padding: "12px 26px", borderRadius: 10, background: COLORS.accent, color: "#0b1026", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, transition: "all 0.2s ease", boxShadow: COLORS.isDark ? "0 10px 40px rgba(245,158,11,0.18)" : "0 10px 40px rgba(180,83,9,0.16)" }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; }}>
              View selected work
            </a>
            <a href="#contact"
              style={{ padding: "12px 26px", borderRadius: 10, border: `1px solid ${COLORS.outlineBorder}`, color: COLORS.textPrimary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, background: "transparent", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; }}>
              Get in touch
            </a>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-start", marginBottom: 40, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
            <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 999, border: `1px solid ${COLORS.outlineBorder}`, color: COLORS.textSecondary, textDecoration: "none", background: "transparent", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.textPrimary; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; e.currentTarget.style.transform = "translateY(0)"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.43 7.86 10.96.57.1.78-.25.78-.55v-2.03c-3.2.7-3.87-1.39-3.87-1.39-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.2.66.79.55 4.56-1.53 7.85-5.85 7.85-10.96C23.5 5.74 18.27.5 12 .5z"/></svg>
            </a>
            <a href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 999, border: `1px solid ${COLORS.outlineBorder}`, color: COLORS.textSecondary, textDecoration: "none", background: "transparent", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.textPrimary; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; e.currentTarget.style.transform = "translateY(0)"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)` }} />
    </section>
  );
}

function AboutSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(null);
  return (
    <section id="about" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="01" text="About" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(30px, 4.5vw, 46px)", color: COLORS.textPrimary, marginBottom: 36, fontWeight: 700 }}>About Me</h2>
      <div data-cols="true" style={{ display: "flex", gap: 64, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85, marginBottom: 18 }}>
            Hey, I'm CJ — an aspiring AI engineer and CS student from the Philippines (FEU Tech, 2026). I bridge research-grade ML with real-world deployment — reliable, observable, maintainable systems beyond the notebook.
          </p>
          <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85, marginBottom: 18 }}>
            Currently Backend AI Engineer Intern at FlyRank AI (LLM content generation, semantic ranking). Previously AI QA Intern at SoFi AI Tech Solutions (adversarial prompt suites, hallucination testing). Focus: LLM evaluation, RAG, production observability.
          </p>
          <div style={{ marginTop: 36, borderTop: `1px solid ${COLORS.stripBorder}` }}>
            {[
              { label: "Current Role", value: "Backend AI Engineer Intern · FlyRank AI" },
              { label: "Location",     value: "Philippines" },
              { label: "Focus",        value: "Agentic AI · LLMs · RAG" },
              { label: "Education",    value: "BS Computer Science · FEU Tech · 2026" },
              { label: "Upskilling",   value: "Databricks · dbt · Airflow · Snowflake" },
            ].map((row, i, arr) => (
              <div key={row.label}
                onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.isDark ? "rgba(245,158,11,0.05)" : "rgba(180,83,9,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                style={{ display: "flex", gap: 24, alignItems: "center", padding: "14px 12px", borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.stripBorder}` : "none", borderRadius: 8, transition: "background 0.2s ease" }}>
                <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0, minWidth: 108 }}>{row.label}</span>
                <span style={{ color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 14 }}>{row.value}</span>
              </div>
            ))}
          </div>

        </div>

        <div style={{ flex: "0 0 280px", display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { num: "01", label: "Overall Best Thesis", sub: "Computer Vision · Nov 2025", detail: "YOLOv8 + Kalman Filtering · 30+ FPS on mobile" },
            { num: "02", label: "3 Internships",        sub: "Lamina · SoFi · FlyRank AI", detail: "Backend AI · AI QA · LLM pipelines" },
            { num: "03", label: "5 Projects",           sub: "CV · NLP · LLMs · RAG", detail: "Production-ready ML systems" },
          ].map((item, idx) => (
            <div key={item.num}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                const target = idx === 1 ? "experience" : "projects";
                const el = document.getElementById(target);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{ display: "flex", alignItems: "flex-start", gap: 18, background: COLORS.surface, border: `1px solid ${hovered === idx ? COLORS.accentBorder : COLORS.border}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", transition: "all 0.25s ease", transform: hovered === idx ? "translateY(-3px)" : "translateY(0)", boxShadow: hovered === idx ? (COLORS.isDark ? "0 12px 30px rgba(245,158,11,0.12)" : "0 12px 30px rgba(180,83,9,0.1)") : "none" }}>
              <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, opacity: 0.65, flexShrink: 0, paddingTop: 2 }}>{item.num}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
                <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.5 }}>{item.sub}</p>
                <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 11, lineHeight: 1.5, marginTop: 6, maxHeight: hovered === idx ? 40 : 0, opacity: hovered === idx ? 1 : 0, overflow: "hidden", transition: "all 0.25s ease" }}>{item.detail}</p>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 14 }}>
            <RagDemo compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const [activeTab, setActiveTab] = useState(0);
  const activeGroup = SKILL_GROUPS[activeTab] || SKILL_GROUPS[0];
  return (
    <section id="stack" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="05" text="Skills" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>Technical Skills</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 640, lineHeight: 1.9, fontFamily: "Inter, sans-serif" }}>
          A focused toolkit for building agentic AI systems, retrieval pipelines, and reliable backend services.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 12 }}>
        {SKILL_GROUPS.map((group, gi) => (
          <button
            key={group.label}
            onClick={() => setActiveTab(gi)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: `1px solid ${activeTab === gi ? COLORS.accentBorder : COLORS.chipBorder}`,
              background: activeTab === gi ? COLORS.accentSoft : "transparent",
              color: activeTab === gi ? COLORS.accent : COLORS.textMuted,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: activeTab === gi ? COLORS.accent : COLORS.textMuted, boxShadow: activeTab === gi ? `0 0 0 3px ${COLORS.accentSoft}` : "none" }} />
            {group.label}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.7 }}>({group.skills.length})</span>
          </button>
        ))}
      </div>

      {/* Active group */}
      <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 18, background: COLORS.isDark ? "linear-gradient(180deg, rgba(17,24,39,0.6), rgba(10,16,32,0.6))" : "linear-gradient(180deg, #ffffff, #f8fafc)", padding: "24px 28px", boxShadow: COLORS.isDark ? "0 20px 50px rgba(0,0,0,0.25)" : "0 20px 50px rgba(15,23,42,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 0 4px ${COLORS.accentSoft}` }} />
            {activeGroup.label}
          </span>
          <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>0{activeTab + 1} / 0{SKILL_GROUPS.length}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {activeGroup.skills.map((skill, si) => (
            <SkillPill key={skill} name={skill} delay={si * 40} muted={activeGroup.label.includes("Learning") || activeGroup.muted} />
          ))}
        </div>
      </div>
    </section>
  );
}

const DOT_THRESHOLDS = EXPERIENCE.map((_, i) => 0.08 + i * (0.66 / Math.max(EXPERIENCE.length - 1, 1)));

function ExperienceSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();

  return (
    <section id="experience" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="02" text="Experience" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>Experience</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 640, lineHeight: 1.9, fontFamily: "Inter, sans-serif" }}>
          Hands-on experience building and evaluating AI systems in production-focused environments.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${COLORS.border}` }}>
        {EXPERIENCE.map((exp, i) => (
          <article key={i}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.isDark ? "rgba(245,158,11,0.03)" : "rgba(180,83,9,0.03)"; e.currentTarget.style.borderLeft = `3px solid ${COLORS.accent}`; e.currentTarget.style.paddingLeft = "16px"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderLeft = "3px solid transparent"; e.currentTarget.style.paddingLeft = "0"; }}
            style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, padding: "30px 0", borderBottom: `1px solid ${COLORS.border}`, borderLeft: "3px solid transparent", transition: "all 0.25s ease", animation: visible ? `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms both` : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{exp.period}</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13 }}>{exp.company}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>{exp.role}</h3>
                <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.9 }}>
                  Focused on shipping reliable AI features with an emphasis on evaluation, retrieval, and integration.
                </p>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {exp.points.map((point) => (
                  <li key={point} style={{ display: "flex", gap: 12, color: COLORS.textSecondary, lineHeight: 1.9, fontFamily: "Inter, sans-serif", fontSize: 14, alignItems: "flex-start" }}>
                    <span style={{ color: COLORS.accent, flexShrink: 0, marginTop: 9, width: 4, height: 4, borderRadius: "50%", background: COLORS.accent }} />
                    <span style={{ flex: 1 }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const [active, setActive] = useState(0);
  const [archOpen, setArchOpen] = useState(false);
  const items = PROJECTS.map((project) => ({
    title: project.title,
    image: project.img,
    alt: project.title
  }));
  const project = PROJECTS[active] || PROJECTS[0];
  const primaryHref = project.link || "#contact";
  const secondaryHref = project.github || "#contact";

  return (
    <section id="projects" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="03" text="Selected Work" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>Projects</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 640, lineHeight: 1.9, fontFamily: "Inter, sans-serif" }}>
          Applied AI systems focused on computer vision, NLP, and agentic workflows with an emphasis on usability and deployment.
        </p>
      </div>

      <div className="project-swap-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)", gap: 32, alignItems: "stretch" }}>
        <div style={{ height: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CardSwap
            items={items}
            width={400}
            height={280}
            delay={3500}
            autoplay={false}
            theme={COLORS.isDark ? "dark" : "light"}
            onChange={(index) => setActive(index)}
            onCardClick={(index) => setActive(index)}
          />
        </div>

        <div key={project.title} className="project-content" style={{ display: "flex", flexDirection: "column", gap: 18, justifyContent: "space-between", padding: "8px 4px", animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" }}>{String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>{project.type}</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12 }}>•</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12 }}>{project.year}</span>
              <span style={{ padding: "4px 10px", borderRadius: 999, border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{project.status}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(22px, 2.8vw, 30px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15 }}>{project.title}</h3>
              <p style={{ color: COLORS.textSecondary, lineHeight: 1.85, fontFamily: "Inter, sans-serif", fontSize: 15 }}>{project.desc}</p>
              {project.metric && (
                <p style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>
                  {project.metric}
                </p>
              )}
            </div>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0 }}>
              {project.features.map((feature) => (
                <li key={feature} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.accent, marginTop: 8, flexShrink: 0 }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
              {!project.private && (
                <a href={primaryHref} target={primaryHref.startsWith("http") ? "_blank" : undefined} rel={primaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "11px 18px", borderRadius: 12, background: COLORS.accent, color: COLORS.isDark ? "#0b1026" : "#ffffff", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, boxShadow: COLORS.isDark ? "0 12px 30px rgba(245,158,11,0.18)" : "0 12px 30px rgba(180,83,9,0.14)" }}>
                  {primaryHref.startsWith("http") ? "View project" : "View details"}
                </a>
              )}
              <button onClick={() => setArchOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "11px 18px", borderRadius: 12, border: `1px solid ${COLORS.outlineBorder}`, background: "transparent", color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textPrimary; }}>
                System architecture
              </button>
            </div>
          </div>
        </div>
      </div>

      {archOpen && (
        <div onClick={() => setArchOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 980, width: "100%", maxHeight: "85vh", overflowY: "auto", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: "24px 26px", boxShadow: COLORS.isDark ? "0 40px 80px rgba(0,0,0,0.6)" : "0 40px 80px rgba(15,23,42,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: COLORS.textPrimary, fontWeight: 700, marginBottom: 2 }}>System Architecture · {project.title}</h3>
                <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12 }}>How this system is built — frontend to backend, AI/ML, data, automation, and observability.</p>
              </div>
              <button onClick={() => setArchOpen(false)} aria-label="Close" style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
            <Architecture project={project.title} />
          </div>
        </div>
      )}

    </section>
  );
}


function CertificatesSection() {
  return null;
}

function InterestsSection() {
  return null;
}

function ContactSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(null);
  const email = "carljoshuamcoloma@gmail.com";

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const localTime = now ? (now.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Manila" }) + " PH") : null;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const socials = [
    { label: "GitHub", handle: "github.com", href: "https://github.com/cdobby18", glyph: "GH" },
    { label: "LinkedIn", handle: "linkedin.com", href: "https://linkedin.com/in/carl-joshua-coloma", glyph: "in" },
  ];

  return (
    <section id="contact" ref={ref} style={{ padding: "72px clamp(24px, 6vw, 96px) 64px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)", position: "relative" }}>
      <style>{`
        @keyframes contactPulse {
          0% { box-shadow: 0 0 0 0 ${COLORS.accent}66; }
          70% { box-shadow: 0 0 0 8px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        @keyframes contactRise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #contact .contact-card {
          transform: none;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.25s ease, box-shadow 0.3s ease, background 0.25s ease;
        }
        #contact .contact-card:hover {
          transform: translateY(-3px);
          border-color: ${COLORS.accentBorder};
          box-shadow: 0 12px 28px ${COLORS.accent}22;
          background: ${COLORS.accentSoft};
        }
        #contact .contact-card:hover .card-arw {
          transform: translateX(5px);
          color: ${COLORS.accent};
        }
        #contact .resume-btn .btn-arrow {
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        #contact .resume-btn:hover .btn-arrow {
          transform: translateX(5px);
        }
        #contact .resume-btn .btn-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(120px 60px at 22% -10%, ${COLORS.accent}44, transparent 70%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        #contact .resume-btn:hover .btn-glow {
          opacity: 1;
        }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* status pill + local time chip */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 22, opacity: now ? 1 : 0, animation: visible ? "contactRise 0.5s cubic-bezier(0.16,1,0.3,1) both" : "none" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 16px", borderRadius: 999, border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", animation: "contactPulse 2s infinite" }} />
            <span style={{ color: COLORS.textPrimary, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>Open to opportunities</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, background: COLORS.chipBg }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em" }}>{localTime || "… PH"}</span>
          </div>
        </div>

        {/* heading */}
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 6.5vw, 72px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1.02, margin: "0 0 20px", animation: visible ? "contactRise 0.55s cubic-bezier(0.16,1,0.3,1) both" : "none" }}>
          Let's build something{" "}
          <span style={{ position: "relative", display: "inline-block", color: COLORS.accent, WebkitTextStroke: `0.5px ${COLORS.accent}` }}>
            reliable
            <span style={{ position: "absolute", left: 0, right: 0, bottom: "0.05em", height: 3, borderRadius: 3, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
          </span>
        </h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 560, lineHeight: 1.9, fontFamily: "Inter, sans-serif", fontSize: 16, margin: "0 0 36px", animation: visible ? "contactRise 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both" : "none" }}>
          Open to AI engineering opportunities, agentic system collaborations, and production ML work. Grab my resume below or reach out directly — I usually reply within a day.
        </p>

        {/* social cards */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 22 }}>
          {socials.map((s, i) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label} className="contact-card"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 13, borderRadius: 14, background: COLORS.chipBg, border: `1px solid ${COLORS.chipBorder}`, textDecoration: "none", animation: visible ? `contactRise 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.05}s both` : "none" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: COLORS.accent }}>
                {s.glyph === "GH" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                  </svg>
                )}
              </span>
            </a>
          ))}
        </div>

        {/* actions: resume + email */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 22 }}>
          {/* resume button */}
          <a href="/cv-coloma.pdf" target="_blank" rel="noopener noreferrer" download="Carl-Coloma-Resume.pdf" className="resume-btn"
            style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", padding: "15px 26px", borderRadius: 14, background: COLORS.accent, color: COLORS.isDark ? "#0b1026" : "#ffffff", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.01em", boxShadow: `0 10px 26px ${COLORS.accent}44`, transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)", animation: visible ? "contactRise 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both" : "none" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
            <span className="btn-glow" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" />
            </svg>
            Download Resume
            <span className="btn-arrow" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, opacity: 0.8 }}>↓</span>
          </a>

          {/* copy email */}
          <button onClick={copyEmail} className="copy-email-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 24px", borderRadius: 14, background: COLORS.chipBg, border: `1px solid ${copied ? "rgba(52,211,153,0.5)" : COLORS.chipBorder}`, color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", transition: "all 0.25s ease", animation: visible ? "contactRise 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both" : "none" }}
            onMouseEnter={e => { if (!copied) e.currentTarget.style.borderColor = COLORS.accentBorder; }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.borderColor = COLORS.chipBorder; }}>
            <span style={{ fontFamily: "Inter, sans-serif", opacity: 0.85 }}>{email}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: copied ? "#34d399" : COLORS.accent, transition: "color 0.2s ease" }}>{copied ? "✓ copied" : "⧉ copy"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function GlidingNavLinks({ links, theme }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const containerRef = useRef(null);
  const [glider, setGlider] = useState({ left: 0, width: 0 });
  const clickLock = useRef(false);
  const lockTimer = useRef(null);

  const measure = (idx) => {
    const el = refs.current[idx];
    const container = containerRef.current;
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setGlider({ left: elRect.left - cRect.left, width: elRect.width });
  };

  useEffect(() => { measure(active); }, [active]);

  useEffect(() => {
    const onScroll = () => {
      if (clickLock.current) return;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (atBottom) {
        // highlight the last on-page section, not external links (e.g. Blog)
        for (let i = links.length - 1; i >= 0; i--) {
          if (!links[i].href) { setActive(i); return; }
        }
        return;
      }
      let current = 0;
      for (let i = 0; i < links.length; i++) {
        const el = document.getElementById(links[i].id);
        if (el && el.getBoundingClientRect().top <= 120) current = i;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [links]);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: 6, borderRadius: 999, background: theme.isDark ? "rgba(148,163,184,0.08)" : "rgba(255,255,255,0.78)", border: `1px solid ${theme.border}`, boxShadow: theme.isDark ? "0 18px 40px rgba(2,6,23,0.18)" : "0 18px 40px rgba(15,23,42,0.08)", backdropFilter: "blur(18px)" }}>
      <span
        style={{
          position: "absolute",
          top: 6,
          left: glider.left,
          width: glider.width,
          height: "calc(100% - 12px)",
          borderRadius: 999,
          background: theme.accent,
          boxShadow: `0 8px 18px ${theme.accent}44`,
          transition: "left .4s cubic-bezier(.65,0,.35,1), width .4s cubic-bezier(.65,0,.35,1)",
          pointerEvents: "none",
        }}
      />
      {links.map((link, i) => (
        <a
          key={link.id}
          href={link.href || `#${link.id}`}
          ref={el => (refs.current[i] = el)}
          aria-current={active === i ? "page" : undefined}
          onClick={() => {
            setActive(i);
            clickLock.current = true;
            clearTimeout(lockTimer.current);
            lockTimer.current = setTimeout(() => { clickLock.current = false; }, 800);
          }}
          style={{
            position: "relative",
            zIndex: 1,
            color: active === i ? (theme.isDark ? "#0b1026" : "#ffffff") : theme.textMuted,
            textDecoration: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: active === i ? 700 : 500,
            letterSpacing: "0.02em",
            padding: "9px 14px",
            borderRadius: 999,
            transition: "color 0.2s ease",
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function WorkAndGitHubSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const workItems = [
    { title: "Stack", body: "Python, FastAPI, React, SQL. Small services, clear boundaries.", detail: "I keep projects modular: API layer, business logic, and data access separated, with minimal dependencies." },
    { title: "Git", body: "Feature branches, small PRs, clear commits.", detail: "Small reviewable PRs, descriptive commits, and a self-review of my own diff before requesting review." },
    { title: "Tools", body: "VS Code, GitHub, Vercel, Jupyter.", detail: "Jupyter for exploration and quick experiments; Vercel for deploys; GitHub for version control and CI." },
    { title: "AI", body: "Claude Code / Copilot for scaffolding; I own every line.", detail: "AI speeds up scaffolding and refactors, but I read, test, and take responsibility for everything I ship." },
  ];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState(new Set());
  const [pushCountAnim, setPushCountAnim] = useState(0);
  const [contributions, setContributions] = useState(null);

  useEffect(() => {
    if (!data) return;
    const target = data.pushCount || 0;
    if (target === 0) { setPushCountAnim(0); return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    const id = setInterval(() => {
      cur = Math.min(target, cur + step);
      setPushCountAnim(cur);
      if (cur >= target) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [data]);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const user = "cdobby18";
        const [reposRes, eventsRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12`),
          fetch(`https://api.github.com/users/${user}/events/public?per_page=100`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`),
        ]);
        if (!reposRes.ok) throw new Error("repos fetch failed");
        const repos = await reposRes.json();
        const events = eventsRes.ok ? await eventsRes.json() : [];
        if (contribRes.ok) {
          const cj = await contribRes.json();
          if (alive) setContributions(cj);
        }
        const pushedEvents = Array.isArray(events) ? events.filter((e) => e.type === "PushEvent") : [];
        const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
        const recentPushes = pushedEvents.filter((e) => new Date(e.created_at).getTime() >= cutoff);
        const lastPush = repos.length ? repos[0].pushed_at : null;
        let latestCommit = null;
        if (pushedEvents.length) {
          const pe = pushedEvents[0];
          const commits = pe.payload?.commits || [];
          if (commits.length) latestCommit = { sha: commits[commits.length - 1].sha?.slice(0, 7), message: commits[commits.length - 1].message, repo: pe.repo?.name };
        }
        if (alive) {
          setData({ lastPush, repos: repos.slice(0, 6), latestCommit, pushCount: recentPushes.length });
        }
      } catch (e) {
        if (alive) setError("Couldn't load GitHub activity right now.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const timeAgo = (iso) => {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  return (
    <section id="work" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em" }}>04</span>
          <div style={{ width: 32, height: 1, background: COLORS.accentBorder }} />
          <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em" }}>Work & GitHub</span>
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(30px, 4.5vw, 46px)", color: COLORS.textPrimary, marginBottom: 24, fontWeight: 700 }}>Work & GitHub</h2>

        <div className="work-github-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Left: How I work */}
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: COLORS.textPrimary, fontWeight: 600, marginBottom: 12 }}>How I work</h3>
            <div className="work-items-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, perspective: 900 }}>
              {workItems.map((it, idx) => {
                const isFlipped = flipped.has(idx);
                return (
                  <div key={it.title}
                    onClick={() => setFlipped((prev) => { const n = new Set(prev); if (n.has(idx)) n.delete(idx); else n.add(idx); return n; })}
                    style={{ position: "relative", height: 110, cursor: "pointer", transformStyle: "preserve-3d", transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                    onMouseEnter={(e) => { if (!isFlipped) e.currentTarget.style.transform = "rotateY(0deg) translateY(-4px)"; }}
                    onMouseLeave={(e) => { if (!isFlipped) e.currentTarget.style.transform = "rotateY(0deg) translateY(0)"; }}
                  >
                    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", boxShadow: COLORS.isDark ? "0 4px 12px rgba(0,0,0,0.25)" : "0 4px 12px rgba(15,23,42,0.06)", transition: "border-color 0.2s ease, box-shadow 0.2s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.boxShadow = `0 8px 20px ${COLORS.accent}22`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = COLORS.isDark ? "0 4px 12px rgba(0,0,0,0.25)" : "0 4px 12px rgba(15,23,42,0.06)"; }}>
                      <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>{it.title}</h4>
                      <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.6 }}>{it.body}</p>
                      <span style={{ position: "absolute", bottom: 8, right: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: COLORS.textMuted }}>tap to flip ↻</span>
                    </div>
                    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: COLORS.isDark ? "rgba(15,23,42,0.95)" : "rgba(248,250,252,0.95)", border: `1px solid ${COLORS.accentBorder}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center" }}>
                      <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 11, lineHeight: 1.6 }}>{it.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: GitHub activity */}
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: COLORS.textPrimary, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 0 0 rgba(52,211,153,0.6)", animation: "ghPulse 1.8s infinite" }} />
              GitHub activity
            </h3>
            <div style={{ background: COLORS.isDark ? "linear-gradient(180deg, rgba(15,23,42,0.7), rgba(10,16,32,0.7))" : "linear-gradient(180deg, #ffffff, #f8fafc)", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 12, overflowX: "auto", boxShadow: COLORS.isDark ? "0 12px 30px rgba(0,0,0,0.25)" : "0 12px 30px rgba(15,23,42,0.06)", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = COLORS.isDark ? "0 16px 40px rgba(0,0,0,0.35)" : "0 16px 40px rgba(15,23,42,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = COLORS.isDark ? "0 12px 30px rgba(0,0,0,0.25)" : "0 12px 30px rgba(15,23,42,0.06)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>Contribution graph · Mar → now</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em" }}>
                  <span>Less</span>
                  {[0.15, 0.35, 0.6, 0.85].map((o, i) => (
                    <span key={i} style={{ width: 10, height: 10, borderRadius: 2, background: `rgba(34,197,94,${o})`, display: "inline-block" }} />
                  ))}
                  <span>More</span>
                </span>
              </div>
              {contributions?.contributions ? (() => {
                const dark = COLORS.isDark;
                const palette = dark
                  ? ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
                  : ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
                const now = new Date();
                const cutoff = new Date(now.getFullYear(), 2, 1); // March 1
                if (cutoff > now) cutoff.setFullYear(cutoff.getFullYear() - 1);
                const cutoffStr = cutoff.toISOString().slice(0, 10);
                const days = contributions.contributions.filter((d) => d.date >= cutoffStr);
                // build weeks (Sun-Sat)
                const weeks = [];
                let current = [];
                // pad first week
                if (days.length) {
                  const firstDow = new Date(days[0].date + "T00:00:00").getDay();
                  for (let i = 0; i < firstDow; i++) current.push(null);
                }
                for (const d of days) {
                  current.push(d);
                  if (current.length === 7) { weeks.push(current); current = []; }
                }
                if (current.length) {
                  while (current.length < 7) current.push(null);
                  weeks.push(current);
                }
                return (
                  <div style={{ overflowX: "auto", paddingBottom: 4 }}>
                    <div style={{ display: "flex", gap: 3, minWidth: "max-content" }}>
                      {weeks.map((week, wi) => (
                        <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          {week.map((day, di) => {
                            if (!day) return <div key={di} style={{ width: 11, height: 11 }} />;
                            const lvl = Math.min(4, Math.max(0, day.level || 0));
                            return (
                              <div
                                key={di}
                                title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                                style={{
                                  width: 11,
                                  height: 11,
                                  borderRadius: 2,
                                  background: palette[lvl],
                                  cursor: "pointer",
                                  transition: "transform 0.1s ease",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.3)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })() : (
                <div style={{ overflow: "hidden", borderRadius: 6 }}>
                  <img
                    src="https://ghchart.rshah.org/cdobby18"
                    alt="GitHub contribution graph for cdobby18"
                    style={{ width: "100%", display: "block", borderRadius: 6 }}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            {loading && <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12, fontStyle: "italic" }}>Loading…</p>}
            {error && <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12, fontStyle: "italic" }}>{error}</p>}
            {data && (
              <>
                {data.lastPush && (
                  <p style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, marginBottom: 8, letterSpacing: "0.04em" }}>
                    last push {timeAgo(data.lastPush)}
                    {data.pushCount > 0 && <span> · {pushCountAnim} pushes / 14d</span>}
                  </p>
                )}
                {data.latestCommit && (
                  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 4, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>{data.latestCommit.repo}</span>
                      <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>{data.latestCommit.sha}</span>
                    </div>
                    <p style={{ color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.5, margin: 0 }}>{data.latestCommit.message}</p>
                  </div>
                )}
                <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; }}>
                  more on github <span style={{ transition: "transform 0.2s ease" }}>→</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ghPulse {
          0% { box-shadow: 0 0 0 0 rgba(52,211,153,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(52,211,153,0); }
          100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
        }
        @media (max-width: 768px) {
          .work-github-grid { grid-template-columns: 1fr !important; }
          .work-items-grid { grid-template-columns: 1fr !important; }
          .rag-sources-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

const CERTIFICATIONS = [
  { name: "Introduction to Model Context Protocol", issuer: "Anthropic Education", date: "May 2026", url: "https://verify.skilljar.com/c/remzvordp5e7", image: "/MCP.png" },
  { name: "The AI Engineer Bootcamp", issuer: "Udemy", date: "Completed", url: "https://www.udemy.com/certificate/UC-ce6b30a4-237b-469c-9f60-0039ab82713f/", image: "/UDEMY.png" },
  { name: "IT Specialist - Python", issuer: "Certiport (Pearson VUE)", date: "Verified", url: "https://www.credly.com/badges/2d0c3b41-ee3f-4616-af62-2b3a55be3890/public_url", image: "https://images.credly.com/images/3c4602d8-832e-4a24-b42d-00359ce746f7/linkedin_thumb_ITS-Badges_Python_1200px.png" },
  { name: "Python Essentials 1", issuer: "Cisco (OpenEDG Python Institute)", date: "Verified", url: "https://www.credly.com/badges/c495ce54-6909-4812-bfee-6303486b3c9a/public_url", image: "https://images.credly.com/images/68c0b94d-f6ac-40b1-a0e0-921439eb092e/linkedin_thumb_image.png" },
  { name: "Artificial Intelligence Fundamentals", issuer: "IBM SkillsBuild", date: "Verified", url: "https://www.credly.com/badges/8ef3efc3-7e58-4ef2-b349-32f818814c5b/public_url", image: "https://images.credly.com/images/82b908e1-fdcd-4785-9d32-97f11ccbcf08/linkedin_thumb_image.png" },
  { name: "Introduction to Modern AI", issuer: "Cisco", date: "Verified", url: "https://www.credly.com/badges/fc10a9c7-172e-47b7-b817-f1116e8b9846/public_url", image: "https://images.credly.com/images/e2d12302-10f9-40d4-8ff1-066a7008b61d/linkedin_thumb_blob" },
];

function CertificationsSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="certs" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em" }}>06</span>
          <div style={{ width: 32, height: 1, background: COLORS.accentBorder }} />
          <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em" }}>Certifications</span>
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(30px, 4.5vw, 46px)", color: COLORS.textPrimary, marginBottom: 12, fontWeight: 700 }}>Certifications</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 720, lineHeight: 1.85, fontFamily: "Inter, sans-serif", marginBottom: 28 }}>
          Verified credentials from Anthropic, Cisco, IBM, Certiport, and Udemy.
        </p>
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 18, background: COLORS.isDark ? "linear-gradient(180deg, rgba(17,24,39,0.6), rgba(10,16,32,0.6))" : "linear-gradient(180deg, #ffffff, #f8fafc)", padding: "20px 22px", boxShadow: COLORS.isDark ? "0 20px 50px rgba(0,0,0,0.25)" : "0 20px 50px rgba(15,23,42,0.06)" }}>
          <CertAccordion items={CERTIFICATIONS} height={400} colors={COLORS} />
        </div>
      </div>
    </section>
  );
}

export default function OnePiece() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("op-theme") !== "light"; } catch { return true; }
  });

  const theme = isDark ? DARK : LIGHT;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.background = theme.bg;
    document.body.style.background = theme.bg;
    document.body.style.color = theme.textPrimary;
    try { localStorage.setItem("op-theme", isDark ? "dark" : "light"); } catch {}
  }, [theme, isDark]);

  const toggleTheme = () => setIsDark(d => !d);

  return (
    <ThemeCtx.Provider value={theme}>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 88px; }
        #root { width: 100% !important; max-width: 100% !important; text-align: left; }
        body { overflow-x: hidden; transition: background 0.3s ease, color 0.3s ease; font-kerning: normal; text-rendering: optimizeLegibility; }
        button { font-family: inherit; }
        a:focus-visible, button:focus-visible { outline: 2px solid ${theme.accent}; outline-offset: 3px; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
          html { scroll-behavior: auto; }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        .op-nav-links { display: flex; gap: 22px; align-items: center; }
        .op-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
        #heroName .glyph { color: ${theme.accent} !important; }
        main > section:not(#hero), footer { max-width: 1120px; margin-left: auto; margin-right: auto; }
        main > section { scroll-margin-top: 88px; }
        @media (max-width: 1080px) {
          .op-nav-links { display: none !important; }
          .op-hamburger { display: flex !important; align-items: center; justify-content: center; }
          #stack > div:last-child { grid-template-columns: 1fr !important; }
          #experience article { grid-template-columns: 1fr !important; gap: 14px !important; }
          .hero-grid { grid-template-columns: 1fr !important; justify-items: center; }
          #projects article > div { grid-template-columns: 1fr !important; }
          #projects > div:nth-of-type(2) { grid-template-columns: 1fr !important; }
          .project-swap-layout { grid-template-columns: 1fr !important; }
          .project-swap-layout > div:first-child { height: 360px !important; }
          #contact > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          [data-cols] { flex-direction: column !important; }
          [data-cols] > div:last-child { flex: 0 0 auto !important; width: 100%; }
        }
        @media (max-width: 640px) {
          main > section:not(#hero) { padding-top: 64px !important; padding-bottom: 64px !important; }
          /* Contact: stack buttons full-width, keep email readable */
          #contact .copy-email-btn { width: 100% !important; justify-content: space-between !important; min-width: 0; }
          #contact .copy-email-btn span:first-child { font-size: 12.5px !important; word-break: break-all; }
          #contact .resume-btn { width: 100% !important; justify-content: center; }
          /* Skill tooltips: shrink vs viewport, keep inside screen */
          .skill-tip { width: min(250px, 74vw) !important; }
          #contact h2 { letter-spacing: -0.03em; }
        }
        @media (max-width: 480px) {
          .op-avatar { width: 108px !important; height: 108px !important; }
          /* tighter rhythm for small phones */
          #contact { padding-left: 20px !important; padding-right: 20px !important; }
          #contact .contact-card { padding: 11px !important; }
        }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 clamp(24px, 6vw, 96px)", background: scrolled || menuOpen ? theme.navBg : "transparent", backdropFilter: scrolled || menuOpen ? "blur(18px)" : "none", borderBottom: scrolled || menuOpen ? `1px solid ${theme.border}` : "1px solid transparent", transition: "all 0.3s ease" }}>
        <a href="#hero" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: theme.textPrimary, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 999, background: theme.accent, color: theme.isDark ? "#0b1026" : "#ffffff", fontSize: 12, boxShadow: `0 10px 20px ${theme.accent}44` }}>CJ</span>
          <span>Carl Joshua<span style={{ color: theme.accent }}>.</span></span>
        </a>

        <div className="op-nav-links" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <GlidingNavLinks links={NAV_LINKS} theme={theme} />
          <button onClick={toggleTheme} aria-label="Toggle theme"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 999, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer", transition: "all 0.2s", outline: "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggleTheme} aria-label="Toggle theme" className="op-hamburger"
            style={{ display: "none", alignItems: "center", justifyContent: "center", padding: "7px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "none", color: theme.textMuted, cursor: "pointer", outline: "none" }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="op-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen
                ? <><line x1="4" y1="4" x2="18" y2="18" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /><line x1="18" y1="4" x2="4" y2="18" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /></>
                : <><line x1="3" y1="6" x2="19" y2="6" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="11" x2="19" y2="11" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="16" x2="19" y2="16" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /></>
              }
            </svg>
          </button>
        </div>
      </nav>

      <div style={{ display: "flex", flexDirection: "column", position: "fixed", top: 68, left: 0, right: 0, background: theme.mobileMenuBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${theme.border}`, padding: "20px clamp(24px,6vw,96px)", zIndex: 99, transform: menuOpen ? "translateY(0)" : "translateY(-120%)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "transform 0.3s ease, opacity 0.25s ease" }}>
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => setMenuOpen(false)}
              style={{ color: theme.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, padding: "14px 0", borderBottom: `1px solid ${theme.stripBorder}` }}>
              {link.label}
            </a>
          ))}
          <div style={{ paddingTop: 16 }}>
            <button onClick={() => { toggleTheme(); setMenuOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.chipBg, color: theme.textSecondary, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, outline: "none" }}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              <span>Switch to {isDark ? "Light" : "Dark"} Mode</span>
            </button>
          </div>
        </div>

      <main>
        <Hero />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <WorkAndGitHubSection />
        <StackSection />
        <CertificationsSection />
        <ContactSection />
      </main>

      <footer style={{ padding: "24px clamp(24px, 6vw, 96px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderTop: `1px solid ${theme.border}` }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: theme.textMuted }}>© {new Date().getFullYear()} Carl Joshua Coloma</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
            <path d="M4 15c2-5 6-7 8-7s6 2 8 7" />
            <ellipse cx="12" cy="16" rx="8" ry="2.5" />
            <path d="M7 14.5v2M10 14v2.5M14 14v2.5M17 14.5v2" />
          </svg>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: theme.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>AI Engineer</span>
        </div>
      </footer>

      <BackToTop />
    </ThemeCtx.Provider>
  );
}
