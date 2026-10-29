import { useState, useEffect, useRef, createContext, useContext } from "react";
import RagDemo from "./demo/RagDemo";

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
  { label: "About",      id: "about"      },
  { label: "Skills",     id: "stack"      },
  { label: "Experience", id: "experience" },
  { label: "Projects",   id: "projects"   },
  { label: "Contact",    id: "contact"    },
];

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const SKILL_GROUPS = [
  {
    label: "Languages",
    skills: ["Python", "JavaScript"],
  },
  {
    label: "AI & ML",
    skills: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "LangChain", "Transformers", "RAG", "Prompt Engineering", "LLM APIs", "Agentic Workflows"],
  },
  {
    label: "Data & ETL (Learning)",
    skills: ["SQL", "Databricks", "ETL", "dbt", "Airflow", "Snowflake", "PySpark"],
  },
  {
    label: "Frameworks & Tools",
    skills: ["FastAPI", "Flask", "React", "Streamlit", "RESTful APIs", "Docker", "Git", "VS Code", "Claude Code", "Hermes Agent", "Obsidian", "Exa AI", "Qdrant"],
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
    desc: "AI biomechanics analyzer for powerlifting built with YOLOv8, Kalman Filtering, and SVM classification. Tracks joint positions, stabilizes motion across frames, and classifies squat, bench, and deadlift mechanics in real time — delivering automated lift assessment and performance feedback on mobile hardware.",
    metric: "Mobile Application · Overall Best Thesis",
    tags: ["Python", "YOLOv8", "Kalman Filtering", "SVM", "MoveNet"],
    accent: "#22d3ee",
    featured: true,
    img: "/Powerlift.webp",
    link: "https://github.com/cdobby18/Powerlift",
  },
    {
    title: "Sunny AI",
    type: "RAG-Built Mentor",
    desc: "A guided platform for aspiring AI engineers starting from zero. No fluff, no shortcuts — RAG-powered mentorship that meets you at the bottom and builds you up through fundamentals, production skills, and real-world readiness.",
    metric: "React · Python · LLMs · RAG · LangChain",
    tags: ["React", "Python", "LLMs", "RAG", "FastAPI"],
    accent: "#0ea5e9",
    img: "/sunny.png",
  },
    {
    title: "AI Engineering Roadmap",
    type: "Learning Journal",
    desc: "A self-study curriculum documenting my path into AI engineering — tutorials completed, core ML/LLM concepts learned, and small exercises built along the way, tracked publicly from fundamentals through applied projects.",
    metric: "Python · Self-Study · Documentation",
    tags: ["Python", "Self-Study", "LLMs", "RAG", "Documentation"],
    accent: "#a78bfa",
    img: "/Python.webp",
    link: "https://github.com/cdobby18/AI-Roadmap",
  },
  {
    title: "Resume Analyzer",
    type: "Natural Language Processing",
    desc: "Resume parsing pipeline using spaCy NER and Transformer-based semantic matching to extract skills, experience, and role fit. Processes 100+ documents per minute with structured JSON output ready for downstream ranking or ATS integration.",
    metric: "Python · spaCy NER + Semantic Match",
    tags: ["NLP", "spaCy", "Transformers", "FastAPI"],
    accent: "#38bdf8",
    img: "/Resume.webp",
    link: "https://github.com/cdobby18/resume_analyzer",
  },
  {
    title: "Document Summarizer",
    type: "Transformer Pipeline",
    desc: "Abstractive summarization system for multi-page PDFs using BART and T5. Handles long-document chunking strategies to stay within model context limits, then merges section-level summaries into a coherent output — outperforming extractive baselines on readability.",
    metric: "Python · NLP · BART",
    tags: ["BART", "T5", "HuggingFace", "PDF"],
    accent: "#34d399",
    img: "/Summarize.webp",
    link: "https://github.com/cdobby18/ai-summarizer",
  },
];

const CERTIFICATIONS = [];

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

function SkillPill({ name, delay = 0, muted = false }) {
  const COLORS = useColors();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 14px",
        borderRadius: 999,
        background: "transparent",
        border: `1px solid ${COLORS.chipBorder}`,
        color: muted ? COLORS.textMuted : COLORS.textSecondary,
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.01em",
        transition: "all 0.2s ease",
        cursor: "default",
        animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        opacity: muted ? 0.8 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLORS.accentBorder;
        e.currentTarget.style.color = muted ? COLORS.textSecondary : COLORS.textPrimary;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = COLORS.chipBorder;
        e.currentTarget.style.color = muted ? COLORS.textMuted : COLORS.textSecondary;
      }}
    >
      {name}
    </div>
  );
}

