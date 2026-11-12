import { useState, useEffect, useRef, createContext, useContext } from "react";
import RagDemo from "./demo/RagDemo";
import CardSwap from "./CardSwap";
import CodeDemo from "./CodeDemo";
import Architecture from "./Architecture";
import { playHoverSound, playClickSound } from "./sound";

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
        playHoverSound();
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

// Signature effect: a dashed "sea route" fixed under the nav. Your voyage inks itself
// in as you read; island markers mark each section, a red boat rides the ink edge.
function VoyageBar() {
  const COLORS = useColors();
  const [progress, setProgress] = useState(0);
  const [marks, setMarks] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const IDS = ["about", "experience", "projects", "work", "stack", "certs", "contact"];
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      setVisible(window.scrollY > 400);
      if (max > 0) {
        setMarks(
          IDS.map((id) => {
            const el = document.getElementById(id);
            if (!el) return null;
            return Math.min(1, Math.max(0, (el.offsetTop - window.innerHeight * 0.5) / max));
          }).filter((v) => v !== null)
        );
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const ink = COLORS.textPrimary;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 72,
        left: 0,
        right: 0,
        height: 22,
        zIndex: 90,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div style={{ position: "absolute", left: "clamp(24px, 6vw, 96px)", right: "clamp(24px, 6vw, 96px)", top: 10 }}>
        {/* dashed route + solid inked progress */}
        <div style={{ borderTop: `2px dashed ${COLORS.chipBorder}` }} />
        <div style={{ position: "absolute", top: -2, left: 0, width: `${progress * 100}%`, borderTop: `2px solid ${ink}`, transition: "width 0.1s linear" }} />
        {/* island markers */}
        {marks.map((m, i) => {
          const passed = progress >= m;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: -5,
                left: `calc(${m * 100}% - 5px)`,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: passed ? ink : COLORS.bg,
                border: `2px solid ${ink}`,
                transition: "background 0.2s ease",
              }}
            />
          );
        })}
        {/* the boat, riding the ink edge */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          style={{ position: "absolute", top: -10, left: `calc(${progress * 100}% - 10px)`, transition: "left 0.1s linear" }}
        >
          <circle cx="12" cy="12" r="10" fill={COLORS.bg} opacity="0.9" />
          <path d="M4 15c2-5 6-7 8-7s6 2 8 7" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="12" cy="16" rx="8" ry="2.5" fill={COLORS.accent} />
        </svg>
      </div>
    </div>
  );
}

// "Night Ink" — an inverted manga page: paper-white linework on black
const DARK = {
  isDark: true,
  bg: "#111110",
  surface: "#191917",
  surfaceHigh: "#21211f",
  border: "rgba(237,232,220,0.16)",
  textPrimary: "#ede8dc",
  textSecondary: "#cfc9bc",
  textMuted: "#8f897d",
  accent: "#e03131",
  accentSoft: "rgba(224,49,49,0.14)",
  accentBorder: "rgba(224,49,49,0.45)",
  cyan: "#ede8dc",
  sky: "#cfc9bc",
  emerald: "#b4aea1",
  violet: "#8f897d",
  navBg: "rgba(17,17,16,0.92)",
  mobileMenuBg: "rgba(17,17,16,0.98)",
  chipBg: "rgba(237,232,220,0.07)",
  chipBorder: "rgba(237,232,220,0.2)",
  outlineBorder: "rgba(237,232,220,0.26)",
  outlineBg: "rgba(237,232,220,0.05)",
  divider: "rgba(237,232,220,0.22)",
  tagBg: "rgba(224,49,49,0.16)",
  stripBorder: "rgba(237,232,220,0.16)",
};

// "Day Paper" — ink on manga volume paper
const LIGHT = {
  isDark: false,
  bg: "#f3eee4",
  surface: "#faf7ef",
  surfaceHigh: "#ebe5d6",
  border: "rgba(23,21,18,0.18)",
  textPrimary: "#171512",
  textSecondary: "#3d3931",
  textMuted: "#6f6a5e",
  accent: "#c92a2a",
  accentSoft: "rgba(201,42,42,0.09)",
  accentBorder: "rgba(201,42,42,0.4)",
  cyan: "#171512",
  sky: "#3d3931",
  emerald: "#555047",
  violet: "#6f6a5e",
  navBg: "rgba(243,238,228,0.94)",
  mobileMenuBg: "rgba(243,238,228,0.98)",
  chipBg: "rgba(23,21,18,0.05)",
  chipBorder: "rgba(23,21,18,0.14)",
  outlineBorder: "rgba(23,21,18,0.22)",
  outlineBg: "rgba(23,21,18,0.03)",
  divider: "rgba(23,21,18,0.16)",
  tagBg: "rgba(201,42,42,0.12)",
  stripBorder: "rgba(23,21,18,0.14)",
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
    fruit: "Paramecia class",
    skills: ["Python", "JavaScript", "FastAPI", "Flask", "React", "Streamlit", "RESTful APIs"],
  },
  {
    label: "AI & ML",
    fruit: "Logia class",
    skills: ["OpenCV", "LangChain", "RAG", "GenAI", "Agentic AI", "Prompt Engineering", "Automation", "LLM APIs", "PyTorch", "HuggingFace"],
  },
  {
    label: "Data",
    fruit: "Zoan class",
    skills: ["SQL", "Databricks", "ETL", "dbt", "Airflow", "PySpark", "Pandas", "NumPy", "Snowflake", "Kafka", "Spark", "BigQuery"],
    muted: true,
  },
  {
    label: "Developer Tools",
    fruit: "Ancient Weapons",
    skills: ["Docker", "Git", "VS Code", "Claude Code", "Hermes Agent", "Obsidian", "Exa AI", "Qdrant", "PostgreSQL", "Jupyter", "Anaconda"],
  },
];

