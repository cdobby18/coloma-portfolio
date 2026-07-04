"""Vercel serverless function powering the Mini RAG Demo.

Retrieval is a simple keyword/prefix-overlap scorer over a small mock
document set — no external APIs or vector DB, just plain Python.
"""

import json
import re
from http.server import BaseHTTPRequestHandler

STOP_WORDS = {
    "the", "and", "for", "are", "you", "your", "what",
    "how", "does", "with", "about", "tell",
}

MOCK_DOCS = [
    {
        "id": "powerlift",
        "title": "Powerlift — Thesis Project",
        "text": (
            "Powerlift is an AI biomechanics analyzer for powerlifting, combining YOLOv8 "
            "pose estimation, Kalman filtering for motion stabilization, and SVM "
            "classification for lift-phase detection. It runs in real time on mobile "
            "hardware and won the Overall Best Thesis Award in the Computer Vision "
            "category, November 2025."
        ),
    },
    {
        "id": "ai-roadmap",
        "title": "AI Engineering Roadmap — Learning Journal",
        "text": (
            "A self-study curriculum documenting my path into AI engineering: tutorials "
            "completed, core machine learning and LLM concepts learned, and small "
            "exercises built along the way, tracked publicly from fundamentals through "
            "applied projects."
        ),
    },
    {
        "id": "resume-analyzer",
        "title": "AI Resume Analyzer",
        "text": (
            "An NLP pipeline using spaCy named-entity recognition and transformer-based "
            "semantic matching to extract skills and experience from resumes, producing "
            "structured JSON for downstream ranking or ATS integration. Processes over "
            "100 documents per minute."
        ),
    },
    {
        "id": "doc-summarizer",
        "title": "Document Summarizer",
        "text": (
            "An abstractive summarization system for multi-page PDFs using BART and T5 "
            "models. Long documents are chunked to fit model context limits, then "
            "section-level summaries are merged into a single coherent output."
        ),
    },
    {
        "id": "flyrank",
        "title": "Backend AI Engineer Intern — FlyRank AI",
        "text": (
            "Currently building LLM-powered content generation and semantic ranking "
            "pipelines, integrating embedding models with vector search for semantic "
            "retrieval, and contributing to prompt engineering workflows for production "
            "AI features."
        ),
    },
    {
        "id": "sofi-qa",
        "title": "AI QA Intern — SoFi AI Tech Solutions",
        "text": (
            "Designed adversarial prompt test suites targeting hallucination, refusal, "
            "and instruction-following failures in conversational AI chatbots, and "
            "evaluated chatbot responses to track hallucination rates and response "
            "quality at scale."
        ),
    },
    {
        "id": "lamina",
        "title": "AI Engineer Intern — Lamina Studios",
        "text": (
            "Built real-time YOLOv8 object detection pipelines with OpenCV at "
            "production-ready inference speeds, and trained XGBoost classification "
            "models on time-series data to automate manual review workflows."
        ),
    },
    {
        "id": "dance-bawz",
        "title": "Dance — BAWZ Crew",
        "text": (
            "Competed with the dance group BAWZ at an international competition in "
            "Singapore in 2025, representing the Philippines and winning the Open "
            "Division championship after months of rehearsal."
        ),
    },
    {
        "id": "skills-stack",
        "title": "Technical Skills & Stack",
        "text": (
            "Works with Python, JavaScript, SQL, and C++, plus PyTorch, TensorFlow, "
            "Scikit-learn, OpenCV, LangChain, Hugging Face Transformers, and "
            "Retrieval-Augmented Generation. Builds with FastAPI, Flask, React, and "
            "Streamlit, and uses Git, Docker, Jupyter, MySQL, VS Code, Kaggle, Claude "
            "Code, and Qdrant."
        ),
    },
    {
        "id": "internships-overview",
        "title": "Internship Experience Overview",
        "text": (
            "Completed three AI engineering internships: Lamina Studios in computer "
            "vision (Dec 2025 to Apr 2026), SoFi AI Tech Solutions in AI QA and chatbot "
            "testing (Apr to Jul 2026), and FlyRank AI in backend AI engineering (Jul "
            "2026 to present)."
        ),
    },
]


def tokenize(text):
    return re.findall(r"\w+", text.lower())


def words_match(a, b):
    if a == b:
        return True
    min_shared_len = 4
    return len(a) >= min_shared_len and len(b) >= min_shared_len and (a.startswith(b) or b.startswith(a))


def score_doc(query_words, doc):
    title_words = tokenize(doc["title"])
    text_words = tokenize(doc["text"])
    score = 0
    for qw in query_words:
        if any(words_match(qw, tw) for tw in title_words):
            score += 2
        if any(words_match(qw, tw) for tw in text_words):
            score += 1
    return score


def build_answer(top_docs):
    if not top_docs:
        return (
            "No relevant documents found in the mock knowledge base — try asking "
            "about a project, an internship, or a skill."
        )
    lead, *rest = top_docs
    supporting = " and ".join(d["title"] for d in rest)
    answer = f'Based on "{lead["title"]}": {lead["text"]}'
    if supporting:
        answer += f" (Also relevant: {supporting}.)"
    return answer


def run_query(query):
    query_words = [w for w in tokenize(query) if len(w) > 2 and w not in STOP_WORDS]
    if not query_words:
        return {"query": query, "matches": [], "answer": build_answer([])}

    scored = sorted(
        ({"doc": doc, "score": score_doc(query_words, doc)} for doc in MOCK_DOCS),
        key=lambda r: r["score"],
        reverse=True,
    )
    matches = [r for r in scored if r["score"] > 0][:3]
    return {
        "query": query,
        "matches": matches,
        "answer": build_answer([m["doc"] for m in matches]),
    }


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        raw_body = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw_body or b"{}")
        except json.JSONDecodeError:
            payload = {}

        query = (payload.get("query") or "").strip()
        result = run_query(query)

        body = json.dumps(result).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
