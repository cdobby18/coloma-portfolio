import { useState, useEffect, useRef } from "react";
import { useColors } from "../OnePiece";

const LOCAL_DOCS = [
  { id: "powerlift", title: "Powerlift — Thesis Project", text: "Powerlift is an AI biomechanics analyzer for powerlifting combining YOLOv8 pose estimation, Kalman filtering, and SVM classification. It runs in real time on mobile and won Overall Best Thesis (Computer Vision, Nov 2025)." },
  { id: "sunny-ai", title: "Sunny AI — RAG-Built Mentor", text: "Sunny AI is a guided platform for aspiring AI engineers built with React, Python, FastAPI, LLMs, and RAG using LangChain. It mentors learners from zero to job-ready." },
  { id: "resume-analyzer", title: "AI Resume Analyzer", text: "An NLP pipeline using spaCy NER and transformer semantic matching to extract skills from resumes, producing structured JSON. Processes 100+ docs/min." },
  { id: "doc-summarizer", title: "Document Summarizer", text: "Abstractive summarization for multi-page PDFs using BART and T5 with chunking and section-level synthesis." },
  { id: "resolve", title: "ReSOLVE — Customer Support Automation", text: "An agentic support platform that triages tickets by intent, priority, and sentiment, drafts grounded responses with RAG confidence scoring, and escalates to humans with deterministic fallbacks." },
  { id: "flyrank", title: "Backend AI Engineer Intern — FlyRank AI", text: "Built LLM-powered content generation and semantic ranking pipelines with embeddings and vector search. Worked on prompt engineering for production AI features." },
  { id: "sofi-qa", title: "AI QA Intern — SoFi AI Tech Solutions", text: "Designed adversarial prompt test suites targeting hallucination, refusal, and instruction-following failures in chatbots. Evaluated responses at scale." },
  { id: "lamina", title: "AI Engineer Intern — Lamina Studios", text: "Built real-time YOLOv8 object detection pipelines with OpenCV at production-ready inference speeds, trained XGBoost models, automated retraining." },
  { id: "skills-stack", title: "Technical Skills & Stack", text: "Python, JavaScript. AI/ML: PyTorch, scikit-learn, OpenCV, LangChain, Transformers, RAG, prompt engineering, LLM integration, agentic workflows. Data: MySQL, Qdrant, PostgreSQL. Tools: FastAPI, React, Git, pytest, Jupyter." },
  { id: "about", title: "About CJ — Carl Joshua Coloma", text: "CJ is Carl Joshua Coloma, an aspiring AI engineer and CS graduate student from the Philippines (FEU Tech, 2026). Focus: agentic AI, LLMs, RAG, production observability. Won Overall Best Thesis for Powerlift. Open to AI engineering roles." },
  { id: "contact", title: "Contact", text: "Email: carljoshuamcoloma@gmail.com. GitHub: github.com/cdobby18. LinkedIn: linkedin.com/in/carl-joshua-coloma." },
  { id: "education", title: "Education", text: "BS Computer Science, FEU Institute of Technology, graduating 2026. Exchange semester at National Sun Yat-sen University, Taiwan." },
];

const SUGGESTIONS = [
  "What is Powerlift?",
  "Tell me about your internships",
  "What's your tech stack?",
  "How can I contact you?",
];

function localAnswer(q) {
  const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 1);
  const scored = LOCAL_DOCS.map((doc) => {
    const text = (doc.title + " " + doc.text).toLowerCase();
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) score += w.length > 2 ? 2 : 1;
    }
    return { doc, score };
  }).sort((a, b) => b.score - a.score);
  const matches = scored.filter((r) => r.score > 0).slice(0, 2);
  const top = matches.length ? matches[0].doc : null;
  const answer = top
    ? top.text
    : "I'm CJ's portfolio assistant. Ask me about his projects, internships, skills, or contact details.";
  return { answer, matches: matches.map((m) => ({ doc: m.doc, score: m.score })) };
}

