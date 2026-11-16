import { useState, useEffect, useRef } from "react";

const LOCAL_DOCS = [
  { id: "powerlift", title: "Powerlift — Thesis Project", text: "Powerlift is an AI biomechanics analyzer for powerlifting combining YOLOv8 pose estimation, Kalman filtering, and SVM classification. It runs in real time on mobile and won Overall Best Thesis (Computer Vision, Nov 2025)." },
  { id: "sunny-ai", title: "Sunny AI — RAG-Built Mentor", text: "Sunny AI is a guided platform for aspiring AI engineers built with React, Python, FastAPI, LLMs, and RAG using LangChain. It mentors learners from zero to job-ready." },
  { id: "resume-analyzer", title: "AI Resume Analyzer", text: "An NLP pipeline using spaCy NER and transformer semantic matching to extract skills from resumes, producing structured JSON. Processes 100+ docs/min." },
  { id: "doc-summarizer", title: "Document Summarizer", text: "Abstractive summarization for multi-page PDFs using BART and T5 with chunking and section-level synthesis." },
  { id: "resolve", title: "ReSOLVE — Customer Support Automation", text: "An agentic support platform that triages tickets by intent, priority, and sentiment, drafts grounded responses with RAG confidence scoring, and escalates to humans with deterministic fallbacks." },
  { id: "automation", title: "AI Automation Focus", text: "CJ builds LLM-powered workflows for support triage, document intake, and research operations. He starts by mapping the manual process, then automates one step at a time with deterministic fallbacks, citations, human approval for irreversible actions, retries, idempotency, and audit logs. ReSOLVE is his featured automation project." },
  { id: "flyrank", title: "Backend AI Engineer Intern — FlyRank AI", text: "Built LLM-powered content generation and semantic ranking pipelines with embeddings and vector search. Worked on prompt engineering for production AI features. Internship ran July to October 2026." },
  { id: "sofi-qa", title: "AI QA Intern — SoFi AI Tech Solutions", text: "Designed adversarial prompt test suites targeting hallucination, refusal, and instruction-following failures in chatbots. Evaluated responses at scale. Internship ran April to July 2026." },
  { id: "lamina", title: "AI Engineer Intern — Lamina Studios", text: "Built real-time YOLOv8 object detection pipelines with OpenCV at production-ready inference speeds, trained XGBoost models, automated retraining. Internship ran December 2025 to April 2026." },
  { id: "internships", title: "Internship Experience Overview", text: "Completed three AI engineering internships: Lamina Studios in computer vision (Dec 2025 to Apr 2026), SoFi AI Tech Solutions in AI QA (Apr to Jul 2026), and FlyRank AI in backend AI engineering (Jul to Oct 2026)." },
  { id: "skills-stack", title: "Technical Skills & Stack", text: "Python, JavaScript. AI/ML: PyTorch, scikit-learn, OpenCV, LangChain, Transformers, RAG, prompt engineering, LLM integration, agentic workflows. Data: MySQL, Qdrant, PostgreSQL. Tools: FastAPI, React, Git, pytest, Jupyter." },
  { id: "about", title: "About CJ — Carl Joshua Coloma", text: "CJ is Carl Joshua Coloma, an AI automation engineer and BS Computer Science graduate from the Philippines (FEU Tech, 2026). Focus: AI, automation, and agentic workflows, with hands-on work in LLMs, RAG, and LLM evaluation. Won Overall Best Thesis for Powerlift. Open to AI automation roles." },
  { id: "contact", title: "Contact", text: "Email: carljoshuamcoloma@gmail.com. GitHub: github.com/cdobby18. LinkedIn: linkedin.com/in/carl-joshua-coloma." },
  { id: "education", title: "Education", text: "BS Computer Science, FEU Institute of Technology (2026)." },
];

const CONTACT_REPLY =
  "You can reach CJ at carljoshuamcoloma@gmail.com. GitHub is github.com/cdobby18, and LinkedIn is linkedin.com/in/carl-joshua-coloma.";

