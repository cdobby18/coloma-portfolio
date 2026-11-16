# Carl Coloma — Portfolio

Personal portfolio for **Carl Joshua Coloma, AI Automation Engineer**. The site focuses on LLM-powered workflows — support triage, document intake, research operations — with guardrails, human-in-the-loop decisions, and production-minded fallbacks.

Live: [carlcoloma.vercel.app](https://carlcoloma.vercel.app/)

---

## What's inside

- Hero and positioning for AI automation engineering
- Experience timeline across FlyRank AI, SoFi AI, and Lamina Studios
- Project list with system-architecture modals
- Interactive portfolio assistant (`/api/rag`) with a local keyword fallback
- Live GitHub activity card
- Certifications, contact details, and résumé download

## Tech stack

- **Frontend:** React 18, Vite, plain CSS (inlined in the app component), no router
- **Backend:** Python serverless function on Vercel (`api/rag.py`)
- **Deployment:** Vercel
- **Static pages:** `public/blog.html`, `public/404.html`

## Running locally

```bash
npm install
npm run dev
```

The portfolio assistant calls `/api/rag`. Locally, Vite does not run the Python function, so the UI falls back to its built-in keyword answers.

Build and preview:

```bash
npm run build
npm run preview
```

## Project structure

```
api/rag.py           # Serverless assistant endpoint (keyword retrieval + intents)
public/              # Static assets, blog, 404, résumé, images
src/OnePiece.jsx     # App shell, sections, theme, inline styles
src/Architecture.jsx # System-architecture data and pipeline diagram
src/demo/RagDemo.jsx # Portfolio assistant UI + local fallback answers
index.html           # Metadata, fonts, JSON-LD
```

## Notes

- Content is currently duplicated across `src/OnePiece.jsx`, `src/demo/RagDemo.jsx`, and `api/rag.py`. Moving it to a single content module is planned.
- The portfolio assistant is a keyword/intent demo, not a vector-based RAG pipeline. It is labeled honestly in the UI copy and slated for a real retrieval upgrade.
