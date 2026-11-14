
import { useState, useEffect, useRef } from "react";
import { useColors } from "./OnePiece";

// ---------- Demo code ----------
const DEMO = {
  title: "hello.js",
  lang: "js",
  code: `const me = {
  name: "Carl Joshua Coloma",
  chasing: "AI engineering",
  fuelsOn: ["curiosity", "play", "small wins"],
};

console.log("Hey! I'm " + me.name + " 👋");
console.log("currently chasing: " + me.chasing);
console.log("fueled by: " + me.fuelsOn.join(" + "));
console.log("");
console.log("psst — edit me, then hit ▶ run.");`,
};

// ---------- Tiny syntax highlighter ----------
const KEYWORDS =
  /\b(function|const|let|var|return|if|else|for|while|new|class|import|from|export|default|typeof|of|in)\b/g;

const STRINGS = /(".*?"|'.*?'|`.*?`)/g;
const COMMENTS = /(\/\/.*$)/gm;
const NUMBERS = /\b(\d+\.?\d*)\b/g;

function highlight(line) {
  // Escape HTML
  let safe = line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const comment = safe.match(COMMENTS);

  if (comment) {
    const idx = safe.indexOf(comment[0]);
    const before = highlightInline(safe.slice(0, idx));

    return before + `<span class="comment">${comment[0]}</span>`;
  }

  return highlightInline(safe);
}

function highlightInline(safe) {
  safe = safe.replace(
    STRINGS,
    (m) => `<span class="string">${m}</span>`
  );

  safe = safe.replace(
    KEYWORDS,
    (m) => `<span class="keyword">${m}</span>`
  );

  safe = safe.replace(
    NUMBERS,
    (m) => `<span class="number">${m}</span>`
  );

  return safe;
}

// ---------- Typing animation hook ----------
function useTyping(
  fullText,
  { duration = 2600, delay = 200, startWhenInView = true } = {}
) {
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
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, [startWhenInView]);

  useEffect(() => {
    if (!inView) return;

    let raf = 0;
    let cancelled = false;

    const startTime = performance.now() + delay;

    const tick = (now) => {
      if (cancelled) return;

      const elapsed = now - startTime;

      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, elapsed / duration);

      setWriting(t > 0 && t < 1);
      setWritten(
        fullText.slice(0, Math.ceil(t * fullText.length))
      );

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [inView, fullText, duration, delay]);

  return { ref, written, writing, done };
}

// ---------- Sandboxed code execution ----------
function runSnippet(code) {
  return new Promise((resolve) => {
    const workerSource = `
      const logs = [];

      const push = (...args) =>
        logs.push(args.map(String).join(" "));

      const fakeConsole = {
        log: push,
        info: push,
        warn: push,
        error: push
      };

      try {
        const fn = new Function("console", ${JSON.stringify(code)});
        fn(fakeConsole);

        self.postMessage({
          ok: true,
          logs: logs.length ? logs : ["(no output)"]
        });
      } catch (err) {
        push(String(err));

        self.postMessage({
          ok: false,
          logs
        });
      }
    `;

    let worker = null;

    const kill = setTimeout(() => {
      if (worker) worker.terminate();

      resolve({
        ok: false,
        output: ["timed out after 2s — infinite loop?"],
      });
    }, 2000);

    const finish = (result) => {
      clearTimeout(kill);

      if (worker) worker.terminate();

      resolve(result);
    };

    try {
      const blob = new Blob(
        [workerSource],
        { type: "application/javascript" }
      );

      const url = URL.createObjectURL(blob);

      worker = new Worker(url);

      URL.revokeObjectURL(url);

      worker.onmessage = (e) => {
        const { ok, logs } = e.data;

        finish({
          ok,
          output:
            logs && logs.length
              ? logs
              : ["(no output)"],
        });
      };

      worker.onerror = (e) => {
        finish({
          ok: false,
          output: [e.message || "worker error"],
        });
      };
    } catch (err) {
      // Fallback when Worker or Blob is unavailable
      clearTimeout(kill);

      resolve(runSnippetInline(code));
    }
  });
}

// ---------- Inline execution fallback ----------
function runSnippetInline(code) {
  const logs = [];

  const push = (...args) =>
    logs.push(args.map(String).join(" "));

  const fakeConsole = {
    log: push,
    info: push,
    warn: push,
    error: push,
  };

  try {
    const fn = new Function("console", code);

    fn(fakeConsole);

    return {
      ok: true,
      output: logs.length ? logs : ["(no output)"],
    };
  } catch (err) {
    push(String(err));

    return {
      ok: false,
      output: logs.length ? logs : [String(err)],
    };
  }
}

