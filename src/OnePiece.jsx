import { useState, useEffect, useRef, createContext, useContext } from "react";
import RagDemo from "./demo/RagDemo";

const DARK = {
  isDark: true,
  bg: "#060d1a",
  surface: "#0c1829",
  surfaceHigh: "#0f2038",
  border: "rgba(232,162,23,0.12)",
  textPrimary: "#f0e6c8",
  textSecondary: "#8a9bb5",
  textMuted: "#4a5a72",
  accent: "#e8a217",
  accentSoft: "rgba(232,162,23,0.09)",
  accentBorder: "rgba(232,162,23,0.28)",
  cyan: "#22d3ee",
  sky: "#38bdf8",
  emerald: "#34d399",
  violet: "#a78bfa",
  navBg: "rgba(6,13,26,0.92)",
  mobileMenuBg: "rgba(6,13,26,0.97)",
  chipBg: "rgba(232,162,23,0.05)",
  chipBorder: "rgba(232,162,23,0.14)",
  outlineBorder: "rgba(255,255,255,0.08)",
  outlineBg: "rgba(255,255,255,0.02)",
  divider: "rgba(255,255,255,0.15)",
  tagBg: "rgba(232,162,23,0.09)",
  stripBorder: "rgba(232,162,23,0.1)",
};

const LIGHT = {
  isDark: false,
  bg: "#fdf8f0",
  surface: "#ffffff",
  surfaceHigh: "#f7f0e0",
  border: "rgba(139,90,0,0.1)",
  textPrimary: "#1a0e00",
  textSecondary: "#5c4230",
  textMuted: "#8c7060",
  accent: "#c47d0e",
  accentSoft: "rgba(196,125,14,0.08)",
  accentBorder: "rgba(196,125,14,0.3)",
  cyan: "#0891b2",
  sky: "#0284c7",
  emerald: "#059669",
  violet: "#7c3aed",
  navBg: "rgba(253,248,240,0.95)",
  mobileMenuBg: "rgba(253,248,240,0.97)",
  chipBg: "rgba(139,90,0,0.05)",
  chipBorder: "rgba(139,90,0,0.1)",
  outlineBorder: "rgba(0,0,0,0.1)",
  outlineBg: "rgba(0,0,0,0.02)",
  divider: "rgba(0,0,0,0.15)",
  tagBg: "rgba(139,90,0,0.07)",
  stripBorder: "rgba(0,0,0,0.06)",
};

const ThemeCtx = createContext(DARK);
export const useColors = () => useContext(ThemeCtx);

