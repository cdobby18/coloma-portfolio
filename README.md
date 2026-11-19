# Carl Coloma — Portfolio

Personal portfolio for **Carl Joshua Coloma, AI Automation Engineer**. The site focuses on LLM-powered workflows — support triage, document intake, research operations — with guardrails, human-in-the-loop decisions, and production-minded fallbacks.

Live: [carlcoloma.vercel.app](https://carlcoloma.vercel.app/)

---

## What's inside

- Hero and positioning for AI automation engineering
- Experience timeline across FlyRank AI, SoFi AI, and Lamina Studios
- Project list with case-study links and system-architecture modals
- Portfolio assistant (`/api/rag`) with BM25 retrieval over section chunks, inline citations, multi-turn context, and abstention when retrieval is weak
- Shared assistant content and eval set in `api/data/assistant.json`, imported by both the Python endpoint and the offline React fallback
- Contact form that sends through Resend (`/api/contact`) with a mailto fallback
- Live GitHub activity card
- Certifications, contact details, and résumé download

## Tech stack

- **Frontend:** React 18, Vite, plain CSS generated from theme tokens, no router
- **Backend:** Python serverless functions on Vercel (`api/rag.py`, `api/contact.py`)
- **Deployment:** Vercel
- **Static pages:** `public/blog.html`, `public/work/*.html`, `public/404.html`

## Running locally

```bash
npm install
npm run dev
```

The portfolio assistant calls `/api/rag`. The Vite dev server shells out to `api/rag.py` for local requests, so retrieval, citations, context, and the eval metric behave the same as production. If the endpoint is unreachable, the UI falls back to the JSON-backed scorer in `src/demo/RagDemo.jsx`. The contact form falls back to opening a mailto draft without `RESEND_API_KEY`.

Build and preview:

```bash
npm run build
npm run preview
```

## Project structure

```
api/rag.py             # Serverless assistant endpoint (BM25 retrieval, guardrails, eval)
api/data/assistant.json # Shared assistant docs, chunks, and retrieval eval cases
api/contact.py         # Serverless contact endpoint (Resend delivery + honeypot)
public/                # Static assets, blog, case studies, 404, résumé, OG card
public/case-study.css  # Shared styles for /work case-study pages
public/work/           # ReSOLVE and Powerlift case studies
src/portfolio.jsx      # App shell: nav, theme toggle, scroll spy, footer
src/theme.js           # Theme tokens (light/dark) + context
src/content.js         # Projects, experience, skills, and site copy
src/components/        # Shared primitives, IDE window, GitHub card
src/sections/          # Hero, About, Experience, Projects, Stack, Certs, Contact
src/styles/            # Theme-aware global stylesheet
src/Architecture.jsx   # System-architecture data and pipeline diagram
src/demo/RagDemo.jsx   # Portfolio assistant UI + local fallback answers
index.html             # Metadata, fonts, JSON-LD
```

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables):

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes (for the form) | Resend API key. Without it `/api/contact` returns 503 and the form falls back to mailto. |
| `CONTACT_TO` | no | Recipient. Defaults to `carljoshuamcoloma@gmail.com`. |
| `CONTACT_FROM` | no | Verified sender. Defaults to `Portfolio <onboarding@resend.dev>`. |

## Notes

- `api/data/assistant.json` is the single source for assistant documents, section chunks, project URLs, and the 30-question retrieval eval set. Update document text there instead of editing it in two places.
- Retrieval is lexical BM25 over section chunks, not an embedding index. It cites the passage it used and abstains below a score threshold instead of guessing. `GET /api/rag?eval=1` returns hit@1, hit@3, MRR, chunk count, and document count.
- The UI shows the eval hit@3 result in the assistant sidebar when `/api/rag` is available.
- Case-study pages use HTML/CSS architecture diagrams rather than fabricated product screenshots.