function Hero() {
  const COLORS = useColors();

  return (
    <section id="hero" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "88px clamp(24px, 6vw, 96px) 80px", position: "relative", overflow: "hidden" }}>

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

      <div style={{ maxWidth: 880, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>

        {/* Profile photo */}
        <div style={{ position: "relative", marginBottom: 22, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both" }}>
          <div className="op-avatar" style={{ width: 132, height: 132, borderRadius: "50%", overflow: "hidden", border: `1px solid ${COLORS.accentBorder}`, boxShadow: COLORS.isDark ? "0 40px 80px rgba(245,158,11,0.14)" : "0 40px 80px rgba(180,83,9,0.12)", flexShrink: 0 }}>
            <img src="/pic.jpeg" alt="Carl Joshua Coloma" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
          </div>
          <div style={{ position: "absolute", bottom: 6, right: -4, width: 28, height: 28, borderRadius: "50%", background: COLORS.surface, border: `1px solid ${COLORS.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
              <path d="M4 15c2-5 6-7 8-7s6 2 8 7" />
              <ellipse cx="12" cy="16" rx="8" ry="2.5" />
              <path d="M7 14.5v2M10 14v2.5M14 14v2.5M17 14.5v2" />
            </svg>
          </div>
        </div>

        {/* Status badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: `1px solid ${COLORS.accentBorder}`, borderRadius: 999, background: COLORS.accentSoft, marginBottom: 24, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.12s both", position: "relative" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 0 6px ${COLORS.accentSoft}` }} />
          <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>Junior AI Engineer</span>
        </div>

        {/* Name */}
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(42px, 8vw, 84px)", lineHeight: 0.98, letterSpacing: "-0.05em", color: COLORS.textPrimary, marginBottom: 16, fontWeight: 700, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
          Carl Joshua Coloma
        </h1>

        {/* Tagline */}
        <p style={{ maxWidth: 720, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.9, marginBottom: 36, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s both" }}>
          AI Engineer focused on building reliable <span style={{ color: COLORS.textPrimary }}>agentic workflows, RAG systems, and production-ready ML</span> with Python.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 16, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.44s both" }}>
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

        <a href="/cv-coloma.pdf" download="cv-coloma.pdf"
          style={{ color: COLORS.textMuted, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, marginBottom: 40, transition: "color 0.2s ease", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
          onMouseEnter={e => { e.currentTarget.style.color = COLORS.textPrimary; }}
          onMouseLeave={e => { e.currentTarget.style.color = COLORS.textMuted; }}>
          Download resume →
        </a>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)` }} />
    </section>
  );
}

function AboutSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="about" ref={ref} style={{ padding: "80px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="01" text="About" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(30px, 4.5vw, 46px)", color: COLORS.textPrimary, marginBottom: 36, fontWeight: 700 }}>About Me</h2>
      <div data-cols="true" style={{ display: "flex", gap: 64, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85, marginBottom: 18 }}>
            Hey, I'm CJ — an aspiring AI engineer and Computer Science student from the Philippines, graduating from FEU Institute of Technology in 2026. I care about bridging research-grade ML with real-world deployment constraints — building systems that are reliable, observable, and maintainable beyond the notebook.
          </p>
          <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85, marginBottom: 18 }}>
            I'm currently working as a Backend AI Engineer Intern at FlyRank AI, where I build LLM-powered content generation and semantic ranking pipelines. Previously, as an AI QA Intern at SoFi AI Tech Solutions, I tested conversational AI chatbots for hallucination and reliability issues, designing adversarial prompt suites to catch failure modes before they reached users. My focus is on LLM evaluation, RAG architectures, and production observability.
          </p>
          <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85 }}>
            My undergraduate thesis — <span style={{ color: COLORS.textPrimary, fontWeight: 500 }}>Powerlift</span> — earned the Overall Best Thesis Award in the Computer Vision category (November 2025). It's an AI biomechanics analyzer for powerlifting built with YOLOv8 + Kalman Filtering, running at 30+ FPS on mobile.
          </p>
          <div style={{ marginTop: 36, borderTop: `1px solid ${COLORS.stripBorder}` }}>
            {[
              { label: "Current Role", value: "Backend AI Engineer Intern · FlyRank AI" },
              { label: "Location",     value: "Philippines" },
              { label: "Focus",        value: "Agentic AI · LLMs · RAG" },
              { label: "Education",    value: "BS Computer Science · FEU Tech · 2026" },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", gap: 24, alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.stripBorder}` : "none" }}>
                <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0, minWidth: 108 }}>{row.label}</span>
                <span style={{ color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 14 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: "0 0 280px", display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { num: "01", label: "Overall Best Thesis", sub: "Computer Vision · Nov 2025" },
            { num: "02", label: "3 Internships",        sub: "Lamina · SoFi · FlyRank AI" },
            { num: "03", label: "5 Projects",           sub: "CV · NLP · LLMs · RAG" },
          ].map((item) => (
            <div key={item.num} style={{ display: "flex", alignItems: "flex-start", gap: 18, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, opacity: 0.65, flexShrink: 0, paddingTop: 2 }}>{item.num}</span>
              <div>
                <p style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
                <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.5 }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="stack" ref={ref} style={{ padding: "88px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Skills</span>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>Technical Skills</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 640, lineHeight: 1.9, fontFamily: "Inter, sans-serif" }}>
          A focused toolkit for building agentic AI systems, retrieval pipelines, and reliable backend services.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 18 }}>
        {SKILL_GROUPS.map((group, gi) => (
          <div key={group.label} style={{ gridColumn: "span 6", border: `1px solid ${COLORS.border}`, borderRadius: 14, background: COLORS.surface, padding: "26px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600 }}>{group.label}</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>0{gi + 1}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {group.skills.map((skill, si) => (
                <SkillPill key={skill} name={skill} delay={(gi * 4 + si) * 35} muted={group.label.includes("Learning")} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const DOT_THRESHOLDS = EXPERIENCE.map((_, i) => 0.08 + i * (0.66 / Math.max(EXPERIENCE.length - 1, 1)));

function ExperienceSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();

  return (
    <section id="experience" ref={ref} style={{ padding: "88px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Experience</span>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>Experience</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 640, lineHeight: 1.9, fontFamily: "Inter, sans-serif" }}>
          Hands-on experience building and evaluating AI systems in production-focused environments.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${COLORS.border}` }}>
        {EXPERIENCE.map((exp, i) => (
          <article key={i} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, padding: "30px 0", borderBottom: `1px solid ${COLORS.border}`, animation: visible ? `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms both` : "none" }}>
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
  const featured = PROJECTS.find((p) => p.featured);
  const secondary = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" ref={ref} style={{ padding: "88px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Selected Work</span>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>Projects</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 640, lineHeight: 1.9, fontFamily: "Inter, sans-serif" }}>
          Applied AI systems focused on computer vision, NLP, and agentic workflows with an emphasis on usability and deployment.
        </p>
      </div>

      {featured && (
        <article style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, overflow: "hidden", marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 0 }}>
            {featured.img && (
              <div style={{ position: "relative", minHeight: 260 }}>
                <img src={featured.img} alt={featured.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Overall Best Thesis</span>
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20, padding: "28px 32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>{featured.type}</span>
                  {featured.link && (
                    <a href={featured.link} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.textMuted, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                      View on GitHub →
                    </a>
                  )}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(22px, 3vw, 30px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>{featured.title}</h3>
                <p style={{ color: COLORS.textSecondary, lineHeight: 1.85, fontFamily: "Inter, sans-serif", fontSize: 14 }}>{featured.desc}</p>
                <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13 }}>{featured.metric}</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {featured.tags.map((tag) => (
                  <span key={tag} style={{ padding: "6px 10px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 12 }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </article>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18 }}>
        {secondary.map((project, i) => {
          const content = (
            <article style={{ height: "100%", display: "flex", flexDirection: "column", border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, overflow: "hidden", transition: "border-color 0.2s ease", animation: visible ? `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both` : "none" }}>
              {project.img && (
                <div style={{ position: "relative", height: 190 }}>
                  <img src={project.img} alt={project.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "26px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>{project.type}</span>
                  {project.link ? (
                    <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13 }}>GitHub →</span>
                  ) : (
                    <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13 }}>In development</span>
                  )}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: COLORS.textPrimary, fontWeight: 600 }}>{project.title}</h3>
                <p style={{ color: COLORS.textSecondary, lineHeight: 1.9, fontFamily: "Inter, sans-serif", fontSize: 14 }}>{project.desc}</p>
                <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13 }}>{project.metric}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{ padding: "6px 10px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 12 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          );

          if (project.link) {
            return (
              <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }} onMouseEnter={(e) => { e.currentTarget.firstChild.style.borderColor = COLORS.accentBorder; }} onMouseLeave={(e) => { e.currentTarget.firstChild.style.borderColor = COLORS.border; }}>
                {content}
              </a>
            );
          }
          return <div key={project.title}>{content}</div>;
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <a href="#demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: COLORS.textMuted, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
          Try the mini RAG demo →
        </a>
      </div>
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
  return (
    <section id="contact" ref={ref} style={{ padding: "88px clamp(24px, 6vw, 96px) 80px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 24, alignItems: "center" }}>
        <div style={{ gridColumn: "span 7", display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Contact</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(34px, 6vw, 64px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.98 }}>
            Let's build something reliable.
          </h2>
          <p style={{ color: COLORS.textSecondary, maxWidth: 560, lineHeight: 1.9, fontFamily: "Inter, sans-serif", fontSize: 16 }}>
            Open to AI engineering opportunities, agentic system collaborations, and production ML work.
          </p>
        </div>
        <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
          <a href="mailto:carljoshuamcoloma@gmail.com"
            style={{ textDecoration: "none", color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, border: `1px solid ${COLORS.outlineBorder}`, borderRadius: 10, padding: "12px 20px", background: "transparent", transition: "all 0.2s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; }}>
            carljoshuamcoloma@gmail.com
          </a>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              style={{ border: `1px solid ${COLORS.outlineBorder}`, borderRadius: 999, padding: "9px 16px", color: COLORS.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.textPrimary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; }}>
              GitHub
            </a>
            <a href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ border: `1px solid ${COLORS.outlineBorder}`, borderRadius: 999, padding: "9px 16px", color: COLORS.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.textPrimary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; }}>
              LinkedIn
            </a>
          </div>
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
        setActive(links.length - 1);
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
    <div ref={containerRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: 28 }}>
      <span
        style={{
          position: "absolute",
          bottom: -4,
          height: 2,
          borderRadius: 2,
          background: theme.accent,
          boxShadow: `0 0 8px ${theme.accent}99`,
          left: glider.left,
          width: glider.width,
          transition: "left .4s cubic-bezier(.65,0,.35,1), width .4s cubic-bezier(.65,0,.35,1)",
          pointerEvents: "none",
        }}
      />
      {links.map((link, i) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          ref={el => (refs.current[i] = el)}
          aria-current={active === i ? "page" : undefined}
          onClick={() => {
            setActive(i);
            clickLock.current = true;
            clearTimeout(lockTimer.current);
            lockTimer.current = setTimeout(() => { clickLock.current = false; }, 800);
          }}
          style={{
            color: active === i ? theme.textPrimary : theme.textMuted,
            textDecoration: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: active === i ? 600 : 500,
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
        main > section:not(#hero), footer { max-width: 1120px; margin-left: auto; margin-right: auto; }
        main > section { scroll-margin-top: 88px; }
        @media (max-width: 1080px) {
          .op-nav-links { display: none !important; }
          .op-hamburger { display: flex !important; align-items: center; justify-content: center; }
          #stack > div:last-child { grid-template-columns: 1fr !important; }
          #experience article { grid-template-columns: 1fr !important; gap: 14px !important; }
          #projects article > div { grid-template-columns: 1fr !important; }
          #projects > div:nth-of-type(2) { grid-template-columns: 1fr !important; }
          #contact > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          [data-cols] { flex-direction: column !important; }
          [data-cols] > div:last-child { flex: 0 0 auto !important; width: 100%; }
        }
        @media (max-width: 640px) {
          main > section:not(#hero) { padding-top: 64px !important; padding-bottom: 64px !important; }
        }
        @media (max-width: 480px) {
          .op-avatar { width: 108px !important; height: 108px !important; }
        }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 clamp(24px, 6vw, 96px)", background: scrolled || menuOpen ? theme.navBg : "transparent", backdropFilter: scrolled || menuOpen ? "blur(18px)" : "none", borderBottom: scrolled || menuOpen ? `1px solid ${theme.border}` : "1px solid transparent", transition: "all 0.3s ease" }}>
        <a href="#hero" style={{ color: theme.textPrimary, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Carl Joshua Coloma
        </a>

        <div className="op-nav-links">
          <GlidingNavLinks links={NAV_LINKS} theme={theme} />
          <a href="/blog.html" style={{ color: theme.textMuted, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13 }}>Blog</a>
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

      {menuOpen && (
        <div style={{ display: "flex", flexDirection: "column", position: "fixed", top: 68, left: 0, right: 0, background: theme.mobileMenuBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${theme.border}`, padding: "20px clamp(24px,6vw,96px)", zIndex: 99 }}>
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => setMenuOpen(false)}
              style={{ color: theme.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, padding: "14px 0", borderBottom: `1px solid ${theme.stripBorder}` }}>
              {link.label}
            </a>
          ))}
          <a href="/blog.html" onClick={() => setMenuOpen(false)}
            style={{ color: theme.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, padding: "14px 0", borderBottom: `1px solid ${theme.stripBorder}` }}>
            Blog
          </a>
          <div style={{ paddingTop: 16 }}>
            <button onClick={() => { toggleTheme(); setMenuOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.chipBg, color: theme.textSecondary, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, outline: "none" }}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              <span>Switch to {isDark ? "Light" : "Dark"} Mode</span>
            </button>
          </div>
        </div>
      )}

      <main>
        <Hero />
        <AboutSection />
        <StackSection />
        <ExperienceSection />
        <ProjectsSection />
        <RagDemo />
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
