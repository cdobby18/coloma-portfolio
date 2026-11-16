"""Vercel serverless function powering the Mini RAG Demo.

Retrieval is a simple keyword/prefix-overlap scorer over a small mock
document set — no external APIs or vector DB, just plain Python.
"""

import json
import re
from http.server import BaseHTTPRequestHandler

STOP_WORDS = {
    "the", "and", "for", "are", "you", "your", "what",
    "how", "does", "with", "about", "tell", "this", "that",
    "from", "have", "been", "into", "over", "more",
}

ALIASES = {
    "sunny": ["sunnyai", "mentor"],
    "roadmap": ["airoadmap"],
    "resume": ["resumes", "analyzer", "ats"],
    "summarizer": ["summarize", "summary", "bart", "t5"],
    "powerlift": ["thesis", "biomechanics", "pose", "yolov8"],
    "intern": ["internship", "internships"],
    "flyrank": ["flyrankai"],
    "sofi": ["sofiai"],
    "lamina": ["laminastudios"],
    "rag": ["retrieval", "retriever"],
    "llm": ["llms", "language", "gpt"],
    "skills": ["stack", "tech", "tools", "technologies"],
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
        "id": "sunny-ai",
        "title": "Sunny AI — RAG-Built Mentor",
        "text": (
            "Sunny AI is a guided platform for aspiring AI engineers built with React, "
            "Python, FastAPI, LLMs, and RAG using LangChain. It acts as a mentor that "
            "takes learners from zero to job-ready by teaching fundamentals, production "
            "skills, and real-world AI engineering practices."
        ),
    },
    {
        "id": "ai-roadmap",
        "title": "AI Engineering Roadmap — Learning Journal",
        "text": (
            "A self-study curriculum documenting the path into AI engineering with tutorials, "
            "core machine learning and LLM concepts, hands-on exercises, and applied projects. "
            "Covers Python, PyTorch, Transformers, RAG, evaluation, and building AI systems."
        ),
    },
    {
        "id": "resume-analyzer",
        "title": "AI Resume Analyzer",
        "text": (
            "An NLP pipeline using spaCy named-entity recognition and transformer-based "
            "semantic matching to extract skills and experience from resumes, producing "
            "structured JSON for downstream ranking or ATS integration. Processes over "
            "100 documents per minute and is built with Python and FastAPI."
        ),
    },
    {
        "id": "resolve",
        "title": "ReSOLVE — Customer Support Automation",
        "text": (
            "ReSOLVE is an agentic support platform that triages tickets by intent, "
            "priority, and sentiment; drafts grounded responses with RAG confidence "
            "scoring and citations; and escalates risky requests to humans with "
            "deterministic fallbacks and an audit trail."
        ),
    },
    {
        "id": "automation",
        "title": "AI Automation Focus",
        "text": (
            "CJ builds LLM-powered workflows for support triage, document intake, and "
            "research operations. He maps the manual process first, then automates one "
            "step at a time with deterministic fallbacks, citations, human approval for "
            "irreversible actions, retries, idempotency, and audit logs. ReSOLVE is his "
            "featured automation project."
        ),
    },
    {
        "id": "doc-summarizer",
        "title": "Document Summarizer",
        "text": (
            "An abstractive summarization system for multi-page PDFs using BART and T5 "
            "from Hugging Face. Long documents are chunked to fit model context limits, "
            "then section-level summaries are merged into a single coherent, readable output."
        ),
    },
    {
        "id": "flyrank",
        "title": "Backend AI Engineer Intern — FlyRank AI",
        "text": (
            "Built LLM-powered content generation and semantic ranking "
            "pipelines, integrated embedding models with vector search for semantic "
            "retrieval, and contributed to prompt engineering workflows for production "
            "AI features. Internship ran July to October 2026."
        ),
    },
    {
        "id": "sofi-qa",
        "title": "AI QA Intern — SoFi AI Tech Solutions",
        "text": (
            "Designed adversarial prompt test suites targeting hallucination, refusal, "
            "and instruction-following failures in conversational AI chatbots, evaluated "
            "responses at scale, and partnered with ML teams to reduce error rates."
        ),
    },
    {
        "id": "lamina",
        "title": "AI Engineer Intern — Lamina Studios",
        "text": (
            "Built real-time YOLOv8 object detection pipelines with OpenCV at "
            "production-ready inference speeds, trained XGBoost classification "
            "models on time-series data, and automated model retraining workflows."
        ),
    },
    {
        "id": "skills-stack",
        "title": "Technical Skills & Stack",
        "text": (
            "Core languages: Python and JavaScript. AI/ML: PyTorch, TensorFlow, Scikit-learn, "
            "OpenCV, LangChain, Transformers, RAG, Prompt Engineering, LLM APIs, Agentic Workflows. "
            "Data & ETL (Learning): SQL, Databricks, ETL, dbt, Airflow, Snowflake, PySpark. "
            "Frameworks & Tools: FastAPI, Flask, React, Streamlit, RESTful APIs, Docker, Git, "
            "VS Code, Claude Code, Hermes Agent, Obsidian, Exa AI, Qdrant."
        ),
    },
    {
        "id": "internships-overview",
        "title": "Internship Experience Overview",
        "text": (
            "Completed three AI engineering internships: Lamina Studios in computer "
            "vision (Dec 2025 to Apr 2026), SoFi AI Tech Solutions in AI QA and chatbot "
            "testing (Apr to Jul 2026), and FlyRank AI in backend AI engineering (Jul "
            "to Oct 2026)."
        ),
    },
]

