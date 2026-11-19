"""Vercel serverless function powering the portfolio assistant.

Retrieval is a small BM25-style scorer over section-level chunks loaded
from api/data/assistant.json. No external APIs, no vector DB, no keys.

The same JSON is imported by src/demo/RagDemo.jsx for the offline
fallback, so the document set has one source of truth.
"""

import json
import math
import re
from collections import Counter
from http.server import BaseHTTPRequestHandler
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent / "data" / "assistant.json"
DATA = json.loads(DATA_PATH.read_text(encoding="utf-8"))
DOCS = DATA["docs"]
EVAL_CASES = DATA.get("eval", [])
DOC_BY_ID = {doc["id"]: doc for doc in DOCS}

# ---------------------------------------------------------------- guardrails

MAX_QUERY = 400

INJECTION_RE = re.compile(
    r"(ignore\s+(all\s+)?(previous|prior|above)\s+instructions"
    r"|system\s+prompt|reveal\s+(your\s+)?prompt"
    r"|you\s+are\s+now|jailbreak|developer\s+mode)",
    re.IGNORECASE,
)

ABSTAIN = (
    "I don't have a grounded answer for that. Try asking about a project, "
    "CJ's experience, technical stack, availability, or contact details.\n\n"
    "- **Direct email:** carljoshuamcoloma@gmail.com\n"
    "- **Projects:** ReSOLVE, Powerlift, Sunny AI, AI Resume Analyzer, Document Summarizer"
)

# ---------------------------------------------------------------- tokenizing

STOP_WORDS = {
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
}

TOKEN_RE = re.compile(r"[a-z0-9]+")

ALIASES = {
    "resolve": ["support", "customer", "ticket", "tickets", "triage", "escalation"],
    "powerlift": ["thesis", "pose", "biomechanics", "yolov8", "kalman", "svm", "lifting"],
    "sunny": ["mentor", "mentorship", "sunnyai"],
    "resume-analyzer": ["resume", "résumé", "ats", "analyzer"],
    "doc-summarizer": ["summarizer", "summarization", "summarize", "bart", "t5", "pdf"],
    "flyrank": ["flyrankai", "recent", "latest"],
    "sofi": ["sofiai"],
    "lamina": ["laminastudios"],
    "experience": [
        "internship", "internships", "intern", "interns", "companies", "role",
        "roles", "position", "positions",
    ],
    "stack": [
        "skills", "tech", "tools", "technologies", "languages", "frameworks",
        "python", "javascript", "pytorch", "react", "fastapi",
    ],
    "contact": ["email", "e-mail", "linkedin", "github", "reach"],
    "availability": ["available", "hiring", "hire", "recruit", "job", "role", "roles"],
    "automation": ["automate", "workflow", "workflows", "guardrails", "human-in-the-loop", "rag"],
    "education": ["school", "university", "degree", "feu", "student"],
    "about": ["bio", "background"],
    "projects": ["portfolio", "project"],
}


def tokenize(text):
    return [
        word
        for word in TOKEN_RE.findall(text.lower())
        if len(word) > 2 and word not in STOP_WORDS
    ]


# ---------------------------------------------------------------- index

CHUNKS = []
for doc in DOCS:
    title_tokens = tokenize(doc["title"])
    for chunk in doc["chunks"]:
        heading_tokens = tokenize(chunk["heading"])
        text_tokens = tokenize(chunk["text"])
        # Repeat heading and title terms so a heading match counts more and a
        # dedicated page outranks a passing mention in another document.
        tokens = text_tokens + heading_tokens + title_tokens * 2
        CHUNKS.append(
            {
                "doc_id": doc["id"],
                "title": doc["title"],
                "url": doc.get("url", ""),
                "heading": chunk["heading"],
                "text": chunk["text"],
                "tokens": tokens,
                "tf": Counter(tokens),
                "dl": len(tokens),
            }
        )

