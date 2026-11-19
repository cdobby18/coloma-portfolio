# Carl Coloma — Portfolio

Personal portfolio for **Carl Joshua Coloma, AI Automation Engineer**. The site focuses on LLM-powered workflows — support triage, document intake, research operations — with guardrails, human-in-the-loop decisions, and production-minded fallbacks.

Live: [carlcoloma.vercel.app](https://carlcoloma.vercel.app/)

---

## What's inside

- Hero and positioning for AI automation engineering
- Experience timeline across FlyRank AI, SoFi AI, and Lamina Studios
- Project list with system-architecture modals
- Interactive portfolio assistant (`/api/rag`) with a local keyword fallback
- Contact form that sends through Resend (`/api/contact`) with a mailto fallback
- Live GitHub activity card
- Certifications, contact details, and résumé download

## Tech stack

- **Frontend:** React 18, Vite, plain CSS generated from theme tokens, no router
- **Backend:** Python serverless functions on Vercel (`api/rag.py`, `api/contact.py`)
- **Deployment:** Vercel
- **Static pages:** `public/blog.html`, `public/404.html`

## Running locally

```bash
npm install
npm run dev
```

The portfolio assistant calls `/api/rag`. Locally, Vite does not run the Python functions, so the UI falls back to its built-in keyword answers and the contact form falls back to opening a mailto draft.

Build and preview:

```bash
npm run build
npm run preview
```

## Project structure

```
api/rag.py             # Serverless assistant endpoint (keyword retrieval + intents)
api/contact.py         # Serverless contact endpoint (Resend delivery + honeypot)
public/                # Static assets, blog, 404, résumé, images, OG card
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

- Content is currently duplicated across `src/portfolio.jsx`, `src/demo/RagDemo.jsx`, and `api/rag.py`. Moving it to a single content module is planned.
- The portfolio assistant is a keyword/intent demo, not a vector-based RAG pipeline. It is labeled honestly in the UI copy and slated for a real retrieval upgrade.
