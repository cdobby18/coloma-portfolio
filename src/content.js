/* Portfolio content: projects, experience, skills, and copy. */

export const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
  { label: "Blog", id: "blog", href: "/blog.html", external: true },
];

export const SECTION_SPY = ["hero", "about", "experience", "projects", "stack", "certs", "contact"];

export const SKILL_GROUPS = [
  {
    label: "Programming Languages",
    skills: ["Python", "JavaScript"],
  },
  {
    label: "Frameworks & Libraries",
    skills: ["FastAPI", "Streamlit", "OpenCV", "NumPy", "scikit-learn", "Pydantic"],
  },
  {
    label: "Generative AI & LLMs",
    skills: ["RAG", "LangChain", "Agentic AI", "Prompt Engineering", "LLM Integration", "Ollama"],
  },
  {
    label: "AI & Developer Tools",
    skills: ["Hermes", "Exa AI", "OpenCode", "Git", "VS Code", "Jupyter", "Obsidian", "Google Colab", "pytest", "Debugging", "Technical Documentation", "Code Review & PRs", "Jira"],
  },
  {
    label: "Databases",
    skills: ["MySQL", "Qdrant", "PostgreSQL"],
  },
  {
    label: "Currently Exploring",
    skills: ["Databricks", "dbt", "Airflow", "Snowflake"],
  },
];

export const EXPERIENCE = [
  {
    role: "Backend AI Engineer Intern",
    company: "FlyRank AI",
    period: "July 2026 – Present",
    points: [
      "Developed LLM-powered content generation and semantic ranking pipelines to improve content relevance at scale.",
      "Integrated embedding models with vector search to build semantic retrieval features across the platform.",
      "Contributed to prompt engineering workflows and output quality evaluation for production AI features.",
    ],
  },
  {
    role: "AI QA Intern",
    company: "SoFi AI Tech Solutions Inc.",
    period: "Apr 2026 – July 2026",
    points: [
      "Designed adversarial prompt test suites targeting hallucination, refusal, and instruction-following failure modes across conversational AI chatbots.",
      "Evaluated chatbot responses against adversarial prompts to label and track hallucination rates and response quality at scale.",
      "Partnered with ML teams to translate evaluation findings into concrete model behavior improvements, reducing error rates across key failure categories.",
    ],
  },
  {
    role: "AI Engineer Intern",
    company: "Lamina Studios",
    period: "Dec 2025 – Apr 2026",
    points: [
      "Built real-time YOLOv8 object detection pipelines with OpenCV, achieving production-ready inference speeds on GPU hardware.",
      "Trained XGBoost classification models on time-series datasets using scikit-learn; deployed predictions to cut manual review overhead.",
      "Automated model retraining and evaluation workflows, reducing iteration cycles from days to hours.",
    ],
  },
];

export const PROJECTS = [
  {
    title: "Powerlift: Precision Pose Estimation for Powerlifting Performance Metrics",
    type: "Computer Vision",
    year: "2025",
    status: "Best Thesis",
    featured: true,
    desc: "Real-time lift analysis on mobile using YOLOv8 pose tracking, Kalman filtering, and SVM classification to assess squat, bench, and deadlift form.",
    metric: "Mobile application · Overall Best Thesis",
    tags: ["Python", "YOLOv8", "Kalman Filtering", "SVM", "MoveNet"],
    img: "/POWER.png",
    logoWide: "/logos/powerlift-wide.webp",
    accent: "#c9443f",
    accentSoft: "rgba(201, 68, 63, 0.10)",
    plate: "linear-gradient(135deg, #fcf9f5 0%, #f4eee5 100%)",
    plateGlow: "rgba(201, 68, 63, 0.18)",
    link: "https://github.com/cdobby18/Powerlift",
  },
  {
    title: "Sunny AI",
    type: "RAG-Built Mentor",
    private: true,
    year: "2026",
    status: "Prototype",
    desc: "RAG-powered mentorship that guides aspiring AI engineers from zero through fundamentals, production skills, and real-world readiness.",
    metric: "React · Python · LLMs · RAG · LangChain",
    tags: ["React", "Python", "LLMs", "RAG", "FastAPI"],
    img: "/sunny.png",
    logo: "/logos/sunny.webp",
    accent: "#d98a3d",
    accentSoft: "rgba(217, 138, 61, 0.12)",
    link: "#contact",
  },
  {
    title: "ReSOLVE: Customer Support Automation Platform",
    type: "Agentic AI",
    year: "2026",
    status: "Built",
    desc: "Support platform that triages tickets by intent, priority, and sentiment, then automates replies with RAG drafting, guardrails, and human escalation.",
    metric: "FastAPI · RAG · Agents · Guardrails",
    tags: ["FastAPI", "React", "RAG", "LangChain", "PostgreSQL", "FAISS"],
    img: "/resolve.png",
    logo: "/logos/resolve.webp",
    accent: "#2f9e75",
    accentSoft: "rgba(47, 158, 117, 0.12)",
    link: "https://github.com/cdobby18/ReSOLVE",
  },
  {
    title: "Resume Analyzer",
    type: "NLP Pipeline",
    year: "2025",
    status: "Pipeline",
    noLogo: true,
    desc: "Parses resumes with spaCy NER and semantic matching into structured JSON for ranking or ATS use, at 100+ documents per minute.",
    metric: "Python · spaCy NER + Semantic Match",
    tags: ["NLP", "spaCy", "Transformers", "FastAPI"],
    img: "/Resume.webp",
    accent: "#4f7fd6",
    accentSoft: "rgba(79, 127, 214, 0.11)",
    link: "https://github.com/cdobby18/resume_analyzer",
  },
  {
    title: "Document Summarizer",
    type: "Transformer Pipeline",
    year: "2024",
    status: "Research Build",
    noLogo: true,
    desc: "Abstractive PDF summarizer using BART and T5, with long-document chunking that merges section summaries into one readable output.",
    metric: "Python · NLP · BART",
    tags: ["BART", "T5", "HuggingFace", "PDF"],
    img: "/Summarize.webp",
    accent: "#8b6fd6",
    accentSoft: "rgba(139, 111, 214, 0.11)",
    link: "https://github.com/cdobby18/ai-summarizer",
  },
];

