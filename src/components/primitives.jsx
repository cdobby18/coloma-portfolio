import { useState, useEffect, useRef } from "react";
import { IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT } from "../content";

export function Icon({ children, size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const ArrowUpRight = ({ size = 14 }) => (
  <Icon size={size}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></Icon>
);

export const FileDown = ({ size = 15 }) => (
  <Icon size={size}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" /></Icon>
);

export const CopyIcon = ({ size = 13 }) => (
  <Icon size={size}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon>
);

export const CheckIcon = ({ size = 13 }) => <Icon size={size}><polyline points="20 6 9 17 4 12" /></Icon>;

export const ClockIcon = ({ size = 13 }) => (
  <Icon size={size}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></Icon>
);

export const PinIcon = ({ size = 13 }) => (
  <Icon size={size}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="2.6" /></Icon>
);

export const SunIcon = () => (
  <Icon size={16}><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></Icon>
);

export const MoonIcon = () => (
  <Icon size={16}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Icon>
);

export const SparkIcon = ({ size = 16 }) => (
  <Icon size={size}><path d="M12 3l1.9 5.4L19.5 10l-5.6 1.6L12 17l-1.9-5.4L4.5 10l5.6-1.6z" /></Icon>
);

export const GitHubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.43 7.86 10.96.57.1.78-.25.78-.55v-2.03c-3.2.7-3.87-1.39-3.87-1.39-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.2.66.79.55 4.56-1.53 7.85-5.85 7.85-10.96C23.5 5.74 18.27.5 12 .5z" />
  </svg>
);

export const LinkedInIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

export const MailIcon = ({ size = 15 }) => (
  <Icon size={size}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></Icon>
);

export function useInView(threshold = 0.1) {
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

export function useManilaTime() {
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

export function Reveal({ children }) {
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

export function Section({ id, children }) {
  return (
    <section id={id} className="section">
      <div className="shell">{children}</div>
    </section>
  );
}

export function SectionHead({ num, label, title, lede }) {
  return (
    <div className="section-head">
      <p className="eyebrow"><em>{num}</em> — {label}</p>
      <h2 className="h2">{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

export function timeAgo(iso) {
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

export function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const TOKEN_RE = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|new|if|else|for|of|in)\b|\b(console)\b|\.([a-zA-Z_$][\w$]*)(?=\()/g;

export function highlightLine(line) {
  return escapeHtml(line).replace(TOKEN_RE, (m, comment, str, kw, obj, fn) => {
    if (comment) return `<span class="tk-c">${comment}</span>`;
    if (str) return `<span class="tk-s">${str}</span>`;
    if (kw) return `<span class="tk-k">${kw}</span>`;
    if (obj) return `<span class="tk-v">${obj}</span>`;
    if (fn) return `.<span class="tk-f">${fn}</span>`;
    return m;
  });
}

export function runIdeInline(code) {
  const logs = [];
  const push = (...args) => logs.push(args.map(String).join(" "));
  try {
    new Function("console", code)({ log: push, info: push, warn: push, error: push });
    return { ok: true, output: logs.length ? logs : ["(no output)"] };
  } catch (err) {
    return { ok: false, output: [...logs, String(err)] };
  }
}

export function runIdeCode(code) {
  return new Promise((resolve) => {
    const source = `
      const logs = [];
      const push = (...args) => logs.push(args.map(String).join(" "));
      const fake = { log: push, info: push, warn: push, error: push };
      try {
        const fn = new Function("console", ${JSON.stringify(code)});
        fn(fake);
        self.postMessage({ ok: true, logs });
      } catch (err) {
        self.postMessage({ ok: false, logs: logs.concat(String(err)) });
      }
    `;
    let worker = null;
    const timer = setTimeout(() => {
      if (worker) worker.terminate();
      resolve({ ok: false, output: ["Timed out after 2s — infinite loop?"] });
    }, 2000);
    try {
      const url = URL.createObjectURL(new Blob([source], { type: "application/javascript" }));
      worker = new Worker(url);
      URL.revokeObjectURL(url);
      worker.onmessage = (event) => {
        clearTimeout(timer);
        worker.terminate();
        const logs = event.data.logs || [];
        resolve({ ok: event.data.ok, output: logs.length ? logs : ["(no output)"] });
      };
      worker.onerror = (event) => {
        clearTimeout(timer);
        worker.terminate();
        resolve({ ok: false, output: [event.message || "Worker error"] });
      };
    } catch {
      clearTimeout(timer);
      resolve(runIdeInline(code));
    }
  });
}

export function IdeWindow() {
  const [code, setCode] = useState(IDE_DEFAULT_CODE);
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState({ ok: true, output: IDE_DEFAULT_OUTPUT });
  const [running, setRunning] = useState(false);

  const touched = code !== IDE_DEFAULT_CODE;
  const lines = code.split("\n");

  const run = async () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    const [res] = await Promise.all([
      runIdeCode(code),
      new Promise((resolve) => setTimeout(resolve, 320)),
    ]);
    setResult(res);
    setRunning(false);
  };

  const reset = () => {
    setCode(IDE_DEFAULT_CODE);
    setResult({ ok: true, output: IDE_DEFAULT_OUTPUT });
  };

  return (
    <div className="ide-card">
      <div className="ide-bar">
        <span className="ide-dots"><i /><i /><i /></span>
        <span className="ide-title">hello.js</span>
        <span className="ide-actions">
          <button className="ide-act" type="button" onClick={() => setEditing((v) => !v)} disabled={running} aria-pressed={editing}>
            {editing ? "done" : "edit"}
          </button>
          {touched && (
            <button className="ide-act" type="button" onClick={reset} disabled={running}>reset</button>
          )}
          <button className="ide-act ide-act--run" type="button" onClick={run} disabled={running}>
            {running ? "…" : "▶ run"}
          </button>
        </span>
      </div>

      <div className="ide-tabs">
        <span className="ide-tab ide-tab--active">
          <span className="ide-file">js</span>
          hello.js
          {touched && <span className="ide-edited">●</span>}
        </span>
        <span className="ide-tab">README.md</span>
      </div>

      {editing ? (
        <textarea
          className="ide-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              run();
            }
          }}
          spellCheck={false}
          rows={lines.length + 1}
          aria-label="Editable code sample"
        />
      ) : (
        <div className="ide-code">
          {lines.map((line, i) => (
            <div className="ide-line" key={i}>
              <span className="ide-ln">{i + 1}</span>
              <span className="ide-src" dangerouslySetInnerHTML={{ __html: highlightLine(line) || "&nbsp;" }} />
            </div>
          ))}
        </div>
      )}

      <div className="ide-term">
        <span className="ide-prompt">$</span>
        <span>node hello.js</span>
        {!result && <span className="ide-caret" />}
      </div>

      {result ? (
        <div className={`ide-output${result.ok ? "" : " ide-output--err"}`}>
          {result.output.slice(0, 12).map((line, i) => (
            <div className="ide-out-line" key={i}>{line}</div>
          ))}
        </div>
      ) : (
        <div className="ide-output ide-output--muted">
          <div className="ide-out-line">running…</div>
        </div>
      )}
    </div>
  );
}

export function BackToTop() {
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
