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
            "CJ built LLM-powered content generation and semantic ranking "
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
    ),
    (
        r"^\s*(how are you( doing)?|how's it going|how are things|how r u|hru|what's up|what up|wassup)"
        r"[\s!,.?]*$",
        "I'm running normally. What would you like to know about CJ's work?",
    ),
    (
        r"^\s*(thanks|thank you|ty|appreciate it)[\s!,.?]*$",
        "You're welcome. Let me know if you have further questions about CJ's work.",
    ),
    (
        r"^\s*(help|what can you do|what can i ask|how does this work|capabilities)"
        r"[\s!,.?]*$",
        "I can answer questions about CJ's projects, automation work, experience, "
        "technical stack, education, and contact details. Try asking about his stack, "
        "ReSOLVE, or the Powerlift thesis.",
    ),
    (
        r"^\s*(bye|goodbye|see you|see ya|later|good night|take care)[\s!,.?]*$",
        "Thank you for stopping by. To get in touch directly, email "
        "carljoshuamcoloma@gmail.com.",
    ),
    (
        r"^\s*(ok|okay|cool|nice|great|awesome|got it|sounds good)[\s!,.?]*$",
        "Understood. Let me know if you would like details on anything else.",
    ),
    (
        r"\b(contact|email|e-mail|reach|get in touch|linkedin|github)\b",
        CONTACT_REPLY,
    ),
    (
        r"\b(available|availability|open to work|open to roles|hiring|hire|recruit|job opportunity|full[- ]time role|looking for a role)\b",
        "CJ is available for AI automation roles and select workflow projects.\n\n"
        "- **Focus areas:** LLM workflows, agentic systems, and human-in-the-loop operations\n"
        "- **Availability:** Immediate — most recent internship concluded October 2026\n"
        "- **Best contact:** carljoshuamcoloma@gmail.com",
    ),
    (
        r"\b(currently|current work|right now|working on|these days|latest role|recent role|most recent|now)\b",
        "CJ's most recent role was a Backend AI Engineer internship at FlyRank AI, "
        "completed in October 2026. He currently focuses on AI automation — LLM "
        "workflows with guardrails, evaluation, and human oversight — and is open to "
        "new roles.",
    ),
    (
        r"\bflyrank\b",
        "**Backend AI Engineer Intern — FlyRank AI** (July–October 2026)\n\n"
        "- Built LLM-powered content generation and semantic ranking pipelines\n"
        "- Integrated embedding models with vector search for semantic retrieval\n"
        "- Contributed to prompt engineering and output quality evaluation for production AI features",
    ),
    (
        r"\bsofi\b",
        "**AI QA Intern — SoFi AI Tech Solutions** (April–July 2026)\n\n"
        "- Designed adversarial prompt test suites for hallucination, refusal, and instruction-following failures\n"
        "- Evaluated chatbot responses at scale and tracked error rates\n"
        "- Worked with ML teams to turn evaluation findings into model behavior improvements",
    ),
    (
        r"\blamina\b",
        "**AI Engineer Intern — Lamina Studios** (December 2025–April 2026)\n\n"
        "- Built real-time YOLOv8 object detection pipelines with OpenCV at production-ready inference speeds\n"
        "- Trained XGBoost classification models on time-series data\n"
        "- Automated model retraining and evaluation workflows",
    ),
    (
        r"\b(automation|automate|automated|workflows?|triage|human[- ]in[- ]the[- ]loop|guardrails?)\b",
        "CJ builds LLM-powered workflows for support triage, document intake, and "
        "research operations. The approach:\n\n"
        "- Map the manual process before writing code\n"
        "- Automate one step at a time with deterministic fallbacks\n"
        "- Add citations and confidence scoring to grounded outputs\n"
        "- Require human approval for irreversible actions\n"
        "- Use retries, idempotency, and audit logs for reliability\n\n"
        "ReSOLVE is the featured automation project.",
    ),
    (
        r"\b(rag|retrieval|llms?|agents?|agentic|prompt engineering|computer vision)\b",
        "CJ's AI work centers on LLMs, RAG, and agentic systems.\n\n"
        "- **Retrieval:** embedding pipelines and vector search at FlyRank AI\n"
        "- **RAG:** a LangChain-based mentor for Sunny AI\n"
        "- **Evaluation:** adversarial prompt testing for chatbots at SoFi\n"
        "- **Computer vision:** real-time YOLOv8 detection and the Powerlift thesis",
    ),
    (
        r"\b(internships?|interns?|work experience|experience|worked|companies)\b",
        "CJ has completed three AI engineering internships:\n\n"
        "- **Lamina Studios** — AI Engineer Intern, computer vision (Dec 2025–Apr 2026)\n"
        "- **SoFi AI Tech Solutions** — AI QA Intern (Apr–Jul 2026)\n"
        "- **FlyRank AI** — Backend AI Engineer Intern (Jul–Oct 2026)\n\n"
        "FlyRank AI was the most recent and has concluded.",
    ),
    (
        r"\bpowerlift\b",
        "**Powerlift — Overall Best Thesis, Computer Vision (November 2025)**\n\n"
        "An AI biomechanics analyzer for powerlifting, running in real time on mobile hardware.\n\n"
        "- **Pose estimation:** YOLOv8 for joint tracking\n"
        "- **Stabilization:** Kalman filtering for motion smoothing\n"
        "- **Classification:** SVM for lift-phase detection",
    ),
    (
        r"\bsunny\b",
        "**Sunny AI — RAG-built mentor**\n\n"
        "A guided platform for aspiring AI engineers, built with React, FastAPI, LLMs, "
        "and RAG via LangChain. It structures the path from fundamentals through "
        "production AI practices.",
    ),
    (
        r"\b(resume|résumé|ats)\b",
        "**AI Resume Analyzer — NLP pipeline**\n\n"
        "- **Extraction:** spaCy named-entity recognition\n"
        "- **Matching:** transformer-based semantic similarity\n"
        "- **Output:** structured JSON for ranking or ATS use\n"
        "- **Throughput:** 100+ documents per minute\n"
        "- **Stack:** Python, FastAPI",
    ),
    (
        r"\b(summarizer|summarization|summarize|bart|t5)\b",
        "**Document Summarizer — abstractive summarization**\n\n"
        "- **Models:** BART and T5 (Hugging Face)\n"
        "- **Approach:** chunk long PDFs to fit context limits, then merge section-level summaries\n"
        "- **Output:** one coherent, readable summary\n"
        "- **Stack:** Python",
    ),
    (
        r"\b(projects?|portfolio|built|what has cj built)\b",
        "CJ's main projects:\n\n"
        "- **ReSOLVE** — agentic customer support automation with RAG drafting and human escalation\n"
        "- **Powerlift** — real-time pose estimation for powerlifting; Overall Best Thesis, Computer Vision (2025)\n"
        "- **Sunny AI** — RAG-based mentorship platform for aspiring AI engineers\n"
        "- **AI Resume Analyzer** — NLP pipeline for resume parsing and ranking\n"
        "- **Document Summarizer** — BART/T5 summarization for long PDFs\n\n"
        "Ask about any project for more detail.",
    ),
    (
        r"\b(stack|skills?|tech|tools|technologies|languages?|frameworks?)\b",
        "CJ's stack, grouped by area:\n\n"
        "- **Languages:** Python, JavaScript\n"
        "- **AI and LLMs:** PyTorch, scikit-learn, OpenCV, LangChain, Transformers, RAG, agentic workflows, prompt engineering\n"
        "- **Data:** MySQL, PostgreSQL, Qdrant\n"
        "- **Backend and frontend:** FastAPI, React\n"
        "- **Tooling:** Git, pytest, Jupyter, VS Code\n"
        "- **Currently exploring:** dbt, Airflow, Databricks, Snowflake",
    ),
    (
        r"\b(education|school|university|degree|study|studied|student|feu)\b",
        "**BS Computer Science** — FEU Institute of Technology (2026)",
    ),
    (
        r"\b(about cj|about you|about him|about yourself|who is cj|who are you|your background|his background|what do you do)\b",
        "CJ is Carl Joshua Coloma, an AI automation engineer and BS Computer Science "
        "graduate of FEU Institute of Technology (2026).\n\n"
        "- **Focus:** AI automation, LLM workflows, and agentic systems\n"
        "- **Experience:** three AI engineering internships across computer vision, AI QA, and backend AI\n"
        "- **Approach:** production-first — guardrails, fallbacks, evaluation, and a human in the loop",
    ),
]