const EXPERIENCE = [
  {
    role: "Backend AI Engineer Intern",
    company: "FlyRank AI",
    period: "July 2026 – Present",
    island: "Island 01",
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
    island: "Island 02",
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
    island: "Island 03",
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
    accent: "#171512",
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
    accent: "#171512",
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
    accent: "#171512",
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
    accent: "#171512",
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

// Hybrid manga chapter tag: red brush chapter marker + professional English label.
// e.g. [ CHAPTER 2 ] ——— ABOUT — The Beginning
export function SectionLabel({ en, text, chapter }) {
  const COLORS = useColors();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap", rowGap: 6 }}>
      {en && (
        <span style={{ color: COLORS.accent, fontFamily: "var(--font-manga)", fontSize: 16, letterSpacing: "0.06em", whiteSpace: "nowrap", lineHeight: 1 }}>
          {en}
        </span>
      )}
      {en && <div style={{ width: 30, height: 2, background: COLORS.textPrimary, opacity: 0.65, flexShrink: 0 }} />}
      <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em" }}>
        {text}{chapter ? ` — ${chapter}` : ""}
      </span>
    </div>
  );
}

// Manga pacing: end-of-section link to the next chapter.
function NextChapter({ to, label, chapter }) {
  const COLORS = useColors();
  return (
    <a
      href={`#${to}`}
      className="next-chapter"
      onClick={(e) => { e.preventDefault(); playClickSound(); const el = document.getElementById(to); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}
      onMouseEnter={() => playHoverSound()}
      style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 12, marginTop: 36, textDecoration: "none" }}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.textMuted }}>Next Chapter</span>
      <span className="nc-text" style={{ fontFamily: "var(--font-manga)", fontSize: 17, letterSpacing: "0.02em" }}>
        {label}{chapter ? ` — ${chapter}` : ""} <span style={{ color: COLORS.accent }}>→</span>
      </span>
    </a>
  );
}

// Straw-hat jolly roger — original SVG redraw of the iconic composition:
// black flag field, paper skull with grin, straw hat with red band, crossed bones.
function MiniFlag({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* flag field */}
      <rect width="48" height="48" rx="7" fill="var(--ink)" />
      {/* crossed bones */}
      <g stroke="var(--paper)" strokeWidth="3" strokeLinecap="round">
        <path d="M9 38.5 39 26.5" />
        <path d="M9 26.5 39 38.5" />
      </g>
      <g fill="var(--paper)">
        <circle cx="8.2" cy="37.2" r="2.5" /><circle cx="10.6" cy="40.4" r="2.5" />
        <circle cx="39.8" cy="25.2" r="2.5" /><circle cx="37.4" cy="22" r="2.5" />
        <circle cx="8.2" cy="27.8" r="2.5" /><circle cx="10.6" cy="24.6" r="2.5" />
        <circle cx="39.8" cy="39.8" r="2.5" /><circle cx="37.4" cy="43" r="2.5" />
      </g>
      {/* skull */}
      <circle cx="24" cy="21" r="9.5" fill="var(--paper)" />
      <path d="M19 29.5h10v3a1.8 1.8 0 0 1-1.8 1.8h-6.4A1.8 1.8 0 0 1 19 32.5v-3z" fill="var(--paper)" />
      {/* eyes, nose, grin */}
      <circle cx="20" cy="21.5" r="2" fill="var(--ink)" />
      <circle cx="28" cy="21.5" r="2" fill="var(--ink)" />
      <path d="M24 24.6l1.5 2.8h-3z" fill="var(--ink)" />
      <path d="M20.6 27.6q3.4 2.2 6.8 0" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* straw hat: dome, red band, brim */}
      <path d="M15 12.6c0-5.6 4-8.6 9-8.6s9 3 9 8.6z" fill="var(--paper)" />
      <rect x="14.4" y="10.6" width="19.2" height="2.8" rx="1.4" fill="var(--red)" />
      <ellipse cx="24" cy="13.4" rx="12.6" ry="2.4" fill="var(--paper)" />
    </svg>
  );
}

// Manga SFX starburst — flat red, paper text, no glow. For the ONE highlight per section.
function SFX({ lines = [], size = 72, rotate = -8, style = {} }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        background: "var(--red)",
        color: "#f6f1e7",
        clipPath: "polygon(100% 50%, 86.7% 59.8%, 93.3% 75%, 76.9% 76.9%, 75% 93.3%, 59.8% 86.7%, 50% 100%, 40.2% 86.7%, 25% 93.3%, 23.1% 76.9%, 6.7% 75%, 13.3% 59.8%, 0% 50%, 13.3% 40.2%, 6.7% 25%, 23.1% 23.1%, 25% 6.7%, 40.2% 13.3%, 50% 0%, 59.8% 13.3%, 75% 6.7%, 76.9% 23.1%, 93.3% 25%, 86.7% 40.2%)",
        transform: `rotate(${rotate}deg)`,
        animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        ...style,
      }}
    >
      <span style={{ fontFamily: "var(--font-manga)", fontSize: Math.max(9, size * 0.15), lineHeight: 1.15, textAlign: "center", letterSpacing: "0.02em" }}>
        {lines.map((l, i) => (
          <span key={i} style={{ display: "block" }}>{l}</span>
        ))}
      </span>
    </span>
  );
}

// skill → "what I actually use it for" (one-liner, first person)
const SKILL_TIPS = {
  Python: "my daily driver — scripts, APIs, and data crunching",
  JavaScript: "the web side of my projects — React frontends & interactivity",
  FastAPI: "serving models & agents as HTTP APIs",
  Flask: "quick internal tools & lightweight prototypes",
  React: "this very portfolio + my project UIs",
  Streamlit: "fast ML demo apps without touching CSS",
  "RESTful APIs": "how all my services talk to each other",
  OpenCV: "computer vision prototyping with cv2",
  LangChain: "RAG & agent chains before writing my own",
  RAG: "grounding LLM answers in real documents",
  GenAI: "exploring generative use cases end-to-end",
  "Agentic AI": "task-executing agents with tools & memory",
  "Prompt Engineering": "getting reliable behavior out of models",
  Automation: "killing repetitive workflows with scripts",
  "LLM APIs": "OpenAI & Anthropic API integrations",
  PyTorch: "model experiments & fine-tuning basics",
  HuggingFace: "models, datasets & transformers in one place",
  SQL: "querying everything — my sharpest tool",
  Databricks: "lakehouse experiments on big data",
  ETL: "moving data from A to B reliably",
  dbt: "SQL-first transformations with tests",
  Airflow: "scheduling & orchestrating pipelines",
  PySpark: "big-data ops that outgrow Pandas",
  Pandas: "the swiss-army knife of exploration",
  NumPy: "vectorized math under everything",
  Snowflake: "cloud warehouse queries",
  Kafka: "event streams between services",
  Spark: "distributed compute across clusters",
  BigQuery: "warehouse analytics at scale",
  Docker: "so 'works on my machine' actually works",
  Git: "commit early, commit small",
  "VS Code": "home base for all my code",
  "Claude Code": "AI-assisted scaffolding — I own every line",
  "Hermes Agent": "agent orchestration experiments",
  Obsidian: "my second brain — notes, projects, ideas",
  "Exa AI": "semantic search experiments",
  Qdrant: "vector DB behind my RAG prototypes",
  PostgreSQL: "the default DB for serious projects",
  Jupyter: "where every experiment starts",
  Anaconda: "keeping messy Python environments tame",
};