export const CERTIFICATIONS = [
  { name: "Introduction to Model Context Protocol", issuer: "Anthropic Education", date: "May 2026", url: "https://verify.skilljar.com/c/remzvordp5e7", image: "/MCP.png" },
  { name: "The AI Engineer Bootcamp", issuer: "Udemy", date: "Completed", url: "https://www.udemy.com/certificate/UC-ce6b30a4-237b-469c-9f60-0039ab82713f/", image: "/UDEMY.png" },
  { name: "IT Specialist — Python", issuer: "Certiport (Pearson VUE)", date: "Verified", url: "https://www.credly.com/badges/2d0c3b41-ee3f-4616-af62-2b3a55be3890/public_url", image: "https://images.credly.com/images/3c4602d8-832e-4a24-b42d-00359ce746f7/linkedin_thumb_ITS-Badges_Python_1200px.png" },
  { name: "Python Essentials 1", issuer: "Cisco (OpenEDG Python Institute)", date: "Verified", url: "https://www.credly.com/badges/c495ce54-6909-4812-bfee-6303486b3c9a/public_url", image: "https://images.credly.com/images/68c0b94d-f6ac-40b1-a0e0-921439eb092e/linkedin_thumb_image.png" },
  { name: "Artificial Intelligence Fundamentals", issuer: "IBM SkillsBuild", date: "Verified", url: "https://www.credly.com/badges/8ef3efc3-7e58-4ef2-b349-32f818814c5b/public_url", image: "https://images.credly.com/images/82b908e1-fdcd-4785-9d32-97f11ccbcf08/linkedin_thumb_image.png" },
  { name: "Introduction to Modern AI", issuer: "Cisco", date: "Verified", url: "https://www.credly.com/badges/fc10a9c7-172e-47b7-b817-f1116e8b9846/public_url", image: "https://images.credly.com/images/e2d12302-10f9-40d4-8ff1-066a7008b61d/linkedin_thumb_blob" },
];

export const HOW_I_WORK = [
  ["01", "Understand the problem", "Read the existing workflow and define what a good output actually looks like."],
  ["02", "Plan the smallest version", "Pick the data, model, and failure paths a first usable slice really needs."],
  ["03", "Build feature by feature", "Ship one testable piece at a time instead of a big-bang demo."],
  ["04", "Test before shipping", "Unit tests, eval sets, and adversarial prompts against real cases."],
  ["05", "Document the handoff", "Setup notes, prompts, and a runbook so someone else can run it."],
];

export const IDE_DEFAULT_CODE = `const name = "Carl Joshua Coloma";
const role = "AI Automation Engineer";
console.log(\`Hi, I'm \${name}.\`);
console.log(\`Role: \${role}\`);`;

export const IDE_DEFAULT_OUTPUT = [
  "Hi, I'm Carl Joshua Coloma.",
  "Role: AI Automation Engineer",
];

export const EMAIL = "carljoshuamcoloma@gmail.com";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const GH_START = "2026-03-01";

/* What CJ is optimising for right now — shown as a strip in About. */
export const LOOKING_FOR = [
  { label: "Role", value: "AI automation · applied AI" },
  { label: "Start", value: "Immediate" },
  { label: "Setup", value: "Remote or hybrid" },
  { label: "Base", value: "Manila · PHT (UTC+8)" },
];