def match_intent(query):
    for pattern, reply in INTENTS:
        if re.search(pattern, query, re.IGNORECASE):
            return reply
    return None


GREETING_PREFIX = re.compile(
    r"^\s*(hi|hey|hello|yo|sup|howdy|good (morning|afternoon|evening))"
    r"(\s+(there|again|all|everyone|friend))?[\s,!.]*",
    re.IGNORECASE,
)


def strip_greeting(query):
    return GREETING_PREFIX.sub("", query, count=1).strip()


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
            "I don't have a specific answer for that. Try asking about a project, "
            "CJ's automation work, the technical stack, or contact details.\n\n"
            "- **Direct email:** carljoshuamcoloma@gmail.com\n"
            "- **Projects:** ReSOLVE, Powerlift, Sunny AI, AI Resume Analyzer, Document Summarizer"
        )
    lead, *rest = top_docs
    supporting = ", ".join(d["title"] for d in rest)
    answer = lead["text"]
    if supporting:
        answer += f"\n\nRelated: {supporting}."
    return answer


def run_query(query):
    original_query = query
    intent_reply = match_intent(query) if query else None
    if intent_reply:
        return {"query": original_query, "matches": [], "answer": intent_reply}

    cleaned = strip_greeting(query)
    if cleaned and cleaned != query:
        intent_reply = match_intent(cleaned)
        if intent_reply:
            return {"query": original_query, "matches": [], "answer": intent_reply}
        query = cleaned

    query_words = [w for w in tokenize(query) if len(w) > 2 and w not in STOP_WORDS]
    if not query_words:
        return {"query": original_query, "matches": [], "answer": build_answer([])}

    scored = sorted(
        ({"doc": doc, "score": score_doc(query_words, doc)} for doc in MOCK_DOCS),
        key=lambda r: r["score"],
        reverse=True,
    )
    matches = [r for r in scored if r["score"] > 0][:3]
    return {
        "query": original_query,
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