CHUNK_COUNT = len(CHUNKS)
AVGDL = sum(c["dl"] for c in CHUNKS) / CHUNK_COUNT
DF = Counter()
for chunk in CHUNKS:
    for term in set(chunk["tokens"]):
        DF[term] += 1

K1 = 1.2
B = 0.75


def idf(term):
    return math.log((CHUNK_COUNT - DF.get(term, 0) + 0.5) / (DF.get(term, 0) + 0.5) + 1)


def expand_query(query):
    """Term weights: query terms count fully, aliases count less."""
    weights = {}
    for term in tokenize(query):
        weights[term] = max(weights.get(term, 0), 1.0)
        for key, aliases in ALIASES.items():
            if term == key or term in aliases:
                weights[key] = max(weights.get(key, 0), 0.55)
                for alias in aliases:
                    weights[alias] = max(weights.get(alias, 0), 0.35)

    if not weights and re.search(
        r"\b(who|what)\b.*\b(cj|carl|coloma|you|him|he)\b", query, re.IGNORECASE
    ):
        weights["bio"] = 1.0
    return weights


def prefix_match(term, chunk):
    """Fallback for plurals and simple stems: 'intern' vs 'internships'."""
    if len(term) < 5:
        return None
    for candidate, count in chunk["tf"].items():
        if len(candidate) >= 5 and (
            candidate.startswith(term) or term.startswith(candidate)
        ):
            return candidate, count
    return None


def score_chunk(weights, chunk):
    score = 0.0
    for term, weight in weights.items():
        tf = chunk["tf"].get(term, 0)
        matched = term
        if not tf:
            found = prefix_match(term, chunk)
            if found:
                matched, tf = found
        if not tf:
            continue
        denom = tf + K1 * (1 - B + B * chunk["dl"] / AVGDL)
        score += weight * idf(matched) * (tf * (K1 + 1)) / denom
    return score


# ---------------------------------------------------------------- retrieval

SENTENCE_RE = re.compile(r"(?<=[.!?])\s+")
MIN_SCORE = 1.0


def make_snippet(text, weights, limit=220):
    sentences = [s.strip() for s in SENTENCE_RE.split(text) if s.strip()]
    if not sentences:
        return text

    def hits(sentence):
        words = set(tokenize(sentence))
        return sum(1 for term in weights if term in words)

    best = max(sentences, key=hits)
    if hits(best) == 0:
        best = sentences[0]
    if len(best) > limit:
        best = best[:limit].rsplit(" ", 1)[0].rstrip(",;:") + "…"
    return best


def retrieve(query, context=None, top_k=3):
    weights = expand_query(query)
    if not weights:
        return []

    follow_up = bool(re.search(r"\b(it|that|this|those|them|more|second|third|first)\b", query, re.IGNORECASE))
    scored = []
    for chunk in CHUNKS:
        score = score_chunk(weights, chunk)
        if context and chunk["doc_id"] == context:
            score *= 1.8 if follow_up else 1.3
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)

    matches = []
    seen = set()
    for score, chunk in scored:
        if chunk["doc_id"] in seen:
            continue
        seen.add(chunk["doc_id"])
        matches.append(
            {
                "id": chunk["doc_id"],
                "doc_id": chunk["doc_id"],
                "title": chunk["title"],
                "heading": chunk["heading"],
                "text": chunk["text"],
                "snippet": make_snippet(chunk["text"], weights),
                "url": chunk["url"],
                "score": round(score, 3),
            }
        )
        if len(matches) >= top_k:
            break
    if not matches:
        return []
    floor = max(MIN_SCORE, matches[0]["score"] * 0.2)
    return [match for match in matches if match["score"] >= floor]