CONTACT_REPLY = (
    "You can reach CJ at carljoshuamcoloma@gmail.com. GitHub is "
    "github.com/cdobby18, and LinkedIn is linkedin.com/in/carl-joshua-coloma."
)

INTENTS = [
    (
        r"^\s*(hi|hey|hello|yo|sup|good (morning|afternoon|evening))[\s!,.?]*$",
        "Hey — I'm CJ's portfolio assistant. What would you like to know?",
    ),
    (
        r"^\s*(thanks|thank you|ty|appreciate it)[\s!,.?]*$",
        "Anytime. Feel free to keep asking.",
    ),
    (
        r"\b(contact|email|e-mail|reach|get in touch|linkedin|github)\b",
        CONTACT_REPLY,
    ),
    (
        r"\b(available|availability|open to work|open to roles|hiring|hire|recruit|job opportunity|full[- ]time role|looking for a role)\b",
        "CJ is open to AI automation roles and select workflow projects, especially "
        "work around LLM workflows, agentic systems, and human-in-the-loop operations. "
        "His most recent internship "
        "at FlyRank AI ended in October 2026, so he's available now. Email is the "
        "fastest way to reach him: carljoshuamcoloma@gmail.com.",
    ),
    (
        r"\b(currently|current work|right now|working on|these days|latest role|recent role|most recent|now)\b",
        "CJ's most recent role was a Backend AI Engineer internship at FlyRank AI, "
        "which ended in October 2026. He's now focused on AI automation — building "
        "LLM workflows with guardrails and human oversight — and is open to new roles.",
    ),
    (
        r"\bflyrank\b",
        "CJ was a Backend AI Engineer Intern at FlyRank AI from July to October 2026. "
        "He built LLM-powered content generation and semantic ranking pipelines, "
        "integrated embedding models with vector search, and worked on prompt "
        "engineering for production AI features.",
    ),
    (
        r"\bsofi\b",
        "CJ was an AI QA Intern at SoFi AI Tech Solutions from April to July 2026. "
        "He designed adversarial prompt test suites for hallucination, refusal, and "
        "instruction-following failures, evaluated chatbot responses at scale, and "
        "worked with ML teams to reduce error rates.",
    ),
    (
        r"\blamina\b",
        "CJ was an AI Engineer Intern at Lamina Studios from December 2025 to April "
        "2026. He built real-time YOLOv8 object detection pipelines with OpenCV, "
        "trained XGBoost models on time-series data, and automated model retraining.",
    ),
    (
        r"\b(automation|automate|automated|workflows?|triage|human[- ]in[- ]the[- ]loop|guardrails?)\b",
        "CJ builds LLM-powered workflows for support triage, document intake, and "
        "research operations. He starts by mapping the manual process, then automates "
        "one step at a time with deterministic fallbacks, citations, human approval for "
        "irreversible actions, retries, idempotency, and audit logs. ReSOLVE is his "
        "featured automation project — a support platform that triages tickets and "
        "drafts grounded replies with human escalation.",
    ),
    (
        r"\b(rag|retrieval|llms?|agents?|agentic|prompt engineering|computer vision)\b",
        "CJ's AI work centers on LLMs, RAG, and agentic systems. He's built retrieval "
        "pipelines with embeddings and vector search at FlyRank, a RAG-based mentor "
        "with LangChain for Sunny AI, and adversarial evaluation for chatbots at SoFi. "
        "His computer vision work includes real-time YOLOv8 detection and the "
        "Powerlift thesis.",
    ),
    (
        r"\b(internships?|interns?|work experience|experience|worked|companies)\b",
        "CJ has completed three AI engineering internships: Lamina Studios in computer "
        "vision (Dec 2025–Apr 2026), SoFi AI Tech Solutions in AI QA (Apr–Jul 2026), "
        "and FlyRank AI in backend AI engineering (Jul–Oct 2026). FlyRank was the most "
        "recent, and that internship has wrapped up.",
    ),
    (
        r"\bpowerlift\b",
        "Powerlift is CJ's thesis project: an AI biomechanics analyzer for powerlifting. "
        "It combines YOLOv8 pose estimation, Kalman filtering for motion stabilization, "
        "and an SVM for lift-phase classification, all running in real time on mobile "
        "hardware. It won Overall Best Thesis in the Computer Vision category in "
        "November 2025.",
    ),
    (
        r"\bsunny\b",
        "Sunny AI is a guided platform CJ built for aspiring AI engineers — React and "
        "FastAPI on the outside, LLMs and RAG with LangChain underneath. It mentors "
        "learners from zero to job-ready by mixing fundamentals with production AI "
        "practices.",
    ),
    (
        r"\b(resume|résumé|ats)\b",
        "The AI Resume Analyzer is an NLP pipeline that extracts skills and experience "
        "from resumes using spaCy NER plus transformer-based semantic matching, then "
        "returns structured JSON for ranking or ATS use. It processes more than 100 "
        "documents a minute and is built with Python and FastAPI.",
    ),
    (
        r"\b(summarizer|summarization|summarize|bart|t5)\b",
        "The Document Summarizer is an abstractive summarization system for long PDFs. "
        "It uses BART and T5, chunks documents to fit context limits, then merges "
        "section-level summaries into one coherent output.",
    ),
    (
        r"\b(projects?|portfolio|built|what has cj built)\b",
        "CJ's main projects are ReSOLVE, Powerlift, Sunny AI, the AI Resume Analyzer, "
        "and the Document Summarizer. ReSOLVE is the automation showcase — a support "
        "platform that triages tickets, drafts grounded replies, and escalates to "
        "humans. Powerlift won Overall Best Thesis in Computer Vision. He's happy to "
        "go deeper on any of them.",
    ),
    (
        r"\b(stack|skills?|tech|tools|technologies|languages?|frameworks?)\b",
        "CJ's core stack is Python and JavaScript. For AI/ML he works with PyTorch, "
        "scikit-learn, OpenCV, LangChain, Transformers, RAG, and prompt engineering; "
        "for data, MySQL, PostgreSQL, and Qdrant; and for tooling, FastAPI, React, Git, "
        "pytest, and Jupyter. He's also building up on the data-engineering side with "
        "SQL, dbt, Airflow, and Databricks.",
    ),
    (
        r"\b(education|school|university|degree|study|studied|student|feu)\b",
        "CJ graduated with a BS in Computer Science from FEU Institute of Technology "
        "(2026).",
    ),
    (
        r"\b(about cj|about you|about him|about yourself|who is cj|who are you|your background|his background|what do you do)\b",
        "CJ is Carl Joshua Coloma, an AI automation engineer and BS Computer Science "
        "graduate from FEU Tech (2026). His focus is AI, automation, and agentic "
        "workflows — with hands-on work spanning LLMs, RAG, computer vision, and "
        "evaluation. He cares most about building AI that works in production, with "
        "guardrails, fallbacks, and a human in the loop.",
    ),
]


