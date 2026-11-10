import { useState, useEffect, useRef } from "react";
import { useColors } from "../OnePiece";

const EXAMPLE_QUERIES = [
  "What is Powerlift?",
  "Tell me about your internships",
  "What's your tech stack?",
];

const LOCAL_DOCS = [
  { id: "powerlift", title: "Powerlift — Thesis Project", text: "Powerlift is an AI biomechanics analyzer for powerlifting combining YOLOv8 pose estimation, Kalman filtering, and SVM classification. It runs in real time on mobile and won Overall Best Thesis (Computer Vision, Nov 2025)." },
  { id: "sunny-ai", title: "Sunny AI — RAG-Built Mentor", text: "Sunny AI is a guided platform for aspiring AI engineers built with React, Python, FastAPI, LLMs, and RAG using LangChain. It mentors learners from zero to job-ready." },
  { id: "ai-roadmap", title: "AI Engineering Roadmap — Learning Journal", text: "A self-study curriculum documenting the path into AI engineering with tutorials, core ML and LLM concepts, hands-on exercises, and applied projects. Covers Python, PyTorch, Transformers, RAG, evaluation." },
  { id: "resume-analyzer", title: "AI Resume Analyzer", text: "An NLP pipeline using spaCy NER and transformer semantic matching to extract skills from resumes, producing structured JSON. Processes 100+ docs/min." },
  { id: "doc-summarizer", title: "Document Summarizer", text: "Abstractive summarization for multi-page PDFs using BART and T5 with chunking and section-level synthesis." },
  { id: "flyrank", title: "Backend AI Engineer Intern — FlyRank AI", text: "Building LLM-powered content generation and semantic ranking pipelines with embeddings and vector search. Prompt engineering for production AI features." },
  { id: "sofi-qa", title: "AI QA Intern — SoFi AI Tech Solutions", text: "Designed adversarial prompt test suites targeting hallucination, refusal, and instruction-following failures in chatbots. Evaluated responses at scale." },
  { id: "lamina", title: "AI Engineer Intern — Lamina Studios", text: "Built real-time YOLOv8 object detection pipelines with OpenCV at production-ready inference speeds, trained XGBoost models, automated retraining." },
  { id: "skills-stack", title: "Technical Skills & Stack", text: "Python, JavaScript. AI/ML: PyTorch, TensorFlow, Scikit-learn, OpenCV, LangChain, Transformers, RAG, Prompt Engineering, LLM APIs, Agentic Workflows. Data: SQL, Databricks, ETL, dbt, Airflow, Snowflake, PySpark. Tools: FastAPI, Flask, React, Docker, Git, Qdrant." },
  { id: "internships-overview", title: "Internship Experience Overview", text: "Three AI engineering internships: Lamina Studios (computer vision, Dec 2025-Apr 2026), SoFi AI Tech Solutions (AI QA, Apr-Jul 2026), FlyRank AI (backend AI, Jul 2026-present)." },
  { id: "about", title: "About CJ — Carl Joshua Coloma", text: "CJ is Carl Joshua Coloma, an aspiring AI engineer and CS graduate student from the Philippines (FEU Tech, 2026). Focus: agentic AI, LLMs, RAG, production observability. Won Overall Best Thesis for Powerlift. Open to AI engineering roles." },
  { id: "contact", title: "Contact", text: "Email: carljoshuamcoloma@gmail.com. GitHub: github.com/cdobby18. LinkedIn: linkedin.com/in/carl-joshua-coloma." },
  { id: "education", title: "Education", text: "BS Computer Science, FEU Institute of Technology, graduating 2026. Exchange semester at National Sun Yat-sen University, Taiwan." },
];

function localAnswer(q) {
  const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 1);
  const scored = LOCAL_DOCS.map((doc) => {
    const text = (doc.title + " " + doc.text).toLowerCase();
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) {
        score += w.length > 2 ? 2 : 1;
      }
    }
    return { doc, score };
  }).sort((a, b) => b.score - a.score);
  const matches = scored.filter((r) => r.score > 0).slice(0, 2);
  const top = matches.length ? matches[0].doc : null;
  const answer = top ? top.text : "Hi! I'm CJ's portfolio assistant — ask about Carl Joshua Coloma's projects, internships, skills, or contact info."
  return { answer, matches: matches.map((m) => ({ doc: m.doc, score: m.score })) };
}

