import { useState, useEffect, useRef } from "react";
import ASSISTANT from "../../api/data/assistant.json";

/* One document set feeds both api/rag.py and this offline fallback. */
const DOCS = ASSISTANT.docs || [];
const DOC_BY_ID = Object.fromEntries(DOCS.map((doc) => [doc.id, doc]));

const MAX_QUERY = 400;

const ABSTAIN =
  "I don't have a grounded answer for that. Try asking about a project, " +
  "CJ's experience, technical stack, availability, workflow, or contact details.\n\n" +
  "- **Direct email:** carljoshuamcoloma@gmail.com\n" +
  "- **Projects:** ReSOLVE, Powerlift, Sunny AI, AI Resume Analyzer, Document Summarizer";

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "you", "your", "what", "how", "does", "did",
  "do", "with", "about", "tell", "this", "that", "these", "those", "from",
  "have", "has", "had", "been", "being", "into", "over", "more", "most",
  "some", "any", "all", "use", "uses", "used", "work", "works", "worked",
  "built", "build", "make", "made", "get", "got", "give", "please", "thanks",
  "can", "could", "would", "should", "was", "were", "will", "his", "her",
  "him", "she", "they", "them", "their", "our", "its", "it", "is", "of",
  "to", "in", "on", "at", "by", "or", "but", "not", "no", "yes", "me",
  "my", "we", "us", "i", "a", "an", "as", "if", "so", "than", "then",
  "there", "here", "which", "who", "whom", "when", "where", "why", "cj",
  "carl", "coloma", "joshua",
]);

const ALIASES = {
  resolve: ["support", "customer", "ticket", "tickets", "triage", "escalation"],
  powerlift: ["thesis", "pose", "biomechanics", "yolov8", "kalman", "svm", "lifting"],
  sunny: ["mentor", "mentorship", "sunnyai"],
  "resume-analyzer": ["resume", "résumé", "ats", "analyzer"],
  "doc-summarizer": ["summarizer", "summarization", "summarize", "bart", "t5", "pdf"],
  flyrank: ["flyrankai"],
  sofi: ["sofiai"],
  lamina: ["laminastudios"],
  experience: [
    "internship", "internships", "intern", "interns", "companies", "role",
    "roles", "position", "positions", "recent", "latest",
  ],
  stack: [
    "skills", "tech", "tools", "technologies", "languages", "frameworks",
    "python", "javascript", "pytorch", "react", "fastapi",
  ],
  contact: ["email", "e-mail", "linkedin", "github", "reach"],
  availability: ["available", "hiring", "hire", "recruit", "job", "role", "roles"],
  automation: ["automate", "human", "guardrails", "human-in-the-loop", "rag"],
  workflow: [
    "aidlc", "lifecycle", "process", "methodology", "ethic", "ethics",
    "principles", "standards", "review", "verify", "merge", "merges", "merging",
  ],
  education: ["school", "university", "degree", "feu", "student"],
  about: ["bio", "background"],
  projects: ["portfolio", "project"],
};