function SkillPill({ name, delay = 0, muted = false }) {
  const COLORS = useColors();
  const [hover, setHover] = useState(false);
  const wrapRef = useRef(null);
  const tipRef = useRef(null);
  const [nudge, setNudge] = useState(0);
  const tip = SKILL_TIPS[name];

  // tap outside closes (mobile)
  useEffect(() => {
    if (!hover) return undefined;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setHover(false); };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [hover]);

  // clamp tooltips into the viewport even when hidden (visibility:hidden keeps layout,
  // so an un-clamped one near the right edge would create horizontal scroll on mobile)
  useEffect(() => {
    if (!tipRef.current) return undefined;
    const clamp = () => {
      const el = tipRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect(); // includes the previous nudge
      const pad = 10;
      let extra = 0;
      if (rect.left < pad) extra = pad - rect.left;
      else if (rect.right > window.innerWidth - pad) extra = (window.innerWidth - pad) - rect.right;
      setNudge(extra === 0 ? 0 : nudge + extra);
    };
    const raf = requestAnimationFrame(clamp);
    window.addEventListener("resize", clamp);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", clamp); };
  }, [tip]);

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", display: "inline-flex" }}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setHover(false); }}
      onPointerDown={(e) => { if (e.pointerType !== "mouse") { playHoverSound(); setHover((v) => !v); } }}
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
          playHoverSound();
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

      {tip && (
        <div
          ref={tipRef}
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: "50%",
            transform: `translateX(calc(-50% + ${nudge}px))`,
            zIndex: 60,
            pointerEvents: "none",
            visibility: hover ? "visible" : "hidden",
          }}
        >
          <div
            style={{
              width: "max-content",
              maxWidth: 240,
              padding: "8px 12px",
              borderRadius: 9,
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,0.25)",
              color: "#e2e8f0",
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              lineHeight: 1.5,
              boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
              opacity: hover ? 1 : 0,
              transform: hover ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.18s ease, transform 0.18s ease",
            }}
          >
            <span style={{ color: "#8ea0b5", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 3 }}>
              {name}
            </span>
            {tip}
            <span style={{ position: "absolute", bottom: -4.5, left: "50%", width: 9, height: 9, background: "#0f172a", borderRight: "1px solid rgba(148,163,184,0.25)", borderBottom: "1px solid rgba(148,163,184,0.25)", transform: "translateX(-50%) rotate(45deg)" }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Hero() {
  const COLORS = useColors();
  const [nameHover, setNameHover] = useState(false);
  const TYPE_LABELS = ["AI & Automation Engineer", "Software Engineer", "GenAI Engineer", "AI Quality Assurance"];
  const [typedLabel, setTypedLabel] = useState("");
  const [typeIndex, setTypeIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [flagDon, setFlagDon] = useState(false);
  const [zoomDon, setZoomDon] = useState(false);

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

  return (
    <section id="hero" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px clamp(24px, 6vw, 96px) 56px", position: "relative", overflow: "hidden" }}>

      {/* Manga speed lines converging behind the headline */}
      <div className={COLORS.isDark ? "speedlines-dark" : "speedlines"} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Screentone patch, fading like printed halftone shading */}
      <div
        className={COLORS.isDark ? "screentone-dark" : "screentone"}
        style={{ position: "absolute", bottom: "-8%", left: "-4%", width: 480, height: 480, transform: "rotate(6deg)", opacity: 0.6, pointerEvents: "none", maskImage: "radial-gradient(circle at 40% 60%, black 25%, transparent 68%)", WebkitMaskImage: "radial-gradient(circle at 40% 60%, black 25%, transparent 68%)" }}
      />

      {/* Compass rose watermark — click for a ZOOM! */}
      <svg width="150" height="150" viewBox="0 0 100 100" fill="none" onClick={() => { playClickSound(); setZoomDon(true); setTimeout(() => setZoomDon(false), 560); }} style={{ position: "absolute", bottom: 42, right: "clamp(24px, 6vw, 96px)", opacity: 0.14, cursor: "pointer" }} aria-hidden="true">
        <circle cx="50" cy="50" r="30" stroke={COLORS.textPrimary} strokeWidth="1" />
        <circle cx="50" cy="50" r="22" stroke={COLORS.textPrimary} strokeWidth="0.6" strokeDasharray="2 3" />
        <path d="M50 10 54 46 90 50 54 54 50 90 46 54 10 50 46 46z" fill={COLORS.textPrimary} opacity="0.85" />
        <text x="50" y="7" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill={COLORS.textPrimary}>N</text>
      </svg>

      {/* Chapter tag — cover page corner */}
      <div style={{ position: "absolute", top: 92, left: "clamp(24px, 6vw, 96px)", display: "flex", alignItems: "center", gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: COLORS.textMuted, textTransform: "uppercase" }}>
        <span style={{ width: 8, height: 8, background: COLORS.textPrimary, borderRadius: 2, flexShrink: 0 }} />
        Chapter 1 — Setting Sail
      </div>

      <div className="hero-grid" style={{ maxWidth: 1100, width: "100%", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "minmax(260px, 380px) minmax(0, 1fr)", alignItems: "center", gap: "clamp(32px, 5vw, 64px)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-40px" }}>
          <div style={{ position: "relative", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both" }}>
            {/* halftone backing sheet, offset like a misprinted panel */}
            <div
              className={COLORS.isDark ? "screentone-dark" : "screentone"}
              style={{ position: "absolute", top: -16, left: -16, width: "70%", height: "70%", transform: "rotate(-2deg)" }}
            />
            {/* Character poster — manga cover-page intro card (no bounty, that's for criminals) */}
            <div className="manga-panel" style={{ position: "relative", width: "min(100%, 340px)", overflow: "hidden", background: COLORS.surface, transform: "rotate(-1.2deg)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 12px", background: COLORS.textPrimary, color: COLORS.bg, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase" }}>
                <span>Character File</span>
                <span>No. <span style={{ color: COLORS.accent }}>001</span></span>
              </div>
              <div style={{ position: "relative", aspectRatio: "1 / 1" }}>
                <img src="/pic.jpeg" alt="Carl Joshua Coloma" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                {/* print shading rising from the bottom edge, like a manga page */}
                <div className={COLORS.isDark ? "screentone-dark" : "screentone"} style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "40%", opacity: 0.45, pointerEvents: "none", maskImage: "linear-gradient(to top, black, transparent)", WebkitMaskImage: "linear-gradient(to top, black, transparent)" }} />
                <div
                  onClick={() => { playClickSound(); setFlagDon(true); setTimeout(() => setFlagDon(false), 560); }}
                  title="hehe."
                  style={{ position: "absolute", top: 10, left: 10, width: 44, height: 44, borderRadius: "50%", background: COLORS.surface, border: `2px solid ${COLORS.textPrimary}`, boxShadow: `3px 3px 0 ${COLORS.textPrimary}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <img src="/straw.png" alt="Straw hat" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", display: "block" }} />
                </div>
              </div>
              <div style={{ padding: "10px 14px 12px", borderTop: `3px solid ${COLORS.textPrimary}` }}>
                <p style={{ fontFamily: "var(--font-manga)", fontSize: 17, lineHeight: 1.2, color: COLORS.textPrimary, letterSpacing: "0.02em", margin: 0 }}>CARL JOSHUA COLOMA</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: COLORS.textMuted, marginTop: 4 }}>AI Engineer — Manila</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignSelf: "flex-start", justifyContent: "flex-start", marginTop: 24, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
            <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              onClick={() => playClickSound()}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 999, border: `1px solid ${COLORS.outlineBorder}`, color: COLORS.textSecondary, textDecoration: "none", background: "transparent", transition: "all 0.2s ease" }}
              onMouseEnter={e => { playHoverSound(); e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.textPrimary; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; e.currentTarget.style.transform = "translateY(0)"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.43 7.86 10.96.57.1.78-.25.78-.55v-2.03c-3.2.7-3.87-1.39-3.87-1.39-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.2.66.79.55 4.56-1.53 7.85-5.85 7.85-10.96C23.5 5.74 18.27.5 12 .5z"/></svg>
            </a>
            <a href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              onClick={() => playClickSound()}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 999, border: `1px solid ${COLORS.outlineBorder}`, color: COLORS.textSecondary, textDecoration: "none", background: "transparent", transition: "all 0.2s ease" }}
              onMouseEnter={e => { playHoverSound(); e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.textPrimary; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; e.currentTarget.style.transform = "translateY(0)"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
            </a>
          </div>
        </div>

        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: `1px solid ${COLORS.accentBorder}`, borderRadius: 999, background: COLORS.accentSoft, marginTop: 34, marginBottom: 22, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.12s both", position: "relative" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, flexShrink: 0, animation: "typePulse 2.4s cubic-bezier(0.4,0,0.2,1) infinite" }} />
            <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap", minWidth: 200, display: "inline-block" }}>{typedLabel}<span style={{ display: "inline-block", width: 7, height: "0.95em", background: COLORS.accent, marginLeft: 2, verticalAlign: "text-bottom", animation: "typeBlink 1.1s step-end infinite" }} /></span>
          </div>

          <h1 style={{ fontFamily: "var(--font-manga)", fontSize: "clamp(40px, 5.6vw, 70px)", lineHeight: 1.02, letterSpacing: "-0.01em", color: COLORS.textPrimary, marginBottom: 18, fontWeight: 400, className: "stamp-in", animation: "stampIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}>
            Carl Joshua Coloma
          </h1>

          <div style={{ position: "relative", display: "inline-block", maxWidth: "min(680px, 100%)", padding: "18px 22px", marginBottom: 30, background: COLORS.surface, border: `2.5px solid ${COLORS.textPrimary}`, borderRadius: 18, boxShadow: `4px 4px 0 ${COLORS.border}` }}>
            <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.9, margin: 0, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s both" }}>
              Aspiring AI Engineer who set sail on his first AI workflow — and he's sworn to keep sailing, building reliable <span style={{ color: COLORS.textPrimary }}>agentic workflows, RAG systems, and production-ready ML</span> with Python. One island at a time.
            </p>
            <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.textMuted }}>
              Sail on. Build the impossible.
            </div>
            <div style={{ position: "absolute", bottom: -13, left: 44, width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "11px solid transparent", borderTop: `13px solid ${COLORS.textPrimary}` }} />
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "flex-start", marginBottom: 16, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.44s both" }}>
            <a href="#projects"
              onClick={() => playClickSound()}
              className="manga-btn"
              style={{ padding: "12px 26px", borderRadius: 6, background: COLORS.accent, color: "#ffffff", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700 }}
              onMouseEnter={e => { playHoverSound(); }}>
              View Projects
            </a>
            <a href="#contact"
              onClick={() => playClickSound()}
              className="manga-btn"
              style={{ padding: "12px 26px", borderRadius: 6, background: COLORS.surface, color: COLORS.textPrimary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600 }}
              onMouseEnter={e => { playHoverSound(); }}>
              Get in touch
            </a>
          </div>

          <p style={{ marginTop: -6, marginBottom: 40, color: COLORS.textMuted, fontFamily: "var(--font-manga)", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            One crew. One ship. One dream.
          </p>

          <a href="#chat-demo"
            onClick={(e) => { playClickSound(); e.preventDefault(); const el = document.getElementById("chat-demo"); if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); } }}
            onMouseEnter={e => { playHoverSound(); e.currentTarget.style.color = COLORS.textPrimary; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = COLORS.accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = COLORS.textSecondary; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = COLORS.accentBorder; }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 999, border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft, color: COLORS.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, marginBottom: 18, cursor: "pointer", transition: "all 0.2s ease", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.48s both" }}>
            <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: COLORS.accent }} />
            </span>
            Curious about my work? <span style={{ color: COLORS.accent, fontWeight: 600 }}>Ask my Portfolio AI</span>
            <span aria-hidden="true" style={{ color: COLORS.accent }}>→</span>
          </a>

        </div>
      </div>

      {/* easter egg — the captain laughs */}
      {flagDon && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SFX lines={["SHISHI", "SHISHI!"]} size={160} rotate={-8} style={{ animation: "donFlash 0.55s ease-out forwards" }} />
        </div>
      )}
      {zoomDon && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SFX lines={["ZOOM!"]} size={150} rotate={-14} style={{ animation: "donFlash 0.55s ease-out forwards" }} />
        </div>
      )}

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
      <SectionLabel en="Chapter 2" text="About" chapter="The Beginning" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(30px, 4.5vw, 46px)", color: COLORS.textPrimary, marginBottom: 36, fontWeight: 700 }}>About Me</h2>
      <div data-cols="true" style={{ display: "flex", gap: 64, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{ position: "relative", display: "inline-block", maxWidth: "100%", padding: "18px 22px", marginBottom: 24, background: COLORS.surface, border: `2.5px solid ${COLORS.textPrimary}`, borderRadius: 18, boxShadow: `4px 4px 0 ${COLORS.border}` }}>
            <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85, margin: 0 }}>
              <span style={{ fontFamily: "var(--font-manga)", float: "left", fontSize: 40, lineHeight: "0.85", marginRight: 8, marginTop: 3, color: COLORS.textPrimary }}>H</span>
              ey, I'm CJ — an aspiring AI engineer and CS graduate student from the Philippines (FEU Tech, 2026). I bridge research-grade ML with real-world deployment — reliable, observable, maintainable systems beyond the notebook.
            </p>
            {/* speech-bubble tail */}
            <div style={{ position: "absolute", bottom: -13, left: 44, width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "11px solid transparent", borderTop: `13px solid ${COLORS.textPrimary}` }} />
          </div>
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
                onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.accentSoft; }}
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
              onMouseEnter={() => { playHoverSound(); setHovered(idx); }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                playClickSound();
                const target = idx === 1 ? "experience" : "projects";
                const el = document.getElementById(target);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{ display: "flex", alignItems: "flex-start", gap: 18, background: COLORS.surface, border: `1px solid ${hovered === idx ? COLORS.accentBorder : COLORS.border}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", transition: "all 0.25s ease", transform: hovered === idx ? "translateY(-3px)" : "translateY(0)", boxShadow: hovered === idx ? "0 12px 30px rgba(0,0,0,0.16)" : "none" }}>
              <span style={{ color: COLORS.accent, display: "inline-flex", marginBottom: 8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8" /><path d="M15 22v-7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v7" /><path d="M12 12v13" /><path d="M8 12V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" /></svg></span>
              <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, opacity: 0.65, flexShrink: 0, paddingTop: 2 }}>{item.num}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
                <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.5 }}>{item.sub}</p>
                <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 11, lineHeight: 1.5, marginTop: 6, maxHeight: hovered === idx ? 40 : 0, opacity: hovered === idx ? 1 : 0, overflow: "hidden", transition: "all 0.25s ease" }}>{item.detail}</p>
              </div>
            </div>
          ))}

          <div id="chat-demo" style={{ marginTop: 14 }}>
            <div style={{ borderRadius: 16, border: `1px solid ${COLORS.accentBorder}`, boxShadow: `0 0 0 1px ${COLORS.accent}22, 0 10px 28px ${COLORS.accent}14`, overflow: "hidden" }}>
              <RagDemo compact />
            </div>
          </div>
        </div>
      </div>

      <NextChapter to="experience" label="Experience" chapter="The Voyage" />
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
      <SectionLabel en="Chapter 5" text="Skills" chapter="Awakened Fruits" />
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
            onClick={() => { playClickSound(); setActiveTab(gi); }}
            onMouseEnter={() => playHoverSound()}
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
      <div style={{ position: "relative", overflow: "hidden", border: `1px solid ${COLORS.border}`, borderRadius: 18, background: COLORS.isDark ? "linear-gradient(180deg, #1c1c1a, #161615)" : "linear-gradient(180deg, #faf7ef, #f3eee4)", padding: "24px 28px", boxShadow: COLORS.isDark ? "0 20px 50px rgba(0,0,0,0.25)" : "0 20px 50px rgba(15,23,42,0.06)" }}>
        {/* flag watermark */}
        <div style={{ position: "absolute", top: -30, right: -24, opacity: 0.055, transform: "rotate(-8deg)", pointerEvents: "none" }}>
          <MiniFlag size={150} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 0 4px ${COLORS.accentSoft}` }} />
            {activeGroup.label}
            {activeGroup.fruit && (
              <span style={{ color: COLORS.textMuted, border: `1px solid ${COLORS.chipBorder}`, background: COLORS.chipBg, borderRadius: 999, padding: "2px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase" }}>{activeGroup.fruit}</span>
            )}
            {activeGroup.muted && (
              <span style={{ color: COLORS.accent, background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`, borderRadius: 999, padding: "2px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Upskilling</span>
            )}
          </span>
          <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>0{activeTab + 1} / 0{SKILL_GROUPS.length}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {activeGroup.skills.map((skill, si) => (
            <SkillPill key={skill} name={skill} delay={si * 40} muted={activeGroup.label.includes("Learning") || activeGroup.muted} />
          ))}
        </div>
      </div>

      <NextChapter to="certs" label="Certifications" chapter="Poneglyphs" />
    </section>
  );
}

