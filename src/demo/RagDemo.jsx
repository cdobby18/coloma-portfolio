import { useState } from "react";
import { useColors, SectionLabel } from "../OnePiece";

const EXAMPLE_QUERIES = [
  "What is Powerlift?",
  "Tell me about your internships",
  "What's your tech stack?",
];

export default function RagDemo() {
  const COLORS = useColors();
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
      setResults(data);
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
    <section
      id="demo"
      style={{ padding: "100px clamp(24px, 6vw, 96px)" }}
    >
      <SectionLabel num="05" text="Demo" />
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: COLORS.textPrimary, marginBottom: 14, fontWeight: 700 }}>
        Mini RAG Demo
      </h2>
      <p style={{ color: COLORS.textSecondary, maxWidth: 620, lineHeight: 1.75, fontFamily: "Inter, sans-serif", margin: "0 0 32px 0" }}>
        A small retrieval-augmented generation demo — the retrieval and grounding logic runs in a Python serverless function (no API keys, no external LLM). Ask a question about my projects or experience; it retrieves the most relevant snippets from a mock document set and grounds an answer in them.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about a project, internship, or skill…"
          style={{
            flex: "1 1 280px",
            padding: "12px 16px",
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
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
            padding: "12px 24px",
            borderRadius: 8,
            border: "none",
            background: COLORS.accent,
            color: "#1a0800",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Asking…" : "Ask"}
        </button>
      </form>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => { setQuery(q); runQuery(q); }}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${COLORS.chipBorder}`,
              background: COLORS.chipBg,
              color: COLORS.textSecondary,
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              cursor: "pointer",
            }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ border: `1px solid ${COLORS.accentBorder}`, borderRadius: 12, padding: "20px 24px", background: COLORS.accentSoft }}>
            <p style={{ color: COLORS.accent, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Grounded Answer
            </p>
            <p style={{ color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: 1.7 }}>
              {results.answer}
            </p>
          </div>

          {results.matches.length > 0 && (
            <div>
              <p style={{ color: COLORS.textMuted, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                Retrieved Snippets
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {results.matches.map(({ doc, score }) => (
                  <div key={doc.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 18px", background: COLORS.surface }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: COLORS.textPrimary, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600 }}>{doc.title}</span>
                      <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>score {score}</span>
                    </div>
                    <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{doc.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