export default function RagDemo() {
  const COLORS = useColors();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | searching | typing
  const streamRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

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
      return localAnswer(q);
    }
  }

  function streamAnswer(answer) {
    clearInterval(streamRef.current);
    const parts = (answer.match(/[^.!?\s][^.!?]*[.!?]+|\S[^.!?]*$/g) || [answer])
      .map((s) => s.trim())
      .filter(Boolean);
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
    }, 150);
  }

  async function runQuery(q) {
    const value = q.trim();
    if (!value || phase !== "idle") return;
    setQuery("");
    setMessages((m) => [...m, { role: "user", text: value }]);
    setPhase("searching");
    const { answer, matches } = await fetchAnswer(value);
    setMessages((m) => [...m, { role: "ai", text: "", matches }]);
    streamAnswer(answer);
  }

  function reset() {
    clearInterval(streamRef.current);
    streamRef.current = null;
    setMessages([]);
    setQuery("");
    setPhase("idle");
    if (inputRef.current) inputRef.current.focus();
  }

  const status = phase === "searching" ? "Retrieving" : phase === "typing" ? "Writing" : "Ready";
  const statusColor = phase === "idle" ? "#2e9e5b" : COLORS.accent;

  return (
    <div
      className="ai-card"
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        background: COLORS.surface,
        boxShadow: COLORS.isDark ? "0 1px 0 rgba(255,255,255,0.03) inset" : "0 1px 2px rgba(9,9,11,0.04)",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
          padding: "18px 20px",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: COLORS.accentSoft,
              border: `1px solid ${COLORS.accentBorder}`,
              color: COLORS.accent,
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.9 5.4L19.5 10l-5.6 1.6L12 17l-1.9-5.4L4.5 10l5.6-1.6z" />
            </svg>
          </span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "'Space Grotesk', Inter, sans-serif", fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, letterSpacing: "-0.01em" }}>
              Portfolio AI
            </p>
            <p style={{ fontSize: 12.5, color: COLORS.textMuted, marginTop: 2 }}>
              Ask anything about my projects, experience, and stack.
            </p>
          </div>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "4px 10px",
            borderRadius: 999,
            border: `1px solid ${COLORS.chipBorder}`,
            background: COLORS.chipBg,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: COLORS.textMuted,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
          {status}
        </span>
      </div>

      {/* thread */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: messages.length ? 140 : 0,
          maxHeight: 300,
          overflowY: "auto",
          padding: messages.length ? "18px 20px" : "0 20px",
        }}
      >
        {messages.length === 0 && (
          <div style={{ padding: "20px 0 4px" }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textSecondary, maxWidth: 620 }}>
              Answers are retrieved from a small corpus of my work — ask about Powerlift, my
              internships, the stack I use, or how to get in touch.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 8,
                marginTop: 14,
              }}
            >
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="ai-suggestion"
                  onClick={() => runQuery(q)}
                  style={{
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.chipBorder}`,
                    background: COLORS.chipBg,
                    color: COLORS.textSecondary,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12.5,
                    lineHeight: 1.4,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          if (m.role === "user") {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "8px 12px",
                    borderRadius: "10px 10px 3px 10px",
                    background: COLORS.chipBg,
                    border: `1px solid ${COLORS.chipBorder}`,
                    color: COLORS.textPrimary,
                    fontSize: 13,
                    lineHeight: 1.55,
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          }
          return (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  background: COLORS.accentSoft,
                  border: `1px solid ${COLORS.accentBorder}`,
                  color: COLORS.accent,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                AI
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: COLORS.textPrimary, fontSize: 13.5, lineHeight: 1.75, whiteSpace: "pre-line" }}>
                  {m.text}
                  {phase === "typing" && isLast && <span style={{ opacity: 0.5 }}> ▍</span>}
                </p>
                {(m.matches || []).length > 0 && !(phase === "typing" && isLast) && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textMuted }}>
                      Sources
                    </span>
                    {(m.matches || []).slice(0, 3).map(({ doc }) => (
                      <span
                        key={doc.id}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 5,
                          border: `1px solid ${COLORS.chipBorder}`,
                          background: COLORS.chipBg,
                          color: COLORS.textMuted,
                          fontSize: 10.5,
                        }}
                      >
                        {doc.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {phase === "searching" && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              style={{
                width: 24, height: 24, borderRadius: 7,
                background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`,
                color: COLORS.accent, display: "inline-flex", alignItems: "center",
                justifyContent: "center", fontSize: 9, fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
              }}
            >
              AI
            </span>
            <span style={{ fontSize: 13, color: COLORS.textMuted, animation: "aiPulse 1.1s ease-in-out infinite" }}>
              Retrieving relevant context…
            </span>
          </div>
        )}
      </div>

      {/* input */}
      <form
        onSubmit={(e) => { e.preventDefault(); runQuery(query); }}
        style={{
          display: "flex",
          gap: 8,
          padding: "14px 20px 18px",
          borderTop: `1px solid ${COLORS.border}`,
          marginTop: messages.length ? 0 : 12,
        }}
      >
        <input
          id="portfolio-ai-input"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={phase === "idle" ? "Ask a question about my work…" : "Assistant is working…"}
          disabled={phase !== "idle"}
          aria-label="Ask the portfolio assistant"
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.bg,
            color: COLORS.textPrimary,
            fontFamily: "Inter, sans-serif",
            fontSize: 13.5,
            outline: "none",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.accent; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
        />
        <button
          type="submit"
          disabled={phase !== "idle" || !query.trim()}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: COLORS.accent,
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            cursor: phase === "idle" && query.trim() ? "pointer" : "default",
            opacity: phase === "idle" && query.trim() ? 1 : 0.55,
            transition: "opacity 0.18s ease",
            flexShrink: 0,
          }}
        >
          Ask
        </button>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            aria-label="Clear conversation"
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: `1px solid ${COLORS.chipBorder}`,
              background: "transparent",
              color: COLORS.textMuted,
              fontSize: 13,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Clear
          </button>
        )}
      </form>

      <style>{`
        @keyframes aiPulse { 0%, 100% { opacity: 0.45 } 50% { opacity: 1 } }
        .ai-suggestion:hover {
          border-color: var(--accent-border) !important;
          color: var(--text) !important;
          background: var(--accent-soft) !important;
        }
      `}</style>
    </div>
  );
}
