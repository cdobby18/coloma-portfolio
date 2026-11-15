import { useState, useEffect, useRef, createContext, useContext } from "react";
import RagDemo from "./demo/RagDemo";
import Architecture from "./Architecture";

const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const DISPLAY = "'Space Grotesk', Inter, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

/* ─────────────────────────────────────────────────────────────
   Theme
   ───────────────────────────────────────────────────────────── */

const DARK = {
  isDark: true,
  bg: "#0a0a0b",
  surface: "#111113",
  surfaceHigh: "#17171a",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.20)",
  textPrimary: "#f4f4f5",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
  accent: "#e5484d",
  accentSoft: "rgba(229,72,77,0.10)",
  accentBorder: "rgba(229,72,77,0.30)",
  cyan: "#f4f4f5",
  sky: "#a1a1aa",
  emerald: "#a1a1aa",
  violet: "#7aa2f7",
  navBg: "rgba(10,10,11,0.82)",
  mobileMenuBg: "rgba(10,10,11,0.98)",
  chipBg: "rgba(255,255,255,0.04)",
  chipBorder: "rgba(255,255,255,0.12)",
  outlineBorder: "rgba(255,255,255,0.18)",
  outlineBg: "rgba(255,255,255,0.04)",
  divider: "rgba(255,255,255,0.10)",
  tagBg: "rgba(229,72,77,0.12)",
  stripBorder: "rgba(255,255,255,0.08)",
  shadow: "0 1px 2px rgba(0,0,0,0.35)",
  shadowLg: "0 24px 60px rgba(0,0,0,0.45)",
};

const LIGHT = {
  isDark: false,
  bg: "#fcfcfc",
  surface: "#ffffff",
  surfaceHigh: "#f4f4f5",
  border: "rgba(9,9,11,0.10)",
  borderStrong: "rgba(9,9,11,0.20)",
  textPrimary: "#09090b",
  textSecondary: "#52525b",
  textMuted: "#71717a",
  accent: "#d92d2d",
  accentSoft: "rgba(217,45,45,0.06)",
  accentBorder: "rgba(217,45,45,0.24)",
  cyan: "#09090b",
  sky: "#52525b",
  emerald: "#52525b",
  violet: "#3b6fd4",
  navBg: "rgba(252,252,252,0.85)",
  mobileMenuBg: "rgba(252,252,252,0.98)",
  chipBg: "#f4f4f5",
  chipBorder: "rgba(9,9,11,0.12)",
  outlineBorder: "rgba(9,9,11,0.18)",
  outlineBg: "#ffffff",
  divider: "rgba(9,9,11,0.10)",
  tagBg: "rgba(217,45,45,0.08)",
  stripBorder: "rgba(9,9,11,0.08)",
  shadow: "0 1px 2px rgba(9,9,11,0.05)",
  shadowLg: "0 24px 60px rgba(9,9,11,0.10)",
};

const ThemeCtx = createContext(DARK);
export const useColors = () => useContext(ThemeCtx);