// ---------- Main CodeDemo component ----------
export default function CodeDemo() {
  const COLORS = useColors();

  const { ref, written, writing, done } = useTyping(
    DEMO.code,
    {
      duration: 2800,
      delay: 300,
    }
  );

  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [code, setCode] = useState(DEMO.code);
  const [editing, setEditing] = useState(false);

  const touched = code !== DEMO.code;

  const lines = (done ? code : written).split("\n");

  // ---------- Copy ----------
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}

    setCopied(true);

    setTimeout(() => setCopied(false), 1600);
  };

  // ---------- Run ----------
  const run = async () => {
    if (!done || running) return;

    setRunning(true);
    setResult(null);

    const [res] = await Promise.all([
      runSnippet(code),
      new Promise((r) => setTimeout(r, 350)),
    ]);

    setResult(res);
    setRunning(false);
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
        boxShadow: COLORS.isDark
          ? "0 12px 30px rgba(0,0,0,0.3)"
          : "0 12px 30px rgba(15,23,42,0.12)",
      }}
    >
      <style>{`
        .keyword { color: #c084fc; }
        .string  { color: #86efac; }
        .number  { color: #fca5a5; }
        .comment { color: #6b7280; font-style: italic; }

        .cd-cursor {
          display: inline-block;
          width: 7px;
          height: 15px;
          background: ${COLORS.accent};
          margin-left: 1px;
          vertical-align: text-bottom;
          animation: cdBlink 1s step-end infinite;
        }

        @keyframes cdBlink {
          50% { opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          rowGap: 8,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />

          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#eab308",
            }}
          />

          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />

          <span
            style={{
              marginLeft: 8,
              color: "#94a3b8",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
            }}
          >
            {DEMO.title}
          </span>

          {touched && (
            <span
              style={{
                color: COLORS.accent,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
              }}
            >
              · edited
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {/* Edit */}
          <button
            onClick={() => setEditing((v) => !v)}
            disabled={!done || running}
            title="Edit the code, then run your own version"
            style={{
              background: "transparent",
              border: `1px solid ${
                editing
                  ? COLORS.accent
                  : "rgba(255,255,255,0.14)"
              }`,
              color: editing ? COLORS.accent : "#cbd5e1",
              borderRadius: 7,
              padding: "4px 10px",
              fontSize: 11,
              cursor:
                done && !running ? "pointer" : "not-allowed",
              opacity: done && !running ? 1 : 0.5,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {editing ? "editing…" : "✎ edit"}
          </button>

          {/* Reset */}
          {touched && (
            <button
              onClick={() => setCode(DEMO.code)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#cbd5e1",
                borderRadius: 7,
                padding: "4px 10px",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ↺ reset
            </button>
          )}

          {/* Copy */}
          <button
            onClick={copy}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#cbd5e1",
              borderRadius: 7,
              padding: "4px 10px",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {copied ? "copied ✓" : "copy"}
          </button>

          {/* Run */}
          <button
            onClick={run}
            disabled={!done || running}
            style={{
              background: COLORS.accent,
              border: "none",
              color: "#ffffff",
              borderRadius: 7,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
              cursor:
                done && !running ? "pointer" : "not-allowed",
              opacity: done && !running ? 1 : 0.5,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {running ? "running…" : "▶ run"}
          </button>
        </div>
      </div>

      {/* Code editor / display */}
      {editing ? (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.metaKey || e.ctrlKey)
            ) {
              e.preventDefault();
              run();
            }
          }}
          spellCheck={false}
          style={{
            display: "block",
            width: "100%",
            minHeight: Math.max(
              260,
              lines.length * 22 + 32
            ),
            boxSizing: "border-box",
            margin: 0,
            padding: "16px 18px",
            border: "none",
            outline: "none",
            resize: "vertical",
            background: "transparent",
            color: "#e2e8f0",
            caretColor: COLORS.accent,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        />
      ) : (
        <pre
          style={{
            margin: 0,
            padding: "16px 18px",
            overflowX: "auto",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 1.7,
            color: "#e2e8f0",
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{ whiteSpace: "pre" }}
            >
              <span
                style={{
                  color: "#475569",
                  display: "inline-block",
                  width: 24,
                  userSelect: "none",
                }}
              >
                {i + 1}
              </span>

              <span
                dangerouslySetInnerHTML={{
                  __html: highlight(line),
                }}
              />

              {writing && i === lines.length - 1 && (
                <span className="cd-cursor" />
              )}
            </div>
          ))}
        </pre>
      )}

      {/* Footer hint */}
      {done && !editing && (
        <div
          style={{
            padding: "8px 18px 12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <span
            style={{
              color: "#64748b",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              letterSpacing: "0.05em",
            }}
          >
            live code · tap{" "}
            <span style={{ color: COLORS.accent }}>
              ✎ edit
            </span>{" "}
            to change the query, then{" "}
            <span style={{ color: COLORS.accent }}>
              ▶ run
            </span>{" "}
            · ⌘/ctrl+enter
          </span>
        </div>
      )}

      {/* Output */}
      {result && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "12px 18px",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            output{touched ? " — your version" : ""}
          </div>

          {result.output.map((line, i) => (
            <div
              key={i}
              style={{
                color: result.ok ? "#86efac" : "#fca5a5",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12.5,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {line || "\u00a0"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
