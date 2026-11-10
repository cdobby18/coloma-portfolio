import { useColors } from "./OnePiece";

const ARCHITECTURES = {
  "Powerlift: Precision Pose Estimation for Powerlifting Performance Metrics": {
    overview: "End-to-end mobile biomechanics analyzer: capture lift video on-device, run pose estimation, stabilize landmarks, classify lift phase, and score form — all in real time on mobile hardware.",
    nodes: [
      { label: "Camera Frame", kind: "io" },
      { label: "YOLOv8 Pose", kind: "ai" },
      { label: "Kalman Filter", kind: "proc" },
      { label: "Landmark Features", kind: "proc" },
      { label: "SVM Classifier", kind: "ai" },
      { label: "Lift Score + UI", kind: "io" },
    ],
    layers: [
      { name: "Frontend (Mobile)", body: "Mobile app UI for recording lifts, live overlay of skeleton/landmarks, and per-rep score display. Optimized for on-device, offline-capable inference." },
      { name: "AI / ML", body: "YOLOv8 pose model detects body keypoints per frame. Kalman filter smooths landmark trajectories across frames. SVM (scikit-learn) classifies lift phase (squat/bench/deadlift) from engineered features." },
      { name: "Data", body: "Video frames streamed to inference; landmark coordinates and per-lift scores persisted locally; labeled training set for model iteration." },
      { name: "Backend / Training", body: "Offline training pipeline in Python (PyTorch/Ultralytics + scikit-learn). Model export (ONNX/TFLite) for mobile. Automated retraining + evaluation scripts." },
      { name: "Automation", body: "Retraining triggered on new labeled data; eval harness checks FPS and accuracy thresholds before model promotion." },
      { name: "Observability", body: "On-device FPS, inference latency, and classification confidence logged; regression alerts if accuracy drops below baseline." },
    ],
  },
  "Sunny AI": {
    overview: "RAG-powered mentor for aspiring AI engineers: chat UI grounded in a structured knowledge base, with retrieval, generation, and progress tracking across a learning path.",
    nodes: [
      { label: "User Question", kind: "io" },
      { label: "Embed Query", kind: "ai" },
      { label: "Vector Search", kind: "proc" },
      { label: "Rerank", kind: "proc" },
      { label: "LLM Generate", kind: "ai" },
      { label: "Grounded Answer", kind: "io" },
    ],
    layers: [
      { name: "Frontend (Web)", body: "React SPA chat interface, conversation history, suggested prompts, and learning-path progress UI. Responsive, theme-aware." },
      { name: "Backend / API", body: "FastAPI service exposing /chat, /retrieve, /progress. Handles auth, rate limiting, request validation, and streaming responses." },
      { name: "AI / ML", body: "Embedding model (e.g. bge-small) for query/doc vectors; LLM for grounded answer generation with citation. LangChain orchestrates retrieval + prompt templates." },
      { name: "Data", body: "Vector store (Qdrant) over chunked learning content; relational DB for users, progress, conversations; object storage for assets." },
      { name: "Automation", body: "Ingestion pipeline chunks + embeds new content; scheduled re-index; CI runs eval suite on prompt/retrieval changes." },
      { name: "Observability", body: "Traces (LangSmith-style), token usage, cost per query, latency, groundedness scores, and hallucination alerts." },
    ],
  },
  "Resume Analyzer": {
    overview: "NLP pipeline that parses resumes at scale: extract text, run NER + semantic matching, and emit structured JSON for ranking/ATS integration.",
    nodes: [
      { label: "Resume PDF", kind: "io" },
      { label: "Text Extract", kind: "proc" },
      { label: "spaCy NER", kind: "ai" },
      { label: "Transformer Embed", kind: "ai" },
      { label: "Semantic Match", kind: "proc" },
      { label: "Structured JSON", kind: "io" },
    ],
    layers: [
      { name: "Frontend (Web)", body: "Upload UI (drag/drop), batch status, and JSON preview. Optional dashboard for extracted entities." },
      { name: "Backend / API", body: "FastAPI service with /analyze endpoint; async job queue for batch processing; returns structured JSON." },
      { name: "AI / ML", body: "spaCy NER for skills/roles/experience entities; transformer embeddings for semantic matching against job descriptions." },
      { name: "Data", body: "Input resumes (PDF), extracted text, entity spans, match scores; output JSON consumed by ATS/ranking." },
      { name: "Automation", body: "Batch workers; scheduled reprocessing; eval harness checks extraction accuracy vs labeled set." },
      { name: "Observability", body: "Throughput (docs/min), latency, error rates, and extraction-quality metrics." },
    ],
  },
  "Document Summarizer": {
    overview: "Abstractive summarization for long PDFs: chunk to fit context, summarize per section, then merge into a coherent output.",
    nodes: [
      { label: "PDF Upload", kind: "io" },
      { label: "Chunking", kind: "proc" },
      { label: "BART/T5 Summarize", kind: "ai" },
      { label: "Section Merge", kind: "proc" },
      { label: "Coherent Summary", kind: "io" },
    ],
    layers: [
      { name: "Frontend (Web)", body: "Upload UI, progress indicator, and rendered summary with section anchors." },
      { name: "Backend / API", body: "FastAPI service; handles PDF parsing, chunking orchestration, and model calls." },
      { name: "AI / ML", body: "BART/T5 (HuggingFace) for abstractive summarization per chunk; merge strategy combines section summaries." },
      { name: "Data", body: "Source PDFs, chunk boundaries, intermediate summaries, final output." },
      { name: "Automation", body: "Async processing for large docs; retries on model failure; eval vs extractive baselines." },
      { name: "Observability", body: "Latency, token counts, chunk counts, and readability metrics." },
    ],
  },
  "AI Engineering Roadmap": {
    overview: "Public learning journal: structured curriculum from fundamentals to production, with notes, exercises, and applied mini-projects.",
    nodes: [
      { label: "Learner", kind: "io" },
      { label: "Curriculum", kind: "proc" },
      { label: "Notes & Exercises", kind: "proc" },
      { label: "Mini-Projects", kind: "proc" },
      { label: "Progress", kind: "io" },
    ],
    layers: [
      { name: "Frontend (Web)", body: "Static site / docs with navigation, search, and progress tracking." },
      { name: "Content", body: "Markdown notes covering Python, PyTorch, Transformers, RAG, evaluation, agentic patterns." },
      { name: "AI / ML", body: "Conceptual coverage; mini-projects apply RAG, fine-tuning basics, eval design." },
      { name: "Data", body: "Curriculum metadata, learner progress (if hosted), and references." },
      { name: "Automation", body: "Build/deploy via CI; link checking; versioned content." },
      { name: "Observability", body: "Page views, completion rates (if tracked)." },
    ],
  },
};