/* ─────────────────────────────────────────────────────────────
   Data
   ───────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Stack", id: "stack" },
  { label: "Certifications", id: "certs" },
  { label: "Contact", id: "contact" },
  { label: "Blog", href: "/blog.html" },
];

const SKILL_GROUPS = [
  {
    label: "Programming Languages",
    skills: ["Python", "JavaScript"],
  },
  {
    label: "Frameworks & Libraries",
    skills: ["FastAPI", "Streamlit", "OpenCV", "NumPy", "scikit-learn", "Pydantic"],
  },
  {
    label: "Generative AI & LLMs",
    skills: ["RAG", "LangChain", "Agentic AI", "Prompt Engineering", "LLM Integration", "Ollama"],
  },
  {
    label: "AI & Developer Tools",
    skills: ["Hermes", "Exa AI", "OpenCode", "Git", "VS Code", "Jupyter", "Obsidian", "Google Colab", "pytest", "Debugging", "Technical Documentation", "Code Review & PRs", "Jira"],
  },
  {
    label: "Databases",
    skills: ["MySQL", "Qdrant", "PostgreSQL"],
  },
  {
    label: "Currently Exploring",
    skills: ["Databricks", "dbt", "Airflow", "Snowflake"],
  },
];

const EXPERIENCE = [
  {
    role: "Backend AI Engineer Intern",
    company: "FlyRank AI",
    period: "July 2026 – Oct 2026",
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
      "Trained XGBoost classification models on time-series datasets using scikit-learn; deployed predictions to cut manual review overhead.",
      "Automated model retraining and evaluation workflows, reducing iteration cycles from days to hours.",
    ],
  },
];

const PROJECTS = [
  {
    name: "Powerlift — Precision Pose Estimation",
    title: "Powerlift: Precision Pose Estimation for Powerlifting Performance Metrics",
    type: "Computer Vision",
    year: "2025",
    status: "Best Thesis",
    short: "Real-time biomechanics analyzer for powerlifting, built with YOLOv8 and Kalman filtering.",
    desc: "AI biomechanics analyzer for powerlifting built with YOLOv8, Kalman filtering, and SVM classification. Tracks joint positions, stabilizes motion across frames, and classifies squat, bench, and deadlift mechanics in real time — delivering automated lift assessment and performance feedback on mobile hardware.",
    metric: "Mobile application · Overall Best Thesis",
    tags: ["Python", "YOLOv8", "Kalman Filtering", "SVM", "MoveNet"],
    img: "/Powerlift.webp",
    link: "https://github.com/cdobby18/Powerlift",
  },
  {
    name: "Sunny AI",
    title: "Sunny AI",
    type: "RAG-Built Mentor",
    private: true,
    year: "2026",
    status: "Prototype",
    short: "RAG-powered mentorship platform that takes aspiring AI engineers from zero to job-ready.",
    desc: "A guided platform for aspiring AI engineers starting from zero. No fluff, no shortcuts — RAG-powered mentorship that meets you at the bottom and builds you up through fundamentals, production skills, and real-world readiness.",
    metric: "React · Python · LLMs · RAG · LangChain",
    tags: ["React", "Python", "LLMs", "RAG", "FastAPI"],
    img: "/sunny.png",
    link: "#contact",
  },
  {
    name: "ReSOLVE — Support Automation",
    title: "ReSOLVE: Customer Support Automation Platform",
    type: "Agentic AI",
    year: "2026",
    status: "Built",
    short: "Agentic support platform for ticket triage, grounded response drafting, and human escalation.",
    desc: "AI-powered support platform that triages tickets using intent, priority, and sentiment classification, then routes requests through automated workflows or human escalation. Includes RAG-based response drafting with confidence scoring, guardrails, and deterministic fallback logic.",
    metric: "FastAPI · RAG · Agents · Guardrails",
    tags: ["FastAPI", "React", "RAG", "LangChain", "PostgreSQL", "FAISS"],
    img: "/resolve.png",
    link: "https://github.com/cdobby18/ReSOLVE",
  },
  {
    name: "Resume Analyzer",
    title: "Resume Analyzer",
    type: "Natural Language Processing",
    year: "2025",
    status: "Pipeline",
    short: "NLP pipeline that extracts and scores resume skills with spaCy and transformer matching.",
    desc: "Resume parsing pipeline using spaCy NER and transformer-based semantic matching to extract skills, experience, and role fit. Processes 100+ documents per minute with structured JSON output ready for downstream ranking or ATS integration.",
    metric: "Python · spaCy NER + Semantic Match",
    tags: ["NLP", "spaCy", "Transformers", "FastAPI"],
    img: "/Resume.webp",
    link: "https://github.com/cdobby18/resume_analyzer",
  },
  {
    name: "Document Summarizer",
    title: "Document Summarizer",
    type: "Transformer Pipeline",
    year: "2024",
    status: "Research Build",
    short: "Abstractive summarization for multi-page PDFs using BART and T5 with chunk-aware merging.",
    desc: "Abstractive summarization system for multi-page PDFs using BART and T5. Handles long-document chunking strategies to stay within model context limits, then merges section-level summaries into a coherent output — outperforming extractive baselines on readability.",
    metric: "Python · NLP · BART",
    tags: ["BART", "T5", "HuggingFace", "PDF"],
    img: "/Summarize.webp",
    link: "https://github.com/cdobby18/ai-summarizer",
  },
];

const CERTIFICATIONS = [
  { name: "Introduction to Model Context Protocol", issuer: "Anthropic Education", date: "May 2026", url: "https://verify.skilljar.com/c/remzvordp5e7", image: "/MCP.png" },
  { name: "The AI Engineer Bootcamp", issuer: "Udemy", date: "Completed", url: "https://www.udemy.com/certificate/UC-ce6b30a4-237b-469c-9f60-0039ab82713f/", image: "/UDEMY.png" },
  { name: "IT Specialist — Python", issuer: "Certiport (Pearson VUE)", date: "Verified", url: "https://www.credly.com/badges/2d0c3b41-ee3f-4616-af62-2b3a55be3890/public_url", image: "https://images.credly.com/images/3c4602d8-832e-4a24-b42d-00359ce746f7/linkedin_thumb_ITS-Badges_Python_1200px.png" },
  { name: "Python Essentials 1", issuer: "Cisco (OpenEDG Python Institute)", date: "Verified", url: "https://www.credly.com/badges/c495ce54-6909-4812-bfee-6303486b3c9a/public_url", image: "https://images.credly.com/images/68c0b94d-f6ac-40b1-a0e0-921439eb092e/linkedin_thumb_image.png" },
  { name: "Artificial Intelligence Fundamentals", issuer: "IBM SkillsBuild", date: "Verified", url: "https://www.credly.com/badges/8ef3efc3-7e58-4ef2-b349-32f818814c5b/public_url", image: "https://images.credly.com/images/82b908e1-fdcd-4785-9d32-97f11ccbcf08/linkedin_thumb_image.png" },
  { name: "Introduction to Modern AI", issuer: "Cisco", date: "Verified", url: "https://www.credly.com/badges/fc10a9c7-172e-47b7-b817-f1116e8b9846/public_url", image: "https://images.credly.com/images/e2d12302-10f9-40d4-8ff1-066a7008b61d/linkedin_thumb_blob" },
];

/* ─────────────────────────────────────────────────────────────
   Icons
   ───────────────────────────────────────────────────────────── */

