import { useState, useEffect, useRef, createContext, useContext } from "react";

const DARK = {
  isDark:        true,
  bg:            "#0a0e1a",
  surface:       "#141925",
  surfaceHigh:   "#1c2333",
  border:        "rgba(255,255,255,0.07)",
  textPrimary:   "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted:     "#475569",
  accent:        "#6366f1",
  accentSoft:    "rgba(99,102,241,0.12)",
  accentBorder:  "rgba(99,102,241,0.25)",
  cyan:          "#22d3ee",
  sky:           "#38bdf8",
  emerald:       "#34d399",
  violet:        "#a78bfa",
  hoverBg:       "#19233a",
  navBg:         "rgba(10,14,26,0.92)",
  mobileMenuBg:  "rgba(10,14,26,0.97)",
  chipBg:        "rgba(255,255,255,0.03)",
  chipBorder:    "rgba(255,255,255,0.06)",
  outlineBorder: "rgba(255,255,255,0.1)",
  outlineBg:     "rgba(255,255,255,0.02)",
  divider:       "rgba(255,255,255,0.2)",
  tagBg:         "rgba(255,255,255,0.06)",
  stripBorder:   "rgba(255,255,255,0.06)",
};

const LIGHT = {
  isDark:        false,
  bg:            "#f8fafc",
  surface:       "#ffffff",
  surfaceHigh:   "#f1f5f9",
  border:        "rgba(0,0,0,0.08)",
  textPrimary:   "#0f172a",
  textSecondary: "#475569",
  textMuted:     "#94a3b8",
  accent:        "#6366f1",
  accentSoft:    "rgba(99,102,241,0.08)",
  accentBorder:  "rgba(99,102,241,0.3)",
  cyan:          "#0891b2",
  sky:           "#0284c7",
  emerald:       "#059669",
  violet:        "#7c3aed",
  hoverBg:       "#eef2ff",
  navBg:         "rgba(248,250,252,0.95)",
  mobileMenuBg:  "rgba(248,250,252,0.97)",
  chipBg:        "rgba(0,0,0,0.04)",
  chipBorder:    "rgba(0,0,0,0.08)",
  outlineBorder: "rgba(0,0,0,0.12)",
  outlineBg:     "rgba(0,0,0,0.02)",
  divider:       "rgba(0,0,0,0.15)",
  tagBg:         "rgba(0,0,0,0.06)",
  stripBorder:   "rgba(0,0,0,0.06)",
};

const ThemeCtx = createContext(DARK);
const useColors = () => useContext(ThemeCtx);

