import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["About", "Stack", "Experience", "Projects", "Certificates", "Contact"];

const SKILLS = [
  { group: "Languages", items: ["Python", "JavaScript", "SQL", "C++", "PHP", "Java"] },
  { group: "AI / ML", items: ["Scikit-learn", "PyTorch", "TensorFlow", "Weights & Biases", "Transformers"] },
  { group: "NLP & LLMs", items: ["spaCy", "Embeddings", "Fine-tuning", "Prompt Engineering", "RAG", "LangChain", "LangGraph", "BERT", "GPT"] },
  { group: "Computer Vision", items: ["OpenCV", "MediaPipe", "YOLOv8"] },
  { group: "Backend / AI APIs", items: ["FastAPI", "Flask", "Pydantic", "JWT Authentication", "Rate Limiting", "REST APIs"] },
  { group: "Tools", items: ["Git", "Jupyter", "Kaggle", "n8n", "MySQL", "Vector Database"] },
];

const EXPERIENCE = [
  {
    role: "AI QA Intern",
    company: "SoFi AI Tech Solutions Inc.",
    period: "2026 - Present",
    points: [
      "Stress-tested conversational AI systems using edge-case prompts and evaluation workflows.",
      "Performed prompt analysis and hallucination classification for model reliability.",
      "Collaborated with ML teams to improve response consistency and AI behavior.",
    ],
  },
  {
    role: "AI Engineer Intern",
    company: "Lamina Studios",
    period: "2025 - 2026",
    points: [
      "Built real-time computer vision pipelines with YOLOv8 and OpenCV.",
      "Developed predictive analytics systems using Scikit-learn and XGBoost.",
      "Automated AI workflows with n8n reducing repetitive manual operations.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Powerlift",
    type: "Computer Vision",
    desc: "AI-powered biomechanics analysis system for powerlifting performance evaluation using YOLOv8, Kalman Filtering, and SVM classification. Designed to analyze lifting mechanics in real time through computer vision, motion tracking, and posture analysis to provide automated lift assessment, movement stabilization, and performance feedback for squat, bench press, and deadlift exercises.",
    metric: "30+ FPS · Mobile Application",
    tags: ["Python","YOLOv8", "Kalman Filtering", "SVM", "MoveNet"],
    accent: "#06b6d4",
    featured: true,
    link: "https://github.com/cdobby18/powerlift-frontend",
  },
  {
    title: "AI Resume Analyzer",
    type: "NLP System",
    desc: "Resume parsing and skill extraction pipeline with entity recognition and semantic matching.",
    metric: "100+ resumes/min",
    tags: ["NLP", "spaCy", "Transformers"],
    accent: "#0ea5e9",
    link: "https://github.com/cdobby18/resume_analyzer",
  },
  {
    title: "Document Summarizer",
    type: "Transformer Pipeline",
    desc: "Abstractive PDF summarization system powered by Hugging Face transformer models.",
    metric: "Multi-page summarization",
    tags: ["BART", "T5", "PDF"],
    accent: "#10b981",
    link: "https://github.com/cdobby18/ai-summarizer",
  },
  {
    title: "AI Engineering Roadmap",
    type: "Learning System",
    desc: "Structured roadmap from Python to ML to LLMs to RAG to production AI systems.",
    metric: "End-to-end AI learning system",
    tags: ["Python", "ML", "LLMs", "RAG"],
    accent: "#8b5cf6",
    link: "https://github.com/cdobby18/AI-Roadmap",
  },
];

const CERTIFICATIONS = [
  {
    title: "AI Engineer",
    issuer: "Udemy",
    desc: "Advanced AI course covering machine learning and deep learning fundamentals.",
    link: "https://www.udemy.com/certificate/UC-ce6b30a4-237b-469c-9f60-0039ab82713f/",
    badge: "AI",
    color: "#06b6d4",
  },
  {
    title: "Python Expert",
    issuer: "Credly",
    desc: "Mastered Python programming and advanced scripting concepts.",
    link: "https://www.credly.com/earner/earned/badge/8ef3efc3-7e58-4ef2-b349-32f818814c5b",
    badge: "PY",
    color: "#3b82f6",
  },
  {
    title: "Intro to Modern AI",
    issuer: "Credly",
    desc: "Core concepts of modern AI including ML and neural networks.",
    link: "https://www.credly.com/badges/fc10a9c7-172e-47b7-b817-f1116e8b9846/public_url",
    badge: "ML",
    color: "#a855f7",
  },
  {
    title: "JavaScript Essentials",
    issuer: "Credly",
    desc: "Fundamentals of JavaScript programming and ES6+ features.",
    link: "https://www.credly.com/earner/earned/badge/2d0c3b41-ee3f-4616-af62-2b3a55be3890",
    badge: "JS",
    color: "#f59e0b",
  },
  {
    title: "Web Development Fundamentals",
    issuer: "Credly",
    desc: "Interface design principles, wireframing, and user experience.",
    link: "https://www.credly.com/badges/b610ac88-9103-441c-9874-f79ea071a605/linked_in_profile",
    badge: "WD",
    color: "#06b6d4",
  },
  {
    title: "Introduction to Data Science",
    issuer: "Credly",
    desc: "Foundations of data science, analytics, and visualization using Python.",
    link: "https://www.credly.com/badges/fde949db-9414-4ed4-85d3-d7fccab61366/public_url",
    badge: "DS",
    color: "#10b981",
  },
];

function useInView(threshold = 0.15) {
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
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.25em" }}>{num}</span>
      <div style={{ width: 42, height: 1, background: "#00ff88" }} />
      <span style={{ color: "#555", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em" }}>{text}</span>
    </div>
  );
}

function Hero() {
  const [typed, setTyped] = useState("");
  const phrases = ["AI Engineer", "AI Solutions", "Quality Assurance"];
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
        if (charIndex - 1 === 0) { setDeleting(false); setPhraseIndex((p) => (p + 1) % phrases.length); setCharIndex(0); }
        else setCharIndex((p) => p - 1);
      }
    }, deleting ? 45 : 90);
    return () => clearTimeout(timeout);
  }, [typed, deleting, charIndex, phraseIndex]);

  return (
    <section id="about" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "center", gap: 80, padding: "120px clamp(24px, 6vw, 96px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "60%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(0,255,136,0.08), transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 16px", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 999, background: "rgba(0,255,136,0.06)", marginBottom: 28 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88" }} />
          <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.15em" }}>OPEN TO WORK</span>
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(58px, 9vw, 110px)", lineHeight: 0.95, letterSpacing: "-0.05em", color: "#f5f5f5", marginBottom: 18 }}>
          Carl Joshua<br /><span style={{ color: "#00ff88" }}>Coloma.</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, height: 42, marginBottom: 28, fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(18px, 2vw, 28px)", color: "#9a9a9a" }}>
          <span style={{ color: "#00ff88" }}>&gt;</span>
          <span>{typed}</span>
          <span style={{ color: "#00ff88", animation: "blink 1s step-end infinite" }}>|</span>
        </div>
        <p style={{ maxWidth: 620, color: "#9c9c9c", fontFamily: "Inter, sans-serif", fontSize: 17, lineHeight: 1.9, marginBottom: 42 }}>
          AI engineering enthusiast focused on developing scalable applications, intelligent workflows, and impactful user experiences.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="#projects" style={{ padding: "14px 28px", borderRadius: 8, background: "#00ff88", color: "#000", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em", fontWeight: 700, transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>VIEW PROJECTS</a>
          <a href="#contact" style={{ padding: "14px 28px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", color: "#f5f5f5", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em", background: "rgba(255,255,255,0.03)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#00ff88"; e.currentTarget.style.color = "#00ff88"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#f5f5f5"; }}>CONTACT ME</a>
        </div>
      </div>

      {/* Terminal card — NO borderBottom, uses background shade instead */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 500, borderRadius: 24, border: "1px solid rgba(0,255,136,0.14)", background: "#0a0a0a", overflow: "hidden", boxShadow: "0 0 60px rgba(0,255,136,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 20px", background: "#111" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>AI ENGINEER</span>
              <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>ACTIVE</span>
            </div>
            {[["Mastery Level", "Junior AI Engineer"], ["Core Stack", "Python · ML · NLP"], ["Specialization", "AI · ML"]].map((item) => (
              <div key={item[0]} style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: "#555" }}>{item[0]}</span>
                <span style={{ color: "#f0f0f0" }}>{item[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  const [ref, visible] = useInView();
  return (
    <section id="stack" ref={ref} style={{ padding: "120px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
      <SectionLabel num="02" text="Technical Stack" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", color: "#f5f5f5", marginBottom: 20 }}>TECH<span style={{ color: "#00ff88" }}> STACK</span></h2>
      <p style={{ color: "#777", maxWidth: 680, lineHeight: 1.8, fontFamily: "Inter, sans-serif", textAlign: "center", margin: "0 auto 48px" }}>
        Tools and technologies used for machine learning systems, deployment, automation, and AI application development.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {SKILLS.map((skill) => (
          <div key={skill.group}
            style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 28, background: "#0a0a0a", transition: "all 0.3s ease", cursor: "default" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00ff88"; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,136,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <p style={{ color: "#00ff88", marginBottom: 16, fontSize: 11, letterSpacing: "0.15em", fontFamily: "'JetBrains Mono', monospace" }}>{skill.group.toUpperCase()}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {skill.items.map((item) => (
                <span key={item} style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ccc", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [ref, visible] = useInView();
  return (
    <section id="experience" ref={ref} style={{ padding: "120px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
      <SectionLabel num="03" text="Experience" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 60 }}>PROFESSIONAL<span style={{ color: "#00ff88" }}> EXPERIENCE</span></h2>
      <div style={{ position: "relative", paddingLeft: 32, display: "flex", flexDirection: "column", gap: 36 }}>
        {/* Gradient line replaces borderLeft — no white line */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(0,255,136,0.5) 0%, rgba(0,255,136,0.03) 100%)" }} />
        {EXPERIENCE.map((exp, i) => (
          <div key={i} style={{ position: "relative" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#00ff88", position: "absolute", left: -37, top: 10, boxShadow: "0 0 20px rgba(0,255,136,0.5)" }} />
            <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 28, background: "#080808" }}>
              <div style={{ marginBottom: 18 }}>
                <h3 style={{ color: "#f0f0f0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, marginBottom: 6 }}>{exp.role}</h3>
                <p style={{ color: "#555", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginBottom: 4 }}>{exp.company}</p>
                <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{exp.period}</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {exp.points.map((point) => (
                  <li key={point} style={{ display: "flex", gap: 12, color: "#9a9a9a", lineHeight: 1.8, fontFamily: "Inter, sans-serif" }}>
                    <span style={{ color: "#00ff88", flexShrink: 0, marginTop: 3 }}>&#9658;</span>{point}
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
  const [ref, visible] = useInView();
  const featured = PROJECTS.find((p) => p.featured);
  const secondary = PROJECTS.filter((p) => !p.featured);
  return (
    <section id="projects" ref={ref} style={{ padding: "120px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
      <SectionLabel num="04" text="Projects" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 20, textAlign: "center" }}>FEATURED<span style={{ color: "#00ff88" }}> SYSTEMS</span></h2>
      <p style={{ color: "#777", maxWidth: 720, lineHeight: 1.8, fontFamily: "Inter, sans-serif", textAlign: "center", margin: "0 auto 52px" }}>
        Applied AI systems focused on real-world deployment, automation, computer vision, and intelligent NLP workflows.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
        <a href={featured.link} target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "block", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 36, background: "#0a0a0a", position: "relative", overflow: "hidden", transition: "all 0.3s ease", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00ff88"; e.currentTarget.style.boxShadow = "0 0 60px rgba(0,255,136,0.15)"; e.currentTarget.style.transform = "translateY(-6px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
          <div style={{ position: "absolute", top: -120, right: -120, width: 300, height: 300, background: "radial-gradient(circle, rgba(0,255,136,0.18), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em" }}>FEATURED PROJECT</span>
            <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, opacity: 0.7 }}>&#8599; GITHUB</span>
          </div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 42, margin: "0 0 12px" }}>{featured.title}</h3>
          <p style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", marginBottom: 24 }}>{featured.type}</p>
          <p style={{ color: "#9a9a9a", lineHeight: 1.9, fontFamily: "Inter, sans-serif", marginBottom: 28 }}>{featured.desc}</p>
          <div style={{ padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(0,255,136,0.16)", background: "rgba(0,255,136,0.05)", width: "fit-content", marginBottom: 24 }}>
            <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>&#9889; {featured.metric}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {featured.tags.map((tag) => (
              <span key={tag} style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#ccc", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{tag}</span>
            ))}
          </div>
        </a>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {secondary.map((project) => (
            <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit", display: "block", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, padding: 28, background: "#0a0a0a", transition: "all 0.3s ease", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = project.accent; e.currentTarget.style.boxShadow = `0 0 40px ${project.accent}22`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ color: project.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em" }}>{project.type}</p>
                <span style={{ color: project.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.65 }}>&#8599; GITHUB</span>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, marginBottom: 14 }}>{project.title}</h3>
              <p style={{ color: "#8e8e8e", lineHeight: 1.8, marginBottom: 20, fontFamily: "Inter, sans-serif" }}>{project.desc}</p>
              <span style={{ color: project.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>&#9889; {project.metric}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificatesSection() {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(null);
  return (
    <section id="certificates" ref={ref} style={{ padding: "120px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
      <SectionLabel num="05" text="Certifications" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 20, textAlign: "center" }}>
        MY <span style={{ color: "#00ff88" }}>CERTIFICATES</span>
      </h2>
      <p style={{ color: "#777", maxWidth: 680, lineHeight: 1.8, fontFamily: "Inter, sans-serif", textAlign: "center", margin: "0 auto 52px" }}>
        Verified credentials across AI engineering, machine learning, and software development from globally recognized platforms.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {CERTIFICATIONS.map((cert, i) => (
          <a key={cert.title} href={cert.link} target="_blank" rel="noopener noreferrer"
            style={{
              textDecoration: "none", color: "inherit",
              display: "flex", flexDirection: "column",
              border: `1px solid ${hovered === i ? cert.color + "55" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 20, overflow: "hidden", background: "#0a0a0a",
              transition: "all 0.3s ease",
              transform: hovered === i ? "translateY(-6px)" : "translateY(0)",
              boxShadow: hovered === i ? `0 0 40px ${cert.color}18` : "none",
              cursor: "pointer", position: "relative",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* colored top strip */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${cert.color}, ${cert.color}33)`, flexShrink: 0 }} />
            <div style={{ padding: "24px 24px 20px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                {/* badge */}
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${cert.color}15`, border: `1px solid ${cert.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: cert.color, flexShrink: 0 }}>
                  {cert.badge}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: cert.color, letterSpacing: "0.12em", padding: "3px 10px", borderRadius: 999, border: `1px solid ${cert.color}33`, background: `${cert.color}0d` }}>{cert.issuer.toUpperCase()}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#444" }}>&#8599; VIEW CERT</span>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: "#f0f0f0", marginBottom: 10, lineHeight: 1.3 }}>{cert.title}</h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#666", lineHeight: 1.7, flexGrow: 1 }}>{cert.desc}</p>
            </div>
            {/* bottom bar */}
            <div style={{ padding: "12px 24px", background: "#111", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: cert.color, boxShadow: `0 0 6px ${cert.color}` }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#444" }}>Verified Credential</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, visible] = useInView();
  return (
    <section id="contact" ref={ref} style={{ padding: "120px clamp(24px, 6vw, 96px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
      <SectionLabel num="06" text="Contact" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 20, textAlign: "center" }}>LET'S BUILD<span style={{ color: "#00ff88" }}> AI SYSTEMS</span></h2>
      <p style={{ color: "#777", maxWidth: 640, lineHeight: 1.8, fontFamily: "Inter, sans-serif", textAlign: "center", margin: "0 auto 48px" }}>
        Open to AI engineering opportunities, ML collaborations, and building production-ready intelligent systems.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, maxWidth: 900, margin: "0 auto" }}>
        {[
          { label: "EMAIL", value: "carljoshuamcoloma@gmail.com", link: "mailto:carljoshuamcoloma@gmail.com", icon: "&#9993;" },
          { label: "PHONE", value: "+63 917 450 4450", link: "tel:+639174504450", icon: "&#9990;" },
          { label: "GITHUB", value: "github.com/cdobby18", link: "https://github.com/cdobby18", icon: "&#9675;" },
          { label: "LINKEDIN", value: "linkedin.com/in/carl-joshua-coloma", link: "https://linkedin.com/in/carl-joshua-coloma", icon: "&#9670;" },
        ].map((item) => (
          <a key={item.label} href={item.link}
            target={item.link.startsWith("http") ? "_blank" : undefined}
            rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 26, background: "#0a0a0a", textDecoration: "none", display: "flex", flexDirection: "column", gap: 14, alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00ff88"; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,136,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <span style={{ fontSize: 18, color: "#00ff88" }} dangerouslySetInnerHTML={{ __html: item.icon }} />
            <div>
              <p style={{ color: "#00ff88", marginBottom: 6, fontSize: 11, letterSpacing: "0.15em", fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</p>
              <p style={{ color: "#f0f0f0", lineHeight: 1.7, wordBreak: "break-all", fontFamily: "Inter, sans-serif", fontSize: 14 }}>{item.value}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;500;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        html, body { background: #050505 !important; }
        body { color: #f5f5f5; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.4); border-radius: 4px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 900px) {
          #projects > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          #stack > div, #certificates > div, #contact > div { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 clamp(24px, 6vw, 96px)", background: scrolled ? "rgba(5,5,5,0.96)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", transition: "all 0.3s ease" }}>
        <a href="#about" style={{ color: "#f5f5f5", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16 }}>cjc<span style={{ color: "#00ff88" }}>.</span></a>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`}
              style={{ color: "#555", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#00ff88"; e.currentTarget.style.textShadow = "0 0 10px rgba(0,255,136,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; e.currentTarget.style.textShadow = "none"; }}>
              {link.toUpperCase()}
            </a>
          ))}
        </div>
      </nav>

      <main>
        <Hero />
        <StackSection />
        <ExperienceSection />
        <ProjectsSection />
        <CertificatesSection />
        <ContactSection />
      </main>

      <footer style={{ padding: "24px clamp(24px, 6vw, 96px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6e6969" }}>Carl Joshua Coloma · AI Engineer</span>
      </footer>
    </>
  );
}