const INTENTS = [
  {
    id: "greeting",
    match: /^\s*(hi|hey|hello|yo|sup|good (morning|afternoon|evening))[\s!,.?]*$/i,
    reply: "I can answer questions about CJ's automation work, projects, and technical background.",
  },
  {
    id: "thanks",
    match: /^\s*(thanks|thank you|ty|appreciate it)[\s!,.?]*$/i,
    reply: "You're welcome. Ask anything else about CJ's work.",
  },
  {
    id: "contact",
    match: /\b(contact|email|e-mail|reach|get in touch|linkedin|github)\b/i,
    reply: CONTACT_REPLY,
  },
  {
    id: "availability",
    match: /\b(available|availability|open to work|open to roles|hiring|hire|recruit|job opportunity|full[- ]time role|looking for a role)\b/i,
    reply: "CJ is open to AI automation roles and select workflow projects, especially work around LLM workflows, agentic systems, and human-in-the-loop operations. His most recent internship at FlyRank AI ended in October 2026, so he's available now. Email is the fastest way to reach him: carljoshuamcoloma@gmail.com.",
  },
  {
    id: "current",
    match: /\b(currently|current work|right now|working on|these days|latest role|recent role|most recent|now)\b/i,
    reply: "CJ's most recent role was a Backend AI Engineer internship at FlyRank AI, which ended in October 2026. He's now focused on AI automation — building LLM workflows with guardrails and human oversight — and is open to new roles.",
  },
  {
    id: "flyrank",
    match: /\bflyrank\b/i,
    reply: "CJ was a Backend AI Engineer Intern at FlyRank AI from July to October 2026. He built LLM-powered content generation and semantic ranking pipelines, integrated embedding models with vector search, and worked on prompt engineering for production AI features.",
  },
  {
    id: "sofi",
    match: /\bsofi\b/i,
    reply: "CJ was an AI QA Intern at SoFi AI Tech Solutions from April to July 2026. He designed adversarial prompt test suites for hallucination, refusal, and instruction-following failures, evaluated chatbot responses at scale, and worked with ML teams to reduce error rates.",
  },
  {
    id: "lamina",
    match: /\blamina\b/i,
    reply: "CJ was an AI Engineer Intern at Lamina Studios from December 2025 to April 2026. He built real-time YOLOv8 object detection pipelines with OpenCV, trained XGBoost models on time-series data, and automated model retraining.",
  },
  {
    id: "automation",
    match: /\b(automation|automate|automated|workflows?|triage|human[- ]in[- ]the[- ]loop|guardrails?)\b/i,
    reply: "CJ builds LLM-powered workflows for support triage, document intake, and research operations. He starts by mapping the manual process, then automates one step at a time with deterministic fallbacks, citations, human approval for irreversible actions, retries, idempotency, and audit logs. ReSOLVE is his featured automation project — a support platform that triages tickets and drafts grounded replies with human escalation.",
  },
  {
    id: "ai-focus",
    match: /\b(rag|retrieval|llms?|agents?|agentic|prompt engineering|computer vision)\b/i,
    reply: "CJ's AI work centers on LLMs, RAG, and agentic systems. He's built retrieval pipelines with embeddings and vector search at FlyRank, a RAG-based mentor with LangChain for Sunny AI, and adversarial evaluation for chatbots at SoFi. His computer vision work includes real-time YOLOv8 detection and the Powerlift thesis.",
  },
  {
    id: "internships",
    match: /\b(internships?|interns?|work experience|experience|worked|companies)\b/i,
    reply: "CJ has completed three AI engineering internships: Lamina Studios in computer vision (Dec 2025–Apr 2026), SoFi AI Tech Solutions in AI QA (Apr–Jul 2026), and FlyRank AI in backend AI engineering (Jul–Oct 2026). FlyRank was the most recent, and that internship has wrapped up.",
  },
  {
    id: "powerlift",
    match: /\bpowerlift\b/i,
    reply: "Powerlift is CJ's thesis project: an AI biomechanics analyzer for powerlifting. It combines YOLOv8 pose estimation, Kalman filtering for motion stabilization, and an SVM for lift-phase classification, all running in real time on mobile hardware. It won Overall Best Thesis in the Computer Vision category in November 2025.",
  },
  {
    id: "sunny",
    match: /\bsunny\b/i,
    reply: "Sunny AI is a guided platform CJ built for aspiring AI engineers — React and FastAPI on the outside, LLMs and RAG with LangChain underneath. It mentors learners from zero to job-ready by mixing fundamentals with production AI practices.",
  },
  {
    id: "resume",
    match: /\b(resume|résumé|ats)\b/i,
    reply: "The AI Resume Analyzer is an NLP pipeline that extracts skills and experience from resumes using spaCy NER plus transformer-based semantic matching, then returns structured JSON for ranking or ATS use. It processes more than 100 documents a minute and is built with Python and FastAPI.",
  },
  {
    id: "summarizer",
    match: /\b(summarizer|summarization|summarize|bart|t5)\b/i,
    reply: "The Document Summarizer is an abstractive summarization system for long PDFs. It uses BART and T5, chunks documents to fit context limits, then merges section-level summaries into one coherent output.",
  },
  {
    id: "projects",
    match: /\b(projects?|portfolio|built|what has cj built)\b/i,
    reply: "CJ's main projects are ReSOLVE, Powerlift, Sunny AI, the AI Resume Analyzer, and the Document Summarizer. ReSOLVE is the automation showcase — a support platform that triages tickets, drafts grounded replies, and escalates to humans. Powerlift won Overall Best Thesis in Computer Vision. He's happy to go deeper on any of them.",
  },
  {
    id: "stack",
    match: /\b(stack|skills?|tech|tools|technologies|languages?|frameworks?)\b/i,
    reply: "CJ's core stack is Python and JavaScript. For AI/ML he works with PyTorch, scikit-learn, OpenCV, LangChain, Transformers, RAG, and prompt engineering; for data, MySQL, PostgreSQL, and Qdrant; and for tooling, FastAPI, React, Git, pytest, and Jupyter. He's also building up on the data-engineering side with SQL, dbt, Airflow, and Databricks.",
  },
  {
    id: "education",
    match: /\b(education|school|university|degree|study|studied|student|feu)\b/i,
    reply: "CJ graduated with a BS in Computer Science from FEU Institute of Technology (2026).",
  },
  {
    id: "about",
    match: /\b(about cj|about you|about him|about yourself|who is cj|who are you|your background|his background|what do you do)\b/i,
    reply: "CJ is Carl Joshua Coloma, an AI automation engineer and BS Computer Science graduate from FEU Tech. His hands-on work spans computer vision, LLMs, RAG, and agentic workflows, and he cares most about building AI that works in production — with guardrails, fallbacks, and a human in the loop.",
  },
];