function Icon({ children, size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

const ArrowUpRight = ({ size = 14 }) => (
  <Icon size={size}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></Icon>
);
const FileDown = ({ size = 15 }) => (
  <Icon size={size}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" /></Icon>
);
const CopyIcon = ({ size = 13 }) => (
  <Icon size={size}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon>
);
const CheckIcon = ({ size = 13 }) => <Icon size={size}><polyline points="20 6 9 17 4 12" /></Icon>;
const ClockIcon = ({ size = 13 }) => (
  <Icon size={size}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></Icon>
);
const PinIcon = ({ size = 13 }) => (
  <Icon size={size}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="2.6" /></Icon>
);
const SunIcon = () => (
  <Icon size={16}><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></Icon>
);
const MoonIcon = () => (
  <Icon size={16}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Icon>
);
const SparkIcon = ({ size = 16 }) => (
  <Icon size={size}><path d="M12 3l1.9 5.4L19.5 10l-5.6 1.6L12 17l-1.9-5.4L4.5 10l5.6-1.6z" /></Icon>
);

const GitHubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.43 7.86 10.96.57.1.78-.25.78-.55v-2.03c-3.2.7-3.87-1.39-3.87-1.39-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.2.66.79.55 4.56-1.53 7.85-5.85 7.85-10.96C23.5 5.74 18.27.5 12 .5z" />
  </svg>
);

const LinkedInIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const MailIcon = ({ size = 15 }) => (
  <Icon size={size}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></Icon>
);

/* ─────────────────────────────────────────────────────────────
   Hooks & shared bits
   ───────────────────────────────────────────────────────────── */

function useInView(threshold = 0.1) {
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

function useManilaTime() {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-PH", {
      hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Manila",
    }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Reveal({ children }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(14px)",
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}

function Section({ id, children }) {
  return (
    <section id={id} className="section">
      <div className="shell">{children}</div>
    </section>
  );
}

function SectionHead({ num, label, title, lede }) {
  return (
    <div className="section-head">
      <p className="eyebrow"><em>{num}</em> — {label}</p>
      <h2 className="h2">{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────────────────────── */

function Hero() {
  const time = useManilaTime();

  return (
    <section id="hero" className="hero">
      <div className="shell">
        <div className="hero-grid">
          <div>
            <span className="status-pill">
              <span className="status-dot" />
              Available for AI engineering roles
            </span>

            <h1 className="hero-title">Carl Joshua<br />Coloma</h1>

            <p className="hero-role">
              AI &amp; Automation Engineer
              <span className="hero-role-sep">/</span>
              <span className="muted">Manila, Philippines</span>
            </p>

            <p className="hero-bio">
              I build reliable AI systems — agentic workflows, retrieval-augmented generation,
              and production-ready machine learning with Python. Most recently a{" "}
              <strong>Backend AI Engineer Intern at FlyRank AI</strong>, with earlier work in AI QA
              at SoFi AI and computer vision at Lamina Studios.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">View projects <ArrowUpRight /></a>
              <a
                className="btn btn-secondary"
                href="/cv-coloma.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Carl-Coloma-Resume.pdf"
              >
                <FileDown /> Download résumé
              </a>
            </div>

            <div className="social-row">
              <a className="social" href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer">
                <GitHubIcon /> GitHub
              </a>
              <a className="social" href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer">
                <LinkedInIcon /> LinkedIn
              </a>
              <a className="social" href="mailto:carljoshuamcoloma@gmail.com">
                <MailIcon /> Email
              </a>
            </div>

            <div className="hero-stats">
              {[
                ["03", "Internships"],
                ["05", "Projects shipped"],
                ["01", "Best thesis award"],
              ].map(([n, label]) => (
                <div className="hero-stat" key={label}>
                  <span className="stat-num">{n}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-side">
            <div className="portrait">
              <img src="/pic.jpeg" alt="Carl Joshua Coloma" />
            </div>
            <div className="portrait-cap">
              <span><PinIcon size={12} /> Manila, PH</span>
              <span>{time ? `${time} PHT` : "—"}</span>
            </div>
          </div>
        </div>

        <div id="ask" className="ask-wrap">
          <RagDemo />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   About
   ───────────────────────────────────────────────────────────── */

function AboutSection() {
  const facts = [
    ["Recent role", "Backend AI Engineer Intern · FlyRank AI"],
    ["Focus", "Agentic AI · LLMs · RAG · Evaluation"],
    ["Education", "BS Computer Science · FEU Tech · 2026"],
    ["Upskilling", "Databricks · dbt · Airflow · Snowflake"],
    ["Location", "Manila, Philippines"],
  ];

  return (
    <Section id="about">
      <Reveal>
        <SectionHead num="01" label="About" title="A bit about me" />
        <div className="about-grid">
          <div className="prose">
            <p className="body-lg">
              Hey, I'm CJ — an aspiring AI engineer and computer science graduate student from the
              Philippines. I bridge research-grade machine learning with real-world deployment:
              systems that are reliable, observable, and maintainable beyond the notebook.
            </p>
            <p className="body">
              I recently wrapped up my internship as a Backend AI Engineer Intern at FlyRank AI,
              working on LLM content generation and semantic ranking. Before that I was an AI QA
              Intern at SoFi AI Tech Solutions, building adversarial prompt suites and tracking
              hallucination rates, and an AI Engineer Intern at Lamina Studios, shipping real-time
              computer vision pipelines.
            </p>
            <p className="body">
              My focus is LLM evaluation, retrieval-augmented generation, and production
              observability. I care about systems that keep working when models don't.
            </p>
            <div className="focus-row">
              {["Agentic AI", "LLMs", "RAG", "Computer Vision", "ML Evaluation"].map((f) => (
                <span className="chip" key={f}>{f}</span>
              ))}
            </div>
          </div>

          <div className="facts-card">
            {facts.map(([label, value]) => (
              <div className="fact-row" key={label}>
                <span className="fact-label">{label}</span>
                <span className="fact-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Experience
   ───────────────────────────────────────────────────────────── */

function ExperienceSection() {
  return (
    <Section id="experience">
      <Reveal>
        <SectionHead
          num="02"
          label="Experience"
          title="Where I've worked"
          lede="Hands-on work building and evaluating AI systems in production-focused environments."
        />
        <div className="exp-list">
          {EXPERIENCE.map((exp) => (
            <article className="exp-item" key={`${exp.company}-${exp.period}`}>
              <div className="exp-meta">
                <span className="exp-period">{exp.period}</span>
                <span className="exp-company">{exp.company}</span>
              </div>
              <div>
                <h3 className="exp-role">{exp.role}</h3>
                <ul className="bullets">
                  {exp.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Projects
   ───────────────────────────────────────────────────────────── */

function ProjectRow({ project, index, onArchitecture }) {
  const isPrivate = !!project.private;
  const primary = isPrivate ? "#contact" : project.link;

  return (
    <article className="proj-row">
      <span className="proj-index">{String(index + 1).padStart(2, "0")}</span>

      <div className="proj-main">
        <div className="proj-head">
          <div className="proj-title-row">
            <h3 className="proj-title">{project.name}</h3>
            <span className="tag">{project.status}</span>
          </div>

          <div className="proj-actions">
            <button className="btn-ghost-sm" type="button" onClick={onArchitecture}>
              System architecture
            </button>
            <a
              className="icon-link"
              href={primary}
              target={isPrivate ? undefined : "_blank"}
              rel={isPrivate ? undefined : "noopener noreferrer"}
              aria-label={isPrivate ? "Request details" : `View ${project.name} on GitHub`}
              title={isPrivate ? "Request details" : "View project"}
            >
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <p className="proj-desc">{project.short}</p>

        <div className="proj-sub">
          <span>{project.type}</span>
          <span className="sep">·</span>
          <span>{project.year}</span>
          <span className="sep">·</span>
          <span>
            {project.tags.slice(0, 4).join(" / ")}
            {project.tags.length > 4 ? ` +${project.tags.length - 4}` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}

function ProjectsSection() {
  const [arch, setArch] = useState(null);

  useEffect(() => {
    if (!arch) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setArch(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [arch]);

  return (
    <Section id="projects">
      <Reveal>
        <SectionHead
          num="03"
          label="Projects"
          title="Selected work"
          lede="Applied AI systems across computer vision, NLP, and agentic workflows — built to be used, not just demoed."
        />
        <div className="projects-layout">
          <div className="proj-list">
            {PROJECTS.map((project, i) => (
              <ProjectRow
                key={project.title}
                project={project}
                index={i}
                onArchitecture={() => setArch(project)}
              />
            ))}
          </div>
          <GitHubCard />
        </div>
      </Reveal>

      {arch && (
        <div className="modal-backdrop" onClick={() => setArch(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`System architecture for ${arch.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h3 className="modal-title">System Architecture</h3>
                <p className="modal-sub">{arch.title}</p>
              </div>
              <button className="icon-btn" onClick={() => setArch(null)} aria-label="Close">
                <Icon size={16}><path d="M18 6 6 18M6 6l12 12" /></Icon>
              </button>
            </div>
            <Architecture project={arch.title} />
          </div>
        </div>
      )}
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stack
   ───────────────────────────────────────────────────────────── */

function StackSection() {
  return (
    <Section id="stack">
      <Reveal>
        <SectionHead
          num="04"
          label="Stack"
          title="Technical toolkit"
          lede="The tools I reach for when building agentic systems, retrieval pipelines, and reliable backend services."
        />
        <div className="stack-list">
          {SKILL_GROUPS.map((group) => (
            <div className="stack-row" key={group.label}>
              <h3 className="stack-label">{group.label}</h3>
              <p className="stack-items">{group.skills.join("  ·  ")}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Certifications
   ───────────────────────────────────────────────────────────── */

function CertificationsSection() {
  return (
    <Section id="certs">
      <Reveal>
        <SectionHead
          num="05"
          label="Certifications"
          title="Verified credentials"
          lede="Completed and verifiable certificates from Anthropic, Cisco, IBM, Certiport, and Udemy."
        />
        <div className="cert-grid">
          {CERTIFICATIONS.map((cert) => (
            <a
              className="cert-card"
              key={cert.name}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cert-img">
                <img
                  src={cert.image}
                  alt={cert.name}
                  loading="lazy"
                  draggable={false}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <div className="cert-body">
                <span className="cert-name">{cert.name}</span>
                <span className="cert-issuer">{cert.issuer}</span>
                <span className="cert-foot">
                  <span className="mono-label">{cert.date}</span>
                  <span className="text-link">Verify <ArrowUpRight size={12} /></span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   GitHub
   ───────────────────────────────────────────────────────────── */

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function GitHubCard() {
  const COLORS = useColors();
  const [data, setData] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const lastPush = repos.length ? repos[0].pushed_at : null;
        let latestCommit = null;
        if (pushedEvents.length) {
          const pe = pushedEvents[0];
          const commits = pe.payload?.commits || [];
          if (commits.length) {
            latestCommit = {
              sha: commits[commits.length - 1].sha?.slice(0, 7),
              message: commits[commits.length - 1].message,
              repo: pe.repo?.name,
            };
          }
        }
        if (!latestCommit && repos.length) {
          const latestRepo = repos[0].full_name;
          try {
            const commitRes = await fetch(`https://api.github.com/repos/${latestRepo}/commits?per_page=1`);
            if (commitRes.ok) {
              const commits = await commitRes.json();
              if (Array.isArray(commits) && commits[0]) {
                latestCommit = {
                  sha: commits[0].sha?.slice(0, 7),
                  message: (commits[0].commit?.message || "").split("\n")[0],
                  repo: latestRepo.split("/")[1],
                };
              }
            }
          } catch {
            // Keep the card usable even if the commit lookup is rate-limited.
          }
        }
        if (alive) setData({ lastPush, latestCommit });
      } catch {
        if (alive) setError("Couldn't load GitHub activity right now.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const days = contributions?.contributions || [];
  const total = days.reduce((sum, d) => sum + (d.count || 0), 0);

  const weeks = [];
  let current = [];
  if (days.length) {
    const firstDow = new Date(days[0].date + "T00:00:00").getDay();
    for (let i = 0; i < firstDow; i++) current.push(null);
  }
  for (const day of days) {
    current.push(day);
    if (current.length === 7) { weeks.push(current); current = []; }
  }
  if (current.length) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  const palette = COLORS.isDark
    ? ["rgba(255,255,255,0.06)", "rgba(229,72,77,0.22)", "rgba(229,72,77,0.42)", "rgba(229,72,77,0.68)", "#e5484d"]
    : ["rgba(9,9,11,0.06)", "rgba(217,45,45,0.18)", "rgba(217,45,45,0.36)", "rgba(217,45,45,0.60)", "#d92d2d"];

  const recentWeeks = weeks.slice(-26);

  return (
    <aside className="gh-card">
      <div className="gh-head">
        <span className="mono-label">GitHub · @cdobby18</span>
        <a
          className="icon-link"
          href="https://github.com/cdobby18"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub profile"
          title="GitHub profile"
        >
          <ArrowUpRight size={15} />
        </a>
      </div>

      <p className="gh-total">
        {contributions
          ? `${total.toLocaleString()} contribution${total === 1 ? "" : "s"} in the last year`
          : loading ? "Loading contributions…" : "Contribution activity"}
      </p>

      <p className="gh-range">Last 6 months</p>

      {recentWeeks.length > 0 ? (
        <>
          <div className="gh-graph">
            {recentWeeks.map((week, wi) => (
              <div className="gh-week" key={wi}>
                {week.map((day, di) => {
                  if (!day) return <span className="gh-cell" key={di} style={{ background: "transparent" }} />;
                  const level = Math.min(4, Math.max(0, day.level || 0));
                  return (
                    <span
                      className="gh-cell"
                      key={di}
                      title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                      style={{ background: palette[level] }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="gh-legend">
            <span>Less</span>
            {palette.map((color) => (
              <span className="gh-cell" key={color} style={{ background: color }} />
            ))}
            <span>More</span>
          </div>
        </>
      ) : (
        !loading && <p className="muted-note">{error || "Contribution graph unavailable right now."}</p>
      )}

      <div className="gh-foot">
        <div className="commit-card">
          {data?.latestCommit ? (
            <>
              <div className="commit-top">
                <span className="commit-repo">{data.latestCommit.repo}</span>
                <span className="commit-sha">{data.latestCommit.sha}</span>
              </div>
              <p className="commit-msg">{data.latestCommit.message}</p>
            </>
          ) : (
            <p className="muted-note">{loading ? "Loading latest activity…" : "No recent public commits."}</p>
          )}
        </div>
        <div className="gh-meta">
          <span><ClockIcon size={12} /> Last push {timeAgo(data?.lastPush)}</span>
        </div>
      </div>

      <div className="gh-how">
        <p className="gh-range">How I work</p>
        <ol className="gh-how-list">
          <li><span className="gh-how-num">01</span> Understand the problem before touching the model.</li>
          <li><span className="gh-how-num">02</span> Build the smallest version that works, then measure.</li>
          <li><span className="gh-how-num">03</span> Write code and docs someone else can maintain.</li>
        </ol>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────
   Contact
   ───────────────────────────────────────────────────────────── */

const EMAIL = "carljoshuamcoloma@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactSection() {
  const time = useManilaTime();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // "sent" | "error"
  const [copied, setCopied] = useState(false);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (status === "error") setStatus(null);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !EMAIL_RE.test(form.email.trim()) || !form.message.trim()) {
      setStatus("error");
      return;
    }
    const subject = encodeURIComponent(form.subject.trim() || `Portfolio enquiry from ${form.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  return (
    <Section id="contact">
      <Reveal>
        <div className="contact-intro">
          <div>
            <p className="eyebrow"><em>06</em> — Contact</p>
            <h2 className="h2">Let's build something reliable.</h2>
          </div>
          <div className="contact-intro-copy">
            <p className="body">
              I'm open to AI engineering opportunities, agentic system collaborations, and
              production ML work. Tell me what you're building — I'd like to hear about it.
            </p>
            <p className="contact-availability">
              <span className="status-dot" />
              Available for AI engineering roles
            </p>
          </div>
        </div>

        <div className="contact-spread">
          <div className="contact-direct">
            <p className="mono-label">Direct</p>
            <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <div className="contact-email-actions">
              <button className="contact-copy" type="button" onClick={copyEmail}>
                {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy email</>}
              </button>
              <span className="muted-note">Usually replies within a day</span>
            </div>

            <dl className="contact-meta">
              <div className="contact-meta-row">
                <dt>LinkedIn</dt>
                <dd>
                  <a href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer">
                    in/carl-joshua-coloma <ArrowUpRight size={11} />
                  </a>
                </dd>
              </div>
              <div className="contact-meta-row">
                <dt>GitHub</dt>
                <dd>
                  <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer">
                    github.com/cdobby18 <ArrowUpRight size={11} />
                  </a>
                </dd>
              </div>
              <div className="contact-meta-row">
                <dt>Based in</dt>
                <dd>Manila, Philippines</dd>
              </div>
              <div className="contact-meta-row">
                <dt>Local time</dt>
                <dd>{time ? `${time} PHT` : "—"}</dd>
              </div>
            </dl>

            <a
              className="contact-resume"
              href="/cv-coloma.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Carl-Coloma-Resume.pdf"
            >
              <FileDown size={14} /> Download résumé
            </a>
          </div>

          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="contact-form-head">
              <div>
                <p className="mono-label">Or send a note</p>
                <h3 className="contact-form-title">Start a conversation</h3>
              </div>
              <span className="muted-note">Opens in your email app</span>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">Subject <span className="optional">(optional)</span></label>
              <input
                id="subject"
                className="input"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="What's this about?"
              />
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className="input textarea"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell me about the role, project, or idea…"
                rows={5}
              />
            </div>

            <div className="contact-form-foot">
              <span className="form-note">I read every message.</span>
              <button className="btn btn-primary" type="submit">
                Send message <ArrowUpRight />
              </button>
            </div>

            {status === "error" && (
              <p className="form-status error">Please add your name, a valid email, and a message.</p>
            )}
            {status === "sent" && (
              <p className="form-status success">Your email app should open with the message ready to send.</p>
            )}
          </form>
        </div>
      </Reveal>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shell
   ───────────────────────────────────────────────────────────── */

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      className="to-top"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <Icon size={15}><path d="m18 15-6-6-6 6" /></Icon>
    </button>
  );
}

export default function OnePiece() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem("op-theme");
      if (stored) return stored !== "light";
    } catch { /* ignore */ }
    return typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  });

  const theme = isDark ? DARK : LIGHT;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const y = window.scrollY + 120;
      let current = "";
      for (const link of NAV_LINKS) {
        if (!link.id) continue;
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= y) current = link.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.background = theme.bg;
    document.body.style.background = theme.bg;
    document.body.style.color = theme.textPrimary;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    try { localStorage.setItem("op-theme", isDark ? "dark" : "light"); } catch { /* ignore */ }
  }, [theme, isDark]);

  const focusAI = () => {
    setMenuOpen(false);
    const panel = document.getElementById("ask");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      const input = document.getElementById("portfolio-ai-input");
      if (input) input.focus({ preventScroll: true });
    }, 450);
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        focusAI();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <ThemeCtx.Provider value={theme}>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: ${theme.bg};
          --surface: ${theme.surface};
          --surface-2: ${theme.surfaceHigh};
          --border: ${theme.border};
          --border-strong: ${theme.borderStrong};
          --text: ${theme.textPrimary};
          --text-2: ${theme.textSecondary};
          --muted: ${theme.textMuted};
          --accent: ${theme.accent};
          --accent-soft: ${theme.accentSoft};
          --accent-border: ${theme.accentBorder};
          --nav-bg: ${theme.navBg};
          --chip-bg: ${theme.chipBg};
          --chip-border: ${theme.chipBorder};
          --sans: ${SANS};
          --display: ${DISPLAY};
          --mono: ${MONO};
        }

        html { scroll-behavior: smooth; scroll-padding-top: 84px; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          font-kerning: normal;
        }
        #root { width: 100%; max-width: 100%; min-height: 100svh; text-align: left; }
        a { color: inherit; }
        button { font-family: inherit; }
        ::selection { background: var(--accent); color: #fff; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 8px; }
        a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        .shell {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding-left: clamp(20px, 5vw, 48px);
          padding-right: clamp(20px, 5vw, 48px);
        }
        .section { padding: clamp(64px, 8vw, 96px) 0; border-top: 1px solid var(--border); }
        .section-head { margin-bottom: clamp(32px, 4vw, 44px); }
        .eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .eyebrow em { color: var(--accent); font-style: normal; }
        .eyebrow::before {
          content: "";
          width: 22px;
          height: 1px;
          background: var(--accent);
          flex-shrink: 0;
        }
        .h2 {
          margin-top: 14px;
          font-family: var(--display);
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.035em;
          color: var(--text);
          text-wrap: balance;
        }
        .lede {
          margin-top: 14px;
          max-width: 620px;
          font-size: 15.5px;
          line-height: 1.75;
          color: var(--text-2);
        }
        .body { font-size: 15.5px; line-height: 1.85; color: var(--text-2); }
        .body-lg { font-size: 17px; line-height: 1.8; color: var(--text-2); }
        .prose > p + p { margin-top: 18px; }
        .muted { color: var(--muted) !important; }
        .muted-note { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .mono-label {
          font-family: var(--mono);
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .dot-sep { color: var(--muted); font-size: 12px; }

        /* nav */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 64px;
          border-bottom: 1px solid transparent;
          transition: background 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease;
        }
        .nav.scrolled {
          background: var(--nav-bg);
          border-bottom-color: var(--border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .nav-inner {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text);
          font-family: var(--display);
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }
        .brand-mark {
          width: 26px; height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-strong);
          border-radius: 6px;
          background: var(--surface);
          font-family: var(--mono);
          font-size: 10.5px;
          font-weight: 600;
        }
        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-link {
          position: relative;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 450;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .nav-link:hover { color: var(--text); background: var(--chip-bg); }
        .nav-link.active { color: var(--text); }
        .nav-link.active::after {
          content: "";
          position: absolute;
          left: 10px; right: 10px; bottom: 2px;
          height: 1.5px;
          border-radius: 2px;
          background: var(--accent);
        }
        .nav-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .icon-btn {
          width: 34px; height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: transparent;
          color: var(--text-2);
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .icon-btn:hover { color: var(--text); border-color: var(--border-strong); background: var(--chip-bg); }
        .kbd-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px 6px 11px;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: var(--surface);
          color: var(--text-2);
          font-size: 12.5px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .kbd-btn:hover { color: var(--text); border-color: var(--border-strong); }
        .kbd {
          font-family: var(--mono);
          font-size: 10px;
          padding: 2px 5px;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--chip-bg);
          color: var(--muted);
        }
        .hamburger { display: none; }
        .menu {
          display: none;
          position: fixed;
          top: 64px; left: 0; right: 0;
          z-index: 99;
          flex-direction: column;
          padding: 10px clamp(20px, 5vw, 48px) 20px;
          background: ${theme.mobileMenuBg};
          border-bottom: 1px solid var(--border);
          box-shadow: 0 24px 48px rgba(0,0,0,0.18);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        .menu.open { display: flex; }
        .menu-link {
          padding: 13px 2px;
          font-size: 15px;
          color: var(--text-2);
          text-decoration: none;
          border-bottom: 1px solid var(--strip-border, var(--border));
        }
        .menu-link:hover { color: var(--text); }
        .menu-foot { display: flex; gap: 8px; padding-top: 16px; flex-wrap: wrap; }

        /* buttons & links */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.2;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .btn-primary { background: var(--text); color: var(--bg); border-color: var(--text); }
        .btn-primary:hover { opacity: 0.85; }
        .btn-secondary { background: var(--surface); color: var(--text); border-color: var(--border-strong); }
        .btn-secondary:hover { background: var(--surface-2); border-color: var(--text-2); }
        .text-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 500;
          color: var(--accent);
          text-decoration: none;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
        .text-link:hover { text-decoration: underline; text-underline-offset: 3px; }
        .chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border: 1px solid var(--chip-border);
          border-radius: 999px;
          background: var(--chip-bg);
          font-size: 12px;
          color: var(--text-2);
        }

        /* hero */
        .hero {
          padding-top: calc(52px + clamp(28px, 5vw, 56px));
          padding-bottom: clamp(44px, 6vw, 72px);
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.82fr);
          gap: clamp(32px, 5vw, 64px);
          align-items: start;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px;
          border: 1px solid var(--accent-border);
          border-radius: 999px;
          background: var(--accent-soft);
          color: var(--text-2);
          font-family: var(--mono);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
          flex-shrink: 0;
        }
        .hero-title {
          margin-top: 20px;
          font-family: var(--display);
          font-size: clamp(42px, 6vw, 68px);
          font-weight: 600;
          line-height: 1.02;
          letter-spacing: -0.045em;
          color: var(--text);
        }
        .hero-role {
          margin-top: 16px;
          font-size: 16px;
          font-weight: 500;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .hero-role-sep { color: var(--border-strong); font-weight: 400; }
        .hero-bio {
          margin-top: 18px;
          max-width: 560px;
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-2);
        }
        .hero-bio strong { color: var(--text); font-weight: 600; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .social-row { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 26px; }
        .social {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: var(--text-2);
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .social:hover { color: var(--accent); }
        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(28px, 5vw, 56px);
          margin-top: 34px;
          padding-top: 22px;
          border-top: 1px solid var(--border);
        }
        .hero-stat { display: flex; flex-direction: column; gap: 3px; }
        .stat-num {
          font-family: var(--display);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--text);
        }
        .stat-label {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .hero-side { display: flex; flex-direction: column; }
        .portrait {
          position: relative;
          aspect-ratio: 4 / 5;
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          background: var(--surface-2);
          box-shadow: var(--shadow);
        }
        .portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 18%;
          display: block;
          filter: saturate(0.95);
        }
        .portrait-cap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .portrait-cap span { display: inline-flex; align-items: center; gap: 5px; }
        .ask-wrap { margin-top: clamp(44px, 6vw, 64px); scroll-margin-top: 88px; }

        /* about */
        .about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: clamp(32px, 5vw, 56px);
          align-items: start;
        }
        .focus-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
        .focus-row .chip {
          border-color: var(--accent-border);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .facts-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          padding: 4px 18px;
        }
        .fact-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 13px 0;
          border-bottom: 1px solid var(--border);
        }
        .fact-row:last-child { border-bottom: 0; }
        .fact-label {
          font-family: var(--mono);
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .fact-value { font-size: 13.5px; line-height: 1.5; color: var(--text-2); }

        /* experience */
        .exp-list { display: flex; flex-direction: column; }
        .exp-item {
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          gap: clamp(20px, 3vw, 36px);
          padding: 28px 0;
          border-top: 1px solid var(--border);
        }
        .exp-item:last-child { border-bottom: 1px solid var(--border); }
        .exp-meta { display: flex; flex-direction: column; gap: 4px; }
        .exp-period {
          font-family: var(--mono);
          font-size: 11.5px;
          letter-spacing: 0.02em;
          color: var(--muted);
        }
        .exp-company { font-size: 13.5px; font-weight: 500; color: var(--text); }
        .exp-role {
          font-family: var(--display);
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        .bullets {
          list-style: none;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .bullets li {
          position: relative;
          padding-left: 16px;
          font-size: 14.5px;
          line-height: 1.75;
          color: var(--text-2);
        }
        .bullets li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.72em;
          width: 5px;
          height: 1px;
          background: var(--accent);
        }

        /* projects */
        .projects-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: clamp(24px, 4vw, 44px);
          align-items: start;
        }
        .proj-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border);
        }
        .proj-row {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          gap: 18px;
          padding: 18px 12px;
          margin: 0 -12px;
          border-bottom: 1px solid var(--border);
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        .proj-row:hover { background: var(--surface); }
        .proj-index {
          padding-top: 4px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--muted);
        }
        .proj-main { min-width: 0; }
        .proj-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .proj-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          min-width: 0;
        }
        .proj-title {
          font-family: var(--display);
          font-size: 16.5px;
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        .proj-desc {
          margin-top: 4px;
          max-width: 780px;
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--text-2);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .proj-sub {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 7px;
          font-family: var(--mono);
          font-size: 10.5px;
          letter-spacing: 0.02em;
          color: var(--muted);
        }
        .proj-sub .sep { opacity: 0.5; }
        .tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border: 1px solid var(--chip-border);
          border-radius: 5px;
          background: var(--chip-bg);
          font-family: var(--mono);
          font-size: 9.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-2);
        }
        .proj-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .btn-ghost-sm {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border: 1px solid var(--border-strong);
          border-radius: 7px;
          background: transparent;
          color: var(--text-2);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
        }
        .btn-ghost-sm:hover {
          color: var(--accent);
          border-color: var(--accent-border);
          background: var(--accent-soft);
        }
        .icon-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          border: 1px solid var(--border-strong);
          border-radius: 7px;
          color: var(--text-2);
          text-decoration: none;
          transition: all 0.18s ease;
        }
        .icon-link:hover {
          color: var(--accent);
          border-color: var(--accent-border);
          background: var(--accent-soft);
        }

        /* stack */
        .stack-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border);
        }
        .stack-row {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: clamp(16px, 3vw, 40px);
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }
        .stack-label {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        .stack-items {
          font-size: 14px;
          line-height: 1.9;
          color: var(--text-2);
        }

        /* certifications */
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }
        .cert-card {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          overflow: hidden;
          text-decoration: none;
          transition: border-color 0.2s ease, transform 0.25s ease;
        }
        .cert-card:hover { border-color: var(--border-strong); transform: translateY(-2px); }
        .cert-img {
          height: 108px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
        }
        .cert-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .cert-body { display: flex; flex-direction: column; gap: 4px; flex: 1; padding: 14px 16px 16px; }
        .cert-name { font-family: var(--display); font-size: 15px; font-weight: 600; line-height: 1.35; color: var(--text); }
        .cert-issuer { font-size: 12.5px; color: var(--text-2); }
        .cert-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 12px;
        }

        /* github */
        .gh-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          padding: 18px;
        }
        .gh-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 6px;
        }
        .gh-total { font-size: 14px; font-weight: 500; line-height: 1.5; color: var(--text); }
        .gh-range {
          margin-top: 16px;
          font-family: var(--mono);
          font-size: 9.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .gh-graph { display: flex; gap: 2px; overflow-x: auto; padding: 8px 0 4px; }
        .gh-week { display: flex; flex-direction: column; gap: 2px; }
        .gh-card .gh-cell { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; display: inline-block; }
        .gh-legend {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 3px;
          margin-top: 8px;
          font-family: var(--mono);
          font-size: 9px;
          color: var(--muted);
        }
        .gh-legend span:first-child { margin-right: 4px; }
        .gh-legend span:last-child { margin-left: 4px; }
        .gh-foot {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }
        .commit-card {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          padding: 10px 12px;
          min-width: 0;
        }
        .commit-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
        .commit-repo { font-family: var(--mono); font-size: 10px; font-weight: 600; color: var(--accent); }
        .commit-sha { font-family: var(--mono); font-size: 9.5px; color: var(--muted); }
        .commit-msg {
          font-size: 12px;
          line-height: 1.5;
          color: var(--text);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .gh-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.04em;
          color: var(--muted);
        }
        .gh-meta span { display: inline-flex; align-items: center; gap: 6px; }
        .gh-how {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }
        .gh-how .gh-range { margin-top: 0; }
        .gh-how-list {
          margin: 10px 0 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .gh-how-list li {
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr);
          gap: 6px;
          font-size: 12px;
          line-height: 1.55;
          color: var(--text-2);
        }
        .gh-how-num {
          font-family: var(--mono);
          font-size: 9.5px;
          line-height: 1.9;
          color: var(--muted);
        }

        /* contact */
        .contact-intro {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
          gap: clamp(26px, 5vw, 64px);
          align-items: end;
          padding-bottom: clamp(28px, 4vw, 40px);
        }
        .contact-intro .h2 { max-width: 15ch; }
        .contact-intro-copy { padding-bottom: 4px; }
        .contact-intro-copy .body { max-width: 430px; }
        .contact-availability {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 16px;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .contact-spread {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          border-top: 1px solid var(--border);
        }
        .contact-direct {
          padding: clamp(28px, 4vw, 38px) clamp(24px, 4vw, 44px) 0 0;
          border-right: 1px solid var(--border);
        }
        .contact-email {
          display: inline-block;
          margin-top: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid var(--border-strong);
          font-family: var(--display);
          font-size: clamp(17px, 1.5vw, 19px);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.035em;
          color: var(--text);
          text-decoration: none;
          overflow-wrap: anywhere;
          transition: color 0.18s ease, border-color 0.18s ease;
        }
        .contact-email:hover { color: var(--accent); border-color: var(--accent); }
        .contact-email-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 12px;
        }
        .contact-copy {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0 0 2px;
          border: 0;
          border-bottom: 1px solid var(--border-strong);
          background: none;
          font-family: var(--mono);
          font-size: 9.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          transition: color 0.18s ease, border-color 0.18s ease;
        }
        .contact-copy:hover { color: var(--text); border-color: var(--text); }
        .contact-meta { margin: 30px 0 0; }
        .contact-meta-row {
          display: grid;
          grid-template-columns: 88px minmax(0, 1fr);
          gap: 14px;
          padding: 11px 0;
          border-top: 1px solid var(--border);
        }
        .contact-meta-row:last-child { border-bottom: 1px solid var(--border); }
        .contact-meta dt {
          padding-top: 2px;
          font-family: var(--mono);
          font-size: 9.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .contact-meta dd {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--text);
        }
        .contact-meta dd a {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .contact-meta dd a:hover { color: var(--accent); }
        .contact-resume {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 22px;
          padding-bottom: 3px;
          border-bottom: 1px solid var(--border-strong);
          font-size: 12.5px;
          color: var(--text-2);
          text-decoration: none;
          transition: color 0.18s ease, border-color 0.18s ease;
        }
        .contact-resume:hover { color: var(--accent); border-color: var(--accent); }
        .contact-form {
          padding: clamp(28px, 4vw, 38px) 0 0 clamp(24px, 4vw, 44px);
        }
        .contact-form-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .contact-form-title {
          margin-top: 7px;
          font-family: var(--display);
          font-size: 23px;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.03em;
          color: var(--text);
        }
        .contact-form .field { margin-bottom: 18px; }
        .contact-form .input {
          padding: 8px 0;
          border: 0;
          border-bottom: 1px solid var(--border-strong);
          border-radius: 0;
          background: transparent;
        }
        .contact-form .input:focus {
          border-color: var(--accent);
          box-shadow: none;
        }
        .contact-form .textarea { min-height: 112px; resize: vertical; }
        .contact-form-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 4px;
        }
        .contact-form-foot .form-note { margin: 0; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .field label {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .optional { text-transform: none; letter-spacing: 0.02em; opacity: 0.7; }
        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          font-size: 14px;
          line-height: 1.5;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .input::placeholder { color: var(--muted); }
        .input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .textarea { resize: vertical; min-height: 130px; }
        .form-note { margin-top: 10px; font-size: 11.5px; color: var(--muted); }
        .form-status { margin-top: 10px; font-size: 12.5px; line-height: 1.5; }
        .form-status.error { color: var(--accent); }
        .form-status.success { color: #2e9e5b; }

        /* footer */
        .footer { border-top: 1px solid var(--border); padding: 28px 0; }
        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 12.5px;
          color: var(--muted);
        }
        .footer-links { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .footer-links a { color: var(--muted); text-decoration: none; transition: color 0.18s ease; }
        .footer-links a:hover { color: var(--text); }
        .to-top {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 90;
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 9px;
          background: var(--nav-bg);
          color: var(--text-2);
          cursor: pointer;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: var(--shadow);
          transition: all 0.18s ease;
        }
        .to-top:hover { color: var(--text); border-color: var(--border-strong); transform: translateY(-2px); }

        /* modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .modal {
          width: 100%;
          max-width: 920px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--surface);
          box-shadow: var(--shadowLg);
        }
        .modal-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }
        .modal-title {
          font-family: var(--display);
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        .modal-sub { margin-top: 3px; font-size: 12.5px; color: var(--muted); }

        @media (max-width: 960px) {
          .nav-links { display: none; }
          .kbd-btn { display: none; }
          .hamburger { display: inline-flex; }
        }
        @media (min-width: 961px) {
          .menu { display: none !important; }
        }
        @media (max-width: 1040px) {
          .projects-layout { grid-template-columns: minmax(0, 1fr); gap: 32px; }
          .gh-card { max-width: 440px; }
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
          .hero-side { max-width: 300px; width: 100%; }
        }
        @media (max-width: 820px) {
          .about-grid { grid-template-columns: minmax(0, 1fr); gap: 28px; }
          .contact-intro { grid-template-columns: minmax(0, 1fr); align-items: start; gap: 20px; }
          .contact-intro .h2 { max-width: none; }
          .contact-spread { grid-template-columns: minmax(0, 1fr); }
          .contact-direct { padding-right: 0; border-right: 0; }
          .contact-form { margin-top: 28px; padding: 28px 0 0; border-top: 1px solid var(--border); }
        }
        @media (max-width: 760px) {
          .exp-item { grid-template-columns: minmax(0, 1fr); gap: 10px; padding: 24px 0; }
          .exp-meta { flex-direction: row; align-items: center; gap: 10px; flex-wrap: wrap; }
          .proj-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 0;
            padding: 16px 0;
            margin: 0;
            border-radius: 0;
          }
          .proj-index { display: none; }
          .proj-head { gap: 10px; }
          .proj-actions { justify-content: flex-start; width: 100%; margin-top: 4px; }
          .stack-row { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 14px 0; }
        }
        @media (max-width: 520px) {
          .form-row { grid-template-columns: minmax(0, 1fr); }
          .hero-stats { gap: 24px; }
          .portrait-cap { font-size: 9px; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          html { scroll-behavior: auto; }
        }
      `}</style>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="shell nav-inner">
          <a className="brand" href="#hero">
            <span className="brand-mark">CJ</span>
            <span>Carl Coloma</span>
          </a>

          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id || link.href}
                className={`nav-link${link.id && active === link.id ? " active" : ""}`}
                href={link.href || `#${link.id}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button className="kbd-btn" type="button" onClick={focusAI}>
              <SparkIcon size={13} />
              Ask AI
              <span className="kbd">⌘K</span>
            </button>
            <button className="icon-btn" type="button" onClick={() => setIsDark((d) => !d)} aria-label="Toggle theme">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              className="icon-btn hamburger"
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen
                ? <Icon size={17}><path d="M18 6 6 18M6 6l12 12" /></Icon>
                : <Icon size={17}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>}
            </button>
          </div>
        </div>
      </nav>

      <div className={`menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a key={link.id || link.href} className="menu-link" href={link.href || `#${link.id}`} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <div className="menu-foot">
          <button className="kbd-btn" type="button" onClick={focusAI}>
            <SparkIcon size={13} /> Ask AI
          </button>
          <a className="btn btn-secondary" href="/cv-coloma.pdf" target="_blank" rel="noopener noreferrer">
            <FileDown /> Résumé
          </a>
        </div>
      </div>

      <main>
        <Hero />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <StackSection />
        <CertificationsSection />
        <ContactSection />
      </main>

      <footer className="footer">
        <div className="shell footer-inner">
          <span>© {new Date().getFullYear()} Carl Joshua Coloma</span>
          <div className="footer-links">
            <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`mailto:${EMAIL}`}>Email</a>
            <a href="/blog.html">Writing</a>
          </div>
        </div>
      </footer>

      <BackToTop />
    </ThemeCtx.Provider>
  );
}