const NAV_LINKS = [
  { label: "About",       id: "about"       },
  { label: "Stack",       id: "stack"       },
  { label: "Experience",  id: "experience"  },
  { label: "Projects",    id: "projects"    },
  { label: "Credentials", id: "credentials" },
  { label: "Interests",   id: "interests"   },
  { label: "Contact",     id: "contact"     },
];

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const SKILL_GROUPS = [
  {
    label: "Languages",
    skills: [
      { name: "Python",     icon: `${DI}/python/python-original.svg` },
      { name: "JavaScript", icon: `${DI}/javascript/javascript-original.svg` },
      { name: "SQL",        icon: `${DI}/postgresql/postgresql-original.svg` },
      { name: "C++",        icon: `${DI}/cplusplus/cplusplus-original.svg` },
    ],
  },
  {
    label: "AI & ML",
    skills: [
      { name: "PyTorch",      icon: `${DI}/pytorch/pytorch-original.svg` },
      { name: "TensorFlow",   icon: `${DI}/tensorflow/tensorflow-original.svg` },
      { name: "Scikit-learn", icon: `${DI}/scikitlearn/scikitlearn-original.svg` },
      { name: "OpenCV",       icon: `${DI}/opencv/opencv-original.svg` },
      { name: "LangChain",    icon: "https://cdn.simpleicons.org/langchain", invert: true },
      { name: "Transformers", icon: "https://cdn.simpleicons.org/huggingface" },
      { name: "RAG",          icon: null },
      { name: "Prompt Engineering", icon: null },
    ],
  },
  {
    label: "Frameworks",
    skills: [
      { name: "FastAPI",   icon: `${DI}/fastapi/fastapi-original.svg` },
      { name: "Flask",     icon: `${DI}/flask/flask-original.svg`, invert: true },
      { name: "React",     icon: `${DI}/react/react-original.svg` },
      { name: "Streamlit", icon: `${DI}/streamlit/streamlit-original.svg` },
    ],
  },
  {
    label: "Tools",
    skills: [
      { name: "Git",         icon: `${DI}/git/git-original.svg` },
      { name: "Jupyter",     icon: `${DI}/jupyter/jupyter-original.svg` },
      { name: "MySQL",       icon: `${DI}/mysql/mysql-original.svg` },
      { name: "VS Code",     icon: `${DI}/vscode/vscode-original.svg` },
      { name: "Docker",      icon: `${DI}/docker/docker-original.svg` },
      { name: "Kaggle",      icon: `${DI}/kaggle/kaggle-original.svg` },
      { name: "Claude Code", icon: "https://cdn.simpleicons.org/anthropic", invert: true },
      { name: "Qdrant",      icon: "https://cdn.simpleicons.org/qdrant" },
    ],
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
    title: "AI Resume Analyzer",
    type: "NLP System",
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
];

const CERTIFICATIONS = [
  { title: "AI Engineer",                  issuer: "Udemy",  desc: "Advanced AI engineering covering LLMs, fine-tuning, RAG pipelines, and production deployment patterns.",  link: "https://www.udemy.com/certificate/UC-ce6b30a4-237b-469c-9f60-0039ab82713f/", badge: "AI" },
  { title: "Python Expert",                issuer: "Credly", desc: "Advanced Python programming including data structures, OOP, and scripting for automation.",               link: "https://www.credly.com/earner/earned/badge/8ef3efc3-7e58-4ef2-b349-32f818814c5b", badge: "PY" },
  { title: "Intro to Modern AI",           issuer: "Credly", desc: "Core concepts of modern AI: neural networks, ML workflows, and applied deep learning fundamentals.",       link: "https://www.credly.com/badges/fc10a9c7-172e-47b7-b817-f1116e8b9846/public_url", badge: "ML" },
  { title: "Introduction to Data Science", issuer: "Credly", desc: "Foundations of data science covering statistical analysis, visualization, and Python-based workflows.",   link: "https://www.credly.com/badges/fde949db-9414-4ed4-85d3-d7fccab61366/public_url", badge: "DS" },
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
      <div style={{ width: 32, height: 1, background: "rgba(232,162,23,0.4)" }} />
      <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em" }}>{text}</span>
    </div>
  );
}

function SkillIcon({ name, icon, invert, delay = 0 }) {
  const COLORS = useColors();
  const [err, setErr] = useState(false);
  const initials = name.replace(/[^A-Za-z0-9]/g, "").substring(0, 2).toUpperCase();
  const imgFilter = invert ? (COLORS.isDark ? "brightness(0) invert(1)" : "none") : "none";
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 18px", borderRadius: 12, background: COLORS.chipBg, border: `1px solid ${COLORS.chipBorder}`, transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)", cursor: "default", minWidth: 108, flex: "0 0 auto", animation: `fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` }}
      onMouseEnter={e => { e.currentTarget.style.background = COLORS.accentSoft; e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = COLORS.chipBg; e.currentTarget.style.borderColor = COLORS.chipBorder; e.currentTarget.style.transform = "translateY(0)"; }}>
      {icon && !err ? (
        <img src={icon} alt={name} width={44} height={44} onError={() => setErr(true)} style={{ objectFit: "contain", filter: imgFilter }} />
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: 8, background: COLORS.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700 }}>{initials}</span>
        </div>
      )}
      <span style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500, textAlign: "center", lineHeight: 1.3, maxWidth: 80 }}>{name}</span>
    </div>
  );
}