function localAnswer(q) {
  const text = q.trim();
  const intent = INTENTS.find((item) => item.match.test(text));
  if (intent) {
    return { answer: intent.reply, matches: [] };
  }

  const words = text.toLowerCase().split(/\W+/).filter((w) => w.length > 1);
  const scored = LOCAL_DOCS.map((doc) => {
    const haystack = (doc.title + " " + doc.text).toLowerCase();
    let score = 0;
    for (const w of words) {
      if (haystack.includes(w)) score += w.length > 2 ? 2 : 1;
    }
    return { doc, score };
  }).sort((a, b) => b.score - a.score);
  const matches = scored.filter((r) => r.score > 0).slice(0, 2);
  const top = matches.length ? matches[0].doc : null;
  const answer = top
    ? top.text
    : "I don't have that in the portfolio context yet. The fastest way to reach CJ is carljoshuamcoloma@gmail.com.";
  return { answer, matches: matches.map((m) => ({ doc: m.doc, score: m.score })) };
}

const PROMPTS = [
  { label: "What has CJ automated?", query: "What has CJ automated?" },
  { label: "Walk me through ReSOLVE", query: "Tell me about ReSOLVE" },
  { label: "What's his stack?", query: "What is CJ's stack?" },
  { label: "Is he open to roles?", query: "Is CJ open to roles?" },
];