const KIND_COLOR = { io: "accent", ai: "violet", proc: "muted" };

function PipelineDiagram({ nodes, COLORS }) {
  const w = 120, gap = 18, h = 40;
  const total = nodes.length * w + (nodes.length - 1) * gap;
  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <svg width={total} height={h + 20} viewBox={`0 0 ${total} ${h + 20}`} style={{ display: "block" }}>
        {nodes.map((n, i) => {
          const x = i * (w + gap);
          const isIO = n.kind === "io";
          const isAI = n.kind === "ai";
          const fill = isIO ? COLORS.accent : isAI ? (COLORS.isDark ? "rgba(167,139,250,0.18)" : "rgba(124,58,237,0.12)") : (COLORS.isDark ? "rgba(148,163,184,0.08)" : "rgba(30,41,59,0.04)");
          const stroke = isIO ? COLORS.accent : isAI ? COLORS.violet : COLORS.border;
          const textColor = isIO ? "#ffffff" : COLORS.textPrimary;
          return (
            <g key={i}>
              <rect x={x} y={6} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={isIO ? 0 : 1} />
              <text x={x + w / 2} y={6 + h / 2 + 4} textAnchor="middle" fill={textColor} fontFamily="Inter, sans-serif" fontSize={11} fontWeight={isIO || isAI ? 700 : 500}>{n.label}</text>
              {i < nodes.length - 1 && (
                <g>
                  <line x1={x + w} y1={6 + h / 2} x2={x + w + gap} y2={6 + h / 2} stroke={COLORS.accentBorder} strokeWidth={1.5} />
                  <polygon points={`${x + w + gap - 5},${6 + h / 2 - 3} ${x + w + gap},${6 + h / 2} ${x + w + gap - 5},${6 + h / 2 + 3}`} fill={COLORS.accent} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Architecture({ project }) {
  const COLORS = useColors();
  const arch = ARCHITECTURES[project] || ARCHITECTURES["AI Engineering Roadmap"];
  return (
    <div>
      <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{arch.overview}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: COLORS.textMuted }}>
        <span style={{ padding: "3px 8px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, background: COLORS.chipBg }}>■ I/O</span>
        <span style={{ padding: "3px 8px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, background: COLORS.chipBg, color: COLORS.violet }}>■ AI/ML</span>
        <span style={{ padding: "3px 8px", borderRadius: 999, border: `1px solid ${COLORS.chipBorder}`, background: COLORS.chipBg }}>■ Process</span>
      </div>
      <PipelineDiagram nodes={arch.nodes} COLORS={COLORS} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 16 }}>
        {arch.layers.map((l) => (
          <div key={l.name} style={{ background: COLORS.isDark ? "rgba(15,23,42,0.5)" : "rgba(248,250,252,0.7)", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <h5 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>{l.name}</h5>
            <p style={{ color: COLORS.textSecondary, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.6 }}>{l.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}