function Hero() {
  const COLORS = useColors();
  const [typed, setTyped] = useState("");
  const phrases = ["AI Engineer", "AI Solutions", "Quality Assurance", "Software Engineer"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setTyped(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) setTimeout(() => setDeleting(true), 1400);
        else setCharIndex((p) => p + 1);
      } else {
        setTyped(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setPhraseIndex((p) => (p + 1) % phrases.length);
          setCharIndex(0);
        } else setCharIndex((p) => p - 1);
      }
    }, deleting ? 45 : 90);
    return () => clearTimeout(timeout);
  }, [typed, deleting, charIndex, phraseIndex]);

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px clamp(24px, 6vw, 96px) 100px", position: "relative", overflow: "hidden" }}>

      {/* Starfield — dark mode only */}
      {COLORS.isDark && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {[
            [9,14],[22,38],[38,8],[51,62],[67,19],[79,47],[88,77],[14,72],[32,52],[58,32],[84,12],
            [5,90],[46,85],[73,5],[95,55],[18,25],[42,70],[63,88],[76,34],[91,20],[28,44],[54,7],[81,63],[12,50],[37,78],
          ].map(([x, y], i) => (
            <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: i % 5 === 0 ? 2 : 1, height: i % 5 === 0 ? 2 : 1, borderRadius: "50%", background: i % 7 === 0 ? "rgba(232,162,23,0.55)" : "rgba(255,255,255,0.35)", animation: `twinkle ${2 + (i % 3)}s ease-in-out ${(i * 0.3) % 2}s infinite` }} />
          ))}
        </div>
      )}

      {/* Ambient ocean glow */}
      <div style={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)", width: 700, height: 320, background: `radial-gradient(ellipse, ${COLORS.isDark ? "rgba(6,60,100,0.2)" : "rgba(196,125,14,0.05)"} 0%, transparent 72%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 780, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>

        {/* Profile photo */}
        <div style={{ width: 160, height: 160, borderRadius: "50%", overflow: "hidden", marginBottom: 32, border: "2px solid rgba(232,162,23,0.45)", boxShadow: "0 0 0 8px rgba(232,162,23,0.07), 0 0 48px rgba(232,162,23,0.12)", flexShrink: 0, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
          <img src="/PROFILE.jpeg" alt="Carl Joshua Coloma" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
        </div>

        {/* Status badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", border: "1px solid rgba(232,162,23,0.32)", borderRadius: 999, background: "rgba(232,162,23,0.08)", marginBottom: 28, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.accent, boxShadow: "0 0 8px rgba(232,162,23,0.9)", flexShrink: 0, animation: "blink 1.4s step-end infinite" }} />
          <span style={{ color: COLORS.accent, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.04em" }}>Open to work</span>
        </div>

        {/* Name */}
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(52px, 8vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.04em", color: COLORS.textPrimary, marginBottom: 22, fontWeight: 700, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
          Carl Joshua<br /><span style={{ color: COLORS.accent }}>Coloma.</span>
        </h1>

        {/* Typing animation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, height: 36, marginBottom: 26, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s both" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(16px, 1.8vw, 20px)", color: COLORS.textSecondary }}>{typed}</span>
          <span style={{ color: COLORS.accent, animation: "blink 1s step-end infinite", fontFamily: "Inter, sans-serif", fontSize: "clamp(16px, 1.8vw, 20px)", lineHeight: 1 }}>|</span>
        </div>

        {/* Tagline */}
        <p style={{ maxWidth: 560, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 17, lineHeight: 1.75, marginBottom: 44, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both" }}>
          Building intelligent systems at the intersection of machine learning, computer vision, and production AI engineering.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 56, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s both" }}>
          <a href="#projects"
            style={{ padding: "13px 28px", borderRadius: 8, background: COLORS.accent, color: "#1a0800", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(232,162,23,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            View Projects
          </a>
          <a href="#contact"
            style={{ padding: "13px 28px", borderRadius: 8, border: `1px solid ${COLORS.outlineBorder}`, color: COLORS.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, background: COLORS.outlineBg, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,162,23,0.4)"; e.currentTarget.style.color = COLORS.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; }}>
            Get in Touch
          </a>
          <a href="/CV-Carl-Coloma.pdf" download="CV-Carl-Coloma.pdf"
            style={{ padding: "13px 28px", borderRadius: 8, border: `1px solid ${COLORS.outlineBorder}`, color: COLORS.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, background: COLORS.outlineBg, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,162,23,0.4)"; e.currentTarget.style.color = COLORS.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; }}>
            Download CV
          </a>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", width: "100%", maxWidth: 520, borderTop: `1px solid ${COLORS.stripBorder}`, borderBottom: `1px solid ${COLORS.stripBorder}`, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.75s both" }}>
          {[
            { label: "Best Thesis Award", sub: "Nov 2025"       },
            { label: "3 Internships",     sub: "AI Engineering" },
            { label: "4 Projects",        sub: "Shipped"        },
          ].map((stat, i, arr) => (
            <div key={stat.label} style={{ flex: "1 1 0", padding: "20px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, borderRight: i < arr.length - 1 ? `1px solid ${COLORS.stripBorder}` : "none" }}>
              <span style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, textAlign: "center" }}>{stat.label}</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11 }}>{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, overflow: "hidden", lineHeight: 0, pointerEvents: "none" }}>
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: 64 }}>
          <path d="M0 32 C180 56, 360 8, 540 32 C720 56, 900 8, 1080 32 C1260 56, 1380 20, 1440 32 L1440 64 L0 64 Z" fill={COLORS.isDark ? "rgba(12,24,41,0.55)" : "rgba(255,248,240,0.55)"} />
          <path d="M0 40 C200 64, 400 16, 600 40 C800 64, 1000 16, 1200 40 C1320 52, 1400 36, 1440 40 L1440 64 L0 64 Z" fill={COLORS.isDark ? "rgba(6,13,26,0.4)" : "rgba(253,248,240,0.5)"} />
        </svg>
      </div>
    </section>
  );
}

function AboutSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="about" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="01" text="About" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 48, fontWeight: 700 }}>About Me</h2>
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
              { label: "Focus",        value: "LLMs · RAG · Computer Vision" },
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
            { num: "03", label: "4 Projects",           sub: "CV · NLP · LLMs · RAG" },
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
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section id="stack" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="02" text="Stack" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 14, fontWeight: 700 }}>Technical Stack</h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 560, lineHeight: 1.75, fontFamily: "Inter, sans-serif", textAlign: "left", margin: "0 0 40px 0" }}>
        Tools and technologies across machine learning, AI systems, frameworks, and development.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-start", marginBottom: 40 }}>
        {SKILL_GROUPS.map((group, i) => (
          <button key={group.label} onClick={() => setActiveTab(i)} style={{ padding: "8px 22px", borderRadius: 999, border: "1px solid", borderColor: activeTab === i ? COLORS.accent : COLORS.outlineBorder, background: activeTab === i ? COLORS.accentSoft : "transparent", color: activeTab === i ? COLORS.accent : COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", outline: "none" }}>
            {group.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "flex-start", minHeight: 160 }}>
        {SKILL_GROUPS[activeTab].skills.map((skill, i) => (
          <SkillIcon key={skill.name} name={skill.name} icon={skill.icon} invert={skill.invert} delay={i * 55} />
        ))}
      </div>
    </section>
  );
}

const DOT_THRESHOLDS = EXPERIENCE.map((_, i) => 0.08 + i * (0.66 / Math.max(EXPERIENCE.length - 1, 1)));

function ExperienceSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - top) / (height + window.innerHeight)));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="experience" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="03" text="Experience" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 56, fontWeight: 700 }}>Experience</h2>
      <div ref={containerRef} style={{ position: "relative", paddingLeft: 36, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(232,162,23,0.7) 0%, rgba(232,162,23,0.04) 100%)", transformOrigin: "top center", transform: `scaleY(${progress})` }} />
        {EXPERIENCE.map((exp, i) => (
          <div key={i} style={{ position: "relative", animation: visible ? `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms both` : "none" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.accent, position: "absolute", left: -41, top: 16, boxShadow: progress >= DOT_THRESHOLDS[i] ? "0 0 12px rgba(232,162,23,0.6)" : "none", opacity: progress >= DOT_THRESHOLDS[i] ? 1 : 0, transform: progress >= DOT_THRESHOLDS[i] ? "scale(1)" : "scale(0)", transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" }} />
            <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "26px 28px", background: COLORS.surface }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
                <div>
                  <h3 style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 21, fontWeight: 600, marginBottom: 4 }}>{exp.role}</h3>
                  <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13 }}>{exp.company}</p>
                </div>
                <span style={{ color: COLORS.accent, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`, borderRadius: 999, padding: "4px 14px", whiteSpace: "nowrap", flexShrink: 0 }}>{exp.period}</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                {exp.points.map((point) => (
                  <li key={point} style={{ display: "flex", gap: 12, color: COLORS.textSecondary, lineHeight: 1.75, fontFamily: "Inter, sans-serif", fontSize: 14, alignItems: "flex-start" }}>
                    <span style={{ color: COLORS.accent, flexShrink: 0, lineHeight: "1.75", opacity: 0.8 }}>·</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
    <section id="projects" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="04" text="Projects" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 14, textAlign: "left", fontWeight: 700 }}>Featured Projects</h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 600, lineHeight: 1.75, fontFamily: "Inter, sans-serif", textAlign: "left", margin: "0 0 20px 0" }}>
        Applied AI systems focused on real-world deployment, computer vision, NLP, and intelligent workflows.
      </p>

      <a href="#demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: COLORS.accent, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 40 }}>
        Try a live mini RAG demo ↓
      </a>

      <a href={featured.link} target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit", display: "block", borderRadius: 14, overflow: "hidden", background: COLORS.surface, border: `1px solid ${COLORS.border}`, marginBottom: 18, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(232,162,23,0.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
        {featured.img && (
          <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
            <img src={featured.img} alt={featured.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${COLORS.surface} 100%)` }} />
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <span style={{ padding: "4px 12px", background: "rgba(232,162,23,0.15)", border: "1px solid rgba(232,162,23,0.35)", borderRadius: 999, color: COLORS.accent, fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", backdropFilter: "blur(8px)" }}>Best Thesis Award</span>
            </div>
          </div>
        )}
        <div style={{ padding: "28px 36px 36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ color: COLORS.accent, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured Project</span>
                <span style={{ width: 1, height: 12, background: COLORS.divider, flexShrink: 0 }} />
                <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11 }}>Computer Vision</span>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, color: COLORS.textPrimary, marginBottom: 14, letterSpacing: "-0.02em" }}>{featured.title}</h3>
              <p style={{ color: COLORS.textSecondary, lineHeight: 1.75, fontFamily: "Inter, sans-serif", fontSize: 14, marginBottom: 20, maxWidth: 680 }}>{featured.desc}</p>
              <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12, marginBottom: 20 }}>{featured.metric}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {featured.tags.map(tag => (
                  <span key={tag} style={{ padding: "5px 12px", borderRadius: 6, background: COLORS.tagBg, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>
            <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13, flexShrink: 0 }}>↗ GitHub</span>
          </div>
        </div>
      </a>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {secondary.map((project, i) => (
          <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", borderRadius: 16, overflow: "hidden", background: COLORS.surface, border: `1px solid ${COLORS.border}`, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)", animation: visible ? `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms both` : "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(232,162,23,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            {project.img && (
              <div style={{ position: "relative", height: 152, overflow: "hidden", flexShrink: 0 }}>
                <img src={project.img} alt={project.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${COLORS.surface} 100%)` }} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "20px 24px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ color: project.accent, fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{project.type}</span>
                <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11 }}>↗ GitHub</span>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10 }}>{project.title}</h3>
              <p style={{ color: COLORS.textSecondary, lineHeight: 1.7, fontFamily: "Inter, sans-serif", fontSize: 13, flexGrow: 1, marginBottom: 14 }}>{project.desc}</p>
              <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12 }}>{project.metric}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function CertificatesSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(null);
  return (
    <section id="credentials" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="06" text="Credentials" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 14, textAlign: "left", fontWeight: 700 }}>Credentials</h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 600, lineHeight: 1.75, fontFamily: "Inter, sans-serif", textAlign: "left", margin: "0 0 48px 0" }}>
        Verified credentials across AI engineering, machine learning, and software development.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {CERTIFICATIONS.map((cert, i) => (
          <a key={cert.title} href={cert.link} target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", border: `1px solid ${hovered === i ? COLORS.accentBorder : COLORS.border}`, borderRadius: 14, overflow: "hidden", background: COLORS.surface, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)", transform: hovered === i ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered === i ? "0 8px 24px rgba(232,162,23,0.12)" : "none", cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #e8a217, rgba(232,162,23,0.2))", flexShrink: 0 }} />
            <div style={{ padding: "20px 20px 16px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, color: COLORS.accent, flexShrink: 0 }}>
                  {cert.badge}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 999, border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft, textTransform: "uppercase" }}>{cert.issuer}</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: COLORS.textMuted }}>↗ View Cert</span>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 7, lineHeight: 1.3 }}>{cert.title}</h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.65, flexGrow: 1 }}>{cert.desc}</p>
            </div>
            <div style={{ padding: "10px 20px", background: COLORS.surfaceHigh, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.textMuted }}>Verified Credential</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function InterestsSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  const items = [
    {
      label: "Dance",
      icon: "💃",
      content: (
        <>
          <p style={{ margin: 0, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.6 }}>
            Began dancing in Grade 1 with a focus on dancehall and open style — performative choreography and team routines. Notable placements include:
          </p>
          <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18, color: COLORS.textSecondary }}>
            <li>DS Kings (2023) — College Division — 3rd Place</li>
            <li>Chosen Ground 16 (Open Division) — Champion</li>
            <li>DS Kings (2024) — College Division — 2nd Place</li>
            <li>LCDC (2025, Singapore) — BAWZ — Open Division — Champion</li>
          </ul>
          <a href="/blog.html" style={{ display: "inline-block", marginTop: 8, color: COLORS.accent, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}>
            Read the BAWZ Singapore story →
          </a>
        </>
      )
    },
    {
      label: "DJ (Amateur)",
      icon: "🎧",
      content: (
        <div>
          <p style={{ margin: 0, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.6 }}>Curates energetic, dancefloor-focused mixes for friends and small events — smooth transitions, crate-digging, and building a vibe from warm intros to peak-time drops.</p>
          <p style={{ margin: "8px 0 0", color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}>Favorite genres:</p>
          <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 18, color: COLORS.textSecondary }}>
            <li>R&B</li><li>Afro</li><li>Dancehall</li><li>Amapiano</li><li>House</li><li>Baile</li>
          </ul>
          <p style={{ marginTop: 8, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13 }}>Gear: Serato DJ Pro · Hercules InPulse 300 MK2.</p>
        </div>
      )
    },
    {
      label: "One Piece",
      icon: "🏴‍☠️",
      content: (
        <div>
          <p style={{ margin: 0, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.6 }}>
            Longtime One Piece fan — I love the epic worldbuilding, emotional stakes, and the way Oda layers mystery across decades.
          </p>
          <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18, color: COLORS.textSecondary }}>
            <li><strong>Favorites:</strong> Luffy (optimism & grit), Zoro (loyalty & discipline), Law (style and strategy).</li>
            <li><strong>Why I love it:</strong> the series rewards patience — long-running mysteries and moments that land after years of buildup.</li>
          </ul>
          <p style={{ marginTop: 8, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13 }}>It inspires how I approach side projects — small details setting up huge payoffs.</p>
        </div>
      )
    }
  ];

  return (
    <section id="interests" ref={ref} style={{ padding: "80px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="07" text="Interests" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px, 3.6vw, 32px)", color: COLORS.textPrimary, marginBottom: 14, textAlign: "left", fontWeight: 700 }}>Beyond Tech</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {items.map((item) => (
          <div key={item.label} style={{ padding: 16, borderRadius: 10, border: `1px solid ${COLORS.chipBorder}`, background: COLORS.surface, boxShadow: COLORS.isDark ? "0 6px 18px rgba(0,0,0,0.45)" : "0 6px 18px rgba(2,6,23,0.04)", animation: "fadeUp 420ms cubic-bezier(0.16,1,0.3,1) both", transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), border-color 0.25s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.chipBorder; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ height: 3, borderRadius: 8, marginBottom: 12, background: "linear-gradient(90deg, #e8a217, rgba(232,162,23,0.2))" }} />
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div style={{ background: COLORS.accentSoft, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 18, marginRight: 12 }}>{item.icon}</div>
              <strong style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 16, color: COLORS.accent }}>{item.label}</strong>
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.7 }}>{item.content}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="contact" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px) 80px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)", textAlign: "center" }}>
      <SectionLabel num="08" text="Contact" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", color: COLORS.textPrimary, marginBottom: 14, fontWeight: 700 }}>Let's build something intelligent.</h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 520, lineHeight: 1.75, fontFamily: "Inter, sans-serif", margin: "0 auto 48px" }}>
        Open to AI engineering opportunities, ML collaborations, and building production-ready intelligent systems.
      </p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <a href="mailto:carljoshuamcoloma@gmail.com"
          style={{ textDecoration: "none", color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 700, border: `1px solid ${COLORS.chipBorder}`, borderRadius: 10, padding: "12px 18px", background: COLORS.surface, display: "inline-block", transition: "all 0.18s ease" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(232,162,23,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.chipBorder; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
          Contact Me
        </a>
        <div style={{ display: "flex", gap: 18 }}>
          <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            style={{ border: `1px solid ${COLORS.chipBorder}`, borderRadius: 12, padding: 10, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 64, minHeight: 64, color: COLORS.textPrimary, textDecoration: "none", background: COLORS.surface, transition: "all 0.18s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(232,162,23,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.chipBorder; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.02 11.02 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.71 5.41-5.29 5.69.42.36.8 1.08.8 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56C20.71 21.42 24 17.1 24 12c0-6.27-5.23-11.5-12-11.5z" fill="currentColor" /></svg>
          </a>
          <a href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            style={{ border: `1px solid ${COLORS.chipBorder}`, borderRadius: 12, padding: 10, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 64, minHeight: 64, color: COLORS.textPrimary, textDecoration: "none", background: COLORS.surface, transition: "all 0.18s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(232,162,23,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.chipBorder; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.1 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5V24H0V8zM8 8h4.8v2.2h.1c.7-1.3 2.4-2.6 4.9-2.6C24 7.6 24 12 24 16.6V24h-5v-7.2c0-1.8-.1-4.2-2.6-4.2-2.6 0-3 2-3 4.1V24H8V8z" fill="currentColor" /></svg>
          </a>
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
        body { overflow-x: hidden; transition: background 0.3s ease, color 0.3s ease; }
        button { font-family: inherit; }
        a:focus-visible, button:focus-visible { outline: 2px solid ${theme.accent}; outline-offset: 3px; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(232,162,23,0.5); border-radius: 3px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes twinkle { 0%,100%{opacity:0.25} 50%{opacity:0.85} }
        .op-nav-links { display: flex; gap: 28px; align-items: center; }
        .op-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
        @media (max-width: 900px) {
          #projects > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          [data-cols] { flex-direction: column !important; }
          [data-cols] > div:last-child { flex: 0 0 auto !important; width: 100%; }
          .op-nav-links { display: none !important; }
          .op-hamburger { display: flex !important; align-items: center; justify-content: center; }
        }
        @media (max-width: 640px) {
          #projects > div:last-child { grid-template-columns: 1fr !important; }
          #credentials > div { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 68, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 clamp(24px, 6vw, 96px)", background: scrolled || menuOpen ? theme.navBg : "transparent", backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none", borderBottom: scrolled || menuOpen ? `1px solid ${theme.border}` : "1px solid transparent", transition: "all 0.3s ease" }}>
        <a href="#hero" style={{ color: theme.textPrimary, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16 }}>
          cjc<span style={{ color: theme.accent }}>.</span>
        </a>

        <div className="op-nav-links">
          <GlidingNavLinks links={NAV_LINKS} theme={theme} />
          <a href="/blog.html" style={{ color: theme.textMuted, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, paddingLeft: 8, borderLeft: `1px solid ${theme.stripBorder}`, marginLeft: 8 }}>Blog</a>
          <button onClick={toggleTheme} aria-label="Toggle theme"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, border: `1px solid ${theme.border}`, background: theme.chipBg, color: theme.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 500, transition: "all 0.2s", outline: "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span>{isDark ? "Light" : "Dark"}</span>
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
        <CertificatesSection />
        <InterestsSection />
        <ContactSection />
      </main>

      <footer style={{ padding: "32px clamp(24px, 6vw, 96px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderTop: `1px solid ${theme.border}` }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: theme.textMuted }}>Carl Joshua Coloma · AI Engineer</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: theme.textMuted, opacity: 0.5 }}>cjc</span>
      </footer>
    </ThemeCtx.Provider>
  );
}