def doc_matches(doc_ids):
    matches = []
    for doc_id in doc_ids:
        doc = DOC_BY_ID.get(doc_id)
        if not doc:
            continue
        chunk = doc["chunks"][0]
        matches.append(
            {
                "id": doc["id"],
                "doc_id": doc["id"],
                "title": doc["title"],
                "heading": chunk["heading"],
                "text": chunk["text"],
                "snippet": make_snippet(chunk["text"], {}),
                "url": doc.get("url", ""),
                "score": 0,
            }
        )
    return matches


FOLLOW_UP_RE = re.compile(
    r"^\s*(and\b|so\b|why\b|how so|really\b|more\b|tell me more|go on|"
    r"continue|elaborate|what about\b|how about\b|anything else)",
    re.IGNORECASE,
)


def build_answer(matches):
    if not matches:
        return ABSTAIN
    lead = matches[0]
    answer = f"**{lead['title']} — {lead['heading']}**\n\n{lead['text']}"
    floor = max(MIN_SCORE, lead["score"] * 0.25)
    related = [
        m for m in matches[1:] if m["doc_id"] != lead["doc_id"] and m["score"] >= floor
    ]
    if related:
        answer += "\n\nRelated: " + "; ".join(
            f"{m['title']} — {m['heading']}" for m in related
        )
    return answer


# ---------------------------------------------------------------- intents

CONTACT_REPLY = (
    "You can reach CJ through the following channels:\n\n"
    "- **Email:** carljoshuamcoloma@gmail.com\n"
    "- **GitHub:** github.com/cdobby18\n"
    "- **LinkedIn:** linkedin.com/in/carl-joshua-coloma"
)

INTENTS = [
    (
        r"^\s*(hi|hey|hello|yo|sup|howdy|good (morning|afternoon|evening))"
        r"(\s+(there|again|all|everyone|friend))?[\s!,.?]*$",
        "Hello. I'm CJ's portfolio assistant. You can ask about his projects, "
        "automation work, technical stack, experience, or contact details.",
        [],
    ),
    (
        r"^\s*(how are you( doing)?|how's it going|how are things|how r u|hru|what's up|what up|wassup)"
        r"[\s!,.?]*$",
        "I'm running normally. What would you like to know about CJ's work?",
        [],
    ),
    (
        r"^\s*(thanks|thank you|ty|appreciate it)[\s!,.?]*$",
        "You're welcome. Let me know if you have further questions about CJ's work.",
        [],
    ),
    (
        r"^\s*(help|what can you do|what can i ask|how does this work|capabilities)"
        r"[\s!,.?]*$",
        "I answer from a small set of portfolio documents. Ask about a project, "
        "CJ's experience, stack, availability, or contact details. I cite the "
        "passage I used and say when I don't have a grounded answer.",
        [],
    ),
    (
        r"^\s*(bye|goodbye|see you|see ya|later|good night|take care)[\s!,.?]*$",
        "Thank you for stopping by. To get in touch directly, email "
        "carljoshuamcoloma@gmail.com.",
        ["contact"],
    ),
    (
        r"^\s*(ok|okay|cool|nice|great|awesome|got it|sounds good)[\s!,.?]*$",
        "Understood. Let me know if you would like details on anything else.",
        [],
    ),
    (
        r"\b(contact|email|e-mail|reach|get in touch|linkedin|github)\b",
        CONTACT_REPLY,
        ["contact"],
    ),
    (
        r"\b(available|availability|open to work|open to roles|hiring|hire|recruit|job opportunity|full[- ]time role|looking for a role)\b",
        "CJ is available immediately for AI automation or applied AI roles, remote "
        "or hybrid, based in Manila on PHT (UTC+8).\n\n"
        "- **Focus:** LLM workflows, agentic systems, and human-in-the-loop operations\n"
        "- **Best contact:** carljoshuamcoloma@gmail.com",
        ["availability"],
    ),
    (
        r"\b(currently|current work|right now|working on|these days|latest role|recent role|most recent)\b",
        "CJ's most recent role was a Backend AI Engineer internship at FlyRank AI, "
        "completed in October 2026. He currently focuses on AI automation and is "
        "open to new roles.",
        ["flyrank", "experience"],
    ),
]