function tokenize(text) {
  const words = (text || "").toLowerCase().match(/[a-z0-9]+/g) || [];
  return words.filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

/* Section-level index. Heading and title terms repeat so they weigh more. */
const CHUNKS = [];
for (const doc of DOCS) {
  const titleTokens = tokenize(doc.title);
  for (const chunk of doc.chunks || []) {
    const textTokens = tokenize(chunk.text);
    const tokens = [
      ...textTokens,
      ...tokenize(chunk.heading),
      ...titleTokens,
      ...titleTokens,
    ];
    const tf = {};
    for (const token of tokens) tf[token] = (tf[token] || 0) + 1;
    CHUNKS.push({
      doc_id: doc.id,
      title: doc.title,
      url: doc.url || "",
      heading: chunk.heading,
      text: chunk.text,
      tokens,
      tf,
      dl: tokens.length,
    });
  }
}

const CHUNK_COUNT = CHUNKS.length;
const AVGDL = CHUNKS.reduce((sum, chunk) => sum + chunk.dl, 0) / CHUNK_COUNT || 1;
const DF = {};
for (const chunk of CHUNKS) {
  for (const term of new Set(chunk.tokens)) DF[term] = (DF[term] || 0) + 1;
}

const K1 = 1.2;
const B = 0.75;
const MIN_SCORE = 1.0;

const FOLLOW_UP_RE =
  /^\s*(and\b|so\b|why\b|how so|really\b|more\b|tell me more|go on|continue|elaborate|what about\b|how about\b|anything else)/i;

function idf(term) {
  const df = DF[term] || 0;
  return Math.log((CHUNK_COUNT - df + 0.5) / (df + 0.5) + 1);
}

function expandQuery(query) {
  const weights = {};
  for (const term of tokenize(query)) {
    weights[term] = Math.max(weights[term] || 0, 1);
    for (const [key, aliases] of Object.entries(ALIASES)) {
      if (term === key || aliases.includes(term)) {
        weights[key] = Math.max(weights[key] || 0, 0.55);
        for (const alias of aliases) {
          weights[alias] = Math.max(weights[alias] || 0, 0.35);
        }
      }
    }
  }

  if (
    !Object.keys(weights).length &&
    /\b(how do (you|u) (work|build|ship|review|test)|aidlc|(cj'?s|his|your) (workflow|process|methodology|work ethics?))\b/i.test(
      query
    )
  ) {
    weights.workflow = 1;
    weights.aidlc = 1;
  }

  if (
    !Object.keys(weights).length &&
    /\b(who|what)\b.*\b(cj|carl|coloma|you|him|he)\b/i.test(query)
  ) {
    weights.bio = 1;
  }
  return weights;
}

function prefixMatch(term, chunk) {
  if (term.length < 5) return null;
  for (const [candidate, count] of Object.entries(chunk.tf)) {
    if (
      candidate.length >= 5 &&
      (candidate.startsWith(term) || term.startsWith(candidate))
    ) {
      return [candidate, count];
    }
  }
  return null;
}

function scoreChunk(weights, chunk) {
  let score = 0;
  for (const [term, weight] of Object.entries(weights)) {
    let tf = chunk.tf[term] || 0;
    let matched = term;
    if (!tf) {
      const found = prefixMatch(term, chunk);
      if (found) [matched, tf] = found;
    }
    if (!tf) continue;
    const denom = tf + K1 * (1 - B + (B * chunk.dl) / AVGDL);
    score += (weight * idf(matched) * (tf * (K1 + 1))) / denom;
  }
  return score;
}

function makeSnippet(text, weights = {}) {
  const sentences = (text || "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  if (!sentences.length) return text;

  const hits = (sentence) => {
    const words = new Set(tokenize(sentence));
    return Object.keys(weights).filter((term) => words.has(term)).length;
  };

  let best = sentences.reduce((a, b) => (hits(b) > hits(a) ? b : a));
  if (hits(best) === 0) best = sentences[0];
  if (best.length > 220) {
    best = best.slice(0, 220).replace(/\s+\S*$/, "").replace(/[,;:]$/, "") + "…";
  }
  return best;
}

function toMatch(chunk, score, weights) {
  return {
    id: chunk.doc_id,
    doc_id: chunk.doc_id,
    title: chunk.title,
    heading: chunk.heading,
    text: chunk.text,
    snippet: makeSnippet(chunk.text, weights),
    url: chunk.url,
    score: Math.round(score * 1000) / 1000,
  };
}

function retrieve(query, context, topK = 3) {
  const weights = expandQuery(query);
  if (!Object.keys(weights).length) return [];

  const followUp = /\b(it|that|this|those|them|more|second|third|first)\b/i.test(query);
  const scored = [];
  for (const chunk of CHUNKS) {
    let score = scoreChunk(weights, chunk);
    if (context && chunk.doc_id === context) {
      score *= followUp ? 1.8 : 1.3;
    }
    if (score > 0) scored.push([score, chunk]);
  }
  scored.sort((a, b) => b[0] - a[0]);

  const matches = [];
  const seen = new Set();
  for (const [score, chunk] of scored) {
    if (seen.has(chunk.doc_id)) continue;
    seen.add(chunk.doc_id);
    matches.push(toMatch(chunk, score, weights));
    if (matches.length >= topK) break;
  }
  if (!matches.length) return [];
  const floor = Math.max(MIN_SCORE, matches[0].score * 0.2);
  return matches.filter((match) => match.score >= floor);
}

function docMatches(docIds) {
  return docIds
    .map((id) => DOC_BY_ID[id])
    .filter(Boolean)
    .map((doc) => {
      const chunk = doc.chunks[0];
      return {
        id: doc.id,
        doc_id: doc.id,
        title: doc.title,
        heading: chunk.heading,
        text: chunk.text,
        snippet: makeSnippet(chunk.text),
        url: doc.url || "",
        score: 0,
      };
    });
}

function buildAnswer(matches) {
  if (!matches.length) return ABSTAIN;
  const lead = matches[0];
  let answer = `**${lead.title} — ${lead.heading}**\n\n${lead.text}`;
  const floor = Math.max(MIN_SCORE, lead.score * 0.25);
  const related = matches
    .slice(1)
    .filter((match) => match.doc_id !== lead.doc_id && match.score >= floor);
  if (related.length) {
    answer +=
      "\n\nRelated: " +
      related.map((match) => `${match.title} — ${match.heading}`).join("; ");
  }
  return answer;
}

const CONTACT_REPLY =
  "You can reach CJ through the following channels:\n\n" +
  "- **Email:** carljoshuamcoloma@gmail.com\n" +
  "- **GitHub:** github.com/cdobby18\n" +
  "- **LinkedIn:** linkedin.com/in/carl-joshua-coloma";

const INTENTS = [
  [
    /^\s*(hi|hey|hello|yo|sup|howdy|good (morning|afternoon|evening))(\s+(there|again|all|everyone|friend))?[\s!,.?]*$/i,
    "Hello. I'm CJ's portfolio assistant. You can ask about his projects, " +
      "automation work, workflow, technical stack, experience, or contact details.",
    [],
  ],
  [
    /^\s*(how are you( doing)?|how's it going|how are things|how r u|hru|what's up|what up|wassup)[\s!,.?]*$/i,
    "I'm running normally. What would you like to know about CJ's work?",
    [],
  ],
  [
    /^\s*(thanks|thank you|ty|appreciate it)[\s!,.?]*$/i,
    "You're welcome. Let me know if you have further questions about CJ's work.",
    [],
  ],
  [
    /^\s*(help|what can you do|what can i ask|how does this work|capabilities)[\s!,.?]*$/i,
    "I answer from a small set of portfolio documents. Ask about a project, " +
      "CJ's experience, stack, workflow, availability, or contact details. I cite the " +
      "passage I used and say when I don't have a grounded answer.",
    [],
  ],
  [
    /^\s*(bye|goodbye|see you|see ya|later|good night|take care)[\s!,.?]*$/i,
    "Thank you for stopping by. To get in touch directly, email carljoshuamcoloma@gmail.com.",
    ["contact"],
  ],
  [
    /^\s*(ok|okay|cool|nice|great|awesome|got it|sounds good)[\s!,.?]*$/i,
    "Understood. Let me know if you would like details on anything else.",
    [],
  ],
  [
    /\b(aidlc|ai[- ]assisted development lifecycle|development lifecycle|work ethics?|how do (you|u) (work|build|ship|review|test)|(cj'?s|his|your) (workflow|process|methodology|work ethics?))\b/i,
    "CJ works in a loop he calls AIDLC — an AI-assisted development lifecycle. " +
      "He defines the problem, constraints, acceptance criteria, and risks first, " +
      "then chooses direct execution for a small change or plan mode for a larger " +
      "one. The agent implements in small reviewable increments; CJ requires " +
      "meaningful tests, runs the full verification toolchain, reviews the diff " +
      "locally and in a pull request, and adds a separate AI reviewer with fresh " +
      "context. He merges only when CI, human review, and the engineering bar pass.\n\n" +
      "- **Work ethic:** own the diff, test before shipping, review his own work " +
      "first, document the handoff, and separate what was built from what was measured.\n" +
      "- **Full write-up:** /blog/aidlc.html",
    ["workflow"],
  ],
  [
    /\b(contact|email|e-mail|reach|get in touch|linkedin|github)\b/i,
    CONTACT_REPLY,
    ["contact"],
  ],
  [
    /\b(available|availability|open to work|open to roles|hiring|hire|recruit|job opportunity|full[- ]time role|looking for a role)\b/i,
    "CJ is available immediately for AI automation or applied AI roles, remote " +
      "or hybrid, based in Manila on PHT (UTC+8).\n\n" +
      "- **Focus:** LLM workflows, agentic systems, and human-in-the-loop operations\n" +
      "- **Best contact:** carljoshuamcoloma@gmail.com",
    ["availability"],
  ],
  [
    /\b(currently|current work|right now|working on|these days|latest role|recent role|most recent)\b/i,
    "CJ's most recent role was a Backend AI Engineer internship at FlyRank AI, " +
      "completed in October 2026. He currently focuses on AI automation and is " +
      "open to new roles.",
    ["flyrank", "experience"],
  ],
];

const GREETING_PREFIX =
  /^\s*(hi|hey|hello|yo|sup|howdy|good (morning|afternoon|evening))(\s+(there|again|all|everyone|friend))?[\s,!.]*/i;

const INJECTION_RE =
  /(ignore\s+(all\s+)?(previous|prior|above)\s+instructions|system\s+prompt|reveal\s+(your\s+)?prompt|you\s+are\s+now|jailbreak|developer\s+mode)/i;

function matchIntent(query) {
  for (const [pattern, reply, docIds] of INTENTS) {
    if (pattern.test(query)) return { reply, matches: docMatches(docIds) };
  }
  return null;
}

function localQuery(rawQuery, context) {
  const original = (rawQuery || "").trim();

  if (!original) {
    return { query: original, matches: [], answer: ABSTAIN, topic: null };
  }

  if (original.length > MAX_QUERY) {
    return {
      query: original,
      matches: [],
      answer: `Keep questions under ${MAX_QUERY} characters so retrieval stays precise.`,
      topic: null,
    };
  }

  if (INJECTION_RE.test(original)) {
    return {
      query: original,
      matches: [],
      answer:
        "I only answer questions about CJ's work and background. Ask about a project, " +
        "his experience, stack, workflow, or contact details.",
      topic: null,
    };
  }

  let query = original;
  let intent = matchIntent(query);
  if (!intent) {
    const cleaned = query.replace(GREETING_PREFIX, "").trim();
    if (cleaned && cleaned !== query) {
      query = cleaned;
      intent = matchIntent(cleaned);
    }
  }
  if (intent) {
    return {
      query,
      matches: intent.matches,
      answer: intent.reply,
      topic: intent.matches[0] ? intent.matches[0].doc_id : null,
    };
  }

  const cleaned = query.replace(GREETING_PREFIX, "").trim() || query;

  if (context && !tokenize(cleaned).length && FOLLOW_UP_RE.test(cleaned) && DOC_BY_ID[context]) {
    const matches = docMatches([context]);
    return {
      query: original,
      matches,
      answer: buildAnswer(matches),
      topic: context,
    };
  }

  const matches = retrieve(cleaned, context, 3);
  if (!matches.length || matches[0].score < MIN_SCORE) {
    return { query: original, matches: [], answer: ABSTAIN, topic: context || null };
  }

  return {
    query: original,
    matches,
    answer: buildAnswer(matches),
    topic: matches[0].doc_id,
  };
}

/* Answer formatting: plain lines become paragraphs, "- " lines become bullets. */
function parseAnswer(text) {
  const blocks = [];
  let list = null;
  for (const raw of (text || "").split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      if (!list) {
        list = { type: "ul", items: [] };
        blocks.push(list);
      }
      list.items.push(bullet[1]);
    } else if (line) {
      list = null;
      blocks.push({ type: "p", text: line });
    } else {
      list = null;
    }
  }
  return blocks;
}

/* Hide the opening marker of a bold span that is still streaming in. */
function cleanStreaming(text) {
  return (text.match(/\*\*/g) || []).length % 2
    ? text.replace(/\*\*([^*]*)$/, "$1")
    : text;
}

/* Screen-reader announcements should not include Markdown markers. */
function plainText(text) {
  return (text || "")
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
}

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

function AnswerBody({ text, typing }) {
  const blocks = parseAnswer(typing ? cleanStreaming(text) : text);

  if (!blocks.length) {
    return <p>{typing && <span className="ai-caret" aria-hidden="true" />}</p>;
  }

  return blocks.map((block, bi) => {
    const isLastBlock = bi === blocks.length - 1;
    const caret = typing && isLastBlock ? <span className="ai-caret" aria-hidden="true" /> : null;

    if (block.type === "ul") {
      return (
        <ul className="ai-list" key={bi}>
          {block.items.map((item, ii) => (
            <li key={ii}>
              {renderInline(item)}
              {ii === block.items.length - 1 ? caret : null}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={bi}>
        {renderInline(block.text)}
        {caret}
      </p>
    );
  });
}

function SendIcon() {  return (
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

function AssistantAvatar() {
  return (
    <span className="ai-avatar" aria-hidden="true">
      <img src="/cbot-mark.webp" alt="" width={240} height={240} loading="lazy" decoding="async" />
    </span>
  );
}

export default function RagDemo() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | searching | typing
  const [announcement, setAnnouncement] = useState("");
  const streamRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, phase]);

  useEffect(() => () => { if (streamRef.current) clearInterval(streamRef.current); }, []);

  async function fetchAnswer(q, context) {
    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, context }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      if (!data.answer) throw new Error("Empty answer");
      return {
        answer: data.answer,
        matches: data.matches || [],
        topic: data.topic || null,
      };
    } catch {
      return localQuery(q, context);
    }
  }

  function streamAnswer(answer) {
    clearInterval(streamRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last && last.role === "ai") {
          copy[copy.length - 1] = { ...last, text: answer || "" };
        }
        return copy;
      });
      setPhase("idle");
      setAnnouncement(plainText(answer));
      return;
    }
    const tokens = (answer || "").split(/(\s+)/).filter(Boolean);
    setPhase("typing");
    let i = 0;
    streamRef.current = setInterval(() => {
      i = Math.min(tokens.length, i + 2);
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last && last.role === "ai") {
          copy[copy.length - 1] = { ...last, text: tokens.slice(0, i).join("") };
        }
        return copy;
      });
      if (i >= tokens.length) {
        clearInterval(streamRef.current);
        streamRef.current = null;
        setPhase("idle");
        setAnnouncement(plainText(answer));
      }
    }, 24);
  }

  async function runQuery(q) {
    const value = q.trim();
    if (!value || phase !== "idle") return;
    const context =
      [...messages].reverse().find((m) => m.role === "ai" && m.topic)?.topic || null;
    setQuery("");
    setMessages((m) => [...m, { role: "user", text: value }]);
    setPhase("searching");
    const { answer, matches, topic } = await fetchAnswer(value, context);
    setMessages((m) => [...m, { role: "ai", text: "", matches, topic }]);
    streamAnswer(answer);
  }

  function reset() {
    clearInterval(streamRef.current);
    streamRef.current = null;
    setMessages([]);
    setQuery("");
    setPhase("idle");
    setAnnouncement("");
    if (inputRef.current) inputRef.current.focus();
  }

  const status = phase === "searching" ? "Searching" : phase === "typing" ? "Writing" : "Ready";

  return (
    <div className="ai-card" aria-busy={phase !== "idle"}>
      <aside className="ai-side">
        <div className="ai-side-head">
          <span className="ai-logo" aria-hidden="true">
            <img src="/cbot-mark.webp" alt="" width={240} height={240} />
          </span>
          <span className="ai-kicker">CJAI</span>
        </div>

        <div className="ai-side-copy">
          <h2 className="ai-heading">Ask about my work.</h2>
          <p className="ai-desc">
            Knows what I use and how I like to build things. Basically, my AI sidekick.
          </p>
        </div>

        <div className="ai-side-foot">
          <span className={`ai-status${phase === "idle" ? "" : " ai-status--busy"}`}>
            <span className="ai-status-dot" aria-hidden="true" />
            {status}
          </span>
          {messages.length > 0 && (
            <button type="button" onClick={reset} className="ai-new">
              New chat
            </button>
          )}
        </div>
      </aside>

      <div className="ai-main">
        <p className="ai-sr" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
        <div
          className={`ai-thread${messages.length === 0 ? " ai-thread--empty" : ""}`}
          ref={scrollRef}
          role="log"
          aria-live="off"
        >
          {messages.length === 0 && (
            <div className="ai-row">
              <AssistantAvatar />
              <div className="ai-answer">
                <p className="ai-greeting">
                  Hello. I'm CJ's portfolio assistant. Ask about his projects, automation work,
                  or technical stack.
                </p>
              </div>
            </div>
          )}

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
                <AssistantAvatar />
                <div className="ai-answer">
                  <AnswerBody text={m.text} typing={phase === "typing" && isLast} />
                  {(m.matches || []).length > 0 && !(phase === "typing" && isLast) && (
                    <div className="ai-sources">
                      <span className="ai-sources-label">Sources</span>
                      {(m.matches || []).slice(0, 3).map((match) => (
                        <a
                          className="ai-source"
                          key={`${match.id}-${match.heading}`}
                          href={match.url || "#projects"}
                          target={match.url && match.url.startsWith("http") ? "_blank" : undefined}
                          rel={match.url && match.url.startsWith("http") ? "noreferrer noopener" : undefined}
                          title={match.snippet || match.text}
                        >
                          {match.title} — {match.heading}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {phase === "searching" && (
            <div className="ai-row">
              <AssistantAvatar />
              <div className="ai-answer">
                <span className="ai-dots" role="status">
                  <span className="ai-sr">Searching portfolio</span>
                  <span /><span /><span />
                </span>
              </div>
            </div>
          )}
        </div>

        <form
          className="ai-form"
          onSubmit={(e) => { e.preventDefault(); runQuery(query); }}
        >
          <input
            id="portfolio-ai-input"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={MAX_QUERY}
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
      </div>

      <style>{`
        .ai-card {
          display: grid;
          grid-template-columns: 292px minmax(0, 1fr);
          min-height: 322px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--surface);
          box-shadow: 0 1px 2px rgba(9, 9, 11, 0.04), 0 24px 60px rgba(9, 9, 11, 0.07);
        }
        [data-theme="dark"] .ai-card {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 24px 60px rgba(0, 0, 0, 0.28);
        }
        .ai-side {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 22px;
          color: #ffffff;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          background-image:
            radial-gradient(150px 150px at 100% 0%, rgba(229, 72, 77, 0.20), transparent 70%),
            linear-gradient(165deg, #16171c 0%, #0c0d11 100%);
          background-size: auto, auto;
        }
        .ai-side-head { display: flex; align-items: center; gap: 10px; }
        .ai-logo {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 10px;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 8px 20px rgba(0, 0, 0, 0.4);
        }
        .ai-logo img { width: 100%; height: 100%; display: block; object-fit: cover; }
        .ai-kicker {
          font-family: var(--mono);
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }
        .ai-side-copy { margin-top: auto; padding-top: 30px; }
        .ai-heading {
          font-family: var(--display);
          font-size: 21px;
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: -0.025em;
          color: #ffffff;
          max-width: 210px;
        }
        .ai-desc {
          margin-top: 8px;
          max-width: 224px;
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.55);
        }
        .ai-side-foot {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 22px;
        }
        .ai-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 9px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.68);
          flex-shrink: 0;
        }
        .ai-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.14);
        }
        .ai-status--busy .ai-status-dot {
          background: var(--accent);
          box-shadow: 0 0 0 3px rgba(229, 72, 77, 0.22);
          animation: aiBlink 1.2s ease-in-out infinite;
        }
        .ai-new {
          flex-shrink: 0;
          padding: 4px 0;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.48);
          font-family: var(--sans);
          font-size: 11.5px;
          cursor: pointer;
          transition: color 0.18s ease;
        }
        .ai-new:hover { color: #ffffff; }
        .ai-main {
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: var(--surface);
        }
        .ai-thread {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 14px;
          min-height: 230px;
          max-height: 340px;
          overflow-y: auto;
          padding: 22px 24px;
        }
        .ai-thread--empty { justify-content: center; padding-top: 16px; padding-bottom: 16px; }
        .ai-thread--empty .ai-row { max-width: 560px; }
        .ai-thread--empty .ai-avatar { width: 30px; height: 30px; border-radius: 8px; }
        .ai-thread--empty .ai-answer p { font-size: 14px; }
        .ai-row { display: flex; align-items: flex-start; gap: 10px; }
        .ai-row--user { justify-content: flex-end; }
        .ai-user {
          max-width: 80%;
          padding: 8px 12px;
          border: 1px solid var(--chip-border);
          border-radius: 10px 10px 3px 10px;
          background: var(--chip-bg);
          color: var(--text);
          font-size: 13px;
          line-height: 1.55;
        }
        .ai-avatar {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          overflow: hidden;
          margin-top: 1px;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: #15181f;
        }
        .ai-avatar img { width: 100%; height: 100%; display: block; object-fit: cover; }
        .ai-answer { flex: 1; min-width: 0; max-width: 720px; }
        .ai-answer p {
          font-size: 13.5px;
          line-height: 1.7;
          color: var(--text);
          white-space: pre-line;
        }
        .ai-answer p + p { margin-top: 8px; }
        .ai-answer strong { font-weight: 600; color: var(--text); }
        .ai-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin: 8px 0 0;
          padding: 0;
          list-style: none;
        }
        .ai-list:first-child { margin-top: 0; }
        .ai-list + p { margin-top: 8px; }
        .ai-list li {
          position: relative;
          padding-left: 15px;
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--text);
        }
        .ai-list li::before {
          content: "";
          position: absolute;
          top: 0.64em;
          left: 1px;
          width: 4px;
          height: 4px;
          border-radius: 1px;
          background: var(--accent);
        }
        .ai-greeting { color: var(--text-2) !important; max-width: 560px; }
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
          text-decoration: none;
          transition: color 0.16s ease, border-color 0.16s ease;
        }
        .ai-source:hover {
          color: var(--text);
          border-color: var(--muted);
        }
        .ai-source:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
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
          padding: 12px 24px 16px;
          border-top: 1px solid var(--border);
        }
        .ai-input {
          flex: 1 1 auto;
          min-width: 0;
          width: 100%;
          padding: 10px 12px;
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
          width: 38px;
          height: 38px;
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
        @media (prefers-reduced-motion: reduce) {
          .ai-caret,
          .ai-dots > span:not(.ai-sr),
          .ai-status--busy .ai-status-dot { animation: none !important; }
          .ai-send:not(:disabled):hover { transform: none; }
        }
        @media (max-width: 760px) {
          .ai-card { grid-template-columns: minmax(0, 1fr); min-height: 0; }
          .ai-side {
            flex-direction: row;
            align-items: center;
            padding: 14px 16px;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .ai-side-head { flex: 1; min-width: 0; }
          .ai-side-copy { display: none; }
          .ai-side-foot { margin: 0; }
          .ai-logo { width: 34px; height: 34px; border-radius: 9px; }
          .ai-thread { min-height: 170px; padding: 18px 16px; }
          .ai-form { padding: 11px 16px 13px; }
        }
      `}</style>
    </div>
  );
}
