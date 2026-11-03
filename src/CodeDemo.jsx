import { useState, useEffect, useRef } from "react";
import { useColors } from "./OnePiece"; // adjust path if OnePiece.jsx lives elsewhere

/**
 * CodeDemo
 * A self-contained "type it out, then run it" code block, inspired by the
 * animate-ui Code Block primitive (char-by-char writing + cursor + copy button),
 * but with a real Run step: it executes the snippet in the browser and shows
 * the captured console output.
 *
 * No external deps (no Shiki) — syntax highlighting is a light regex tokenizer,
 * enough for a short demo snippet.
 */

const DEMO = {
  title: "welcome.ts",
  lang: "ts",
  code: `const name = "Carl Joshua Coloma";
const role = "AI Engineer";
const skills = ["Python", "LLMs", "RAG", "FastAPI"];

console.log("Welcome to my portfolio! 👋");
console.log("I'm " + name + ", an aspiring " + role + ".");

for (const skill of skills) {
  console.log("- " + skill);
}

console.log("Thanks for stopping by!");`,
};

// ---------- tiny syntax highlighter (no deps) ----------
const KEYWORDS = /\b(function|const|let|var|return|if|else|for|while|new|class|import|from|export|default|typeof|of|in)\b/g;
const STRINGS = /(".*?"|'.*?'|`.*?`)/g;
const COMMENTS = /(\/\/.*$)/gm;
const NUMBERS = /\b(\d+\.?\d*)\b/g;

function highlight(line) {
  // escape html
  let safe = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tokens = [];
  let comment = safe.match(COMMENTS);
  if (comment) {
    const idx = safe.indexOf(comment[0]);
    const before = highlightInline(safe.slice(0, idx));
    return before + `<span class="tok-comment">${comment[0]}</span>`;
  }
  return highlightInline(safe);
}
function highlightInline(safe) {
  safe = safe.replace(STRINGS, (m) => `<span class="tok-string">${m}</span>`);
  safe = safe.replace(KEYWORDS, (m) => `<span class="tok-keyword">${m}</span>`);
  safe = safe.replace(NUMBERS, (m) => `<span class="tok-number">${m}</span>`);
  return safe;
}

// ---------- typing hook ----------
function useTyping(fullText, { duration = 2600, delay = 200, startWhenInView = true } = {}) {
  const ref = useRef(null);
  const [written, setWritten] = useState("");
  const [writing, setWriting] = useState(false);
  const [done, setDone] = useState(false);
  const [inView, setInView] = useState(!startWhenInView);

  useEffect(() => {
    if (!startWhenInView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startWhenInView]);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    let cancelled = false;
    const chars = fullText.length;
    const perChar = Math.max(6, duration / chars);
    const start = setTimeout(() => {
      setWriting(true);
      const tick = () => {
        if (cancelled) return;
        i++;
        setWritten(fullText.slice(0, i));
        if (i < chars) {
          setTimeout(tick, perChar);
        } else {
          setWriting(false);
          setDone(true);
        }
      };
      tick();
    }, delay);
    return () => { cancelled = true; clearTimeout(start); };
  }, [inView, fullText, duration, delay]);

  return { ref, written, writing, done };
}

// ---------- sandboxed-ish execution (fixed, non-user-editable snippet) ----------
function runSnippet(code) {
  const logs = [];
  const fakeConsole = {
    log: (...args) => logs.push(args.map(String).join(" ")),
    error: (...args) => logs.push("Error: " + args.map(String).join(" ")),
  };
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", code);
    fn(fakeConsole);
    return { ok: true, output: logs.length ? logs : ["(no output)"] };
  } catch (err) {
    return { ok: false, output: [String(err)] };
  }
}

export default function CodeDemo() {
  const COLORS = useColors();
  const { ref, written, writing, done } = useTyping(DEMO.code, { duration: 2800, delay: 300 });
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const lines = written.split("\n");

  const copy = async () => {
    try { await navigator.clipboard.writeText(DEMO.code); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const run = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(runSnippet(DEMO.code));
      setRunning(false);
    }, 350); // tiny delay so it reads as "running", not instant
  };

  return (
    <div
      ref={ref}
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        overflow: "hidden",
        background: COLORS.isDark ? "#0b0f1d" : "#0f172a",
        marginTop: 14,
        boxShadow: COLORS.isDark ? "0 12px 30px rgba(0,0,0,0.3)" : "0 12px 30px rgba(15,23,42,0.12)",
      }}
    >
      <style>{`
        .tok-keyword { color: #c084fc; }
        .tok-string  { color: #86efac; }
        .tok-number  { color: #fca5a5; }
        .tok-comment { color: #6b7280; font-style: italic; }
        .cd-cursor {
          display: inline-block; width: 7px; height: 15px; background: ${COLORS.accent};
          margin-left: 1px; vertical-align: text-bottom;
          animation: cdBlink 1s step-end infinite;
        }
        @keyframes cdBlink { 50% { opacity: 0; } }
      `}</style>

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444" }} />
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#eab308" }} />
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ marginLeft: 8, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{DEMO.title}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={copy}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.14)", color: "#cbd5e1", borderRadius: 7, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
          >
            {copied ? "copied ✓" : "copy"}
          </button>
          <button
            onClick={run}
            disabled={!done || running}
            style={{
              background: COLORS.accent, border: "none", color: "#0b1026", borderRadius: 7,
              padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: done ? "pointer" : "not-allowed",
              opacity: done ? 1 : 0.5, fontFamily: "Inter, sans-serif",
            }}
          >
            {running ? "running…" : "▶ run"}
          </button>
        </div>
      </div>

      {/* code */}
      <pre style={{ margin: 0, padding: "16px 18px", overflowX: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: "pre" }}>
            <span style={{ color: "#475569", display: "inline-block", width: 24, userSelect: "none" }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: highlight(line) }} />
            {writing && i === lines.length - 1 && <span className="cd-cursor" />}
          </div>
        ))}
      </pre>

      {/* output */}
      {result && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 18px", background: "rgba(0,0,0,0.25)" }}>
          <div style={{ color: "#64748b", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            output
          </div>
          {result.output.map((line, i) => (
            <div key={i} style={{ color: result.ok ? "#86efac" : "#fca5a5", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, lineHeight: 1.6 }}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}