function MiniChat() {
  const COLORS = useColors();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | searching | typing
  const streamRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, phase]);

  useEffect(() => () => { if (streamRef.current) clearInterval(streamRef.current); }, []);

  async function fetchAnswer(q) {
    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      if (!data.answer) throw new Error("Empty answer");
      return { answer: data.answer, matches: data.matches || [] };
    } catch {
      const local = localAnswer(q);
      return { answer: local.answer, matches: local.matches };
    }
  }

  function streamAnswer(answer) {
    clearInterval(streamRef.current);
    const parts = (answer.match(/[^.!?\s][^.!?]*[.!?]+|\S[^.!?]*$/g) || [answer]).map((s) => s.trim()).filter(Boolean);
    setPhase("typing");
    let i = 0;
    streamRef.current = setInterval(() => {
      i += 1;
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last && last.role === "ai") {
          copy[copy.length - 1] = { ...last, text: parts.slice(0, i).join(" ") };
        }
        return copy;
      });
      if (i >= parts.length) {
        clearInterval(streamRef.current);
        streamRef.current = null;
        setPhase("idle");
      }
    }, 160);
  }

  async function runQuery(q) {
    if (!q.trim() || phase !== "idle") return;
    setQuery("");
    setMessages((m) => [...m, { role: "user", text: q.trim() }]);
    setPhase("searching");
    const { answer, matches } = await fetchAnswer(q.trim());
    setMessages((m) => [...m, { role: "ai", text: "", matches }]);
    streamAnswer(answer);
  }

  function reset() {
    clearInterval(streamRef.current);
    streamRef.current = null;
    setMessages([]);
    setQuery("");
    setPhase("idle");
  }

  const chipBtn = {
    padding: "5px 11px",
    borderRadius: 999,
    border: `1px solid ${COLORS.chipBorder}`,
    background: "transparent",
    color: COLORS.textMuted,
    fontFamily: "Inter, sans-serif",
    fontSize: 11.5,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const statusLabel = phase === "searching" ? "retrieving from corpus…" : phase === "typing" ? "generating response…" : "online";

  return (
    <div id="demo" style={{ width: "100%", border: `1px solid ${COLORS.accentBorder}`, borderRadius: 16, background: COLORS.surface, padding: 14, boxSizing: "border-box", boxShadow: `0 8px 28px ${COLORS.accent}12`, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: COLORS.textSecondary, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: phase === "idle" ? COLORS.accent : COLORS.textMuted, boxShadow: `0 0 0 3px ${COLORS.accent}22` }} />
          Portfolio AI
        </span>
        <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>{statusLabel}</span>
      </div>

      {/* Thread */}
      <div ref={scrollRef} style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 250, overflowY: "auto", paddingRight: 2, minHeight: messages.length ? undefined : 0 }}>
        {messages.length === 0 && (
          <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.6, margin: 0, padding: "2px 2px 4px" }}>
            Ask about my projects, internships, or skills — answers are retrieved live from a corpus.
          </p>
        )}
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          if (m.role === "user") {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ maxWidth: "85%", padding: "8px 12px", borderRadius: "13px 13px 4px 13px", background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`, color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 12.5, lineHeight: 1.5 }}>
                  {m.text}
                </div>
              </div>
            );
          }
          return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ width: 22, height: 22, borderRadius: 999, background: COLORS.accent, color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", marginTop: 2 }}>AI</span>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "9px 12px", borderRadius: "13px 13px 13px 4px", border: `1px solid ${COLORS.border}`, background: COLORS.chipBg, color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 12.5, lineHeight: 1.65, whiteSpace: "pre-line" }}>
                  {m.text}
                  {phase === "typing" && isLast && <span style={{ opacity: 0.55 }}> ▋</span>}
                </div>
                {(m.matches || []).length > 0 && !(phase === "typing" && isLast) && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>sources</span>
                    {(m.matches || []).slice(0, 3).map(({ doc }) => (
                      <span key={doc.id} style={{ padding: "3px 9px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 10.5 }}>
                        ◈ {doc.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {phase === "searching" && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 22, height: 22, borderRadius: 999, background: COLORS.accent, color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif" }}>AI</span>
            <div style={{ padding: "9px 12px", borderRadius: "13px 13px 13px 4px", border: `1px solid ${COLORS.border}`, background: COLORS.chipBg, color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 12.5, letterSpacing: "0.08em" }}>
              <span style={{ display: "inline-block", animation: "miniPulse 1.1s ease-in-out infinite" }}>◈ retrieving relevant context</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); runQuery(query); }} style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={phase === "idle" ? "Ask me about anything…" : "Assistant is working…"}
          disabled={phase !== "idle"}
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            padding: "9px 12px",
            borderRadius: 10,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.isDark ? "rgba(10,16,32,0.5)" : "rgba(255,255,255,0.6)",
            color: COLORS.textPrimary,
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={phase !== "idle"}
          style={{
            padding: "9px 16px",
            borderRadius: 10,
            border: "none",
            background: COLORS.accent,
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            cursor: phase === "idle" ? "pointer" : "default",
            opacity: phase === "idle" ? 1 : 0.6,
            transition: "all 0.2s ease",
          }}
        >
          Ask
        </button>
        {messages.length > 0 && (
          <button type="button" onClick={reset} aria-label="Clear conversation"
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              border: `1px solid ${COLORS.chipBorder}`,
              background: "transparent",
              color: COLORS.textMuted,
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              cursor: "pointer",
            }}>
            ✕
          </button>
        )}
      </form>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["What is Powerlift?", "Tech stack?", "Internships?"].map((q) => (
            <button key={q} type="button" onClick={() => runQuery(q)} style={chipBtn}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.textPrimary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.chipBorder; e.currentTarget.style.color = COLORS.textMuted; }}>
              {q}
            </button>
          ))}
        </div>
      )}
      <style>{`@keyframes miniPulse { 0%, 100% { opacity: 0.45 } 50% { opacity: 1 } }`}</style>
    </div>
  );
}

export default function RagDemo({ compact = false }) {
  const COLORS = useColors();

  if (compact) {
    return <MiniChat />;
  }

  // full section mode (unchanged below)
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function runQuery(q) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResults({ ...data, answer: (data.answer || "").replace(/\. /g, ".\n") });
    } catch {
      setError("Couldn't reach the retrieval backend — this demo's Python endpoint only runs on the deployed site, not local `vite dev`.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) runQuery(query.trim());
  }

  return (
    <section id="demo" style={{ padding: "56px clamp(24px, 6vw, 96px)", maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
            <path d="M3 6h18M3 12h18M3 18h18" />
            <circle cx="7" cy="6" r="1.5" fill={COLORS.accent} />
            <circle cx="12" cy="12" r="1.5" fill={COLORS.accent} />
            <circle cx="17" cy="18" r="1.5" fill={COLORS.accent} />
          </svg>
          <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Live Demo</span>
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 4.5vw, 42px)", color: COLORS.textPrimary, fontWeight: 700, letterSpacing: "-0.03em" }}>Ask the Portfolio</h2>
        <p style={{ color: COLORS.textSecondary, maxWidth: 620, lineHeight: 1.9, fontFamily: "Inter, sans-serif" }}>
          A compact RAG demo trained on my projects and experience. Chart a course with a question.
        </p>
      </div>

      <div style={{ position: "relative", border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: COLORS.isDark ? 0.08 : 0.06 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="map" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="0.5" fill={COLORS.accent} />
                <path d="M30 0 L30 60 M0 30 L60 30" stroke={COLORS.accentBorder} strokeWidth="0.3" strokeDasharray="2 4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map)" />
          </svg>
        </div>

        <div style={{ position: "relative", padding: "clamp(20px, 4vw, 32px)", display: "flex", flexDirection: "column", gap: 18 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me about anything…"
              style={{
                flex: "1 1 280px",
                padding: "11px 16px",
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                background: "transparent",
                color: COLORS.textPrimary,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "11px 22px",
                borderRadius: 10,
                border: "none",
                background: COLORS.accent,
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "Searching…" : "Plot course"}
            </button>
          </form>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => { setQuery(q); runQuery(q); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: `1px solid ${COLORS.chipBorder}`,
                  background: "transparent",
                  color: COLORS.textMuted,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accentBorder; e.currentTarget.style.color = COLORS.textPrimary; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.chipBorder; e.currentTarget.style.color = COLORS.textMuted; }}
              >
                {q}
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13, fontStyle: "italic" }}>
              {error}
            </p>
          )}

          {results && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ border: `1px solid ${COLORS.accentBorder}`, borderRadius: 12, padding: "16px 20px", background: COLORS.accentSoft }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Charted Answer
                  </p>
                </div>
                <p style={{ color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.8 }}>
                  {results.answer}
                </p>
              </div>

              {results.matches.length > 0 && (
                <div>
                  <p style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
                    Log Entries
                  </p>
                  <div className="rag-sources-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    {results.matches.map(({ doc, score }) => (
                      <div key={doc.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600 }}>{doc.title}</span>
                          <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>#{score}</span>
                        </div>
                        <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.7, margin: 0 }}>{doc.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