const DOT_THRESHOLDS = EXPERIENCE.map((_, i) => 0.08 + i * (0.66 / Math.max(EXPERIENCE.length - 1, 1)));

function ExperienceSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();

  return (
    <section id="experience" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel en="Chapter 3" text="Experience" chapter="The Voyage" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>Experience</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 640, lineHeight: 1.9, fontFamily: "Inter, sans-serif" }}>
          Hands-on experience building and evaluating AI systems in production-focused environments.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${COLORS.border}` }}>
        {EXPERIENCE.map((exp, i) => (
          <article key={i}
            onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.background = COLORS.accentSoft; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, padding: "30px 0", borderBottom: `1px solid ${COLORS.border}`, transition: "background 0.25s ease", animation: visible ? `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms both` : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" /><path d="M15 9l-2 5-4 1 2-5z" fill="currentColor" stroke="none" />
                </svg>
                Log Pose · {exp.island}
              </span>
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

      <NextChapter to="projects" label="Projects" chapter="Island Arcs" />
    </section>
  );
}

function ProjectsSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const [active, setActive] = useState(0);
  const [archOpen, setArchOpen] = useState(false);
  const [don, setDon] = useState(false);
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
      <SectionLabel en="Chapter 4" text="Selected Work" chapter="Island Arcs" />
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
            onCardClick={(index) => { playClickSound(); setActive(index); }}
          />
        </div>

        <div key={project.title} className="project-content" style={{ display: "flex", flexDirection: "column", gap: 18, justifyContent: "space-between", padding: "8px 4px", animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ color: COLORS.textPrimary, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" }}>ARC {String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>{project.type}</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12 }}>•</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12 }}>{project.year}</span>
              {project.status === "Best Thesis" ? (
                <SFX lines={["BEST", "THESIS!"]} size={74} rotate={-8} />
              ) : (
                <span style={{ padding: "4px 10px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, background: COLORS.chipBg, color: COLORS.textSecondary, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{project.status}</span>
              )}
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
                  onClick={() => playClickSound()}
                  onMouseEnter={() => playHoverSound()}
                  className="manga-btn"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "11px 18px", borderRadius: 6, background: COLORS.accent, color: "#ffffff", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700 }}>
                  {primaryHref.startsWith("http") ? "View project" : "View details"}
                </a>
              )}
              <button onClick={() => { playClickSound(); setArchOpen(true); setDon(true); setTimeout(() => setDon(false), 560); }}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "11px 18px", borderRadius: 12, border: `1px solid ${COLORS.outlineBorder}`, background: "transparent", color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={e => { playHoverSound(); e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.accent; }}
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
              <button onClick={() => { playClickSound(); setArchOpen(false); }} aria-label="Close" style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
            <Architecture project={project.title} />
          </div>
        </div>
      )}

      {/* impact frame — DON!! */}
      {don && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SFX lines={["DON!!"]} size={170} rotate={-10} style={{ animation: "donFlash 0.55s ease-out forwards" }} />
        </div>
      )}

      <NextChapter to="stack" label="Skills" chapter="Awakened Fruits" />
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
    playClickSound();
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
        <SectionLabel en="Final Chapter" text="Contact" chapter="Den Den Mushi" />

        {/* status pill + local time chip */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 22, opacity: now ? 1 : 0, animation: visible ? "contactRise 0.5s cubic-bezier(0.16,1,0.3,1) both" : "none" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 16px", borderRadius: 999, border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft }}>
            {/* Den Den Mushi — the transponder snail carrying your signal */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="14.5" cy="12.5" r="5.2" />
              <path d="M14.5 12.5a2.6 2.6 0 0 0 2.6 2.6" />
              <path d="M6.2 13.4c0-2.6 1.8-4.9 4.3-5.7" />
              <path d="M7 11.5 5.5 7.5" /><circle cx="5.2" cy="6.6" r="0.9" fill={COLORS.accent} stroke="none" />
              <path d="M9.5 11.5 9 8" /><circle cx="8.9" cy="7.1" r="0.9" fill={COLORS.accent} stroke="none" />
              <path d="M2.5 19.5c0-1.1.9-2 2-2h17" />
            </svg>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, animation: "contactPulse 2s infinite" }} />
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
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound()}
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
          <a href="/cv-coloma.pdf" target="_blank" rel="noopener noreferrer" download="Carl-Coloma-Resume.pdf" className="resume-btn manga-btn"
            onClick={() => playClickSound()}
            onMouseEnter={e => { playHoverSound(); }}
            onMouseLeave={e => { }}
            style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", padding: "15px 26px", borderRadius: 6, background: COLORS.accent, color: "#ffffff", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.01em", animation: visible ? "contactRise 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both" : "none" }}>
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
            onMouseEnter={e => { playHoverSound(); if (!copied) e.currentTarget.style.borderColor = COLORS.accentBorder; }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.borderColor = COLORS.chipBorder; }}>
            <span style={{ fontFamily: "Inter, sans-serif", opacity: 0.85 }}>{email}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: copied ? "#34d399" : COLORS.accent, transition: "color 0.2s ease" }}>{copied ? "✓ puru puru…" : "⧉ copy"}</span>
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
          onMouseEnter={() => playHoverSound()}
          onClick={(e) => {
            playClickSound();
            if (link.href) {
              // real page link (e.g. Blog → /blog.html) — let the browser navigate normally
              return;
            }
            e.preventDefault();
            const el = document.getElementById(link.id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            setActive(i);
            clickLock.current = true;
            clearTimeout(lockTimer.current);
            lockTimer.current = setTimeout(() => { clickLock.current = false; }, 800);
          }}
          style={{
            position: "relative",
            zIndex: 1,
            color: active === i ? "#ffffff" : theme.textMuted,
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
  const PROCESS = [
    {
      num: "01",
      tag: "Start here",
      title: "I start with the problem, not the tool",
      body: "Before I touch a model or a framework, I'm clear on what could go wrong and why it matters. This is the step most beginners skip — jumping straight into the shiny tool — and it's the one that saves months of building the wrong thing.",
      detail: "Why before how · failure modes before features",
    },
    {
      num: "02",
      tag: "Experiment",
      title: "Play before you build",
      body: "Get your hands dirty early. Test one idea in a notebook, with real data, before committing to a full architecture. As an aspiring AI engineer, your superpower right now is curiosity — and the best way to kill a bad idea fast is to play with it before you build it.",
      detail: "Jupyter · real data · one idea at a time",
    },
    {
      num: "03",
      tag: "Build small",
      title: "Small steps beat big beginnings",
      body: "You don't need a production system on day one. Break the problem into small, modular pieces, and ship the smallest useful version. Small PRs, small builds — compounding confidence beats one giant launch.",
      detail: "Small steps · small builds · iterate",
    },
    {
      num: "04",
      tag: "Measure",
      title: "Let evaluation guide you",
      body: "Learn to measure what your system is actually doing. Start with evals — what counts as good output, what failure looks like — and let that guide your next iteration. This habit is what separates people who copy models from people who build AI responsibly.",
      detail: "Evals · measure · iterate · repeat",
    },
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
    <section id="work" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)", position: "relative", overflow: "hidden" }}>
      {/* nautical map wash */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(rgba(23,21,18,0.11) 0.9px, transparent 1.4px)`, backgroundSize: "7px 7px", opacity: COLORS.isDark ? 0.5 : 1 }} />
      <div style={{ position: "absolute", top: "26%", left: "-80px", width: 14, height: 14, borderRadius: "50%", background: COLORS.accent, opacity: 0.55, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
        <SectionLabel en="Side Story" text="Work & GitHub" />
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(30px, 4.5vw, 46px)", color: COLORS.textPrimary, marginBottom: 24, fontWeight: 700 }}>Work & GitHub</h2>

        <div className="work-github-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
          {/* Left: How I work — process timeline */}
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: COLORS.textPrimary, fontWeight: 600, marginBottom: 18 }}>How I work</h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {PROCESS.map((step, i) => (
                <div key={step.num} style={{ position: "relative", paddingLeft: 40, paddingBottom: i < PROCESS.length - 1 ? 24 : 0, animation: visible ? `fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) ${0.12 + i * 0.1}s both` : "none" }}>
                  {/* connector line */}
                  {i < PROCESS.length - 1 && (
                    <div style={{ position: "absolute", left: 15, top: 30, bottom: 0, width: 1, background: `linear-gradient(180deg, ${COLORS.accentBorder}, ${COLORS.border})` }} />
                  )}
                  {/* numbered node */}
                  <div style={{ position: "absolute", left: 0, top: 0, width: 30, height: 30, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700 }}>
                    {step.num.slice(1)}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 7 }}>
                    <span style={{ color: COLORS.accent, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em" }}>{step.title}</span>
                    <span style={{ padding: "2px 9px", borderRadius: 999, border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", animation: "tagBlink 1.8s ease-in-out infinite" }}>{step.tag}</span>
                  </div>
                  <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 12.5, lineHeight: 1.75, margin: 0 }}>
                    {step.body}
                  </p>
                  <p style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.03em", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: COLORS.accent, opacity: 0.8 }}>→</span>{step.detail}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${COLORS.stripBorder}`, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Why before how", "Play before building", "Small wins", "Measure & learn"].map((p) => (
                <span key={p} style={{ padding: "5px 11px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, background: COLORS.chipBg, color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500 }}>
                  {p}
                </span>
              ))}
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
                <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.color = COLORS.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.2s ease" }}>
                  more on github <span style={{ transition: "transform 0.2s ease" }}>→</span>
                </a>
                <CodeDemo />
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
          .work-github-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .work-github-grid > div { min-width: 0 !important; max-width: 100% !important; overflow: hidden; }
          .rag-sources-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

const CERTIFICATIONS = [
  { name: "Introduction to Model Context Protocol", issuer: "Anthropic Education", date: "May 2026", url: "https://verify.skilljar.com/c/remzvordp5e7", image: "/MCP.png", road: true },
  { name: "The AI Engineer Bootcamp", issuer: "Udemy", date: "Completed", url: "https://www.udemy.com/certificate/UC-ce6b30a4-237b-469c-9f60-0039ab82713f/", image: "/UDEMY.png" },
  { name: "IT Specialist - Python", issuer: "Certiport (Pearson VUE)", date: "Verified", url: "https://www.credly.com/badges/2d0c3b41-ee3f-4616-af62-2b3a55be3890/public_url", image: "https://images.credly.com/images/3c4602d8-832e-4a24-b42d-00359ce746f7/linkedin_thumb_ITS-Badges_Python_1200px.png" },
  { name: "Python Essentials 1", issuer: "Cisco (OpenEDG Python Institute)", date: "Verified", url: "https://www.credly.com/badges/c495ce54-6909-4812-bfee-6303486b3c9a/public_url", image: "https://images.credly.com/images/68c0b94d-f6ac-40b1-a0e0-921439eb092e/linkedin_thumb_image.png" },
  { name: "Artificial Intelligence Fundamentals", issuer: "IBM SkillsBuild", date: "Verified", url: "https://www.credly.com/badges/8ef3efc3-7e58-4ef2-b349-32f818814c5b/public_url", image: "https://images.credly.com/images/82b908e1-fdcd-4785-9d32-97f11ccbcf08/linkedin_thumb_image.png" },
  { name: "Introduction to Modern AI", issuer: "Cisco", date: "Verified", url: "https://www.credly.com/badges/fc10a9c7-172e-47b7-b817-f1116e8b9846/public_url", image: "https://images.credly.com/images/e2d12302-10f9-40d4-8ff1-066a7008b61d/linkedin_thumb_blob" },
];

function CertCard({ cert, idx, visible }) {
  const COLORS = useColors();
  const [hov, setHov] = useState(false);
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => playClickSound()}
      onMouseEnter={e => {
        playHoverSound();
        setHov(true);
        e.currentTarget.style.borderColor = COLORS.accentBorder;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 14px 34px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={e => {
        setHov(false);
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        border: `1px solid ${hov ? COLORS.accentBorder : COLORS.border}`,
        borderRadius: 14,
        overflow: "hidden",
        background: COLORS.surface,
        boxShadow: "none",
        transition: "all 0.25s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        animation: visible ? `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 60 + 100}ms both` : "none",
      }}
    >
      {cert.road && (
        <span style={{ position: "absolute", top: 10, right: 10, zIndex: 2, padding: "3px 9px", borderRadius: 4, border: `2px solid ${COLORS.accent}`, color: COLORS.accent, background: COLORS.surface, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Road Poneglyph
        </span>
      )}
      <div style={{ height: 140, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: COLORS.isDark ? "#f1f5f9" : "#f8fafc", borderBottom: `1px solid ${COLORS.border}` }}>
        <img
          src={cert.image}
          alt={cert.name}
          loading="lazy"
          draggable={false}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transform: hov ? "scale(1.04)" : "scale(1)", transition: "transform 0.3s ease" }}
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
      </div>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <span style={{ fontFamily: "var(--font-manga)", fontSize: 15, fontWeight: 400, color: COLORS.textPrimary, lineHeight: 1.35 }}>
          {cert.name}
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.textSecondary }}>
          {cert.issuer}
        </span>
        <span style={{ marginTop: "auto", paddingTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textMuted }}>
          {cert.date}
        </span>
        <span style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: COLORS.accent }}>
          verify ↗
        </span>
      </div>
    </a>
  );
}

function CertificationsSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="certs" ref={ref} style={{ padding: "56px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionLabel en="Chapter 6" text="Certifications" chapter="Poneglyphs" />
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(30px, 4.5vw, 46px)", color: COLORS.textPrimary, marginBottom: 12, fontWeight: 700 }}>Certifications</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 720, lineHeight: 1.85, fontFamily: "Inter, sans-serif", marginBottom: 28 }}>
          Stones deciphered: {CERTIFICATIONS.length}. Verified credentials from Anthropic, Cisco, IBM, Certiport, and Udemy.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {CERTIFICATIONS.map((c, i) => (
            <CertCard key={c.name} cert={c} idx={i} visible={visible} />
          ))}
        </div>

        <NextChapter to="contact" label="Contact" chapter="Den Den Mushi" />
      </div>
    </section>
  );
}

function ChapterTurn() {
  const [turn, setTurn] = useState(null);
  const titles = {
    about: { n: "Chapter 2", t: "The Beginning" },
    experience: { n: "Chapter 3", t: "The Voyage" },
    projects: { n: "Chapter 4", t: "Island Arcs" },
    work: { n: "Side Story", t: "Work & GitHub" },
    stack: { n: "Chapter 5", t: "Awakened Fruits" },
    certs: { n: "Chapter 6", t: "Poneglyphs" },
    contact: { n: "Final Chapter", t: "Den Den Mushi" },
  };
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && titles[e.target.id]) {
            setTurn({ n: titles[e.target.id].n, t: titles[e.target.id].t });
          }
        }
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
    );
    Object.keys(titles).forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!turn) return;
    const t = setTimeout(() => setTurn(null), 1500);
    return () => clearTimeout(t);
  }, [turn]);
  if (!turn) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, pointerEvents: "none", animation: "turnFlash 1.4s ease forwards" }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.34em", color: "var(--red)", textTransform: "uppercase" }}>The Next Chapter</span>
      <span style={{ fontFamily: "var(--font-manga)", fontSize: "clamp(28px, 6vw, 46px)", color: "var(--paper)", letterSpacing: "0.02em" }}>{turn.t}</span>
      <div style={{ width: 140, height: 3, background: "var(--red)" }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.24em", color: "var(--paper)", textTransform: "uppercase", opacity: 0.55 }}>{turn.n}</span>
    </div>
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
        :root { --ink: ${theme.textPrimary}; --paper: ${theme.bg}; --red: ${theme.accent}; }
        main h2 { font-family: var(--font-manga); letter-spacing: 0.01em; font-weight: 400; }
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
        @keyframes stampIn { 0% { opacity:0; transform:rotate(-6deg) scale(1.35); filter:blur(3px); } 55% { opacity:1; transform:rotate(-2deg) scale(0.98); filter:blur(0); } 75% { transform:rotate(1deg) scale(1.015); } 100% { opacity:1; transform:rotate(0deg) scale(1); filter:none; } }
        @keyframes turnFlash { 0% { opacity:0; } 18% { opacity:1; } 45% { opacity:1; } 100% { opacity:0; } }
        @keyframes tagBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        @keyframes donFlash { 0% { opacity: 0; transform: scale(0.5) rotate(-10deg); } 22% { opacity: 1; transform: scale(1.07) rotate(-10deg); } 55% { opacity: 1; transform: scale(1) rotate(-10deg); } 100% { opacity: 0; transform: scale(1.03) rotate(-10deg); } }
        .next-chapter .nc-text { color: ${theme.textMuted}; transition: color 0.2s ease; }
        .next-chapter:hover .nc-text { color: ${theme.accent}; }
        @keyframes typeBlink { 0%, 55% { opacity: 1 } 56%, 100% { opacity: 0 } }
        @keyframes typePulse {
          0% { box-shadow: 0 0 0 6px ${theme.accentSoft}, 0 0 0 0 ${theme.accent}55; }
          70% { box-shadow: 0 0 0 6px ${theme.accentSoft}, 0 0 0 9px transparent; }
          100% { box-shadow: 0 0 0 6px ${theme.accentSoft}, 0 0 0 0 transparent; }
        }
        .op-nav-links { display: flex; gap: 22px; align-items: center; }
        .op-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
        .work-github-grid > div { min-width: 0; }
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
        <a href="#hero" onClick={() => playClickSound()} style={{ display: "inline-flex", alignItems: "center", gap: 10, color: theme.textPrimary, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 4, background: theme.textPrimary, color: theme.bg, fontSize: 12, boxShadow: `3px 3px 0 ${theme.accent}` }}>CJ</span>
          <span>Carl Joshua<span style={{ color: theme.accent }}>.</span></span>
        </a>

        <div className="op-nav-links" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <GlidingNavLinks links={NAV_LINKS} theme={theme} />
          <button onClick={() => { playClickSound(); toggleTheme(); }} aria-label="Toggle theme"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 999, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer", transition: "all 0.2s", outline: "none" }}
            onMouseEnter={e => { playHoverSound(); e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => { playClickSound(); toggleTheme(); }} aria-label="Toggle theme" className="op-hamburger"
            onMouseEnter={() => playHoverSound()}
            style={{ display: "none", alignItems: "center", justifyContent: "center", padding: "7px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "none", color: theme.textMuted, cursor: "pointer", outline: "none" }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="op-hamburger" onClick={() => { playClickSound(); setMenuOpen(o => !o); }} onMouseEnter={() => playHoverSound()} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen
                ? <><line x1="4" y1="4" x2="18" y2="18" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /><line x1="18" y1="4" x2="4" y2="18" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /></>
                : <><line x1="3" y1="6" x2="19" y2="6" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="11" x2="19" y2="11" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="16" x2="19" y2="16" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" /></>
              }
            </svg>
          </button>
        </div>
      </nav>

      <VoyageBar />

      <div style={{ display: "flex", flexDirection: "column", position: "fixed", top: 68, left: 0, right: 0, background: theme.mobileMenuBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${theme.border}`, padding: "20px clamp(24px,6vw,96px)", zIndex: 99, transform: menuOpen ? "translateY(0)" : "translateY(-120%)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "transform 0.3s ease, opacity 0.25s ease" }}>
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={link.href || `#${link.id}`} onClick={() => { playClickSound(); setMenuOpen(false); }} onMouseEnter={() => playHoverSound()}
              style={{ color: theme.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, padding: "14px 0", borderBottom: `1px solid ${theme.stripBorder}` }}>
              {link.label}
            </a>
          ))}
          <div style={{ paddingTop: 16 }}>
            <button onClick={() => { playClickSound(); toggleTheme(); setMenuOpen(false); }} onMouseEnter={() => playHoverSound()}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.chipBg, color: theme.textSecondary, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, outline: "none" }}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              <span>Switch to {isDark ? "Day Paper" : "Night Ink"} Mode</span>
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

      <footer style={{ padding: "28px clamp(24px, 6vw, 96px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
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
      <ChapterTurn />
    </ThemeCtx.Provider>
  );
}