const NAV_LINKS = ["About", "Stack", "Experience", "Projects", "Credentials", "Contact"];

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const SKILL_GROUPS = [
  {
    label: "Languages",
    skills: [
      { name: "Python",     icon: `${DI}/python/python-original.svg` },
      { name: "JavaScript", icon: `${DI}/javascript/javascript-original.svg` },
      { name: "SQL",        icon: `${DI}/postgresql/postgresql-original.svg` },
      { name: "C++",        icon: `${DI}/cplusplus/cplusplus-original.svg` },
      { name: "PHP",        icon: `${DI}/php/php-original.svg` },
      { name: "Java",       icon: `${DI}/java/java-original.svg` },
    ],
  },
  {
    label: "AI & ML",
    skills: [
      { name: "PyTorch",      icon: `${DI}/pytorch/pytorch-original.svg` },
      { name: "TensorFlow",   icon: `${DI}/tensorflow/tensorflow-original.svg` },
      { name: "Scikit-learn", icon: `${DI}/scikitlearn/scikitlearn-original.svg` },
      { name: "OpenCV",       icon: `${DI}/opencv/opencv-original.svg` },
      { name: "LangChain",    icon: "https://cdn.simpleicons.org/langchain",  invert: true },
      { name: "Transformers", icon: "https://cdn.simpleicons.org/huggingface" },
      { name: "RAG",          icon: null },
    ],
  },
  {
    label: "Frameworks",
    skills: [
      { name: "FastAPI",   icon: `${DI}/fastapi/fastapi-original.svg` },
      { name: "Flask",     icon: `${DI}/flask/flask-original.svg`,   invert: true },
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
    role: "AI QA Intern",
    company: "SoFi AI Tech Solutions Inc.",
    period: "Apr 2026 – Present",
    points: [
      "Stress-tested conversational AI systems using edge-case prompts and evaluation workflows.",
      "Performed prompt analysis and hallucination classification for model reliability.",
      "Collaborated with ML teams to improve response consistency and AI behavior.",
    ],
  },
  {
    role: "AI Engineer Intern",
    company: "Lamina Studios",
    period: "Dec 2025 – Apr 2026",
    points: [
      "Built real-time computer vision pipelines with YOLOv8 and OpenCV.",
      "Developed predictive analytics systems using Scikit-learn and XGBoost.",
      "Automated AI workflows and tooling to reduce repetitive manual operations.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Powerlift",
    type: "Computer Vision",
    desc: "AI-powered biomechanics analysis system for powerlifting performance evaluation using YOLOv8, Kalman Filtering, and SVM classification. Designed to analyze lifting mechanics in real time through computer vision, motion tracking, and posture analysis to provide automated lift assessment, movement stabilization, and performance feedback for squat, bench press, and deadlift exercises.",
    metric: "30+ FPS · Mobile Application",
    tags: ["Python", "YOLOv8", "Kalman Filtering", "SVM", "MoveNet"],
    accent: "#22d3ee",
    featured: true,
    award: "Overall Best Thesis",
    link: "https://github.com/cdobby18/powerlift-frontend",
  },
  {
    title: "AI Resume Analyzer",
    type: "NLP System",
    desc: "Resume parsing and skill extraction pipeline with entity recognition and semantic matching.",
    metric: "100+ resumes/min",
    tags: ["NLP", "spaCy", "Transformers"],
    accent: "#38bdf8",
    link: "https://github.com/cdobby18/resume_analyzer",
  },
  {
    title: "Document Summarizer",
    type: "Transformer Pipeline",
    desc: "Abstractive PDF summarization system powered by Hugging Face transformer models.",
    metric: "Multi-page summarization",
    tags: ["BART", "T5", "PDF"],
    accent: "#34d399",
    link: "https://github.com/cdobby18/ai-summarizer",
  },
  {
    title: "AI Engineering Roadmap",
    type: "Learning System",
    desc: "Structured roadmap from Python to ML to LLMs to RAG to production AI systems.",
    metric: "End-to-end AI learning system",
    tags: ["Python", "ML", "LLMs", "RAG"],
    accent: "#a78bfa",
    link: "https://github.com/cdobby18/AI-Roadmap",
  },
];

const CERTIFICATIONS = [
  { title: "AI Engineer",                  issuer: "Udemy",  desc: "Advanced AI course covering machine learning and deep learning fundamentals.",        link: "https://www.udemy.com/certificate/UC-ce6b30a4-237b-469c-9f60-0039ab82713f/", badge: "AI" },
  { title: "Python Expert",                issuer: "Credly", desc: "Mastered Python programming and advanced scripting concepts.",                        link: "https://www.credly.com/earner/earned/badge/8ef3efc3-7e58-4ef2-b349-32f818814c5b", badge: "PY" },
  { title: "Intro to Modern AI",           issuer: "Credly", desc: "Core concepts of modern AI including ML and neural networks.",                        link: "https://www.credly.com/badges/fc10a9c7-172e-47b7-b817-f1116e8b9846/public_url", badge: "ML" },
  { title: "JavaScript Essentials",        issuer: "Credly", desc: "Fundamentals of JavaScript programming and ES6+ features.",                           link: "https://www.credly.com/earner/earned/badge/2d0c3b41-ee3f-4616-af62-2b3a55be3890", badge: "JS" },
  { title: "Web Development Fundamentals", issuer: "Credly", desc: "Interface design principles, wireframing, and user experience.",                      link: "https://www.credly.com/badges/b610ac88-9103-441c-9874-f79ea071a605/linked_in_profile", badge: "WD" },
  { title: "Introduction to Data Science", issuer: "Credly", desc: "Foundations of data science, analytics, and visualization using Python.",             link: "https://www.credly.com/badges/fde949db-9414-4ed4-85d3-d7fccab61366/public_url", badge: "DS" },
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

function SectionLabel({ num, text }) {
  const COLORS = useColors();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em", opacity: 0.7 }}>{num}</span>
      <div style={{ width: 32, height: 1, background: "rgba(99,102,241,0.4)" }} />
      <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em" }}>{text}</span>
    </div>
  );
}

function SkillIcon({ name, icon, invert }) {
  const COLORS = useColors();
  const [err, setErr] = useState(false);
  const initials = name.replace(/[^A-Za-z0-9]/g, "").substring(0, 2).toUpperCase();
  const imgFilter = invert ? (COLORS.isDark ? "brightness(0) invert(1)" : "none") : "none";
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 18px", borderRadius: 12, background: COLORS.chipBg, border: `1px solid ${COLORS.chipBorder}`, transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)", cursor: "default", minWidth: 108, flex: "0 0 auto" }}
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
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px clamp(24px, 6vw, 96px) 60px" }}>
      <div style={{ maxWidth: 780, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 160, height: 160, borderRadius: "50%", overflow: "hidden", marginBottom: 32, border: "2px solid rgba(99,102,241,0.4)", boxShadow: "0 0 0 8px rgba(99,102,241,0.07)", flexShrink: 0, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
          <img src="/PROFILE.jpeg" alt="Carl Joshua Coloma" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 999, background: COLORS.accentSoft, marginBottom: 28, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.accent, boxShadow: "0 0 6px rgba(99,102,241,0.9)", flexShrink: 0 }} />
          <span style={{ color: COLORS.accent, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.04em" }}>Available for AI Engineering roles</span>
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(52px, 8vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.04em", color: COLORS.textPrimary, marginBottom: 22, fontWeight: 700, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
          Carl Joshua<br /><span style={{ color: COLORS.accent }}>Coloma.</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, height: 36, marginBottom: 26, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s both" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(16px, 1.8vw, 20px)", color: COLORS.textSecondary }}>{typed}</span>
          <span style={{ color: COLORS.accent, animation: "blink 1s step-end infinite", fontFamily: "Inter, sans-serif", fontSize: "clamp(16px, 1.8vw, 20px)", lineHeight: 1 }}>|</span>
        </div>
        <p style={{ maxWidth: 560, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 17, lineHeight: 1.75, marginBottom: 44, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both" }}>
          Building intelligent systems at the intersection of machine learning, computer vision, and production AI engineering.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s both" }}>
          <a href="#projects" style={{ padding: "13px 28px", borderRadius: 8, background: COLORS.accent, color: "#fff", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#4f52d4"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = COLORS.accent; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            View Projects
          </a>
          <a href="#contact" style={{ padding: "13px 28px", borderRadius: 8, border: `1px solid ${COLORS.outlineBorder}`, color: COLORS.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, background: COLORS.outlineBg, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.color = COLORS.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.outlineBorder; e.currentTarget.style.color = COLORS.textSecondary; }}>
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="about" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="02" text="About" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 48, fontWeight: 700 }}>About Me</h2>
      <div data-cols="true" style={{ display: "flex", gap: 64, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85, marginBottom: 18 }}>
            Hey, I'm CJ — a Computer Science student from the Philippines, graduating from FEU Institute of Technology in 2026. I'm passionate about building AI systems that actually work in production, not just in notebooks.
          </p>
          <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85, marginBottom: 18 }}>
            I'm currently working as an AI QA Intern at SoFi AI Tech Solutions, where I evaluate and stress-test conversational AI systems. My focus right now is on LLM pipelines, RAG architectures, and anything that bridges research-grade ML with real-world deployment.
          </p>
          <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.85 }}>
            My undergraduate thesis — <span style={{ color: COLORS.textPrimary, fontWeight: 500 }}>Powerlift</span> — earned the Overall Best Thesis Award in the Computer Vision category (December 2025). It's an AI biomechanics analyzer for powerlifting that runs at 30+ FPS on mobile.
          </p>
          <div style={{ marginTop: 36, borderTop: `1px solid ${COLORS.stripBorder}` }}>
            {[
              { label: "Current Role", value: "AI QA Intern · SoFi AI Tech Solutions" },
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
            { num: "01", label: "Overall Best Thesis", sub: "Computer Vision Category · Nov 2025" },
            { num: "02", label: "3 Internships",       sub: "Lamina Studios · SoFi AI Tech Solutions · FlyRank AI" },
            { num: "03", label: "4 Projects",          sub: "Python · Computer Vision · NLP · LLMs · RAG" },
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
      <SectionLabel num="03" text="Technical Stack" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 14, fontWeight: 700 }}>Technical Stack</h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 560, lineHeight: 1.75, fontFamily: "Inter, sans-serif", textAlign: "center", margin: "0 auto 40px" }}>
        Tools and technologies across machine learning, AI systems, frameworks, and development.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
        {SKILL_GROUPS.map((group, i) => (
          <button key={group.label} onClick={() => setActiveTab(i)} style={{ padding: "8px 22px", borderRadius: 999, border: "1px solid", borderColor: activeTab === i ? COLORS.accent : COLORS.outlineBorder, background: activeTab === i ? COLORS.accentSoft : "transparent", color: activeTab === i ? COLORS.accent : COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", outline: "none" }}>
            {group.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", minHeight: 160 }}>
        {SKILL_GROUPS[activeTab].skills.map((skill) => (
          <SkillIcon key={skill.name} name={skill.name} icon={skill.icon} invert={skill.invert} />
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="experience" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <SectionLabel num="04" text="Experience" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 56, fontWeight: 700 }}>Experience</h2>
      <div style={{ position: "relative", paddingLeft: 32, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(99,102,241,0.6) 0%, rgba(99,102,241,0.04) 100%)" }} />
        {EXPERIENCE.map((exp, i) => (
          <div key={i} style={{ position: "relative" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.accent, position: "absolute", left: -37, top: 14, boxShadow: "0 0 12px rgba(99,102,241,0.6)" }} />
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
      <SectionLabel num="05" text="Projects" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 14, textAlign: "center", fontWeight: 700 }}>Featured Projects</h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 600, lineHeight: 1.75, fontFamily: "Inter, sans-serif", textAlign: "center", margin: "0 auto 48px" }}>
        Applied AI systems focused on real-world deployment, computer vision, NLP, and intelligent workflows.
      </p>
      <a href={featured.link} target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit", display: "block", borderRadius: 14, padding: "36px 40px", background: COLORS.surface, marginBottom: 18, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
        onMouseEnter={e => { e.currentTarget.style.background = COLORS.hoverBg; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.2)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{ color: COLORS.cyan, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured Project</span>
              <span style={{ width: 1, height: 12, background: COLORS.divider, flexShrink: 0 }} />
              <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11 }}>Computer Vision</span>
              <span style={{ padding: "3px 10px", background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: 999, color: "#facc15", fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>Best Thesis Award</span>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 42, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 14, letterSpacing: "-0.02em" }}>{featured.title}</h3>
            <p style={{ color: COLORS.textSecondary, lineHeight: 1.75, fontFamily: "Inter, sans-serif", fontSize: 14, marginBottom: 20, maxWidth: 680 }}>{featured.desc}</p>
            <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12, marginBottom: 20 }}>{featured.metric}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {featured.tags.map(tag => (
                <span key={tag} style={{ padding: "5px 12px", borderRadius: 6, background: COLORS.tagBg, color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </div>
          <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 13, flexShrink: 0, paddingTop: 4 }}>&#8599; GitHub</span>
        </div>
      </a>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {secondary.map((project) => (
          <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", borderRadius: 16, padding: "24px 26px", background: COLORS.surface, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.background = COLORS.hoverBg; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ color: project.accent, fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{project.type}</span>
              <span style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11 }}>&#8599; GitHub</span>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10 }}>{project.title}</h3>
            <p style={{ color: COLORS.textSecondary, lineHeight: 1.7, fontFamily: "Inter, sans-serif", fontSize: 13, flexGrow: 1, marginBottom: 16 }}>{project.desc}</p>
            <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12 }}>{project.metric}</p>
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
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 14, textAlign: "center", fontWeight: 700 }}>Credentials</h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 600, lineHeight: 1.75, fontFamily: "Inter, sans-serif", textAlign: "center", margin: "0 auto 48px" }}>
        Verified credentials across AI engineering, machine learning, and software development.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {CERTIFICATIONS.map((cert, i) => (
          <a key={cert.title} href={cert.link} target="_blank" rel="noopener noreferrer"
            style={{
              textDecoration: "none", color: "inherit",
              display: "flex", flexDirection: "column",
              border: `1px solid ${hovered === i ? "rgba(99,102,241,0.35)" : COLORS.border}`,
              borderRadius: 14, overflow: "hidden", background: COLORS.surface,
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
              boxShadow: hovered === i ? "0 8px 24px rgba(99,102,241,0.12)" : "none",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #6366f1, rgba(99,102,241,0.25))", flexShrink: 0 }} />
            <div style={{ padding: "20px 20px 16px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, color: COLORS.accent, flexShrink: 0 }}>
                  {cert.badge}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 999, border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft, textTransform: "uppercase" }}>{cert.issuer}</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: COLORS.textMuted }}>&#8599; View Cert</span>
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

function ContactSection() {
  const COLORS = useColors();
  const [ref, visible] = useInView();
  return (
    <section id="contact" ref={ref} style={{ padding: "100px clamp(24px, 6vw, 96px) 80px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)", textAlign: "center" }}>
      <SectionLabel num="07" text="Contact" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", color: COLORS.textPrimary, marginBottom: 14, fontWeight: 700 }}>Let's build something intelligent.</h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 520, lineHeight: 1.75, fontFamily: "Inter, sans-serif", margin: "0 auto 48px" }}>
        Open to AI engineering opportunities, ML collaborations, and building production-ready intelligent systems.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, maxWidth: 580, margin: "0 auto" }}>
        {[
          { label: "Email",    value: "carljoshuamcoloma@gmail.com",        link: "mailto:carljoshuamcoloma@gmail.com" },
          { label: "Phone",    value: "+63 917 450 4450",                   link: "tel:+639174504450" },
          { label: "GitHub",   value: "github.com/cdobby18",                link: "https://github.com/cdobby18" },
          { label: "LinkedIn", value: "linkedin.com/in/carl-joshua-coloma", link: "https://linkedin.com/in/carl-joshua-coloma" },
        ].map((item) => (
          <a key={item.label} href={item.link}
            target={item.link.startsWith("http") ? "_blank" : undefined}
            rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 22px", background: COLORS.surface, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>{item.label}</p>
            <p style={{ color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 13, wordBreak: "break-all", textAlign: "left" }}>{item.value}</p>
          </a>
        ))}
      </div>
    </section>
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

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("theme") !== "light"; } catch { return true; }
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
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch {}
  }, [theme, isDark]);

  const toggleTheme = () => setIsDark(d => !d);

  return (
    <ThemeCtx.Provider value={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        #root { width: 100% !important; max-width: 100% !important; text-align: left; }
        body { overflow-x: hidden; transition: background 0.3s ease, color 0.3s ease; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.5); border-radius: 3px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .nav-links { display: flex; gap: 28px; align-items: center; }
        .nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
        @media (max-width: 900px) {
          #projects > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
          #credentials > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          [data-cols] { flex-direction: column !important; }
          [data-cols] > div:last-child { flex: 0 0 auto !important; width: 100%; }
          .nav-links { display: none !important; }
          .nav-hamburger { display: flex !important; align-items: center; justify-content: center; }
        }
        @media (max-width: 640px) {
          #projects > div:last-child { grid-template-columns: 1fr !important; }
          #credentials > div { grid-template-columns: 1fr !important; }
          #contact > div { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 68, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 clamp(24px, 6vw, 96px)", background: scrolled || menuOpen ? theme.navBg : "transparent", backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none", borderBottom: scrolled || menuOpen ? `1px solid ${theme.border}` : "1px solid transparent", transition: "all 0.3s ease" }}>
        <a href="#hero" style={{ color: theme.textPrimary, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16 }}>cjc<span style={{ color: theme.accent }}>.</span></a>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`}
              style={{ color: theme.textMuted, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, transition: "color 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.color = theme.textPrimary; }}
              onMouseLeave={e => { e.currentTarget.style.color = theme.textMuted; }}>
              {link}
            </a>
          ))}
          <button onClick={toggleTheme} aria-label="Toggle theme"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, border: `1px solid ${theme.border}`, background: theme.chipBg, color: theme.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 500, transition: "all 0.2s", outline: "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accentBorder; e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggleTheme} aria-label="Toggle theme"
            style={{ display: "none", alignItems: "center", justifyContent: "center", padding: "7px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "none", color: theme.textMuted, cursor: "pointer", outline: "none" }}
            className="nav-hamburger" id="theme-toggle-mobile">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="4" x2="4" y2="18" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="19" y2="6" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="11" x2="19" y2="11" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="16" x2="19" y2="16" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ display: "flex", flexDirection: "column", position: "fixed", top: 68, left: 0, right: 0, background: theme.mobileMenuBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${theme.border}`, padding: "20px clamp(24px,6vw,96px)", zIndex: 99 }}>
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{ color: theme.textSecondary, textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, padding: "14px 0", borderBottom: `1px solid ${theme.stripBorder}` }}>
              {link}
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
      )}

      <main>
        <Hero />
        <AboutSection />
        <StackSection />
        <ExperienceSection />
        <ProjectsSection />
        <CertificatesSection />
        <ContactSection />
      </main>

      <footer style={{ padding: "32px clamp(24px, 6vw, 96px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderTop: `1px solid ${theme.border}` }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: theme.textMuted }}>Carl Joshua Coloma · AI Engineer</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: theme.textMuted }}>Built with React · 2026</span>
      </footer>
    </ThemeCtx.Provider>
  );
}