GREETING_PREFIX = re.compile(
    r"^\s*(hi|hey|hello|yo|sup|howdy|good (morning|afternoon|evening))"
    r"(\s+(there|again|all|everyone|friend))?[\s,!.]*",
    re.IGNORECASE,
)


def match_intent(query):
    for pattern, reply, doc_ids in INTENTS:
        if re.search(pattern, query, re.IGNORECASE):
            return reply, doc_matches(doc_ids)
    return None


# ---------------------------------------------------------------- request


def run_query(query, context=None):
    original = (query or "").strip()

    if not original:
        return {"query": original, "matches": [], "answer": ABSTAIN, "topic": None}

    if len(original) > MAX_QUERY:
        return {
            "query": original,
            "matches": [],
            "answer": f"Keep questions under {MAX_QUERY} characters so retrieval stays precise.",
            "topic": None,
        }

    if INJECTION_RE.search(original):
        return {
            "query": original,
            "matches": [],
            "answer": "I only answer questions about CJ's work and background. "
            "Ask about a project, his experience, stack, or contact details.",
            "topic": None,
        }

    intent = match_intent(original)
    if not intent:
        cleaned = GREETING_PREFIX.sub("", original, count=1).strip()
        if cleaned and cleaned != original:
            intent = match_intent(cleaned)
            if intent:
                original = cleaned
    if intent:
        reply, matches = intent
        topic = matches[0]["doc_id"] if matches else None
        return {"query": original, "matches": matches, "answer": reply, "topic": topic}

    cleaned = GREETING_PREFIX.sub("", query, count=1).strip() or query

    if context and not tokenize(cleaned) and FOLLOW_UP_RE.match(cleaned):
        doc = DOC_BY_ID.get(context)
        if doc:
            matches = doc_matches([context])
            return {
                "query": original,
                "matches": matches,
                "answer": build_answer(matches),
                "topic": context,
            }

    matches = retrieve(cleaned, context=context, top_k=3)
    if not matches or matches[0]["score"] < MIN_SCORE:
        return {"query": original, "matches": [], "answer": ABSTAIN, "topic": context}

    return {
        "query": original,
        "matches": matches,
        "answer": build_answer(matches),
        "topic": matches[0]["doc_id"],
    }


# ---------------------------------------------------------------- evaluation

_EVAL_CACHE = None


def evaluate():
    global _EVAL_CACHE
    if _EVAL_CACHE is not None:
        return _EVAL_CACHE

    total = len(EVAL_CASES)
    hit1 = hit3 = 0
    reciprocal = 0.0
    for case in EVAL_CASES:
        results = retrieve(case["query"], top_k=3)
        ids = [r["doc_id"] for r in results]
        expected = set(case["expect"])
        if ids and ids[0] in expected:
            hit1 += 1
        if any(doc_id in expected for doc_id in ids):
            hit3 += 1
        for rank, doc_id in enumerate(ids, 1):
            if doc_id in expected:
                reciprocal += 1 / rank
                break

    _EVAL_CACHE = {
        "total": total,
        "hit1": round(hit1 / total * 100, 1) if total else 0,
        "hit3": round(hit3 / total * 100, 1) if total else 0,
        "mrr": round(reciprocal / total, 3) if total else 0,
    }
    return _EVAL_CACHE


def write_json(handler, payload, status=200):
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(body)


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        write_json(
            self,
            {"eval": evaluate(), "chunks": CHUNK_COUNT, "docs": len(DOCS)},
        )

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        raw_body = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw_body or b"{}")
        except json.JSONDecodeError:
            payload = {}

        query = payload.get("query") or ""
        context = payload.get("context")
        if not isinstance(context, str):
            context = None

        write_json(self, run_query(query, context=context))