function Sparkle({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.9 5.4L19.5 10l-5.6 1.6L12 17l-1.9-5.4L4.5 10l5.6-1.6z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export default function RagDemo() {
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

  const status = phase === "searching" ? "Searching" : phase === "typing" ? "Writing" : "Ready";

  return (
    <div className="ai-card" aria-busy={phase !== "idle"}>
      <div className="ai-head">
        <div className="ai-brand">
          <span className="ai-mark" aria-hidden="true"><Sparkle /></span>
          <div className="ai-brand-text">
            <p className="ai-title">Portfolio AI</p>
            <p className="ai-sub">Answers about CJ's work, projects, and stack.</p>
          </div>
        </div>
        <div className="ai-head-actions">
          {messages.length > 0 && (
            <button type="button" onClick={reset} className="ai-new">
              New chat
            </button>
          )}
          <span className={`ai-status${phase === "idle" ? "" : " ai-status--busy"}`}>
            <span className="ai-status-dot" aria-hidden="true" />
            {status}
          </span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="ai-empty">
          <p className="ai-intro">
            Ask about CJ's automation work, projects, or technical background.
          </p>
          <div className="ai-prompts">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt.query}
                type="button"
                className="ai-prompt"
                onClick={() => runQuery(prompt.query)}
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="ai-thread" ref={scrollRef} role="log" aria-live="polite">
          {messages.map((m, i) => {
            const isLast = i === messages.length - 1;
            if (m.role === "user") {
              return (
                <div className="ai-row ai-row--user" key={i}>
                  <div className="ai-user">{m.text}</div>
                </div>
              );
            }
            return (
              <div className="ai-row" key={i}>
                <span className="ai-avatar" aria-hidden="true"><Sparkle size={12} /></span>
                <div className="ai-answer">
                  <p>
                    {m.text}
                    {phase === "typing" && isLast && <span className="ai-caret" aria-hidden="true" />}
                  </p>
                  {(m.matches || []).length > 0 && !(phase === "typing" && isLast) && (
                    <div className="ai-sources">
                      <span className="ai-sources-label">Sources</span>
                      {(m.matches || []).slice(0, 3).map(({ doc }) => (
                        <span className="ai-source" key={doc.id}>{doc.title}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {phase === "searching" && (
            <div className="ai-row">
              <span className="ai-avatar" aria-hidden="true"><Sparkle size={12} /></span>
              <div className="ai-answer">
                <span className="ai-dots" role="status">
                  <span className="ai-sr">Searching portfolio</span>
                  <span /><span /><span />
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <form
        className="ai-form"
        onSubmit={(e) => { e.preventDefault(); runQuery(query); }}
      >
        <input
          id="portfolio-ai-input"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={phase === "idle" ? "Ask about my work…" : "Assistant is working…"}
          disabled={phase !== "idle"}
          aria-label="Ask the portfolio assistant"
          className="ai-input"
        />
        <button
          type="submit"
          disabled={phase !== "idle" || !query.trim()}
          aria-label="Send question"
          className="ai-send"
        >
          <SendIcon />
        </button>
      </form>

      <style>{`
        .ai-card {
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
          box-shadow: var(--shadow);
        }
        .ai-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          padding: 15px 18px;
          border-bottom: 1px solid var(--border);
        }
        .ai-brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
        .ai-mark {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--accent-border);
          border-radius: 9px;
          background: var(--accent-soft);
          color: var(--accent);
        }
        .ai-brand-text { min-width: 0; }
        .ai-title {
          font-family: var(--display);
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        .ai-sub { margin-top: 2px; font-size: 12px; color: var(--muted); }
        .ai-head-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .ai-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 9px;
          border: 1px solid var(--chip-border);
          border-radius: 999px;
          background: var(--chip-bg);
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--muted);
          flex-shrink: 0;
        }
        .ai-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #2e9e5b;
          box-shadow: 0 0 0 3px rgba(46, 158, 91, 0.14);
        }
        .ai-status--busy .ai-status-dot {
          background: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
          animation: aiBlink 1.2s ease-in-out infinite;
        }
        .ai-empty { padding: 16px 18px 4px; }
        .ai-intro {
          max-width: 620px;
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--text-2);
        }
        .ai-prompts { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
        .ai-prompt {
          padding: 6px 11px;
          border: 1px solid var(--chip-border);
          border-radius: 999px;
          background: var(--chip-bg);
          color: var(--text-2);
          font-family: var(--sans);
          font-size: 12px;
          line-height: 1.4;
          text-align: left;
          cursor: pointer;
          transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .ai-prompt:hover {
          color: var(--text);
          border-color: var(--accent-border);
          background: var(--accent-soft);
        }
        .ai-thread {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 320px;
          overflow-y: auto;
          padding: 16px 18px;
        }
        .ai-row { display: flex; align-items: flex-start; gap: 10px; }
        .ai-row--user { justify-content: flex-end; }
        .ai-user {
          max-width: 82%;
          padding: 8px 12px;
          border: 1px solid var(--chip-border);
          border-radius: 10px 10px 3px 10px;
          background: var(--chip-bg);
          color: var(--text);
          font-size: 13px;
          line-height: 1.55;
        }
        .ai-avatar {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
          border: 1px solid var(--accent-border);
          border-radius: 7px;
          background: var(--accent-soft);
          color: var(--accent);
        }
        .ai-answer { flex: 1; min-width: 0; max-width: 780px; }
        .ai-answer p {
          font-size: 13.5px;
          line-height: 1.75;
          color: var(--text);
          white-space: pre-line;
        }
        .ai-caret {
          display: inline-block;
          width: 1px;
          height: 13px;
          margin-left: 2px;
          vertical-align: -2px;
          background: var(--accent);
          animation: aiCaret 1s step-end infinite;
        }
        .ai-sources { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 9px; }
        .ai-sources-label {
          font-family: var(--mono);
          font-size: 8.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .ai-source {
          padding: 2px 8px;
          border: 1px solid var(--chip-border);
          border-radius: 5px;
          background: var(--chip-bg);
          color: var(--muted);
          font-size: 10.5px;
          line-height: 1.5;
        }
        .ai-dots { display: inline-flex; align-items: center; gap: 4px; padding: 7px 0; }
        .ai-dots > span:not(.ai-sr) {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--muted);
          animation: aiDot 1.1s ease-in-out infinite;
        }
        .ai-dots > span:nth-child(3) { animation-delay: 0.15s; }
        .ai-dots > span:nth-child(4) { animation-delay: 0.3s; }
        .ai-form {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px 14px;
          border-top: 1px solid var(--border);
        }
        .ai-input {
          flex: 1 1 auto;
          min-width: 0;
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          font-size: 13.5px;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .ai-input::placeholder { color: var(--muted); }
        .ai-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .ai-input:disabled { opacity: 0.7; }
        .ai-send {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 8px;
          background: var(--accent);
          color: #ffffff;
          cursor: pointer;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .ai-send:disabled { opacity: 0.45; cursor: default; }
        .ai-send:not(:disabled):hover { transform: translateY(-1px); }
        .ai-new {
          flex-shrink: 0;
          padding: 4px 2px;
          border: none;
          background: transparent;
          color: var(--muted);
          font-family: var(--sans);
          font-size: 11.5px;
          cursor: pointer;
          transition: color 0.18s ease;
        }
        .ai-new:hover { color: var(--text); }
        .ai-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        @keyframes aiCaret { 50% { opacity: 0; } }
        @keyframes aiDot {
          0%, 80%, 100% { opacity: 0.28; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
        @keyframes aiBlink { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
        @media (max-width: 560px) {
          .ai-head { padding: 14px 15px; }
          .ai-empty { padding: 14px 15px 2px; }
          .ai-thread { padding: 14px 15px; max-height: 360px; }
          .ai-form { padding: 11px 15px 13px; }
          .ai-sub { display: none; }
        }
      `}</style>
    </div>
  );
}