def match_intent(query):
    for pattern, reply in INTENTS:
        if re.search(pattern, query, re.IGNORECASE):
            return reply
    return None


def tokenize(text):
    return re.findall(r"\w+", text.lower())


def expand_query(query_words):
    expanded = set(query_words)
    for qw in list(query_words):
        for key, aliases in ALIASES.items():
            if qw == key or qw in aliases:
                expanded.add(key)
                expanded.update(aliases)
    return expanded


def words_match(a, b):
    if a == b:
        return True
    if len(a) < 3 or len(b) < 3:
        return False
    min_shared_len = 4
    if len(a) >= min_shared_len and len(b) >= min_shared_len and (a.startswith(b) or b.startswith(a)):
        return True
    return False


def score_doc(query_words, doc):
    expanded = expand_query(query_words)
    title_words = tokenize(doc["title"])
    text_words = tokenize(doc["text"])
    all_words = set(title_words + text_words)
    score = 0
    for qw in expanded:
        if qw in all_words:
            if any(words_match(qw, tw) for tw in title_words):
                score += 3
            elif any(words_match(qw, tw) for tw in text_words):
                score += 2
            else:
                score += 1
        else:
            if any(words_match(qw, tw) for tw in title_words):
                score += 2
            if any(words_match(qw, tw) for tw in text_words):
                score += 1
    return score


def build_answer(top_docs):
    if not top_docs:
        return (
            "I don't have a good answer for that yet. You can reach CJ directly at "
            "carljoshuamcoloma@gmail.com."
        )
    lead, *rest = top_docs
    supporting = " and ".join(d["title"] for d in rest)
    answer = f"Here's what I have on that: {lead['text']}"
    if supporting:
        answer += f" (Also relevant: {supporting}.)"
    return answer


def run_query(query):
    intent_reply = match_intent(query) if query else None
    if intent_reply:
        return {"query": query, "matches": [], "answer": intent_reply}

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
